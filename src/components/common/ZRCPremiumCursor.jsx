import { useEffect, useRef } from 'react';

export default function ZRCPremiumCursor() {
  const markRef = useRef(null);
  const frameRef = useRef(null);
  const stateRef = useRef({
    x: -80,
    y: -80,
    markX: -80,
    markY: -80,
    visible: false
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    const finePointer = window.matchMedia?.('(pointer: fine)');
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    if (finePointer && !finePointer.matches) return undefined;
    if (reducedMotion && reducedMotion.matches) return undefined;

    const body = document.body;
    const mark = markRef.current;

    if (!body || !mark) return undefined;

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

    const animate = () => {
      const state = stateRef.current;

      state.markX += (state.x - state.markX) * 0.23;
      state.markY += (state.y - state.markY) * 0.23;

      mark.style.transform = `translate3d(${state.markX}px, ${state.markY}px, 0) translate(10px, 10px)`;

      frameRef.current = window.requestAnimationFrame(animate);
    };

    const setVisible = (visible) => {
      stateRef.current.visible = visible;
      body.classList.toggle('zrc-micro-cursor-visible', visible);
    };

    const applyTargetTone = (target) => {
      const element = target instanceof Element ? target : null;
      const isText = Boolean(element?.closest(textSelector));
      const isInteractive = Boolean(element?.closest(interactiveSelector));

      body.classList.toggle('zrc-micro-cursor-text', isText);
      body.classList.toggle('zrc-micro-cursor-interactive', isInteractive && !isText);
    };

    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        setVisible(false);
        return;
      }

      const state = stateRef.current;

      state.x = event.clientX;
      state.y = event.clientY;

      if (!state.visible) {
        state.markX = event.clientX;
        state.markY = event.clientY;
        setVisible(true);
      }

      applyTargetTone(event.target);
    };

    const onPointerDown = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      body.classList.add('zrc-micro-cursor-down');
    };

    const onPointerUp = () => {
      body.classList.remove('zrc-micro-cursor-down');
    };

    const onMouseLeave = () => {
      setVisible(false);
      body.classList.remove('zrc-micro-cursor-interactive', 'zrc-micro-cursor-text', 'zrc-micro-cursor-down');
    };

    const onMouseEnter = () => {
      setVisible(true);
    };

    const onTouchStart = () => {
      setVisible(false);
    };

    body.classList.add('zrc-micro-cursor-enabled');
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
        'zrc-micro-cursor-enabled',
        'zrc-micro-cursor-visible',
        'zrc-micro-cursor-interactive',
        'zrc-micro-cursor-text',
        'zrc-micro-cursor-down'
      );
    };
  }, []);

  return (
    <span ref={markRef} className="zrc-micro-cursor-mark" aria-hidden="true">
      <span className="zrc-micro-cursor-mark__dash zrc-micro-cursor-mark__dash--a" />
      <span className="zrc-micro-cursor-mark__dash zrc-micro-cursor-mark__dash--b" />
    </span>
  );
}
