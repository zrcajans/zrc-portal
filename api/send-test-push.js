import webPush from 'web-push';
import { authorizeWorkspaceRequest } from '../server/supabaseAuthorization.js';

const getVapidConfig = () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY || '';
  const privateKey = process.env.VAPID_PRIVATE_KEY || '';
  const subject = process.env.VAPID_SUBJECT || 'mailto:enszrc@gmail.com';

  return {
    publicKey,
    privateKey,
    subject
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Sadece POST desteklenir.'
    });
  }

  const { publicKey, privateKey, subject } = getVapidConfig();
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!publicKey || !privateKey) {
    return res.status(500).json({
      error: 'VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY eksik. Vercel Environment Variables ayarı gerekiyor.'
    });
  }

  const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
  const workspaceId = String(body.workspaceId || '').trim();
  const authorization = await authorizeWorkspaceRequest({
    authorizationHeader: req.headers.authorization || '',
    workspaceId,
    supabaseUrl,
    supabaseAnonKey,
    serviceRoleKey
  });

  if (authorization.error) {
    return res.status(authorization.status).json({ error: authorization.error });
  }

  const { admin, userId } = authorization;
  const { data: subscriptionRecord, error: subscriptionError } = await admin
    .from('notifications')
    .select('body')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .eq('type', 'push_subscription')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subscriptionError) {
    return res.status(500).json({ error: 'Push aboneliği doğrulanamadı.' });
  }

  let subscription;

  try {
    const savedSubscription = JSON.parse(subscriptionRecord?.body || '{}');
    subscription = savedSubscription.subscription || savedSubscription;
  } catch {
    subscription = undefined;
  }

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({
      error: 'Bu kullanıcı ve workspace için kayıtlı push aboneliği bulunamadı.'
    });
  }

  try {
    webPush.setVapidDetails(subject, publicKey, privateKey);

    await webPush.sendNotification(
      subscription,
      JSON.stringify({
        title: String(body.title || 'ZRC Portal').trim().slice(0, 80),
        body: String(body.body || 'Test bildirimi başarılı.').trim().slice(0, 180),
        icon: '/zrc-logo.png',
        badge: '/zrc-logo.png',
        tag: 'zrc-test-push'
      })
    );

    return res.status(200).json({
      ok: true
    });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Push gönderimi başarısız.'
    });
  }
}
