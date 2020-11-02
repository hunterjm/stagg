import classNames from 'classnames'

import { FooterNav } from './partials/FooterNav'
import { FooterSocial } from './partials/FooterSocial'
import { Logo } from './partials/Logo'

interface FooterProps {
  className?: string;
  topOuterDivider?: boolean
  topDivider?: boolean
}

export const Footer = ({
  className,
  topOuterDivider,
  topDivider,
  ...props
}: FooterProps) => {
  const classes = classNames(
    'site-footer center-content-mobile',
    topOuterDivider && 'has-top-divider',
    className
  );

  return (
    <footer {...props} className={classes}>
      <div className="container">
        <div
          className={classNames(
            'site-footer-inner',
            topDivider && 'has-top-divider'
          )}
        >
          <div className="footer-top space-between text-xxs">
            <Logo />
            <FooterSocial />
          </div>
          <div className="footer-bottom space-between text-xxs invert-order-desktop">
            <FooterNav />
            <div className="footer-copyright">
              &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
