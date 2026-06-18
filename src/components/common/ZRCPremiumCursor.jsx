import { useEffect, useRef } from 'react';

export default function ZRCPremiumCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const frameRef = useRef(null);
  const positionRef = useRef({
    x: -100,
    y: -100,
    ringX: -100,
    ringY: -100,
    visible: false
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    const finePointer = window.matchMedia?.('(pointer: fine)');
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    if (finePointer && !finePointer.matches) return undefined;
    if (reducedMotion && reducedMotion.matches) return undefined;

    const body = document.body;
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!body || !dot || !ring) return undefined;

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

    const cleanupTargetClasses = () => {
      body.classList.remove('zrc-premium-cursor-visible');
      body.classList.remove('zrc-premium-cursor-interactive');
      body.classList.remove('zrc-premium-cursor-text');
      body.classList.remove('zrc-premium-cursor-down');
    };

    const applyTargetTone = (target) => {
      const element = target instanceof Element ? target : null;

      const isTextTarget = Boolean(element?.closest(textSelector));
      const isInteractiveTarget = Boolean(element?.closest(interactiveSelector));

      body.classList.toggle('zrc-premium-cursor-text', isTextTarget);
      body.classList.toggle('zrc-premium-cursor-interactive', isInteractiveTarget && !isTextTarget);
    };

    const animate = () => {
      const state = positionRef.current;

      state.ringX += (state.x - state.ringX) * 0.19;
      state.ringY += (state.y - state.ringY) * 0.19;

      dot.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate(-50%, -50%)`;

      frameRef.current = window.requestAnimationFrame(animate);
    };

    const showCursor = () => {
      positionRef.current.visible = true;
      body.classList.add('zrc-premium-cursor-visible');
    };

    const hideCursor = () => {
      positionRef.current.visible = false;
      cleanupTargetClasses();
    };

    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        hideCursor();
        return;
      }

      positionRef.current.x = event.clientX;
      positionRef.current.y = event.clientY;

      if (!positionRef.current.visible) {
        positionRef.current.ringX = event.clientX;
        positionRef.current.ringY = event.clientY;
        showCursor();
      }

      applyTargetTone(event.target);
    };

    const onPointerDown = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;

      body.classList.add('zrc-premium-cursor-down');

      const ripple = document.createElement('span');
      ripple.className = 'zrc-premium-cursor-ripple';
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;

      document.body.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 520);
    };

    const onPointerUp = () => {
      body.classList.remove('zrc-premium-cursor-down');
    };

    const onMouseLeave = () => {
      hideCursor();
    };

    const onMouseEnter = () => {
      showCursor();
    };

    const onTouchStart = () => {
      hideCursor();
    };

    body.classList.add('zrc-premium-cursor-enabled');
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

      body.classList.remove('zrc-premium-cursor-enabled');
      cleanupTargetClasses();
    };
  }, []);

  return (
    <>
      <span ref={ringRef} className="zrc-premium-cursor-ring" aria-hidden="true" />
      <span ref={dotRef} className="zrc-premium-cursor-dot" aria-hidden="true" />
    </>
  );
}
