import Link from 'next/link'
import classNames from 'classnames'

interface FooterNavProps {
  className?: string
}

export const FooterNav = ({ className, ...props }: FooterNavProps) => {
  const classes = classNames('footer-nav', className);

  return (
    <nav {...props} className={classes}>
      <ul className="list-reset">
        <li>
          <Link href="/">
             <a href="/">Terms of service</a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
