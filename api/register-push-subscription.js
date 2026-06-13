import { createClient } from '@supabase/supabase-js';

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

const isUuid = (value = '') =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value));

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Sadece POST desteklenir.' });
  }

  const { supabaseUrl, supabaseAnonKey, serviceRoleKey } = getSupabaseConfig();

  if (!supabaseUrl || !serviceRoleKey) {
    return sendJson(res, 500, {
      error: 'Supabase env eksik. SUPABASE_SERVICE_ROLE_KEY ve Supabase URL kontrol edilmeli.'
    });
  }

  const body = parseBody(req);
  const workspaceId = String(body.workspaceId || '').trim();
  const subscription = body.subscription;
  const endpoint = String(subscription?.endpoint || '').trim();

  if (!workspaceId) {
    return sendJson(res, 400, { error: 'Workspace bilgisi eksik.' });
  }

  if (!endpoint) {
    return sendJson(res, 400, { error: 'Push subscription endpoint eksik.' });
  }

  let userId = '';
  const authorizationHeader = req.headers.authorization || '';

  if (authorizationHeader.startsWith('Bearer ') && supabaseAnonKey) {
    try {
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

      const { data: authData } = await userClient.auth.getUser();
      userId = authData?.user?.id || '';
    } catch {
      userId = '';
    }
  }

  if (!isUuid(userId) && isUuid(body.userId)) {
    userId = String(body.userId).trim();
  }

  if (!isUuid(userId)) {
    return sendJson(res, 400, { error: 'Kullanıcı id bulunamadı.' });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  try {
    await admin
      .from('notifications')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .eq('type', 'push_subscription');

    const { error: insertError } = await admin
      .from('notifications')
      .insert({
        workspace_id: workspaceId,
        user_id: userId,
        type: 'push_subscription',
        title: 'Push Subscription',
        body: JSON.stringify({
          subscription,
          endpoint,
          userAgent: String(body.userAgent || ''),
          savedAt: new Date().toISOString()
        }),
        is_read: true
      });

    if (insertError) throw insertError;

    return sendJson(res, 200, {
      ok: true,
      userId,
      endpointTail: endpoint.slice(-18)
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: error?.message || 'Push aboneliği kaydedilemedi.'
    });
  }
}
