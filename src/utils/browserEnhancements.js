import {
  getActiveStorageWorkspaceId,
  getScopedStorageKey
} from '../app/utils/storageScopeHelpers.js';

// zrc-v426-task-end-date-color
const getZrcTaskEndDateValue = (task = {}) =>
  task?.dueDate ||
  task?.endDate ||
  task?.due_date ||
  task?.end_date ||
  task?.deadline ||
  task?.finishDate ||
  '';

const parseZrcDueDateForColor = (value = '') => {
  const raw = String(value || '').trim();

  if (!raw || /tarih yok/i.test(raw)) return null;

  const isoMatch = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
  }

  const trMonths = {
    ocak: 0,
    şubat: 1,
    subat: 1,
    mart: 2,
    nisan: 3,
    mayıs: 4,
    mayis: 4,
    haziran: 5,
    temmuz: 6,
    ağustos: 7,
    agustos: 7,
    eylül: 8,
    eylul: 8,
    ekim: 9,
    kasım: 10,
    kasim: 10,
    aralık: 11,
    aralik: 11
  };

  const clean = raw
    .toLocaleLowerCase('tr-TR')
    .replace(/[.,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const trMatch = clean.match(/(\d{1,2})\s+([a-zçğıöşü]+)\s+(\d{4})/i);
  if (trMatch) {
    const monthIndex = trMonths[trMatch[2]];

    if (monthIndex !== undefined) {
      return new Date(Number(trMatch[3]), monthIndex, Number(trMatch[1]));
    }
  }

  return null;
};

const getZrcDueDateColorState = (value = '') => {
  const date = parseZrcDueDateForColor(value);

  if (!date) return 'default';

  const today = new Date();
  const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const cleanDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (cleanDate.getTime() < cleanToday.getTime()) return 'overdue';
  if (cleanDate.getTime() === cleanToday.getTime()) return 'today';

  return 'default';
};

const applyZrcDueDateColoring = () => {
  if (typeof document === 'undefined') return;

  const nodes = document.querySelectorAll('span, div, p, button');

  nodes.forEach((node) => {
    if (!node || node.children?.length > 0) return;

    const text = String(node.textContent || '').trim();

    if (!/^(Bit|Bitiş)\s*:/i.test(text)) return;

    const datePart = text.replace(/^(Bit|Bitiş)\s*:/i, '').trim();
    const state = getZrcDueDateColorState(datePart);

    node.style.fontWeight = '900';

    if (state === 'overdue') {
      node.style.color = '#dc2626';
    } else if (state === 'today') {
      node.style.color = '#d97706';
    } else {
      node.style.color = '';
    }
  });
};

if (typeof window !== 'undefined' && typeof document !== 'undefined' && !window.__zrcDueDateColoringInstalled) {
  window.__zrcDueDateColoringInstalled = true;

  const scheduleZrcDueDateColoring = () => {
    window.clearTimeout(window.__zrcDueDateColoringTimer);
    window.__zrcDueDateColoringTimer = window.setTimeout(applyZrcDueDateColoring, 80);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleZrcDueDateColoring, { once: true });
  } else {
    scheduleZrcDueDateColoring();
  }

  const observer = new MutationObserver(scheduleZrcDueDateColoring);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
}



// zrc-v426b-mobile-end-date-hard-fix
const zrcV426bPickTaskEndDate = (task = {}) =>
  task?.endDate ||
  task?.dueDate ||
  task?.end_date ||
  task?.due_date ||
  task?.deadline ||
  task?.finishDate ||
  '';

export const zrcV426bNormalizeTaskDateFields = (task = {}) => {
  if (!task || typeof task !== 'object') return task;

  const resolvedEndDate = zrcV426bPickTaskEndDate(task);
  const resolvedStartDate =
    task?.startDate ||
    task?.start_date ||
    task?.createdAt ||
    task?.created_at ||
    '';

  if (!resolvedEndDate) return task;

  const nextEndDate = task.endDate || resolvedEndDate;
  const nextDueDate = task.dueDate || resolvedEndDate;
  const shouldAddStartDate = !task.startDate && Boolean(resolvedStartDate);

  // Çok kritik: Tarihler zaten doğruysa aynı object'i döndür.
  // Böylece projectBoards effect'i gereksiz setState/render döngüsüne girmez.
  if (
    task.endDate === nextEndDate &&
    task.dueDate === nextDueDate &&
    !shouldAddStartDate
  ) {
    return task;
  }

  return {
    ...task,
    endDate: nextEndDate,
    dueDate: nextDueDate,
    ...(shouldAddStartDate ? { startDate: resolvedStartDate } : {})
  };
};

