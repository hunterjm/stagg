import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

interface FooterNavProps {
  className?: string;
}

export const FooterNav = ({ className, ...props }: FooterNavProps) => {
  const classes = classNames('footer-nav', className);

  return (
    <nav {...props} className={classes}>
      <ul className="list-reset">
        <li>
          <Link href="/">
            <a href="/">Developers</a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a href="/">Terms</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
