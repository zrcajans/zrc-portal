import { useEffect, useRef } from 'react';

export default function ZRCPremiumCursor() {
  const cursorRef = useRef(null);
  const frameRef = useRef(null);

  const stateRef = useRef({
    x: -80,
    y: -80,
    dotX: -80,
    dotY: -80,
    visible: false
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    const finePointer = window.matchMedia?.('(pointer: fine)');
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    if (finePointer && !finePointer.matches) return undefined;
    if (reducedMotion && reducedMotion.matches) return undefined;

    const body = document.body;
    const cursor = cursorRef.current;

    if (!body || !cursor) return undefined;

    const interactiveSelector = [
      'a',
      'button',
      '[role="button"]',
      'input',
      'textarea',
      'select',
      'summary',
      '[contenteditable="true"]',
      '[data-cursor="interactive"]',
      '.cursor-pointer',
      '[draggable="true"]'
    ].join(',');

    const textSelector = [
      'input',
      'textarea',
      '[contenteditable="true"]'
    ].join(',');

    const applyTargetState = (target) => {
      const element = target instanceof Element ? target : null;
      const isText = Boolean(element?.closest(textSelector));
      const isInteractive = Boolean(element?.closest(interactiveSelector));

      body.classList.toggle('zrc-pure-dot-cursor-text', isText);
      body.classList.toggle('zrc-pure-dot-cursor-interactive', isInteractive && !isText);
    };

    const animate = () => {
      const state = stateRef.current;

      state.dotX += (state.x - state.dotX) * 0.62;
      state.dotY += (state.y - state.dotY) * 0.62;

      cursor.style.transform = `translate3d(${state.dotX}px, ${state.dotY}px, 0) translate(-50%, -50%)`;

      frameRef.current = window.requestAnimationFrame(animate);
    };

    const show = () => {
      stateRef.current.visible = true;
      body.classList.add('zrc-pure-dot-cursor-visible');
    };

    const hide = () => {
      stateRef.current.visible = false;
      body.classList.remove(
        'zrc-pure-dot-cursor-visible',
        'zrc-pure-dot-cursor-interactive',
        'zrc-pure-dot-cursor-text',
        'zrc-pure-dot-cursor-down'
      );
    };

    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        hide();
        return;
      }

      const state = stateRef.current;
      state.x = event.clientX;
      state.y = event.clientY;

      if (!state.visible) {
        state.dotX = event.clientX;
        state.dotY = event.clientY;
        show();
      }

      applyTargetState(event.target);
    };

    const onPointerDown = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      body.classList.add('zrc-pure-dot-cursor-down');
    };

    const onPointerUp = () => {
      body.classList.remove('zrc-pure-dot-cursor-down');
    };

    const onMouseLeave = () => hide();
    const onMouseEnter = () => show();
    const onTouchStart = () => hide();

    body.classList.add('zrc-pure-dot-cursor-enabled');

    frameRef.current = window.requestAnimationFrame(animate);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('touchstart', onTouchStart);

      body.classList.remove(
        'zrc-pure-dot-cursor-enabled',
        'zrc-pure-dot-cursor-visible',
        'zrc-pure-dot-cursor-interactive',
        'zrc-pure-dot-cursor-text',
        'zrc-pure-dot-cursor-down'
      );
    };
  }, []);

  return <span ref={cursorRef} className="zrc-pure-dot-cursor" aria-hidden="true" />;
}
