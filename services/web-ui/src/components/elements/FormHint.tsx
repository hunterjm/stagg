import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface FormHintProps {
  className?: string;
  children: ReactNode;
  status?: string;
}

export const FormHint = ({
  children,
  className,
  status,
  ...props
}: FormHintProps) => {
  const classes = classNames(
    'form-hint',
    status && `text-color-${status}`,
    className
  );

  return (
    <div {...props} className={classes}>
      {children}
    </div>
  );
};
