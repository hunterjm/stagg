import classNames from 'classnames'

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
          <div className="text-xxs" style={{textAlign: 'center'}}>
            <a href="/terms" style={{color: 'inherit', textDecoration: 'none'}}>&copy; {new Date().getFullYear()}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
