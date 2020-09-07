import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { SectionSharedProps } from 'src/interfaces/SectionProps';

interface Props extends SectionSharedProps {
  children: ReactNode;
}

export const GenericSection = ({
  className,
  children,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}: Props) => {
  const outerClasses = classNames(
    'section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  return (
    <section {...props} className={outerClasses}>
      <div className="container">
        <div className={innerClasses}>{children}</div>
      </div>
    </section>
  );
};
