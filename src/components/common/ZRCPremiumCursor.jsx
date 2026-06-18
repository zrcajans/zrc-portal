import { useEffect, useRef } from 'react';

export default function ZRCPremiumCursor() {
  const cursorRef = useRef(null);
  const softRef = useRef(null);
  const frameRef = useRef(null);
  const clickTimerRef = useRef(null);

  const stateRef = useRef({
    x: -80,
    y: -80,
    cursorX: -80,
    cursorY: -80,
    softX: -80,
    softY: -80,
    angle: 0,
    targetAngle: 0,
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
    const soft = softRef.current;

    if (!body || !cursor || !soft) return undefined;

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

      body.classList.toggle('zrc-tiny-x-cursor-text', isText);
      body.classList.toggle('zrc-tiny-x-cursor-interactive', isInteractive && !isText);
    };

    const shortestAngle = (from, to) => {
      let delta = to - from;
      while (delta > 180) delta -= 360;
      while (delta < -180) delta += 360;
      return delta;
    };

    const animate = () => {
      const state = stateRef.current;

      state.cursorX += (state.x - state.cursorX) * 0.62;
      state.cursorY += (state.y - state.cursorY) * 0.62;

      state.softX += (state.x - state.softX) * 0.19;
      state.softY += (state.y - state.softY) * 0.19;

      state.angle += shortestAngle(state.angle, state.targetAngle) * 0.16;

      cursor.style.transform = `translate3d(${state.cursorX}px, ${state.cursorY}px, 0) translate(-50%, -50%) rotate(${state.angle}deg)`;
      soft.style.transform = `translate3d(${state.softX}px, ${state.softY}px, 0) translate(-50%, -50%)`;

      frameRef.current = window.requestAnimationFrame(animate);
    };

    const show = () => {
      stateRef.current.visible = true;
      body.classList.add('zrc-tiny-x-cursor-visible');
    };

    const hide = () => {
      stateRef.current.visible = false;
      body.classList.remove(
        'zrc-tiny-x-cursor-visible',
        'zrc-tiny-x-cursor-interactive',
        'zrc-tiny-x-cursor-text',
        'zrc-tiny-x-cursor-down',
        'zrc-tiny-x-cursor-clicked'
      );
    };

    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        hide();
        return;
      }

      const state = stateRef.current;
      const previousX = state.x;
      const previousY = state.y;

      state.x = event.clientX;
      state.y = event.clientY;

      const dx = state.x - previousX;
      const dy = state.y - previousY;
      const distance = Math.hypot(dx, dy);

      if (distance > 1.4) {
        state.targetAngle = Math.atan2(dy, dx) * 180 / Math.PI + 45;
      }

      if (!state.visible) {
        state.cursorX = event.clientX;
        state.cursorY = event.clientY;
        state.softX = event.clientX;
        state.softY = event.clientY;
        state.angle = state.targetAngle;
        show();
      }

      applyTargetState(event.target);
    };

    const onPointerDown = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;

      body.classList.add('zrc-tiny-x-cursor-down');
      body.classList.add('zrc-tiny-x-cursor-clicked');

      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = window.setTimeout(() => {
        body.classList.remove('zrc-tiny-x-cursor-clicked');
      }, 420);
    };

    const onPointerUp = () => {
      body.classList.remove('zrc-tiny-x-cursor-down');
    };

    const onMouseLeave = () => hide();
    const onMouseEnter = () => show();
    const onTouchStart = () => hide();

    body.classList.add('zrc-tiny-x-cursor-enabled');
    frameRef.current = window.requestAnimationFrame(animate);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      window.clearTimeout(clickTimerRef.current);

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('touchstart', onTouchStart);

      body.classList.remove(
        'zrc-tiny-x-cursor-enabled',
        'zrc-tiny-x-cursor-visible',
        'zrc-tiny-x-cursor-interactive',
        'zrc-tiny-x-cursor-text',
        'zrc-tiny-x-cursor-down',
        'zrc-tiny-x-cursor-clicked'
      );
    };
  }, []);

  return (
    <>
      <span ref={softRef} className="zrc-tiny-x-cursor-soft" aria-hidden="true" />
      <span ref={cursorRef} className="zrc-tiny-x-cursor" aria-hidden="true">
        <span className="zrc-tiny-x-cursor__dot" />
        <span className="zrc-tiny-x-cursor__line zrc-tiny-x-cursor__line--a" />
        <span className="zrc-tiny-x-cursor__line zrc-tiny-x-cursor__line--b" />
        <span className="zrc-tiny-x-cursor__spark zrc-tiny-x-cursor__spark--a" />
        <span className="zrc-tiny-x-cursor__spark zrc-tiny-x-cursor__spark--b" />
        <span className="zrc-tiny-x-cursor__spark zrc-tiny-x-cursor__spark--c" />
        <span className="zrc-tiny-x-cursor__spark zrc-tiny-x-cursor__spark--d" />
      </span>
    </>
  );
}
