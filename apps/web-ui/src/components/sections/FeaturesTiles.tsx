import { useEffect } from 'react';
import classNames from 'classnames';
import config from 'config/ui';

import FeatureSplitIconOne from 'public/icons/feature-tile-icon-01.svg';
import FeatureSplitIconTwo from 'public/icons/feature-tile-icon-02.svg';
import FeatureSplitIconThree from 'public/icons/feature-tile-icon-03.svg';
import FeatureSplitIconFour from 'public/icons/feature-tile-icon-04.svg';
import FeatureSplitIconFive from 'public/icons/feature-tile-icon-05.svg';
import FeatureSplitIconSix from 'public/icons/feature-tile-icon-06.svg';

import { SectionTilesProps } from 'src/interfaces/SectionProps';

import { SectionHeader } from './partials/SectionHeader';

let ScrollReveal: scrollReveal.ScrollRevealObject;

if (typeof window !== 'undefined') {
  ScrollReveal = require('scrollreveal').default;
}

export const FeaturesTiles = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}: SectionTilesProps) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ScrollReveal().reveal('#features-tiles-one');
      ScrollReveal().reveal('#features-tiles-two', { delay: 200 });
      ScrollReveal().reveal('#features-tiles-three', {
        delay: 400,
      });
      ScrollReveal().reveal('#features-tiles-four');
      ScrollReveal().reveal('#features-tiles-five', {
        delay: 200,
      });
      ScrollReveal().reveal('#features-tiles-six', { delay: 400 });
    }
  }, []);

  const outerClasses = classNames(
    'features-tiles section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-tiles-inner section-inner pt-0',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const tilesClasses = classNames(
    'tiles-wrap center-content',
    pushLeft && 'push-left'
  );

  const sectionHeader = {
    paragraph: `
      Everyone wants to get better — luckily we have the secret sauce.
      Improving your play is a combination of personal gains and methodical
      team-building; we have solutions for both.
    `,
    title: 'Play deliberately',
  };

  return (
    <section {...props} className={outerClasses}>
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>
            <div className="tiles-item" id="features-tiles-one">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <FeatureSplitIconOne />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">Professional Profiles</h4>
                  <p className="m-0 text-sm">
                    Known Good Players (KGP) help us levelset your performances
                    to identify strengths and weaknesses.
                  </p>
                </div>
              </div>
            </div>

            <div className="tiles-item" id="features-tiles-two">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <FeatureSplitIconTwo />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">Unlimited Reports</h4>
                  <p className="m-0 text-sm">
                    Render custom charts and reports to check progress in
                    real-time without ever leaving Discord.
                  </p>
                </div>
              </div>
            </div>

            <div className="tiles-item" id="features-tiles-three">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <FeatureSplitIconThree />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">LFG + SBMM</h4>
                  <p className="m-0 text-sm">
                    Automate your LFG server with SBMM and do your part to stop
                    the KD-spamming madness.
                  </p>
                </div>
              </div>
            </div>

            <div className="tiles-item" id="features-tiles-four">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <FeatureSplitIconFour />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">Playstyle Analysis</h4>
                  <p className="m-0 text-sm">
                    Game-changing ability to identify your playstyle based on
                    performance history and profile trends.
                  </p>
                </div>
              </div>
            </div>

            <div className="tiles-item" id="features-tiles-five">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <FeatureSplitIconFive />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">Personalized Coaching</h4>
                  <p className="m-0 text-sm">
                    Get personalized, digestible tips in real-time to help you
                    take the guess-work out of improving performance.
                  </p>
                </div>
              </div>
            </div>

            <div className="tiles-item" id="features-tiles-six">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <FeatureSplitIconSix />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">Community Driven</h4>
                  <p className="m-0 text-sm">
                    Got an idea for a feature you'd like to see? We'd love to
                    hear all about it. &nbsp;
                    <a href={config.discord.url.join} target="_blank" rel=>
                      Tell us in our Discord!
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
