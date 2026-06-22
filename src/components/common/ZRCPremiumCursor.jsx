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

    const zrcGetTextRangeAtPointer = (clientX, clientY) => {
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
        // Tarayıcı hit-test API'sini desteklemezse normal nokta imleci kullanılır.
      }

      return null;
    };

    const zrcIsPointerOnRenderedText = (clientX, clientY) => {
      const caret = zrcGetTextRangeAtPointer(clientX, clientY);
      const textNode = caret?.node;

      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
        return false;
      }

      const text = String(textNode.nodeValue || '');
      if (!text) return false;

      const safeOffset = Math.max(0, Math.min(Number(caret.offset || 0), text.length));

      // Caret bir harfin sağına düşebildiği için iki komşu karakteri kontrol eder.
      // Boşluk karakteri uzun imleci tetiklemez.
      const candidateIndexes = [safeOffset, safeOffset - 1]
        .filter((index) => index >= 0 && index < text.length)
        .filter((index, position, array) => array.indexOf(index) === position)
        .filter((index) => !/\s/.test(text[index] || ''));

      if (candidateIndexes.length === 0) {
        return false;
      }

      try {
        const range = document.createRange();

        return candidateIndexes.some((index) => {
          range.setStart(textNode, index);
          range.setEnd(textNode, index + 1);

          const rect = range.getBoundingClientRect();
          if (!rect || (!rect.width && !rect.height)) return false;

          const horizontalPadding = 2;
          const verticalPadding = 3;

          return (
            clientX >= rect.left - horizontalPadding &&
            clientX <= rect.right + horizontalPadding &&
            clientY >= rect.top - verticalPadding &&
            clientY <= rect.bottom + verticalPadding
          );
        });
      } catch {
        return false;
      }
    };

    const setModeFromTarget = (target, clientX, clientY) => {
      const element = target instanceof Element ? target : null;
      const isEditable = Boolean(element?.closest(EDITABLE_SELECTOR));
      const isInteractive = !isEditable && Boolean(element?.closest(INTERACTIVE_SELECTOR));

      // Uzun imleç yalnızca gerçek, render edilmiş bir harfin hitbox'ında görünür.
      const isText =
        !isEditable &&
        !isInteractive &&
        zrcIsPointerOnRenderedText(clientX, clientY);

      body.classList.toggle('zrc-dynamic-orange-cursor-text-mode', isText);
      body.classList.toggle('zrc-dynamic-orange-cursor-interactive', isInteractive);
      body.classList.toggle('zrc-dynamic-orange-cursor-visible', !isEditable);

      return { isEditable, isText };
    };

    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        hide();
        return;
      }

      const state = stateRef.current;
      const { isEditable, isText } = setModeFromTarget(event.target, event.clientX, event.clientY);

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
