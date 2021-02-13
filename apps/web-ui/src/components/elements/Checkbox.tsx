import classNames from 'classnames';
import React, { ReactNode, InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode;
}

export const Checkbox = ({
  className,
  children,
  name,
  value,
  disabled,
  checked,
  ...props
}: CheckboxProps) => {
  const classes = classNames('form-checkbox', className);

  return (
    <label className={classes}>
      <input
        {...props}
        type="checkbox"
        name={name}
        value={value}
        disabled={disabled}
        checked={checked}
      />
      {children}
    </label>
  );
};
