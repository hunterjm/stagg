import React from 'react';
import { Layout } from 'src/components/layout';
import { Cta } from 'src/components/sections/Cta';
import { FeaturesSplit } from 'src/components/sections/FeaturesSplit';
import { FeaturesTiles } from 'src/components/sections/FeaturesTiles';
import { Hero } from 'src/components/sections/Hero';
import { Testimonial } from 'src/components/sections/Testimonial';

const IndexContent = () => {
  return (
    <>
      <Hero className="illustration-section-01" />
      <FeaturesTiles />
      <FeaturesSplit
        invertMobile
        topDivider
        imageFill
        className="illustration-section-02"
      />
      {/* <Testimonial topDivider />
      <Cta split /> */}
      <div className="featured-games hoverable center-content-mobile reveal-from-bottom" data-reveal-delay="600">
        <h4>Select a game below to get started</h4>
        <i className="icon-pubg" title="Coming soon!" />
        <i className="icon-callofduty supported" title="Supports Warzone &amp; Multiplayer for Modern Warfare &amp; Black Ops 4" />
        <i className="icon-csgo" title="Coming soon!" />
        <i className="icon-fortnite" title="Coming soon!" />
      </div>
    </>
  );
};

const Index = () => {
  return (
    <Layout title="Best-in-class stats, coaching, matchmaking, and more | Stagg.co">
      <IndexContent />
    </Layout>
  );
};

// eslint-disable-next-line import/no-default-export
export default Index;
