import classNames from 'classnames';
import React, { ReactNode, InputHTMLAttributes } from 'react';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode;
}

export const Radio = ({
  className,
  children,
  name,
  value,
  disabled,
  checked,
  ...props
}: RadioProps) => {
  const classes = classNames('form-radio', className);

  return (
    <label className={classes}>
      <input
        {...props}
        type="radio"
        name={name}
        value={value}
        disabled={disabled}
        checked={checked}
      />
      {children}
    </label>
  );
};
