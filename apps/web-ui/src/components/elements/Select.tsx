import classNames from 'classnames';
import React, { ReactNode, SelectHTMLAttributes } from 'react';

import { FormHint } from './FormHint';
import { FormLabel } from './FormLabel';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  label?: string;
  labelHidden?: boolean;
  status?: string;
  hint?: string;
}

export const Select = ({
  className,
  children,
  label,
  labelHidden,
  name,
  status,
  disabled,
  value,
  size,
  placeholder,
  hint,
  ...props
}: SelectProps) => {
  const classes = classNames(
    'form-select',
    size && `form-select-${size}`,
    status && `form-${status}`,
    className
  );

  return (
    <>
      {label && (
        <FormLabel labelHidden={labelHidden} id={props.id}>
          {label}
        </FormLabel>
      )}
      <select
        {...props}
        className={classes}
        name={name}
        disabled={disabled}
        value={value}
      >
        {placeholder && (
          <option hidden value="">
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {hint && <FormHint status={status}>{hint}</FormHint>}
    </>
  );
};
