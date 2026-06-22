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

function parseRgbColor(value) {
  if (!value || value === 'transparent') return null;

  const match = String(value).match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;

  const parts = match[1]
    .split(',')
    .map((part) => Number.parseFloat(part.trim()));

  if (parts.length < 3 || parts.slice(0, 3).some((part) => Number.isNaN(part))) {
    return null;
  }

  const alpha = Number.isFinite(parts[3]) ? parts[3] : 1;
  if (alpha <= 0.05) return null;

  return {
    r: Math.max(0, Math.min(255, parts[0])),
    g: Math.max(0, Math.min(255, parts[1])),
    b: Math.max(0, Math.min(255, parts[2])),
    a: alpha
  };
}

function channelToLinear(value) {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function getLuminance(color) {
  return (
    0.2126 * channelToLinear(color.r) +
    0.7152 * channelToLinear(color.g) +
    0.0722 * channelToLinear(color.b)
  );
}

function getContrastRatio(first, second) {
  const firstLum = getLuminance(first);
  const secondLum = getLuminance(second);
  const lighter = Math.max(firstLum, secondLum);
  const darker = Math.min(firstLum, secondLum);

  return (lighter + 0.05) / (darker + 0.05);
}

function getContrastAnchor(target) {
  let current = target instanceof Element ? target : null;

  // Maksimum 6 üst katman: yeterli kontrast bilgisi, gereksiz DOM maliyeti yok.
  for (let depth = 0; current && current !== document.documentElement && depth < 6; depth += 1) {
    try {
      const background = parseRgbColor(window.getComputedStyle(current).backgroundColor);
      if (background) return current;
    } catch {
      break;
    }

    current = current.parentElement;
  }

  return document.body;
}

function shouldShowWhiteOutline(anchor) {
  try {
    const background = parseRgbColor(window.getComputedStyle(anchor).backgroundColor);
    if (!background) return false;

    const contrast = getContrastRatio(ZRC_ORANGE, background);
    const orangeDistance = Math.hypot(
      ZRC_ORANGE.r - background.r,
      ZRC_ORANGE.g - background.g,
      ZRC_ORANGE.b - background.b
    );

    // Turuncu zeminler ve turuncunun kaybolduğu orta-kontrast tonlar.
    return contrast < 2.15 || orangeDistance < 118;
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
    // Hit-test API desteklenmiyorsa normal nokta imleci kullanılır.
  }

  return null;
}

function isPointerOnRenderedText(clientX, clientY) {
  const caret = getCaretAtPoint(clientX, clientY);
  const textNode = caret?.node;

  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return false;

  const text = String(textNode.nodeValue || '');
  if (!text) return false;

  const offset = Math.max(0, Math.min(Number(caret.offset || 0), text.length));
  const candidates = [offset, offset - 1]
    .filter((index) => index >= 0 && index < text.length)
    .filter((index, position, array) => array.indexOf(index) === position)
    .filter((index) => !/\s/.test(text[index] || ''));

  if (candidates.length === 0) return false;

  try {
    const range = document.createRange();

    return candidates.some((index) => {
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
    previousX: -80,
    previousY: -80,
    speed: 0,
    angle: 0,
    visible: false,
    target: null,
    lastModeTarget: null,
    contrastAnchor: null,
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
    const blob = document.createElement('span');

    cursor.className = 'zrc-smart-liquid-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.setAttribute('data-zrc-cursor-portal', 'true');

    blob.className = 'zrc-smart-liquid-cursor__blob';
    cursor.appendChild(blob);
    body.appendChild(cursor);
    body.classList.add('zrc-smart-liquid-cursor-enabled');

    const hide = () => {
      stateRef.current.visible = false;
      cursor.classList.remove(
        'is-visible',
        'is-interactive',
        'is-text',
        'is-low-contrast',
        'is-pressed'
      );
    };

    const paint = () => {
      frameRef.current = 0;

      const state = stateRef.current;
      const target = state.target instanceof Element ? state.target : null;
      const editable = Boolean(target?.closest(EDITABLE_SELECTOR));
      const interactive = !editable && Boolean(target?.closest(INTERACTIVE_SELECTOR));
      const textMode = !editable && !interactive && isPointerOnRenderedText(state.x, state.y);

      if (target && target !== state.lastModeTarget) {
        state.lastModeTarget = target;
        state.contrastAnchor = getContrastAnchor(target);
        state.lowContrast = shouldShowWhiteOutline(state.contrastAnchor);
      }

      const speed = Math.min(34, state.speed);
      const stretch = textMode ? 1 : 1 + Math.min(0.38, speed / 76);
      const squash = textMode ? 1 : Math.max(0.72, 1 - Math.min(0.22, speed / 155));
      const angle = textMode ? 0 : state.angle;

      // Hıza ve yön değişimine göre organik sıvı form.
      const wobble = Math.min(11, Math.round(speed / 3));
      const radius = textMode
        ? '999px'
        : `${58 + wobble}% ${42 - Math.min(8, wobble)}% ${54 + Math.min(8, wobble)}% ${46 - Math.min(7, wobble)}% / ${48 - Math.min(7, wobble)}% ${57 + Math.min(8, wobble)}% ${43 - Math.min(6, wobble)}% ${58 + Math.min(7, wobble)}%`;

      cursor.style.setProperty('--zrc-cursor-x', `${state.x}px`);
      cursor.style.setProperty('--zrc-cursor-y', `${state.y}px`);
      blob.style.setProperty('--zrc-liquid-angle', `${angle.toFixed(2)}deg`);
      blob.style.setProperty('--zrc-liquid-scale-x', stretch.toFixed(3));
      blob.style.setProperty('--zrc-liquid-scale-y', squash.toFixed(3));
      blob.style.setProperty('--zrc-liquid-radius', radius);

      cursor.classList.toggle('is-visible', !editable);
      cursor.classList.toggle('is-interactive', interactive);
      cursor.classList.toggle('is-text', textMode);
      cursor.classList.toggle('is-low-contrast', Boolean(state.lowContrast) && !textMode);

      state.visible = !editable;
    };

    const schedulePaint = () => {
      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(paint);
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
      const deltaX = nextX - state.previousX;
      const deltaY = nextY - state.previousY;

      state.x = nextX;
      state.y = nextY;
      state.previousX = nextX;
      state.previousY = nextY;
      state.speed = Math.hypot(deltaX, deltaY);

      if (state.speed > 0.45) {
        state.angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
      }

      state.target = event.target instanceof Element ? event.target : null;
      schedulePaint();
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
      body.classList.remove('zrc-smart-liquid-cursor-enabled');
    };
  }, []);

  return null;
}
