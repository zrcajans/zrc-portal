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
  '[tabindex]:not([tabindex="-1"])',
  '.cursor-pointer',
  '.btn',
  '.button',
  '[class*="button"]',
  '[class*="Button"]',
  '[class*="btn"]',
  '[class*="Btn"]'
].join(',');

export default function ZRCPremiumCursor() {
  const frameRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    const finePointer = window.matchMedia?.('(pointer: fine)');
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    if ((finePointer && !finePointer.matches) || (reducedMotion && reducedMotion.matches)) {
      return undefined;
    }

    const body = document.body;
    const cursor = document.createElement('span');

    cursor.className = 'zrc-lite-orange-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.setAttribute('data-zrc-cursor-portal', 'true');

    body.appendChild(cursor);
    body.classList.add('zrc-lite-orange-cursor-enabled');

    let latestX = -80;
    let latestY = -80;

    const paint = () => {
      frameRef.current = 0;
      cursor.style.setProperty('--zrc-lite-x', `${latestX}px`);
      cursor.style.setProperty('--zrc-lite-y', `${latestY}px`);
    };

    const schedulePaint = () => {
      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(paint);
      }
    };

    const hide = () => {
      body.classList.remove(
        'zrc-lite-orange-cursor-visible',
        'zrc-lite-orange-cursor-interactive',
        'zrc-lite-orange-cursor-down'
      );
    };

    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        hide();
        return;
      }

      latestX = event.clientX;
      latestY = event.clientY;
      schedulePaint();

      const element = event.target instanceof Element ? event.target : null;
      const isEditable = Boolean(element?.closest(EDITABLE_SELECTOR));
      const isInteractive = !isEditable && Boolean(element?.closest(INTERACTIVE_SELECTOR));

      body.classList.toggle('zrc-lite-orange-cursor-interactive', isInteractive);
      body.classList.toggle('zrc-lite-orange-cursor-visible', !isEditable);
    };

    const onPointerDown = (event) => {
      if (!event.pointerType || event.pointerType === 'mouse') {
        body.classList.add('zrc-lite-orange-cursor-down');
      }
    };

    const onPointerUp = () => {
      body.classList.remove('zrc-lite-orange-cursor-down');
    };

    const onMouseEnter = () => {
      if (latestX > -70 && latestY > -70) {
        body.classList.add('zrc-lite-orange-cursor-visible');
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('blur', onPointerUp);
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('blur', onPointerUp);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', onMouseEnter);

      cursor.remove();
      body.classList.remove(
        'zrc-lite-orange-cursor-enabled',
        'zrc-lite-orange-cursor-visible',
        'zrc-lite-orange-cursor-interactive',
        'zrc-lite-orange-cursor-down'
      );
    };
  }, []);

  return null;
}
