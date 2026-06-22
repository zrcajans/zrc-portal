import { useEffect, useRef } from 'react';

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

const TEXT_SELECTOR = [
  'p',
  'span',
  'strong',
  'em',
  'b',
  'i',
  'small',
  'label',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'td',
  'th',
  'blockquote',
  'code',
  'pre'
].join(',');

export default function ZRCPremiumCursor() {
  const frameRef = useRef(0);
  const stateRef = useRef({
    x: -80,
    y: -80,
    previousX: -80,
    previousY: -80,
    rotation: 0,
    scaleX: 1,
    scaleY: 1
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

    cursor.className = 'zrc-dynamic-orange-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.setAttribute('data-zrc-cursor-portal', 'true');

    body.appendChild(cursor);
    body.classList.add('zrc-dynamic-orange-cursor-enabled');

    const paint = () => {
      frameRef.current = 0;

      const state = stateRef.current;
      cursor.style.setProperty('--zrc-cursor-x', `${state.x}px`);
      cursor.style.setProperty('--zrc-cursor-y', `${state.y}px`);
      cursor.style.setProperty('--zrc-cursor-rotation', `${state.rotation.toFixed(2)}deg`);
      cursor.style.setProperty('--zrc-cursor-scale-x', state.scaleX.toFixed(3));
      cursor.style.setProperty('--zrc-cursor-scale-y', state.scaleY.toFixed(3));
    };

    const schedulePaint = () => {
      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(paint);
      }
    };

    const hasDirectReadableText = (startElement) => {
      let current = startElement;

      // Pahalı genel DOM taraması yerine yalnızca hedef + en yakın 4 üst katman.
      // Bu, div içine doğrudan yazılmış "Gösterilecek görev yok" gibi metinleri yakalar.
      for (let depth = 0; current && current !== document.body && depth < 4; depth += 1) {
        if (current.matches?.(TEXT_SELECTOR)) {
          return true;
        }

        const hasOwnTextNode = Array.from(current.childNodes || []).some((node) => (
          node.nodeType === Node.TEXT_NODE &&
          String(node.nodeValue || '').trim().length > 0
        ));

        if (hasOwnTextNode) {
          return true;
        }

        current = current.parentElement;
      }

      return false;
    };

    const setModeFromTarget = (target) => {
      const element = target instanceof Element ? target : null;
      const isEditable = Boolean(element?.closest(EDITABLE_SELECTOR));
      const isInteractive = !isEditable && Boolean(element?.closest(INTERACTIVE_SELECTOR));

      // Önce etkileşimli elemanları ele; geri kalan okunabilir normal metinlerde
      // ince/uzun turuncu imleç görünür.
      const isText = !isEditable && !isInteractive && hasDirectReadableText(element);

      body.classList.toggle('zrc-dynamic-orange-cursor-text-mode', isText);
      body.classList.toggle('zrc-dynamic-orange-cursor-interactive', isInteractive);
      body.classList.toggle('zrc-dynamic-orange-cursor-visible', !isEditable);

      return { isEditable, isText };
    };

    const hide = () => {
      body.classList.remove(
        'zrc-dynamic-orange-cursor-visible',
        'zrc-dynamic-orange-cursor-interactive',
        'zrc-dynamic-orange-cursor-down'
      );
    };

    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        hide();
        return;
      }

      const state = stateRef.current;
      const { isEditable, isText } = setModeFromTarget(event.target);

      const nextX = event.clientX;
      const nextY = event.clientY;
      const deltaX = nextX - state.previousX;
      const deltaY = nextY - state.previousY;
      const speed = Math.min(28, Math.hypot(deltaX, deltaY));

      state.x = nextX;
      state.y = nextY;
      state.previousX = nextX;
      state.previousY = nextY;

      if (isText) {
        state.rotation = 0;
        state.scaleX = 1;
        state.scaleY = 1;
      } else if (speed > 0.5) {
        const stretch = 1 + Math.min(0.24, speed / 120);
        state.rotation = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
        state.scaleX = stretch;
        state.scaleY = Math.max(0.86, 1 - (stretch - 1) * 0.62);
      } else {
        state.scaleX = 1;
        state.scaleY = 1;
      }

      if (isEditable) {
        return;
      }

      schedulePaint();
    };

    const onPointerDown = (event) => {
      if (!event.pointerType || event.pointerType === 'mouse') {
        body.classList.add('zrc-dynamic-orange-cursor-down');
      }
    };

    const onPointerUp = () => {
      body.classList.remove('zrc-dynamic-orange-cursor-down');
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
      body.classList.remove(
        'zrc-dynamic-orange-cursor-enabled',
        'zrc-dynamic-orange-cursor-visible',
        'zrc-dynamic-orange-cursor-interactive',
        'zrc-dynamic-orange-cursor-text-mode',
        'zrc-dynamic-orange-cursor-down'
      );
    };
  }, []);

  return null;
}
