import { createClient } from '@supabase/supabase-js';
import webPush from 'web-push';

const sendJson = (res, statusCode, payload) => {
  res.status(statusCode).json(payload);
};

const parseBody = (req) => {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return typeof req.body === 'object' && req.body !== null ? req.body : {};
};

const getSupabaseConfig = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    supabaseUrl,
    supabaseAnonKey,
    serviceRoleKey
  };
};

const getVapidConfig = () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY || '';
  const privateKey = process.env.VAPID_PRIVATE_KEY || '';
  const subject = process.env.VAPID_SUBJECT || 'mailto:info@zrcajans.com';

  return {
    publicKey,
    privateKey,
    subject
  };
};

const getAuthUser = async ({ supabaseUrl, supabaseAnonKey, authorizationHeader }) => {
  if (!authorizationHeader?.startsWith('Bearer ') || !supabaseAnonKey) return null;

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authorizationHeader
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data, error } = await userClient.auth.getUser();

  if (error || !data?.user?.id) return null;

  return data.user;
};

const cleanNotificationBody = (value = '') => {
  const body = String(value || 'Yeni bildirimin var.').trim();

  if (body.startsWith('Yeni görev oluşturuldu:')) {
    return body.replace('Yeni görev oluşturuldu:', 'Yeni görev:').trim();
  }

  if (body.startsWith('Sana yeni görev atandı')) {
    return body.replace('Sana yeni görev atandı', 'Yeni görev').trim();
  }

  if (body.startsWith('Görevlerde yeni bir işlem yapıldı')) {
    return 'Yeni görev işlemi yapıldı.';
  }

  return body;
};

const shouldSendPush = ({ type, body }) => {
  const normalizedType = String(type || '').trim();
  const normalizedBody = String(body || '').trim();

  // Telefon bağlantı/test bildirimi çalışmaya devam etsin.
  if (normalizedType === 'push_connection_test') return true;

  // Görev bildirimleri sade metinle geçsin.
  if (normalizedBody.startsWith('Yeni görev:')) return true;
  if (normalizedBody.startsWith('Görev güncellendi:')) return true;
  if (normalizedBody.startsWith('Yeni görev işlemi yapıldı.')) return false;

  // Eski fazla kaynakları sessizce kes.
  return false;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Sadece POST desteklenir.' });
  }

  const { supabaseUrl, supabaseAnonKey, serviceRoleKey } = getSupabaseConfig();
  const { publicKey, privateKey, subject } = getVapidConfig();

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return sendJson(res, 500, { error: 'Supabase env eksik.' });
  }

  if (!publicKey || !privateKey) {
    return sendJson(res, 500, { error: 'VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY eksik.' });
  }

  const bodyPayload = parseBody(req);
  const authorizationHeader = req.headers.authorization || '';

  const notificationTitle = 'ZRC';
  const notificationType = String(bodyPayload.type || 'activity').trim();
  const rawBody = String(bodyPayload.body || 'Yeni bildirimin var.').trim().slice(0, 240);
  const notificationBody = cleanNotificationBody(rawBody).slice(0, 220);

  if (!shouldSendPush({
    type: notificationType,
    body: notificationBody
  })) {
    return sendJson(res, 200, {
      ok: true,
      blocked: true,
      sent: 0,
      reason: 'Fazla/ikincil push engellendi.',
      type: notificationType,
      body: notificationBody
    });
  }

  let workspaceId = String(bodyPayload.workspaceId || '').trim();

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const authUser = await getAuthUser({
    supabaseUrl,
    supabaseAnonKey,
    authorizationHeader
  });

  if (!workspaceId && authUser?.id) {
    const { data: membershipRows, error: membershipError } = await admin
      .from('workspace_members')
      .select('workspace_id, status')
      .eq('user_id', authUser.id)
      .eq('status', 'Aktif')
      .limit(1);

    if (membershipError) {
      return sendJson(res, 500, { error: `Workspace üyeliği okunamadı: ${membershipError.message}` });
    }

    workspaceId = String(membershipRows?.[0]?.workspace_id || '').trim();
  }

  if (!workspaceId) {
    return sendJson(res, 400, { error: 'Workspace bilgisi bulunamadı.' });
  }

  try {
    const { data: subscriptionRows, error: subscriptionError } = await admin
      .from('notifications')
      .select('id, user_id, body')
      .eq('workspace_id', workspaceId)
      .eq('type', 'push_subscription');

    if (subscriptionError) throw subscriptionError;

    if (!subscriptionRows || subscriptionRows.length === 0) {
      return sendJson(res, 200, {
        ok: true,
        workspaceId,
        sent: 0,
        subscriptionCount: 0,
        reason: 'Workspace içinde kayıtlı push aboneliği yok.'
      });
    }

    webPush.setVapidDetails(subject, publicKey, privateKey);

    const tag = 'zrc-task-direct';

    let sent = 0;
    let failed = 0;
    const staleIds = [];

    await Promise.all(
      subscriptionRows.map(async (row) => {
        try {
          const parsed = JSON.parse(row.body || '{}');
          const subscription = parsed.subscription || parsed;

          if (!subscription?.endpoint) {
            failed += 1;
            return;
          }

          await webPush.sendNotification(
            subscription,
            JSON.stringify({
              title: notificationTitle,
              body: notificationBody,
              icon: '/zrc-logo.png',
              badge: '/zrc-logo.png',
              tag,
              url: bodyPayload.url || '/'
            })
          );

          sent += 1;
        } catch (error) {
          failed += 1;

          if (error?.statusCode === 404 || error?.statusCode === 410) {
            staleIds.push(row.id);
          }
        }
      })
    );

    if (staleIds.length > 0) {
      await admin
        .from('notifications')
        .delete()
        .in('id', staleIds);
    }

    return sendJson(res, 200, {
      ok: true,
      workspaceId,
      subscriptionCount: subscriptionRows.length,
      sent,
      failed,
      staleRemoved: staleIds.length,
      title: notificationTitle,
      body: notificationBody
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: error?.message || 'Push bildirimi gönderilemedi.'
    });
  }
}
