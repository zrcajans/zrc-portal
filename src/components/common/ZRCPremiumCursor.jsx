import { useEffect, useRef } from 'react';

const ZRC_ORANGE_RGB = { r: 255, g: 54, b: 0 };

function parseRgbColor(value) {
  if (!value || value === 'transparent') return null;

  const match = value.match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;

  const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()));

  if (parts.length < 3 || parts.some((part, index) => index < 3 && Number.isNaN(part))) return null;

  const alpha = parts.length >= 4 && !Number.isNaN(parts[3]) ? parts[3] : 1;

  if (alpha <= 0.04) return null;

  return {
    r: Math.max(0, Math.min(255, parts[0])),
    g: Math.max(0, Math.min(255, parts[1])),
    b: Math.max(0, Math.min(255, parts[2])),
    a: alpha
  };
}

function channelToLinear(value) {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function getLuminance(color) {
  return (
    0.2126 * channelToLinear(color.r) +
    0.7152 * channelToLinear(color.g) +
    0.0722 * channelToLinear(color.b)
  );
}

function getContrastRatio(a, b) {
  const lumA = getLuminance(a);
  const lumB = getLuminance(b);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);

  return (lighter + 0.05) / (darker + 0.05);
}

function getVisibleBackgroundColor(target) {
  let element = target instanceof Element ? target : null;

  while (element && element !== document.documentElement) {
    const style = window.getComputedStyle(element);
    const color = parseRgbColor(style.backgroundColor);

    if (color) return color;

    element = element.parentElement;
  }

  return parseRgbColor(window.getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255 };
}

function shouldUseWhiteOutline(target) {
  const background = getVisibleBackgroundColor(target);
  const contrast = getContrastRatio(ZRC_ORANGE_RGB, background);

  const orangeDistance = Math.hypot(
    ZRC_ORANGE_RGB.r - background.r,
    ZRC_ORANGE_RGB.g - background.g,
    ZRC_ORANGE_RGB.b - background.b
  );

  return contrast < 2.25 || orangeDistance < 120;
}

export default function ZRCPremiumCursor() {
  const cursorRef = useRef(null);
  const frameRef = useRef(null);
  const clickTimerRef = useRef(null);

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
      const needsWhiteOutline = !isText && shouldUseWhiteOutline(target);

      body.classList.toggle('zrc-pure-dot-cursor-text', isText);
      body.classList.toggle('zrc-pure-dot-cursor-interactive', isInteractive && !isText);
      body.classList.toggle('zrc-pure-dot-cursor-low-contrast', needsWhiteOutline);
    };

    const animate = () => {
      const state = stateRef.current;

      state.dotX += (state.x - state.dotX) * 0.68;
      state.dotY += (state.y - state.dotY) * 0.68;

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
        'zrc-pure-dot-cursor-down',
        'zrc-pure-dot-cursor-clicked',
        'zrc-pure-dot-cursor-low-contrast'
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
      body.classList.remove('zrc-pure-dot-cursor-clicked');

      window.clearTimeout(clickTimerRef.current);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          body.classList.add('zrc-pure-dot-cursor-clicked');
        });
      });

      clickTimerRef.current = window.setTimeout(() => {
        body.classList.remove('zrc-pure-dot-cursor-clicked');
      }, 1180);
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
      window.clearTimeout(clickTimerRef.current);

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
        'zrc-pure-dot-cursor-down',
        'zrc-pure-dot-cursor-clicked',
        'zrc-pure-dot-cursor-low-contrast'
      );
    };
  }, []);

  return <span ref={cursorRef} className="zrc-pure-dot-cursor" aria-hidden="true" />;
}
