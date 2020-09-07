import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { FormHint } from './FormHint';
import { FormLabel } from './FormLabel';

interface InputProps {
  id: string;
  className?: string;
  children: ReactNode;
  as?: 'textarea' | 'input';
  type?:
    | 'text'
    | 'email'
    | 'tel'
    | 'password'
    | 'number'
    | 'search'
    | 'color'
    | 'date'
    | 'time'
    | 'datetime-local';
  name?: string;
  disabled?: boolean;
  value?: string;
  size?: string;
  placeholder?: string;
  label?: string;
  labelHidden?: boolean;
  status?: string;
  formGroup?: string;
  hasIcon?: string;
  rows?: number;
  hint?: string;
}

export const Input = ({
  id,
  className,
  as = 'input',
  children,
  label,
  labelHidden,
  placeholder,
  type = 'text',
  name,
  status,
  disabled,
  value,
  formGroup,
  hasIcon,
  size,
  rows = 3,
  hint,
  ...props
}: InputProps) => {
  const wrapperClasses = classNames(
    formGroup &&
      formGroup !== '' &&
      (formGroup === 'desktop' ? 'form-group-desktop' : 'form-group'),
    hasIcon && hasIcon !== '' && `has-icon-${hasIcon}`
  );

  const classes = classNames(
    'form-input',
    size && `form-input-${size}`,
    status && `form-${status}`,
    className
  );

  const Component = as;
  return (
    <>
      {label && (
        <FormLabel labelHidden={labelHidden} id={id}>
          {label}
        </FormLabel>
      )}
      <div className={wrapperClasses}>
        <Component
          {...props}
          type={as !== 'textarea' ? type : null}
          className={classes}
          name={name}
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          rows={as === 'textarea' ? rows : null}
        />
        {children}
      </div>
      {hint && <FormHint status={status}>{hint}</FormHint>}
    </>
  );
};
