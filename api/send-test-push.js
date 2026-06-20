import webPush from 'web-push';
import { authorizeAnyActiveWorkspaceRequest } from '../server/supabaseAuthorization.js';

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

  const authorization = await authorizeAnyActiveWorkspaceRequest({
    authorizationHeader: req.headers.authorization || '',
    supabaseUrl,
    supabaseAnonKey,
    serviceRoleKey
  });

  if (authorization.error) {
    return res.status(authorization.status).json({ error: authorization.error });
  }

  const subscription = req.body?.subscription;

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({
      error: 'Push subscription bulunamadı.'
    });
  }

  try {
    webPush.setVapidDetails(subject, publicKey, privateKey);

    await webPush.sendNotification(
      subscription,
      JSON.stringify({
        title: String(req.body?.title || 'ZRC Portal').trim().slice(0, 80),
        body: String(req.body?.body || 'Test bildirimi başarılı.').trim().slice(0, 180),
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
