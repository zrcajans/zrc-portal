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
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    supabaseUrl,
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

  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
  const { publicKey, privateKey, subject } = getVapidConfig();

  if (!supabaseUrl || !serviceRoleKey) {
    return sendJson(res, 500, {
      error: 'Supabase env eksik. SUPABASE_SERVICE_ROLE_KEY ve Supabase URL kontrol edilmeli.'
    });
  }

  if (!publicKey || !privateKey) {
    return sendJson(res, 500, {
      error: 'VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY eksik.'
    });
  }

  const body = parseBody(req);
  const workspaceId = String(body.workspaceId || '').trim();

  if (!workspaceId) {
    return sendJson(res, 400, { error: 'Workspace bilgisi eksik.' });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

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
        sent: 0,
        subscriptionCount: 0,
        reason: 'Workspace içinde kayıtlı push aboneliği yok. Telefonda Telefonu Bildirime Bağla butonuna basılmalı.'
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
      subscriptionCount: subscriptionRows.length,
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
