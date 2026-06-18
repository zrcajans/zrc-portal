import { useEffect, useRef } from 'react';

export default function ZRCPremiumCursor() {
  const bladeRef = useRef(null);
  const trailARef = useRef(null);
  const trailBRef = useRef(null);
  const trailCRef = useRef(null);
  const frameRef = useRef(null);

  const stateRef = useRef({
    x: -120,
    y: -120,
    bladeX: -120,
    bladeY: -120,
    trailAX: -120,
    trailAY: -120,
    trailBX: -120,
    trailBY: -120,
    trailCX: -120,
    trailCY: -120,
    visible: false
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    const finePointer = window.matchMedia?.('(pointer: fine)');
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    if (finePointer && !finePointer.matches) return undefined;
    if (reducedMotion && reducedMotion.matches) return undefined;

    const body = document.body;
    const blade = bladeRef.current;
    const trailA = trailARef.current;
    const trailB = trailBRef.current;
    const trailC = trailCRef.current;

    if (!body || !blade || !trailA || !trailB || !trailC) return undefined;

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

    const cleanupClasses = () => {
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

    const setTransform = (element, x, y) => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const animate = () => {
      const state = stateRef.current;

      state.bladeX += (state.x - state.bladeX) * 0.42;
      state.bladeY += (state.y - state.bladeY) * 0.42;

      state.trailAX += (state.x - state.trailAX) * 0.20;
      state.trailAY += (state.y - state.trailAY) * 0.20;

      state.trailBX += (state.x - state.trailBX) * 0.135;
      state.trailBY += (state.y - state.trailBY) * 0.135;

      state.trailCX += (state.x - state.trailCX) * 0.085;
      state.trailCY += (state.y - state.trailCY) * 0.085;

      setTransform(blade, state.bladeX, state.bladeY);
      setTransform(trailA, state.trailAX, state.trailAY);
      setTransform(trailB, state.trailBX, state.trailBY);
      setTransform(trailC, state.trailCX, state.trailCY);

      frameRef.current = window.requestAnimationFrame(animate);
    };

    const showCursor = () => {
      stateRef.current.visible = true;
      body.classList.add('zrc-premium-cursor-visible');
    };

    const hideCursor = () => {
      stateRef.current.visible = false;
      cleanupClasses();
    };

    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        hideCursor();
        return;
      }

      const state = stateRef.current;
      state.x = event.clientX;
      state.y = event.clientY;

      if (!state.visible) {
        state.bladeX = event.clientX;
        state.bladeY = event.clientY;
        state.trailAX = event.clientX;
        state.trailAY = event.clientY;
        state.trailBX = event.clientX;
        state.trailBY = event.clientY;
        state.trailCX = event.clientX;
        state.trailCY = event.clientY;
        showCursor();
      }

      applyTargetTone(event.target);
    };

    const onPointerDown = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      body.classList.add('zrc-premium-cursor-down');
    };

    const onPointerUp = () => {
      body.classList.remove('zrc-premium-cursor-down');
    };

    const onMouseLeave = () => hideCursor();
    const onMouseEnter = () => showCursor();
    const onTouchStart = () => hideCursor();

    body.classList.add('zrc-premium-cursor-enabled');
    body.classList.add('zrc-cursor-blade-mode');

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
      body.classList.remove('zrc-cursor-blade-mode');
      cleanupClasses();
    };
  }, []);

  return (
    <>
      <span ref={trailCRef} className="zrc-cursor-trail zrc-cursor-trail-c" aria-hidden="true" />
      <span ref={trailBRef} className="zrc-cursor-trail zrc-cursor-trail-b" aria-hidden="true" />
      <span ref={trailARef} className="zrc-cursor-trail zrc-cursor-trail-a" aria-hidden="true" />
      <span ref={bladeRef} className="zrc-cursor-blade" aria-hidden="true" />
    </>
  );
}
