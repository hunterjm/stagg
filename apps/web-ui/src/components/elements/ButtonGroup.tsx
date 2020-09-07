import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface ButtonGroupProps {
  className?: string;
  children: ReactNode;
}

export const ButtonGroup = ({ className, children }: ButtonGroupProps) => {
  const classes = classNames('button-group', className);

  return <div className={classes}>{children}</div>;
};
