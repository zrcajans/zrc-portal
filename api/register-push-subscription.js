import { authorizeWorkspaceRequest } from '../server/supabaseAuthorization.js';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Sadece POST desteklenir.' });
  }

  const { supabaseUrl, supabaseAnonKey, serviceRoleKey } = getSupabaseConfig();

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return sendJson(res, 500, { error: 'Supabase env eksik.' });
  }

  const body = parseBody(req);
  const subscription = body.subscription;
  const endpoint = String(subscription?.endpoint || '').trim();
  const workspaceId = String(body.workspaceId || '').trim();

  if (!endpoint) {
    return sendJson(res, 400, { error: 'Push subscription endpoint eksik.' });
  }

  const authorization = await authorizeWorkspaceRequest({
    authorizationHeader: req.headers.authorization || '',
    workspaceId,
    supabaseUrl,
    supabaseAnonKey,
    serviceRoleKey
  });

  if (authorization.error) {
    return sendJson(res, authorization.status, { error: authorization.error });
  }

  const { admin, userId } = authorization;

  try {
    const { error: deleteError } = await admin
      .from('notifications')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .eq('type', 'push_subscription');

    if (deleteError) throw deleteError;

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
          source: String(body.source || 'register-api'),
          savedAt: new Date().toISOString()
        }),
        is_read: true
      });

    if (insertError) throw insertError;

    return sendJson(res, 200, {
      ok: true,
      userId,
      workspaceId,
      endpointTail: endpoint.slice(-18)
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: error?.message || 'Push aboneliği kaydedilemedi.'
    });
  }
}
