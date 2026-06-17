// zrc-premium-dialog-runtime-v1
// Native browser alert/prompt/confirm yerine ZRC tasarımına uygun premium dialog sistemi.

let activeDialog = null;
let queue = [];

const ZRC_ORANGE = '#ff3600';

function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('zrc-premium-dialog-styles')) return;

  const style = document.createElement('style');
  style.id = 'zrc-premium-dialog-styles';
  style.textContent = `
    .zrc-premium-dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 2147483000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 22px;
      background:
        radial-gradient(circle at 50% 15%, rgba(255,54,0,.16), transparent 32%),
        rgba(9, 9, 11, .52);
      backdrop-filter: blur(18px) saturate(1.25);
      -webkit-backdrop-filter: blur(18px) saturate(1.25);
      animation: zrcPremiumBackdropIn .16s ease-out;
    }

    .zrc-premium-dialog-card {
      width: min(460px, 100%);
      border-radius: 28px;
      border: 1px solid rgba(255, 255, 255, .72);
      background:
        linear-gradient(180deg, rgba(255,255,255,.98), rgba(250,250,250,.96));
      box-shadow:
        0 28px 80px rgba(15, 23, 42, .28),
        0 1px 0 rgba(255,255,255,.9) inset;
      overflow: hidden;
      transform-origin: center;
      animation: zrcPremiumCardIn .2s cubic-bezier(.2,.9,.2,1);
    }

    .zrc-premium-dialog-topline {
      height: 5px;
      width: 100%;
      background:
        linear-gradient(90deg, transparent, ${ZRC_ORANGE}, #ff7a45, ${ZRC_ORANGE}, transparent);
    }

    .zrc-premium-dialog-body {
      padding: 24px 24px 20px;
    }

    .zrc-premium-dialog-kicker {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 28px;
      padding: 0 11px;
      border-radius: 999px;
      background: rgba(255,54,0,.08);
      border: 1px solid rgba(255,54,0,.15);
      color: ${ZRC_ORANGE};
      font-size: 10px;
      line-height: 1;
      font-weight: 950;
      letter-spacing: .16em;
      text-transform: uppercase;
    }

    .zrc-premium-dialog-title {
      margin-top: 14px;
      color: #111827;
      font-size: 22px;
      line-height: 1.1;
      font-weight: 950;
      letter-spacing: -.04em;
    }

    .zrc-premium-dialog-message {
      margin-top: 10px;
      color: #52525b;
      font-size: 13px;
      line-height: 1.6;
      font-weight: 700;
      white-space: pre-wrap;
    }

    .zrc-premium-dialog-input {
      margin-top: 18px;
      width: 100%;
      height: 52px;
      border-radius: 16px;
      border: 1px solid #e4e4e7;
      background: #fafafa;
      padding: 0 16px;
      color: #18181b;
      font-size: 14px;
      font-weight: 850;
      outline: none;
      transition: all .16s ease;
      box-sizing: border-box;
    }

    .zrc-premium-dialog-input:focus {
      border-color: ${ZRC_ORANGE};
      background: #fff;
      box-shadow: 0 0 0 5px rgba(255,54,0,.10);
    }

    .zrc-premium-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 22px;
    }

    .zrc-premium-dialog-btn {
      height: 42px;
      min-width: 92px;
      border-radius: 999px;
      border: 0;
      padding: 0 17px;
      font-size: 12px;
      font-weight: 950;
      cursor: pointer;
      transition: transform .14s ease, box-shadow .14s ease, background .14s ease;
    }

    .zrc-premium-dialog-btn:active {
      transform: scale(.97);
    }

    .zrc-premium-dialog-btn-secondary {
      color: #52525b;
      background: #f4f4f5;
      border: 1px solid #e4e4e7;
    }

    .zrc-premium-dialog-btn-secondary:hover {
      background: #ededf0;
    }

    .zrc-premium-dialog-btn-primary {
      color: #fff;
      background: linear-gradient(135deg, ${ZRC_ORANGE}, #ff5a1f);
      box-shadow: 0 13px 28px rgba(255,54,0,.26);
    }

    .zrc-premium-dialog-btn-primary:hover {
      box-shadow: 0 16px 36px rgba(255,54,0,.34);
    }

    @keyframes zrcPremiumBackdropIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes zrcPremiumCardIn {
      from { opacity: 0; transform: translateY(12px) scale(.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @media (max-width: 560px) {
      .zrc-premium-dialog-backdrop {
        align-items: flex-end;
        padding: 14px;
      }

      .zrc-premium-dialog-card {
        border-radius: 24px;
      }

      .zrc-premium-dialog-body {
        padding: 22px 18px 18px;
      }

      .zrc-premium-dialog-title {
        font-size: 20px;
      }
    }
  `;
  document.head.appendChild(style);
}

function getTitle(type) {
  if (type === 'prompt') return 'Bilgi gerekli';
  if (type === 'confirm') return 'Onay gerekiyor';
  return 'ZRC Portal';
}

