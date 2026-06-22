import { useEffect, useRef } from 'react';

const ZRC_ORANGE = { r: 255, g: 54, b: 0 };
const EDITABLE_SELECTOR = 'input,textarea,select,[contenteditable="true"]';

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  '[role="button"]',
  '[type="button"]',
  '[type="submit"]',
  '[type="reset"]',
  'summary',
  '[aria-haspopup]',
  '[aria-expanded]',
  '[data-cursor="interactive"]',
  '[tabindex]:not([tabindex="-1"])',
  '.cursor-pointer',
  '.btn',
  '.button',
  '[class*="button"]',
  '[class*="Button"]',
  '[class*="btn"]',
  '[class*="Btn"]',
  '[draggable="true"]'
].join(',');

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function parseRgb(value) {
  const match = String(value || '').match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;

  const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()));
  if (parts.length < 3 || parts.slice(0, 3).some((part) => Number.isNaN(part))) {
    return null;
  }

  const alpha = Number.isFinite(parts[3]) ? parts[3] : 1;
  if (alpha <= 0.06) return null;

  return {
    r: clamp(parts[0], 0, 255),
    g: clamp(parts[1], 0, 255),
    b: clamp(parts[2], 0, 255)
  };
}

function toLinear(channel) {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function getLuminance(color) {
  return (
    0.2126 * toLinear(color.r) +
    0.7152 * toLinear(color.g) +
    0.0722 * toLinear(color.b)
  );
}

function getContrastRatio(first, second) {
  const light = Math.max(getLuminance(first), getLuminance(second));
  const dark = Math.min(getLuminance(first), getLuminance(second));
  return (light + 0.05) / (dark + 0.05);
}

function findBackgroundElement(target) {
  let current = target instanceof Element ? target : null;

  // Sadece hedef + en yakın 6 katman: düşük maliyetli kontrast tespiti.
  for (let depth = 0; current && current !== document.documentElement && depth < 6; depth += 1) {
    try {
      if (parseRgb(window.getComputedStyle(current).backgroundColor)) {
        return current;
      }
    } catch {
      break;
    }

    current = current.parentElement;
  }

  return document.body;
}

function needsWhiteOutline(target) {
  try {
    const backgroundElement = findBackgroundElement(target);
    const background = parseRgb(window.getComputedStyle(backgroundElement).backgroundColor);
    if (!background) return false;

    const contrast = getContrastRatio(ZRC_ORANGE, background);
    const distance = Math.hypot(
      ZRC_ORANGE.r - background.r,
      ZRC_ORANGE.g - background.g,
      ZRC_ORANGE.b - background.b
    );

    // Turuncu ya da benzeri zeminler / düşük kontrastlı tonlar.
    return contrast < 2.15 || distance < 116;
  } catch {
    return false;
  }
}

function getCaretAtPoint(clientX, clientY) {
  try {
    if (typeof document.caretPositionFromPoint === 'function') {
      const position = document.caretPositionFromPoint(clientX, clientY);
      if (position?.offsetNode) {
        return {
          node: position.offsetNode,
          offset: Number(position.offset || 0)
        };
      }
    }

    if (typeof document.caretRangeFromPoint === 'function') {
      const range = document.caretRangeFromPoint(clientX, clientY);
      if (range?.startContainer) {
        return {
          node: range.startContainer,
          offset: Number(range.startOffset || 0)
        };
      }
    }
  } catch {
    // Destek yoksa normal nokta imleci kullanılır.
  }

  return null;
}

function isExactlyOverText(clientX, clientY) {
  const caret = getCaretAtPoint(clientX, clientY);
  const textNode = caret?.node;

  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return false;

  const text = String(textNode.nodeValue || '');
  if (!text) return false;

  const offset = clamp(Number(caret.offset || 0), 0, text.length);
  const indexes = [offset, offset - 1]
    .filter((index) => index >= 0 && index < text.length)
    .filter((index, position, all) => all.indexOf(index) === position)
    .filter((index) => !/\s/.test(text[index] || ''));

  if (!indexes.length) return false;

  try {
    const range = document.createRange();

    return indexes.some((index) => {
      range.setStart(textNode, index);
      range.setEnd(textNode, index + 1);

      const rect = range.getBoundingClientRect();
      if (!rect || (!rect.width && !rect.height)) return false;

      return (
        clientX >= rect.left - 2 &&
        clientX <= rect.right + 2 &&
        clientY >= rect.top - 3 &&
        clientY <= rect.bottom + 3
      );
    });
  } catch {
    return false;
  }
}

export default function ZRCPremiumCursor() {
  const frameRef = useRef(0);
  const stateRef = useRef({
    x: -80,
    y: -80,
    previousX: null,
    previousY: null,
    speed: 0,
    angle: 0,
    target: null,
    lastContrastTarget: null,
    lowContrast: false
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    const finePointer = window.matchMedia?.('(pointer: fine)');
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    if ((finePointer && !finePointer.matches) || (reducedMotion && reducedMotion.matches)) {
      return undefined;
    }

    const body = document.body;
    const cursor = document.createElement('span');
    const dot = document.createElement('span');

    cursor.className = 'zrc-classic-orange-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.setAttribute('data-zrc-cursor-portal', 'true');

    dot.className = 'zrc-classic-orange-cursor__dot';
    cursor.appendChild(dot);
    body.appendChild(cursor);
    body.classList.add('zrc-classic-orange-cursor-enabled');

    const hide = () => {
      cursor.classList.remove(
        'is-visible',
        'is-interactive',
        'is-text',
        'is-low-contrast',
        'is-pressed'
      );
    };

    const render = () => {
      frameRef.current = 0;

      const state = stateRef.current;
      const target = state.target instanceof Element ? state.target : null;
      const editable = Boolean(target?.closest(EDITABLE_SELECTOR));
      const interactive = !editable && Boolean(target?.closest(INTERACTIVE_SELECTOR));
      const textMode = !editable && !interactive && isExactlyOverText(state.x, state.y);

      if (target && target !== state.lastContrastTarget) {
        state.lastContrastTarget = target;
        state.lowContrast = needsWhiteOutline(target);
      }

      const speed = clamp(state.speed, 0, 34);
      const stretch = textMode ? 1 : 1 + Math.min(0.28, speed / 108);
      const squash = textMode ? 1 : 1 - Math.min(0.14, speed / 190);

      cursor.style.setProperty('--zrc-cursor-x', `${state.x}px`);
      cursor.style.setProperty('--zrc-cursor-y', `${state.y}px`);
      dot.style.setProperty('--zrc-cursor-angle', `${textMode ? 0 : state.angle}deg`);
      dot.style.setProperty('--zrc-cursor-scale-x', stretch.toFixed(3));
      dot.style.setProperty('--zrc-cursor-scale-y', squash.toFixed(3));

      cursor.classList.toggle('is-visible', !editable);
      cursor.classList.toggle('is-interactive', interactive);
      cursor.classList.toggle('is-text', textMode);

      // Metin çizgisi zaten ince olduğu için kontur yalnızca normal imleçte görünür.
      cursor.classList.toggle('is-low-contrast', Boolean(state.lowContrast) && !textMode);
    };

    const scheduleRender = () => {
      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(render);
      }
    };

    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        hide();
        return;
      }

      const state = stateRef.current;
      const nextX = event.clientX;
      const nextY = event.clientY;
      const deltaX = state.previousX === null ? 0 : nextX - state.previousX;
      const deltaY = state.previousY === null ? 0 : nextY - state.previousY;

      state.x = nextX;
      state.y = nextY;
      state.previousX = nextX;
      state.previousY = nextY;
      state.speed = Math.hypot(deltaX, deltaY);

      if (state.speed > 0.3) {
        state.angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
      }

      state.target = event.target instanceof Element ? event.target : null;
      scheduleRender();
    };

    const onPointerDown = (event) => {
      if (!event.pointerType || event.pointerType === 'mouse') {
        cursor.classList.add('is-pressed');
      }
    };

    const onPointerUp = () => {
      cursor.classList.remove('is-pressed');
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('blur', onPointerUp);
    document.addEventListener('mouseleave', hide);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('blur', onPointerUp);
      document.removeEventListener('mouseleave', hide);

      cursor.remove();
      body.classList.remove('zrc-classic-orange-cursor-enabled');
    };
  }, []);

  return null;
}
