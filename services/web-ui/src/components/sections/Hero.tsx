import classNames from 'classnames';
import React, { useState, MouseEvent } from 'react';
import { SectionSharedProps } from 'src/interfaces/SectionProps';

import { Button } from '../elements/Button';
import { ButtonGroup } from '../elements/ButtonGroup';
import { Image } from '../elements/Image';
import { Modal } from '../elements/Modal';

import config from 'config/ui'

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
    <section {...props} className={outerClasses}>
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">
            <h1
              className="mt-0 mb-16 reveal-from-bottom"
              data-reveal-delay="200"
            >
              We help you {' '}
              <span className="text-color-primary">git&nbsp;gud</span>
            </h1>
            <div className="container-xs">
              <p
                className="m-0 mb-32 reveal-from-bottom"
                data-reveal-delay="400"
              >
                Unrivaled stat tracking combined with a proprietary Discord integration to provide personalized coaching and so much more
              </p>
              <div className="reveal-from-bottom" data-reveal-delay="600">
                <ButtonGroup>
                  <Button
                    as="a"
                    color="primary"
                    wideMobile
                    href="/login"
                  >
                    Create Profile
                  </Button>
                  <Button
                    as="a"
                    color="dark"
                    wideMobile
                    href={config.discord.url.join}
                  >
                    Join Discord
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
          <div className="featured-games center-content-mobile reveal-from-bottom" data-reveal-delay="600">
            <i className="icon-pubg" title="Coming soon!" />
            <i className="icon-callofduty supported" title="Supports Warzone &amp; Multiplayer for Modern Warfare &amp; Black Ops 4" />
            <i className="icon-csgo" title="Coming soon!" />
            <i className="icon-fortnite" title="Coming soon!" />
          </div>
          <div
            className="hero-figure reveal-from-bottom illustration-element-01"
            data-reveal-value="20px"
            data-reveal-delay="800"
          >
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
