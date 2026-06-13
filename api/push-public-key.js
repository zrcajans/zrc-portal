export default function handler(req, res) {
  const publicKey = process.env.VAPID_PUBLIC_KEY || '';

  if (!publicKey) {
    return res.status(500).json({
      error: 'VAPID_PUBLIC_KEY eksik. Vercel Environment Variables içine VAPID_PUBLIC_KEY eklenmeli.'
    });
  }

  return res.status(200).json({
    publicKey
  });
}