const zrcV426bParseDueDate = (value = '') => {
  const raw = String(value || '').trim();

  if (!raw || /tarih yok/i.test(raw)) return null;

  const iso = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));

  const months = {
    ocak: 0,
    şubat: 1,
    subat: 1,
    mart: 2,
    nisan: 3,
    mayıs: 4,
    mayis: 4,
    haziran: 5,
    temmuz: 6,
    ağustos: 7,
    agustos: 7,
    eylül: 8,
    eylul: 8,
    ekim: 9,
    kasım: 10,
    kasim: 10,
    aralık: 11,
    aralik: 11
  };

  const clean = raw
    .toLocaleLowerCase('tr-TR')
    .replace(/[.,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tr = clean.match(/(\d{1,2})\s+([a-zçğıöşü]+)\s+(\d{4})/i);
  if (tr && months[tr[2]] !== undefined) {
    return new Date(Number(tr[3]), months[tr[2]], Number(tr[1]));
  }

  return null;
};

const zrcV426bDueDateState = (value = '') => {
  const date = zrcV426bParseDueDate(value);
  if (!date) return 'default';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (target.getTime() < today.getTime()) return 'overdue';
  if (target.getTime() === today.getTime()) return 'today';

  return 'default';
};

const zrcV426bApplyDueDateColors = () => {
  if (typeof document === 'undefined') return;

  document.querySelectorAll('span, div, p, button').forEach((node) => {
    const text = String(node.textContent || '').trim();

    if (!text || text.length > 80) return;
    if (!/^(Bit|Bitiş)\s*:/i.test(text)) return;

    const dateText = text.replace(/^(Bit|Bitiş)\s*:/i, '').trim();
    const state = zrcV426bDueDateState(dateText);

    node.style.fontWeight = '900';

    if (state === 'overdue') {
      node.style.setProperty('color', '#dc2626', 'important');
    } else if (state === 'today') {
      node.style.setProperty('color', '#d97706', 'important');
    } else {
      node.style.removeProperty('color');
    }
  });
};

if (typeof window !== 'undefined' && typeof document !== 'undefined' && !window.__zrcV426bDueDateObserver) {
  window.__zrcV426bDueDateObserver = true;

  const run = () => {
    window.clearTimeout(window.__zrcV426bDueDateTimer);
    window.__zrcV426bDueDateTimer = window.setTimeout(zrcV426bApplyDueDateColors, 120);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  const observer = new MutationObserver(run);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
}



// zrc-v427c-pwa-install-panel
const zrcIsMobileDevice = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches || /iphone|ipad|ipod|android/i.test(navigator.userAgent || '');
};

const zrcIsStandalonePwa = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
};

const zrcIsIosDevice = () => {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent || '');
};

