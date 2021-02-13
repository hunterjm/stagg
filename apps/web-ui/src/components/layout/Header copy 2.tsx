import classNames from 'classnames';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './partials/Logo';
import { UserMenu } from './partials/UserMenu';
import { LoginMenu } from './partials/LoginMenu';

interface HeaderProps {
  className?: string;
  navPosition?: string;
  hideNav?: boolean;
  hideSignIn?: boolean;
  hideUserMenu?: boolean;
  hideHelp?: boolean;
  simpleSignIn?: boolean;
  bottomOuterDivider?: boolean;
  bottomDivider?: boolean;
}

let ScrollReveal: scrollReveal.ScrollRevealObject;

if (typeof window !== 'undefined') {
  ScrollReveal = require('scrollreveal').default;
}

export const Header = ({
  className,
  navPosition,
  hideNav,
  hideSignIn,
  hideHelp,
  simpleSignIn,
  hideUserMenu,
  bottomOuterDivider,
  bottomDivider,
  ...props
}: HeaderProps) => {
  const [isActive, setIsactive] = useState(false);

  const nav = useRef(null);
  const hamburger = useRef(null);

  useEffect(() => {
    isActive && openMenu();
    document.addEventListener('keydown', keyPress);
    document.addEventListener('click', clickOutside);
    ScrollReveal().reveal('#header');
    return () => {
      document.removeEventListener('keydown', keyPress);
      document.addEventListener('click', clickOutside);
      closeMenu();
    };
  }, []);

  const openMenu = () => {
    document.body.classList.add('off-nav-is-active');
    nav.current.style.maxHeight = `${nav.current.scrollHeight}px`;
    setIsactive(true);
  };

  const closeMenu = () => {
    document.body.classList.remove('off-nav-is-active');
    nav.current && (nav.current.style.maxHeight = null);
    setIsactive(false);
  };

  const keyPress = (e: KeyboardEvent) => {
    isActive && e.keyCode === 27 && closeMenu();
  };

  const clickOutside = (ev: globalThis.MouseEvent) => {
    if (!nav.current) return;
    if (!isActive || nav.current.contains(ev.target) || ev.target === hamburger.current) return;
    closeMenu();
  };

  const classes = classNames('site-header', bottomOuterDivider && 'has-bottom-divider', className);

  return (
    <header {...props} className={classes} id="header">
      <div className="container">
        <div className={classNames('site-header-inner', bottomDivider && 'has-bottom-divider')}>
          <Logo />
          {!hideNav && (
            <>
              <button
                type="button"
                ref={hamburger} // eslint-disable-line react/button-has-type
                className="header-nav-toggle"
                onClick={isActive ? closeMenu : openMenu}
              >
                <span className="screen-reader">Menu</span>
                <span className="hamburger">
                  <span className="hamburger-inner" />
                </span>
              </button>
              <nav ref={nav} className={classNames('header-nav', isActive && 'is-active')}>
                <div className="header-nav-inner">
                  {!hideHelp && (
                    <ul className={classNames('list-reset text-xs', navPosition && `header-nav-${navPosition}`)}>
                      <li>
                        <Link href="/help">
                          <a onClick={closeMenu}>Need help?</a>
                        </Link>
                      </li>
                    </ul>
                  )}
                  {!hideSignIn && <LoginMenu simpleSignIn={simpleSignIn} closeMenu={closeMenu} />}
                  {!hideUserMenu && <UserMenu />}
                </div>
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
