export const shouldRegisterZrcPwa = (hostname = '') => {
  const cleanHostname = String(hostname || '').trim().toLowerCase();

  return cleanHostname === 'portal.zrcajans.com' || cleanHostname.endsWith('.vercel.app');
};

export const registerZrcPwa = async () => {
  if (typeof window === 'undefined') return null;
  if (!('serviceWorker' in navigator)) return null;
  if (!shouldRegisterZrcPwa(window.location.hostname)) return null;

  try {
    return await navigator.serviceWorker.register('/zrc-sw.js', { scope: '/' });
  } catch (error) {
    console.warn('ZRC service worker kayıt hatası:', error);
    return null;
  }
};

export const registerZrcServiceWorker = registerZrcPwa;