function closeDialog(value) {
  if (!activeDialog) return;

  const { overlay, resolve } = activeDialog;
  activeDialog = null;

  overlay.remove();
  resolve(value);

  const next = queue.shift();
  if (next) {
    setTimeout(() => showDialog(next), 40);
  }
}

function showDialog(options) {
  if (typeof document === 'undefined') {
    if (options.type === 'confirm') return options.resolve(false);
    if (options.type === 'prompt') return options.resolve('');
    return options.resolve(undefined);
  }

  if (activeDialog) {
    queue.push(options);
    return;
  }

  ensureStyles();

  const overlay = document.createElement('div');
  overlay.className = 'zrc-premium-dialog-backdrop';

  const card = document.createElement('div');
  card.className = 'zrc-premium-dialog-card';

  const topLine = document.createElement('div');
  topLine.className = 'zrc-premium-dialog-topline';

  const body = document.createElement('div');
  body.className = 'zrc-premium-dialog-body';

  const kicker = document.createElement('div');
  kicker.className = 'zrc-premium-dialog-kicker';
  kicker.textContent = 'ZRC AJANS';

  const title = document.createElement('div');
  title.className = 'zrc-premium-dialog-title';
  title.textContent = options.title || getTitle(options.type);

  const message = document.createElement('div');
  message.className = 'zrc-premium-dialog-message';
  message.textContent = options.message || '';

  let input = null;

  if (options.type === 'prompt') {
    input = document.createElement('input');
    input.className = 'zrc-premium-dialog-input';
    input.value = options.defaultValue || '';
    input.placeholder = options.placeholder || '';
  }

  const actions = document.createElement('div');
  actions.className = 'zrc-premium-dialog-actions';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'zrc-premium-dialog-btn zrc-premium-dialog-btn-secondary';
  cancelButton.textContent = options.cancelText || 'İptal';

  const okButton = document.createElement('button');
  okButton.type = 'button';
  okButton.className = 'zrc-premium-dialog-btn zrc-premium-dialog-btn-primary';
  okButton.textContent = options.okText || 'Tamam';

  if (options.type !== 'alert') {
    actions.appendChild(cancelButton);
  }

  actions.appendChild(okButton);

  body.appendChild(kicker);
  body.appendChild(title);

  if (options.message) {
    body.appendChild(message);
  }

  if (input) {
    body.appendChild(input);
  }

  body.appendChild(actions);
  card.appendChild(topLine);
  card.appendChild(body);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  activeDialog = { overlay, resolve: options.resolve };

  const finishOk = () => {
    if (options.type === 'prompt') {
      closeDialog(input.value);
      return;
    }

    if (options.type === 'confirm') {
      closeDialog(true);
      return;
    }

    closeDialog(undefined);
  };

  const finishCancel = () => {
    if (options.type === 'prompt') {
      closeDialog(null);
      return;
    }

    if (options.type === 'confirm') {
      closeDialog(false);
      return;
    }

    closeDialog(undefined);
  };

  okButton.addEventListener('click', finishOk);
  cancelButton.addEventListener('click', finishCancel);

  overlay.addEventListener('mousedown', (event) => {
    if (event.target === overlay && options.type !== 'alert') {
      finishCancel();
    }
  });

  const onKeyDown = (event) => {
    if (!activeDialog || activeDialog.overlay !== overlay) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      finishCancel();
    }

    if (event.key === 'Enter' && (options.type !== 'prompt' || document.activeElement === input)) {
      event.preventDefault();
      finishOk();
    }
  };

  document.addEventListener('keydown', onKeyDown, { once: false });

  const originalClose = activeDialog.resolve;
  activeDialog.resolve = (value) => {
    document.removeEventListener('keydown', onKeyDown);
    originalClose(value);
  };

  setTimeout(() => {
    if (input) {
      input.focus();
      input.select();
    } else {
      okButton.focus();
    }
  }, 40);
}

export function zrcAlert(message, opts = {}) {
  return new Promise((resolve) => showDialog({
    type: 'alert',
    message: String(message || ''),
    title: opts.title || 'Bilgi',
    okText: opts.okText || 'Tamam',
    resolve
  }));
}

export function zrcConfirm(message, opts = {}) {
  return new Promise((resolve) => showDialog({
    type: 'confirm',
    message: String(message || ''),
    title: opts.title || 'Onay gerekiyor',
    okText: opts.okText || 'Onayla',
    cancelText: opts.cancelText || 'Vazgeç',
    resolve
  }));
}

export function zrcPrompt(message, defaultValue = '', opts = {}) {
  return new Promise((resolve) => showDialog({
    type: 'prompt',
    message: String(message || ''),
    defaultValue: String(defaultValue || ''),
    placeholder: opts.placeholder || '',
    title: opts.title || 'Bilgi gerekli',
    okText: opts.okText || 'Kaydet',
    cancelText: opts.cancelText || 'İptal',
    resolve
  }));
}

export function installZRCPremiumDialogRuntime() {
  if (typeof window === 'undefined') return;

  window.zrcAlert = zrcAlert;
  window.zrcConfirm = zrcConfirm;
  window.zrcPrompt = zrcPrompt;
}
