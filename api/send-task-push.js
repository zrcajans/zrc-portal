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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Sadece POST desteklenir.' });
  }

  const { supabaseUrl, supabaseAnonKey, serviceRoleKey } = getSupabaseConfig();
  const { publicKey, privateKey, subject } = getVapidConfig();

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return sendJson(res, 500, {
      error: 'Supabase env eksik. SUPABASE_SERVICE_ROLE_KEY ve Supabase URL/anon key kontrol edilmeli.'
    });
  }

  if (!publicKey || !privateKey) {
    return sendJson(res, 500, {
      error: 'VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY eksik.'
    });
  }

  const authorizationHeader = req.headers.authorization || '';

  if (!authorizationHeader.startsWith('Bearer ')) {
    return sendJson(res, 401, { error: 'Oturum bulunamadı.' });
  }

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

  const { data: authData, error: authError } = await userClient.auth.getUser();

  if (authError || !authData?.user?.id) {
    return sendJson(res, 401, { error: 'Oturum doğrulanamadı.' });
  }

  const body = parseBody(req);
  const workspaceId = String(body.workspaceId || '').trim();
  const targetUserIds = Array.isArray(body.targetUserIds)
    ? Array.from(new Set(body.targetUserIds.map((value) => String(value || '').trim()).filter(Boolean)))
    : [];

  if (!workspaceId) {
    return sendJson(res, 400, { error: 'Workspace bilgisi eksik.' });
  }

  if (targetUserIds.length === 0) {
    return sendJson(res, 200, { ok: true, sent: 0, reason: 'Hedef kullanıcı yok.' });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data: requesterMembership, error: requesterError } = await admin
    .from('workspace_members')
    .select('user_id, status')
    .eq('workspace_id', workspaceId)
    .eq('user_id', authData.user.id)
    .maybeSingle();

  if (requesterError) {
    return sendJson(res, 500, { error: `Yetki kontrolü yapılamadı: ${requesterError.message}` });
  }

  if (!requesterMembership || requesterMembership.status !== 'Aktif') {
    return sendJson(res, 403, { error: 'Bu workspace için aktif oturum bulunamadı.' });
  }

  try {
    const { data: subscriptionRows, error: subscriptionError } = await admin
      .from('notifications')
      .select('id, user_id, body')
      .eq('workspace_id', workspaceId)
      .eq('type', 'push_subscription')
      .in('user_id', targetUserIds);

    if (subscriptionError) throw subscriptionError;

    if (!subscriptionRows || subscriptionRows.length === 0) {
      return sendJson(res, 200, {
        ok: true,
        sent: 0,
        reason: 'Hedef kullanıcıların kayıtlı push aboneliği yok.'
      });
    }

    webPush.setVapidDetails(subject, publicKey, privateKey);

    const notificationTitle = String(body.title || 'ZRC Portal').slice(0, 80);
    const notificationBody = String(body.body || body.taskTitle || 'Yeni bildirimin var.').slice(0, 220);
    const tag = `zrc-${String(body.type || 'activity')}-${Date.now()}`;

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
              url: body.url || '/'
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
      sent,
      failed,
      staleRemoved: staleIds.length
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: error?.message || 'Push bildirimi gönderilemedi.'
    });
  }
}
