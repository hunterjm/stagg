import classNames from 'classnames';
import config from 'config/ui';
import React, { useState, MouseEvent, useEffect } from 'react';
import { SectionSharedProps } from 'src/interfaces/SectionProps';

import { Button } from '../elements/Button';
import { ButtonGroup } from '../elements/ButtonGroup';
import { Image } from '../elements/Image';
import { Modal } from '../elements/Modal';

let ScrollReveal: scrollReveal.ScrollRevealObject;

if (typeof window !== 'undefined') {
  ScrollReveal = require('scrollreveal').default;
}

export const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}: SectionSharedProps) => {
  const [videoModalActive, setVideomodalactive] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ScrollReveal().reveal('#hero-text-h2', {
        delay: 200,
      });
      ScrollReveal().reveal('#hero-text-p', {
        delay: 400,
      });
      ScrollReveal().reveal('#hero-button', {
        delay: 600,
      });
      ScrollReveal().reveal('.featured-games', { delay: 600 });
      ScrollReveal().reveal('.hero-figure', { delay: 800, distance: '20px' });
    }
  }, []);

  const openModal = (
    event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault();
    setVideomodalactive(true);
  };

  const closeModal = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault();
    setVideomodalactive(false);
  };

  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  return (
    <section {...props} className={outerClasses} id="hero">
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">
            <h2 className="mt-0 mb-16" id="hero-text-h2">
              We help you{' '}
              <span className="text-color-primary">git&nbsp;gud</span>
            </h2>
            <div className="container-xs">
              <p id="hero-text-p">
                Unrivaled stat tracking combined with a proprietary Discord
                integration to provide personalized coaching and so much more
              </p>
              <div id="hero-button">
                <ButtonGroup>
                  <Button as="a" color="primary" wideMobile href="/me">
                    Get Started
                  </Button>
                  <Button
                    as="a"
                    color="dark"
                    wideMobile
                    href={config.discord.url.join}
                  >
                    Join our Discord
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
          <div className="featured-games center-content-mobile">
            <i className="icon-pubg" title="Coming soon!" />
            <i
              className="icon-callofduty supported"
              title="Supports Warzone &amp; Multiplayer for Modern Warfare &amp; Black Ops 4"
            />
            <i className="icon-csgo" title="Coming soon!" />
            <i className="icon-fortnite" title="Coming soon!" />
          </div>
          <div className="hero-figure illustration-element-01">
            <a
              data-video="https://www.youtube.com/embed/5-ulSMDLUrc"
              href="#0"
              aria-controls="video-modal"
              onClick={openModal}
            >
              <Image
                className="has-shadow video-preview"
                src="/images/video-preview.png"
                alt="Hero"
                width={896}
                height={504}
              />
            </a>
          </div>
          <Modal
            id="video-modal"
            show={videoModalActive}
            handleClose={closeModal}
            video="https://www.youtube.com/embed/5-ulSMDLUrc"
            videoTag="iframe"
          />
        </div>
      </div>
    </section>
  );
};
