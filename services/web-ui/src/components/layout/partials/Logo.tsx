import classNames from 'classnames';
import Link from 'next/link';
import LogoSVG from 'public/icons/logo.svg';
import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className, ...props }: LogoProps) => {
  const classes = classNames('brand', className);

  return (
    <div {...props} className={classes}>
      <h1 className="m-0">
        <Link href="/">
          <a>
            <i className="icon-stagg-antlers" />
            <span>Stagg</span>
          </a>
        </Link>
      </h1>
    </div>
  );
};
