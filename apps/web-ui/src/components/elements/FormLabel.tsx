import classNames from 'classnames';
import React, { ReactNode, LabelHTMLAttributes } from 'react';

interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  labelHidden?: boolean;
}

export const FormLabel = ({
  className,
  children,
  labelHidden,
  id,
  ...props
}: FormLabelProps) => {
  const classes = classNames(
    'form-label',
    labelHidden && 'screen-reader',
    className
  );

  return (
    <label {...props} className={classes} htmlFor={id}>
      {children}
    </label>
  );
};
