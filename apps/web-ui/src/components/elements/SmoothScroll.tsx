import classNames from 'classnames';
import React, { ReactNode, MouseEvent } from 'react';

interface SmoothScrollProps {
  className?: string;
  children: ReactNode;
  to: string;
  duration: number;
  onLinkClick: () => void;
}

export const SmoothScroll = ({
  className,
  children,
  to,
  duration,
  onLinkClick,
  ...props
}: SmoothScrollProps) => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const easeInOutQuad = (t: number) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const scrollToEl = (
    startTime: number,
    currentTime: number,
    duration: number,
    scrollEndElemTop: number,
    startScrollOffset: number
  ) => {
    const runtime = currentTime - startTime;
    let progress = runtime / duration;

    progress = Math.min(progress, 1);

    const ease = easeInOutQuad(progress);

    window.scroll(0, startScrollOffset + scrollEndElemTop * ease);
    if (runtime < duration) {
      window.requestAnimationFrame((timestamp) => {
        const currentTime = timestamp || new Date().getTime();
        scrollToEl(
          startTime,
          currentTime,
          duration,
          scrollEndElemTop,
          startScrollOffset
        );
      });
    }
  };

  const smoothScroll = (
    event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault();

    const targetId = to;
    const target = document.querySelector(targetId);
    const timing = duration || 1000;

    if (!target) return;

    onLinkClick && onLinkClick();

    window.requestAnimationFrame((timestamp) => {
      const stamp = timestamp || new Date().getTime();
      const start = stamp;

      const startScrollOffset = window.pageYOffset;
      const scrollEndElemTop = target.getBoundingClientRect().top;

      scrollToEl(start, stamp, timing, scrollEndElemTop, startScrollOffset);
    });
  };

  const classes = classNames(className);

  return (
    <a {...props} className={classes} href={`#${to}`} onClick={smoothScroll}>
      {children}
    </a>
  );
};
