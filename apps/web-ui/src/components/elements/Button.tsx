import classNames from 'classnames';
import React, { ReactNode } from 'react';

// Didn't extend ButtonAttributes because the 'as' maybe "a" (link)
interface ButtonProps {
  as?: 'button' | 'a';
  color?: string;
  size?: string;
  loading?: boolean;
  wide?: boolean;
  wideMobile?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  role?: string;
  href?: string; // In case as="a"
  onClick?: () => void; // In case as="button"
}

export const Button = ({
  className,
  as = 'button',
  color,
  size,
  loading,
  wide,
  wideMobile,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const classes = classNames(
    'button',
    color && `button-${color}`,
    size && `button-${size}`,
    loading && 'is-loading',
    wide && 'button-block',
    wideMobile && 'button-wide-mobile',
    className
  );

  const Component = as;
  return (
    <Component {...props} className={classes} disabled={disabled}>
      {children}
    </Component>
  );
};
