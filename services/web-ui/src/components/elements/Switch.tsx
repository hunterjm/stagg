import classNames from 'classnames';
import React, { ReactNode, InputHTMLAttributes } from 'react';

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode;
  rightLabel?: string;
}

export const Switch = ({
  className,
  children,
  name,
  value,
  rightLabel,
  disabled,
  checked,
  ...props
}: SwitchProps) => {
  const classes = classNames('form-switch', className);

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
      <span className="form-switch-icon" />
      <span>{children}</span>
      {rightLabel && <span>{rightLabel}</span>}
    </label>
  );
};