const zrcShowMobileSetupPanel = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!zrcIsMobileDevice()) return;
  const isStandalone = zrcIsStandalonePwa();
  const notificationPermission =
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported';

  // zrc-v428-pwa-notification-button
  // Ana ekrana eklenmiş PWA içinde de bildirim açma kartı görünsün.
  if (isStandalone && notificationPermission === 'granted') return;
  const wasDismissed = window.localStorage.getItem('zrc-mobile-setup-dismissed') === '1';

  // PWA içindeyken bildirim izni hâlâ açılmamışsa, daha önce kapatılmış olsa bile kartı tekrar göster.
  if (wasDismissed && !(isStandalone && notificationPermission !== 'granted')) return;
  if (document.getElementById('zrc-mobile-setup-panel')) return;

  const panel = document.createElement('div');
  panel.id = 'zrc-mobile-setup-panel';
  panel.innerHTML = `
    <div class="zrc-mobile-setup-card">
      <button class="zrc-mobile-setup-close" type="button" aria-label="Kapat">×</button>
      <div class="zrc-mobile-setup-eyebrow">Mobil Kurulum</div>
      <div class="zrc-mobile-setup-title">${zrcIsStandalonePwa() ? 'Bildirimleri aç' : 'ZRC Portalı telefona kur'}</div>
      <div class="zrc-mobile-setup-text">Ana ekrana ekle, bildirimleri aç, portalı uygulama gibi kullan.</div>
      <div class="zrc-mobile-setup-actions">
        ${zrcIsStandalonePwa() ? '' : '<button class="zrc-mobile-setup-install" type="button">Ana Ekrana Ekle</button>'}
        <button class="zrc-mobile-setup-notify" type="button">Bildirimleri Aç</button>
      </div>
      <div class="zrc-mobile-setup-hint"></div>
    </div>
  `;

  if (!document.getElementById('zrc-mobile-setup-style')) {
    const style = document.createElement('style');
    style.id = 'zrc-mobile-setup-style';
    style.textContent = `
      #zrc-mobile-setup-panel{position:fixed;left:14px;right:14px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:2147483646;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,sans-serif}
      #zrc-mobile-setup-panel .zrc-mobile-setup-card{position:relative;border-radius:26px;background:#111827;color:#fff;padding:18px;box-shadow:0 28px 80px rgba(15,23,42,.28);border:1px solid rgba(255,255,255,.08)}
      #zrc-mobile-setup-panel .zrc-mobile-setup-close{position:absolute;right:12px;top:10px;width:34px;height:34px;border:0;border-radius:999px;background:rgba(255,255,255,.10);color:#fff;font-size:24px;font-weight:900}
      #zrc-mobile-setup-panel .zrc-mobile-setup-eyebrow{color:#ff6a3d;font-size:10px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
      #zrc-mobile-setup-panel .zrc-mobile-setup-title{margin-top:5px;font-size:20px;line-height:1.1;font-weight:950}
      #zrc-mobile-setup-panel .zrc-mobile-setup-text{margin-top:7px;color:rgba(255,255,255,.72);font-size:12px;line-height:1.4;font-weight:700;max-width:88%}
      #zrc-mobile-setup-panel .zrc-mobile-setup-actions{margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:9px}
      #zrc-mobile-setup-panel .zrc-mobile-setup-actions button{min-height:46px;border:0;border-radius:999px;font-size:12px;font-weight:950}
      #zrc-mobile-setup-panel .zrc-mobile-setup-install{background:#ff3600;color:#fff}
      #zrc-mobile-setup-panel .zrc-mobile-setup-notify{background:#fff;color:#111827}
      #zrc-mobile-setup-panel .zrc-mobile-setup-hint{margin-top:10px;color:rgba(255,255,255,.68);font-size:11px;font-weight:800;line-height:1.35}
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(panel);

  const closeButton = panel.querySelector('.zrc-mobile-setup-close');
  const installButton = panel.querySelector('.zrc-mobile-setup-install');
  const notifyButton = panel.querySelector('.zrc-mobile-setup-notify');
  const hint = panel.querySelector('.zrc-mobile-setup-hint');

  closeButton?.addEventListener('click', () => {
    window.localStorage.setItem('zrc-mobile-setup-dismissed', '1');
    panel.remove();
  });

  installButton?.addEventListener('click', async () => {
    const deferredPrompt = window.__zrcDeferredInstallPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch {}
      window.__zrcDeferredInstallPrompt = null;
      hint.textContent = 'Kurulum penceresi açıldı. Onaylarsan portal ana ekrana eklenecek.';
      return;
    }

    if (zrcIsIosDevice()) {
      hint.textContent = 'iPhone için: Safari alt menüden Paylaş simgesine bas → Ana Ekrana Ekle seç.';
      return;
    }

    hint.textContent = 'Tarayıcı menüsünden “Uygulamayı yükle” veya “Ana ekrana ekle” seçeneğini kullan.';
  });

  notifyButton?.addEventListener('click', async () => {
    if (!('Notification' in window)) {
      hint.textContent = 'Bu tarayıcı bildirimleri desteklemiyor.';
      return;
    }

    let permission = Notification.permission;
    if (permission !== 'granted') permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      hint.textContent = 'Bildirim izni verilmedi. Telefon ayarlarından izin verebilirsin.';
      return;
    }

    try {
      const registration = await navigator.serviceWorker?.ready;
      if (registration?.showNotification) {
        registration.showNotification('ZRC Portal bildirimleri açık', {
          body: 'Artık portal bildirimlerini bu cihazda alabilirsin.',
          icon: '/zrc-logo.png',
          badge: '/zrc-logo.png',
          tag: 'zrc-notification-test'
        });
      } else {
        new Notification('ZRC Portal bildirimleri açık', {
          body: 'Artık portal bildirimlerini bu cihazda alabilirsin.',
          icon: '/zrc-logo.png'
        });
      }
      hint.textContent = 'Bildirim izni açıldı. Test bildirimi gönderildi.';
    } catch {
      hint.textContent = 'Bildirim izni açıldı.';
    }
  });
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    window.__zrcDeferredInstallPrompt = event;
    window.setTimeout(zrcShowMobileSetupPanel, 350);
  });

  window.addEventListener('appinstalled', () => {
    // zrc-v428-pwa-notification-button
    // Kurulumdan sonra bildirim izni kartının PWA içinde çıkabilmesi için dismissed kilidini kaldır.
    window.localStorage.removeItem('zrc-mobile-setup-dismissed');
    document.getElementById('zrc-mobile-setup-panel')?.remove();
  });

  window.setTimeout(zrcShowMobileSetupPanel, 1200);
}



// zrc-v428-clear-dismissed-once
if (typeof window !== 'undefined' && typeof Notification !== 'undefined') {
  const shouldReopenMobileSetup =
    (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) &&
    Notification.permission !== 'granted' &&
    window.localStorage.getItem('zrc-v428-notification-panel-reopened') !== '1';

  if (shouldReopenMobileSetup) {
    window.localStorage.removeItem('zrc-mobile-setup-dismissed');
    window.localStorage.setItem('zrc-v428-notification-panel-reopened', '1');
  }
}


// zrc-v429-web-push-test
const zrcV429UrlBase64ToUint8Array = (base64String = '') => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
};

const zrcV429SetHintText = (hint, text) => {
  if (hint) hint.textContent = text;
};

const zrcV429RegisterAndSendTestPush = async (hint) => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

  if (!('Notification' in window)) {
    zrcV429SetHintText(hint, 'Bu cihaz/tarayıcı bildirimleri desteklemiyor.');
    return;
  }

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    zrcV429SetHintText(hint, 'Bu cihazda Web Push desteği yok. iPhone’da ana ekrandaki uygulamadan açtığından emin ol.');
    return;
  }

  let permission = Notification.permission;

  if (permission !== 'granted') {
    permission = await Notification.requestPermission();
  }

  if (permission !== 'granted') {
    zrcV429SetHintText(hint, 'Bildirim izni verilmedi.');
    return;
  }

  zrcV429SetHintText(hint, 'Bildirim izni açık. Push aboneliği hazırlanıyor...');

  let registration = await navigator.serviceWorker.ready;

  if (!registration) {
    registration = await navigator.serviceWorker.register('/zrc-sw.js', { scope: '/' });
  }

  const keyResponse = await fetch('/api/push-public-key', {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });

  const keyResult = await keyResponse.json().catch(() => ({}));

  if (!keyResponse.ok || !keyResult.publicKey) {
    zrcV429SetHintText(
      hint,
      keyResult.error || 'VAPID_PUBLIC_KEY eksik. Vercel Environment Variables ayarı gerekiyor.'
    );
    return;
  }

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: zrcV429UrlBase64ToUint8Array(keyResult.publicKey)
    });
  }

  zrcV429SetHintText(hint, 'Push aboneliği hazır. Test bildirimi gönderiliyor...');

  const accessToken = zrcV442ReadSupabaseAccessToken();

  if (!accessToken) {
    zrcV429SetHintText(hint, 'Aktif oturum bulunamadı. Çıkış yapıp tekrar giriş yap.');
    return;
  }

  const workspaceId = getActiveStorageWorkspaceId();

  if (!workspaceId) {
    zrcV429SetHintText(hint, 'Aktif workspace bulunamadı. Çıkış yapıp tekrar giriş yap.');
    return;
  }

  const registerResponse = await fetch('/api/register-push-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      subscription,
      workspaceId,
      userAgent: navigator.userAgent || '',
      source: 'v429-manual-test'
    })
  });

  const registerResult = await registerResponse.json().catch(() => ({}));

  if (!registerResponse.ok || registerResult.error) {
    zrcV429SetHintText(hint, registerResult.error || 'Push aboneliği kaydedilemedi.');
    return;
  }

  const pushResponse = await fetch('/api/send-test-push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      workspaceId,
      title: 'ZRC',
      body: 'Test bildirimi başarılı. Telefon bildirimleri aktif.'
    })
  });

  const pushResult = await pushResponse.json().catch(() => ({}));

  if (!pushResponse.ok || pushResult.error) {
    zrcV429SetHintText(hint, pushResult.error || 'Test bildirimi gönderilemedi.');
    return;
  }

  zrcV429SetHintText(hint, 'Test bildirimi gönderildi. iPhone kilit ekranını/bildirim merkezini kontrol et.');
};

if (typeof window !== 'undefined' && typeof document !== 'undefined' && !window.__zrcV429PushClickInstalled) {
  window.__zrcV429PushClickInstalled = true;

  document.addEventListener(
    'click',
    async (event) => {
      const button = event.target?.closest?.('.zrc-mobile-setup-notify');

      if (!button) return;

      const panel = button.closest('#zrc-mobile-setup-panel');
      if (!panel) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const hint = panel.querySelector('.zrc-mobile-setup-hint');

      try {
        await zrcV429RegisterAndSendTestPush(hint);
      } catch (error) {
        zrcV429SetHintText(hint, error?.message || 'Bildirim kurulumu tamamlanamadı.');
      }
    },
    true
  );
}





// zrc-v442-single-direct-task-push
const zrcV442ReadSupabaseAccessToken = () => {
  if (typeof window === 'undefined') return '';

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index) || '';

      if (!key.startsWith('sb-') || !key.endsWith('-auth-token')) continue;

      const rawValue = window.localStorage.getItem(key) || '';
      const parsed = JSON.parse(rawValue);

      const token =
        parsed?.access_token ||
        parsed?.currentSession?.access_token ||
        parsed?.session?.access_token ||
        parsed?.data?.session?.access_token ||
        '';

      if (token) return token;
    }
  } catch (error) {
    console.warn('[ZRC Push v442] Supabase token okunamadı.', error);
  }

  return '';
};

export const zrcV442SendTaskSavePush = async ({
  title = 'ZRC Portal',
  body = 'Görevlerde yeni bir işlem yapıldı.',
  type = 'task_save',
  workspaceId = '',
  recipientUserIds = []
} = {}) => {
  if (typeof window === 'undefined') return false;

  if (!workspaceId) {
    console.warn('[ZRC Push v442] Workspace yok, push atlanıyor.');
    return false;
  }

  const recipients = Array.from(
    new Set((Array.isArray(recipientUserIds) ? recipientUserIds : []).map(String).filter(Boolean))
  );

  if (recipients.length === 0) {
    console.info('[ZRC Push v442] Hedef kullanıcı yok, push atlanıyor.');
    return false;
  }

  const now = Date.now();
  const lastPushStorageKey = getScopedStorageKey('zrc-v442-last-task-push-at');
  const lastPushAt = Number(window.localStorage.getItem(lastPushStorageKey) || '0');

  if (now - lastPushAt < 3000) {
    console.info('[ZRC Push v442] Çift push engellendi.');
    return false;
  }

  window.localStorage.setItem(lastPushStorageKey, String(now));

  const accessToken = zrcV442ReadSupabaseAccessToken();

  if (!accessToken) {
    console.warn('[ZRC Push v442] Oturum token yok, push atlanıyor.');
    return false;
  }

  try {
    const response = await window.fetch('/api/send-task-push', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
      body: JSON.stringify({
        type,
        title,
        body,
        workspaceId,
        recipientUserIds: recipients,
        url: '/'
      })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.error) {
      console.warn('[ZRC Push v442] Push gönderilemedi.', result.error || result);
      return false;
    }

    console.info('[ZRC Push v442] Push sonucu:', result);
    return true;
  } catch (error) {
    console.warn('[ZRC Push v442] Push isteği hata verdi.', error);
    return false;
  }
};



// zrc-v447-auto-mobile-push-register
const zrcV447UrlBase64ToUint8Array = (base64String = '') => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
};

const zrcV447ReadSupabaseAccessToken = () => {
  if (typeof window === 'undefined') return '';

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index) || '';

      if (!key.startsWith('sb-') || !key.endsWith('-auth-token')) continue;

      const rawValue = window.localStorage.getItem(key) || '';
      const parsed = JSON.parse(rawValue);

      const token =
        parsed?.access_token ||
        parsed?.currentSession?.access_token ||
        parsed?.session?.access_token ||
        parsed?.data?.session?.access_token ||
        '';

      if (token) return token;
    }
  } catch (error) {
    console.warn('[ZRC Push v447] Supabase token okunamadı.', error);
  }

  return '';
};

const zrcV447ShouldAutoRegisterPush = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const isStandalone =
    window.matchMedia?.('(display-mode: standalone)')?.matches ||
    window.navigator?.standalone === true;
  const isMobileWidth = window.innerWidth <= 900;
  const isPortalHost =
    window.location.hostname.includes('portal.zrcajans.com') ||
    window.location.hostname.includes('vercel.app') ||
    window.location.hostname === 'localhost';

  return isPortalHost && (isStandalone || isMobileWidth);
};

const zrcV447AutoRegisterMobilePush = async () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if (!zrcV447ShouldAutoRegisterPush()) return false;
  if (!('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;

  const now = Date.now();
  const lastTryStorageKey = getScopedStorageKey('zrc-v447-last-auto-register-try-at');
  const lastTryAt = Number(window.localStorage.getItem(lastTryStorageKey) || '0');

  if (now - lastTryAt < 45000) return false;

  window.localStorage.setItem(lastTryStorageKey, String(now));

  const accessToken = zrcV447ReadSupabaseAccessToken();

  if (!accessToken) {
    console.warn('[ZRC Push v447] Oturum token yok, mobil push kaydı ertelendi.');
    return false;
  }

  try {
    let registration = null;

    try {
      registration = await navigator.serviceWorker.ready;
    } catch {
      registration = null;
    }

    if (!registration) {
      registration = await navigator.serviceWorker.register('/zrc-sw.js', { scope: '/' });
      registration = await navigator.serviceWorker.ready;
    }

    const keyResponse = await fetch('/api/push-public-key', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });

    const keyResult = await keyResponse.json().catch(() => ({}));

    if (!keyResponse.ok || !keyResult.publicKey) {
      console.warn('[ZRC Push v447] VAPID public key okunamadı.', keyResult);
      return false;
    }

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: zrcV447UrlBase64ToUint8Array(keyResult.publicKey)
      });
    }

    const registerResponse = await fetch('/api/register-push-subscription', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
      body: JSON.stringify({
        subscription,
        workspaceId: getActiveStorageWorkspaceId(),
        userAgent: navigator.userAgent || '',
        source: 'v447-auto-mobile'
      })
    });

    const registerResult = await registerResponse.json().catch(() => ({}));

    if (!registerResponse.ok || registerResult.error) {
      console.warn('[ZRC Push v447] Mobil push kaydı başarısız.', registerResult.error || registerResult);
      return false;
    }

    window.localStorage.setItem(
      getScopedStorageKey('zrc-v447-last-auto-register-success-at'),
      new Date().toISOString()
    );
    console.info('[ZRC Push v447] Mobil push otomatik kaydedildi.', registerResult);
    return true;
  } catch (error) {
    console.warn('[ZRC Push v447] Mobil push otomatik kayıt hatası.', error);
    return false;
  }
};

const zrcV447InstallAutoMobilePushRegister = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__zrcV447AutoMobilePushRegisterInstalled) return;

  window.__zrcV447AutoMobilePushRegisterInstalled = true;

  const run = () => {
    window.setTimeout(() => {
      zrcV447AutoRegisterMobilePush();
    }, 1200);
  };

  window.addEventListener('load', run);
  window.addEventListener('focus', run);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) run();
  });

  window.setTimeout(run, 2500);
  window.setTimeout(run, 8000);
};

zrcV447InstallAutoMobilePushRegister();



// zrc-v448-desktop-notification-sound
const zrcV448DesktopNotificationSoundUrl = '/sounds/bildirim.wav?v=448';

const zrcV448IsDesktopPortal = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  return window.innerWidth > 900 && document.visibilityState === 'visible';
};

const zrcV448UnlockDesktopNotificationSound = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__zrcV448DesktopSoundUnlocked) return;

  window.__zrcV448DesktopSoundUnlocked = true;

  try {
    const audio = new Audio(zrcV448DesktopNotificationSoundUrl);
    audio.preload = 'auto';
    audio.volume = 1;
    window.__zrcV448DesktopNotificationAudio = audio;
  } catch (error) {
    console.warn('[ZRC Ses v448] Masaüstü bildirim sesi hazırlanamadı.', error);
  }
};

const zrcV448InstallDesktopSoundUnlock = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__zrcV448DesktopSoundUnlockInstalled) return;

  window.__zrcV448DesktopSoundUnlockInstalled = true;

  ['click', 'keydown', 'pointerdown'].forEach((eventName) => {
    document.addEventListener(eventName, zrcV448UnlockDesktopNotificationSound, {
      once: true,
      passive: true
    });
  });
};

export const zrcV448PlayDesktopNotificationSound = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;

  // Farklı bildirimler hızlı gelirse tek sese düşmesin.
  // 450 ms altı hâlâ aynı olayın çift tetiklenmesini engeller.
  const now = Date.now();
  const lastSoundAt = Number(window.__zrcV449LastDesktopSoundAt || 0);

  if (now - lastSoundAt < 450) {
    console.info('[ZRC Ses] Aynı anda tekrar eden masaüstü sesi engellendi.');
    return false;
  }

  window.__zrcV449LastDesktopSoundAt = now;

  try {
    zrcV448InstallDesktopSoundUnlock();

    if (!zrcV448IsDesktopPortal()) return false;

    const audio = window.__zrcV448DesktopNotificationAudio || new Audio(zrcV448DesktopNotificationSoundUrl);
    audio.src = zrcV448DesktopNotificationSoundUrl;
    audio.muted = false;
    audio.volume = 1;
    audio.currentTime = 0;
    window.__zrcV448DesktopNotificationAudio = audio;

    const playPromise = audio.play();

    if (playPromise?.catch) {
      playPromise.catch((error) => {
        console.warn('[ZRC Ses v448] Masaüstü bildirim sesi çalınamadı. Sayfada bir kez tıklamak gerekebilir.', error);
      });
    }

    return true;
  } catch (error) {
    console.warn('[ZRC Ses v448] Masaüstü bildirim sesi hata verdi.', error);
    return false;
  }
};

zrcV448InstallDesktopSoundUnlock();

/* === ZRC KILL FLOATING VERSION BADGE START === */
const zrcKillFloatingVersionBadge = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const versionTextPattern = /^ZRC\s+v\d+[A-Za-z0-9._-]*$/i;

  const removeNodeSafely = (node) => {
    if (!node || !node.parentNode) return;

    const parent = node.parentElement;
    const parentText = parent?.textContent?.trim() || '';

    if (parent && versionTextPattern.test(parentText)) {
      parent.remove();
      return;
    }

    node.remove();
  };

  const allElements = Array.from(document.querySelectorAll('body *'));

  allElements.forEach((element) => {
    if (!element || element.closest('script, style, noscript')) return;

    const text = element.textContent?.trim() || '';
    if (!versionTextPattern.test(text)) return;

    const childCount = element.children?.length || 0;

    if (childCount === 0) {
      removeNodeSafely(element);
      return;
    }

    const computed = window.getComputedStyle(element);
    const looksFloating =
      ['fixed', 'absolute', 'sticky'].includes(computed.position) ||
      computed.right !== 'auto' ||
      computed.bottom !== 'auto' ||
      element.className?.toString?.().toLowerCase?.().includes('version') ||
      element.className?.toString?.().toLowerCase?.().includes('badge');

    if (looksFloating) {
      element.remove();
    } else {
      element.style.display = 'none';
      element.style.visibility = 'hidden';
      element.style.opacity = '0';
      element.setAttribute('aria-hidden', 'true');
    }
  });
};

const zrcInstallFloatingVersionBadgeKiller = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__zrcFloatingVersionBadgeKillerInstalled) return;

  window.__zrcFloatingVersionBadgeKillerInstalled = true;

  zrcKillFloatingVersionBadge();

  window.setTimeout(zrcKillFloatingVersionBadge, 100);
  window.setTimeout(zrcKillFloatingVersionBadge, 500);
  window.setTimeout(zrcKillFloatingVersionBadge, 1200);
  window.setTimeout(zrcKillFloatingVersionBadge, 2500);
};

zrcInstallFloatingVersionBadgeKiller();
/* === ZRC KILL FLOATING VERSION BADGE END === */
