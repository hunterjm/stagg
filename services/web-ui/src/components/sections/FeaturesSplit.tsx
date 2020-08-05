import classNames from 'classnames';
import config from 'config/ui';
import React from 'react';
import { Image } from 'src/components/elements/Image';
import { SectionSplitProps } from 'src/interfaces/SectionProps';

import { SectionHeader } from './partials/SectionHeader';

export const FeaturesSplit = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  imageFill,
  ...props
}: SectionSplitProps) => {
  const outerClasses = classNames(
    'features-split section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-split-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const splitClasses = classNames(
    'split-wrap',
    invertMobile && 'invert-mobile',
    invertDesktop && 'invert-desktop',
    alignTop && 'align-top'
  );

  const sectionHeader = {
    paragraph: `
      The same approach won't always work — that's why we provide personalized, 1-on-1 feedback
      that adapts to your natural skill-level and playstyle evolution.
    `,
    title: 'See the bigger picture',
  };

  return (
    <section {...props} className={outerClasses}>
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={splitClasses}>
            <div className="split-item">
              <div
                className="split-item-content center-content-mobile reveal-from-left"
                data-reveal-container=".split-item"
              >
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Big data means bigger gains
                </div>
                <h3 className="mt-0 mb-12">Full match history</h3>
                <p className="m-0">
                  Unlike traditional stat trackers, we aggregate your entire
                  match history for all applicable games and use this enormous
                  amount of compiled data in every feature and decision.
                  Observing trends is important; isolated stats are not.
                </p>
              </div>
              <div
                className={classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item"
              >
                <Image
                  src="/images/features-split-image-01.png"
                  alt="Features split 01"
                  width={528}
                  height={396}
                />
              </div>
            </div>

            <div className="split-item">
              <div
                className="split-item-content center-content-mobile reveal-from-right"
                data-reveal-container=".split-item"
              >
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Key Performance Indicators
                </div>
                <h3 className="mt-0 mb-12">KPI-driven matchmaking</h3>
                <p className="m-0">
                  When you join one of our partnered LFG servers, our bot will
                  automatically compare your profile to other active players in
                  the server and smoothly transition you to a private voice
                  channel. There you'll find other appropriately skilled
                  teammates and a game invite awaiting your acceptance.
                </p>
              </div>
              <div
                className={classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item"
              >
                <Image
                  src="/images/features-split-image-02.png"
                  alt="Features split 02"
                  width={528}
                  height={396}
                />
              </div>
            </div>

            <div className="split-item">
              <div
                className="split-item-content center-content-mobile reveal-from-left"
                data-reveal-container=".split-item"
              >
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Zero outages. Period.
                </div>
                <h3 className="mt-0 mb-12">Built in future-proofing</h3>
                <p className="m-0">
                  We want this community to continue growing so we've paved the
                  way to make that happen. Even when the servers for your
                  favorite game go down, we'll still be here serving your data
                  uninterrupted. If you ever need any assistance for any reason
                  you can always{' '}
                  <a href={config.discord.url.join} target="_blank">
                    find help 24/7 in our Discord
                  </a>
                </p>
              </div>
              <div
                className={classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item"
              >
                <Image
                  src="/images/features-split-image-03.png"
                  alt="Features split 03"
                  width={528}
                  height={396}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
