import config from 'config/ui';
import Link from 'next/link';

export const SignUp: any = () => {
  return (
    <div
      className="center-content-mobile reveal-from-bottom"
      data-reveal-delay="600"
    >
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
