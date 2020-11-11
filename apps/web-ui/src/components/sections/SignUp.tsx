import config from 'config/ui';
import Link from 'next/link';
import { useEffect } from 'react';

let ScrollReveal: scrollReveal.ScrollRevealObject;

if (typeof window !== 'undefined') {
  ScrollReveal = require('scrollreveal').default;
}

export const SignUp: any = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ScrollReveal().reveal('#footer-hero', {
        delay: 600,
      });
    }
  }, []);

  return (
    <div className="center-content-mobile" id="footer-hero">
      <div className="featured-games hoverable">
        <h4>Full support for Call of Duty is live now with more games coming soon!</h4>
        {config.games.map((game) => (
          <Link key={game.id} href={`/${game.id}/login`}>
            <i
              className={[game.icon, game.supported ? 'supported' : ''].join(
                ' '
              )}
              title={
                game.supported
                  ? `Supports ${game.supported}`
                  : `${game.name} support coming soon!`
              }
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
