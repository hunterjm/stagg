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
        <h4>Select a game below to get started</h4>
        {config.games.map((game) => (
          <Link key={game.id} href={`/login/${game.id}`}>
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
