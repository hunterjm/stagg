import classNames from 'classnames';
import React from 'react';
import config from 'config/ui'

interface FooterSocialProps {
  className?: string;
}

export const FooterSocial = ({ className, ...props }: FooterSocialProps) => {
  const classes = classNames('footer-social', className);
  return (
    <div {...props} className={classes}>
      <ul className="list-reset">
        <li>
          <a href="https://github.com/mdlindsey/stagg" target="_blank">
            <i className="icon-github" />
          </a>
        </li>
        <li>
          <a href="https://www.npmjs.com/package/@stagg/api" target="_blank">
            <i className="icon-npm" />
          </a>
        </li>
        <li>
          <a href={config.discord.url.join} target="_blank">
            <i className="icon-discord" />
          </a>
        </li>
      </ul>
    </div>
  );
};
