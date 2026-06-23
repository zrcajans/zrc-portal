import webPush from 'web-push';
import { authorizeWorkspaceRequest, isSupabaseUuid } from '../server/supabaseAuthorization.js';

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

  // Uygulamanın doğrudan görev kayıt akışı için type esas alınır.
  // Böylece metin sadeleştirmesi push'u yanlışlıkla engellemez.
  if (normalizedType === 'task_create' || normalizedType === 'task_update') return true;

  // Eski istemcilerden gelen uyumlu görev metinleri de çalışmaya devam eder.
  if (normalizedBody.startsWith('Yeni görev:')) return true;
  if (normalizedBody.startsWith('Görev güncellendi:')) return true;

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
  const workspaceId = String(bodyPayload.workspaceId || '').trim();
  const authorization = await authorizeWorkspaceRequest({
    authorizationHeader,
    workspaceId,
    supabaseUrl,
    supabaseAnonKey,
    serviceRoleKey
  });

  if (authorization.error) {
    return sendJson(res, authorization.status, { error: authorization.error });
  }

  const admin = authorization.admin;
  const clientRecipientUserIds = Array.from(
    new Set(
      (Array.isArray(bodyPayload.recipientUserIds) ? bodyPayload.recipientUserIds : [])
        .map((value) => String(value || '').trim())
        .filter(isSupabaseUuid)
    )
  );

  const taskId = String(bodyPayload.taskId || '').trim();
  let taskAssigneeUserIds = [];

  /* Client cache eksik kalırsa gerçek alıcılar task_assignees tablosundan çözülür. */
  if (isSupabaseUuid(taskId)) {
    const { data: taskRow, error: taskError } = await admin
      .from('tasks')
      .select('id')
      .eq('id', taskId)
      .eq('workspace_id', workspaceId)
      .maybeSingle();

    if (taskError) {
      return sendJson(res, 500, { error: 'Push görevi doğrulanamadı.' });
    }

    if (taskRow?.id) {
      const { data: assigneeRows, error: assigneeError } = await admin
        .from('task_assignees')
        .select('user_id')
        .eq('task_id', taskId);

      if (assigneeError) {
        return sendJson(res, 500, { error: 'Push görev sorumluları okunamadı.' });
      }

      taskAssigneeUserIds = Array.from(
        new Set(
          (assigneeRows || [])
            .map((row) => String(row?.user_id || '').trim())
            .filter(isSupabaseUuid)
        )
      );
    }
  }

  const requestedRecipientUserIds = Array.from(
    new Set([...clientRecipientUserIds, ...taskAssigneeUserIds])
  )
    .filter((userId) => userId !== authorization.userId)
    .slice(0, 200);

  if (requestedRecipientUserIds.length === 0) {
    return sendJson(res, 200, {
      ok: true,
      blocked: true,
      sent: 0,
      taskId,
      reason: 'Push hedef kullanıcısı bulunamadı.'
    });
  }

  const { data: activeRecipientRows, error: recipientError } = await admin
    .from('workspace_members')
    .select('user_id')
    .eq('workspace_id', workspaceId)
    .eq('status', 'Aktif')
    .in('user_id', requestedRecipientUserIds);

  if (recipientError) {
    return sendJson(res, 500, { error: 'Push hedef kullanıcıları doğrulanamadı.' });
  }

  const activeRecipientUserIds = Array.from(
    new Set((activeRecipientRows || []).map((row) => row.user_id).filter(Boolean))
  );

  if (activeRecipientUserIds.length === 0) {
    return sendJson(res, 200, {
      ok: true,
      blocked: true,
      sent: 0,
      taskId,
      requestedRecipientCount: requestedRecipientUserIds.length,
      taskAssigneeRecipientCount: taskAssigneeUserIds.length,
      reason: 'Aktif workspace üyesi olan push hedefi bulunamadı.'
    });
  };

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

  try {
    const { data: subscriptionRows, error: subscriptionError } = await admin
      .from('notifications')
      .select('id, user_id, body')
      .eq('workspace_id', workspaceId)
      .eq('type', 'push_subscription')
      .in('user_id', activeRecipientUserIds);

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
      const { error: staleDeleteError } = await admin
        .from('notifications')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('type', 'push_subscription')
        .in('id', staleIds);

      if (staleDeleteError) throw staleDeleteError;
    }

    return sendJson(res, 200, {
      ok: true,
      workspaceId,
      recipientCount: activeRecipientUserIds.length,
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
