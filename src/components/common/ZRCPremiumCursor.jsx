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

function parseRgbColor(value) {
  if (!value || value === 'transparent') return null;

  const match = String(value).match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;

  const values = match[1]
    .split(',')
    .map((part) => Number.parseFloat(part.trim()));

  if (values.length < 3 || values.slice(0, 3).some((part) => Number.isNaN(part))) {
    return null;
  }

  const alpha = Number.isFinite(values[3]) ? values[3] : 1;
  if (alpha <= 0.06) return null;

  return {
    r: clamp(values[0], 0, 255),
    g: clamp(values[1], 0, 255),
    b: clamp(values[2], 0, 255)
  };
}

function toLinear(channel) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function getLuminance(color) {
  return (
    0.2126 * toLinear(color.r) +
    0.7152 * toLinear(color.g) +
    0.0722 * toLinear(color.b)
  );
}

function getContrastRatio(first, second) {
  const firstLum = getLuminance(first);
  const secondLum = getLuminance(second);
  const lighter = Math.max(firstLum, secondLum);
  const darker = Math.min(firstLum, secondLum);

  return (lighter + 0.05) / (darker + 0.05);
}

function getBackgroundAnchor(target) {
  let current = target instanceof Element ? target : null;

  for (let depth = 0; current && current !== document.documentElement && depth < 6; depth += 1) {
    try {
      if (parseRgbColor(window.getComputedStyle(current).backgroundColor)) {
        return current;
      }
    } catch {
      break;
    }

    current = current.parentElement;
  }

  return document.body;
}

function needsWhiteOutline(anchor) {
  try {
    const background = parseRgbColor(window.getComputedStyle(anchor).backgroundColor);
    if (!background) return false;

    const contrast = getContrastRatio(ZRC_ORANGE, background);
    const colorDistance = Math.hypot(
      ZRC_ORANGE.r - background.r,
      ZRC_ORANGE.g - background.g,
      ZRC_ORANGE.b - background.b
    );

    return contrast < 2.15 || colorDistance < 116;
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
    // Tarayıcı desteklemezse normal nokta modunda kalır.
  }

  return null;
}

function isPointerExactlyOnText(clientX, clientY) {
  const caret = getCaretAtPoint(clientX, clientY);
  const textNode = caret?.node;

  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return false;

  const text = String(textNode.nodeValue || '');
  if (!text) return false;

  const offset = clamp(Number(caret.offset || 0), 0, text.length);
  const candidateIndexes = [offset, offset - 1]
    .filter((index) => index >= 0 && index < text.length)
    .filter((index, indexPosition, allIndexes) => allIndexes.indexOf(index) === indexPosition)
    .filter((index) => !/\s/.test(text[index] || ''));

  if (!candidateIndexes.length) return false;

  try {
    const range = document.createRange();

    return candidateIndexes.some((index) => {
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
  const animationFrameRef = useRef(0);

  const stateRef = useRef({
    x: -80,
    y: -80,
    previousX: -80,
    previousY: -80,
    speed: 0,
    angle: 0,
    target: null,
    lastBackgroundTarget: null,
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
    const shape = document.createElement('span');

    cursor.className = 'zrc-smooth-liquid-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.setAttribute('data-zrc-cursor-portal', 'true');

    shape.className = 'zrc-smooth-liquid-cursor__shape';
    cursor.appendChild(shape);
    body.appendChild(cursor);
    body.classList.add('zrc-smooth-liquid-cursor-enabled');

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
      animationFrameRef.current = 0;

      const state = stateRef.current;
      const target = state.target instanceof Element ? state.target : null;
      const editable = Boolean(target?.closest(EDITABLE_SELECTOR));
      const interactive = !editable && Boolean(target?.closest(INTERACTIVE_SELECTOR));
      const textMode = !editable && !interactive && isPointerExactlyOnText(state.x, state.y);

      if (target && target !== state.lastBackgroundTarget) {
        state.lastBackgroundTarget = target;
        state.lowContrast = needsWhiteOutline(getBackgroundAnchor(target));
      }

      const normalizedSpeed = clamp(state.speed, 0, 32);
      const stretch = textMode ? 1 : 1 + Math.min(0.28, normalizedSpeed / 104);
      const squash = textMode ? 1 : 1 - Math.min(0.16, normalizedSpeed / 178);
      const angle = textMode ? 0 : state.angle;
      const skew = textMode ? 0 : clamp(normalizedSpeed / 12, 0, 3.2);

      cursor.style.setProperty('--zrc-cursor-x', `${state.x}px`);
      cursor.style.setProperty('--zrc-cursor-y', `${state.y}px`);
      shape.style.setProperty('--zrc-liquid-rotation', `${angle.toFixed(2)}deg`);
      shape.style.setProperty('--zrc-liquid-scale-x', stretch.toFixed(3));
      shape.style.setProperty('--zrc-liquid-scale-y', squash.toFixed(3));
      shape.style.setProperty('--zrc-liquid-skew', `${skew.toFixed(2)}deg`);

      cursor.classList.toggle('is-visible', !editable);
      cursor.classList.toggle('is-interactive', interactive);
      cursor.classList.toggle('is-text', textMode);
      cursor.classList.toggle('is-low-contrast', Boolean(state.lowContrast) && !textMode);
    };

    const scheduleRender = () => {
      if (!animationFrameRef.current) {
        animationFrameRef.current = window.requestAnimationFrame(render);
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

      if (state.speed > 0.25) {
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
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('blur', onPointerUp);
      document.removeEventListener('mouseleave', hide);

      cursor.remove();
      body.classList.remove('zrc-smooth-liquid-cursor-enabled');
    };
  }, []);

  return null;
}
