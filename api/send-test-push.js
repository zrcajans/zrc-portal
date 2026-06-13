import webPush from 'web-push';

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

  if (!publicKey || !privateKey) {
    return res.status(500).json({
      error: 'VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY eksik. Vercel Environment Variables ayarı gerekiyor.'
    });
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
        title: req.body?.title || 'ZRC Portal',
        body: req.body?.body || 'Test bildirimi başarılı.',
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
