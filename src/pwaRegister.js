// zrc-v427c-pwa-import-fix
export const registerZrcPwa = async () => {
  if (typeof window === 'undefined') return null;
  if (!('serviceWorker' in navigator)) return null;

  try {
    return await navigator.serviceWorker.register('/zrc-sw.js', { scope: '/' });
  } catch (error) {
    console.warn('ZRC service worker kayıt hatası:', error);
    return null;
  }
};

export const registerZrcServiceWorker = registerZrcPwa;

registerZrcPwa();
