import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface SectionHeaderProps {
  className?: string;
  data: { title: string; paragraph: string };
  children?: ReactNode;
  tag?: 'h1' | 'h2' | 'h3';
}

export const SectionHeader = ({
  className,
  data,
  children,
  tag = 'h2',
  ...props
}: SectionHeaderProps) => {
  const classes = classNames('section-header', className);

  const Component = tag;

  return data.title || data.paragraph ? (
    <div {...props} className={classes}>
      <div className="container-xs">
        {children}
        {data.title && (
          <Component
            className={classNames('mt-0', data.paragraph ? 'mb-16' : 'mb-0')}
          >
            {data.title}
          </Component>
        )}
        {data.paragraph && <p className="m-0">{data.paragraph}</p>}
      </div>
    </div>
  ) : null;
};
