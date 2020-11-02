import Link from 'next/link'
import classNames from 'classnames'

interface LogoProps {
  className?: string
}

export const Logo = ({ className, ...props }: LogoProps) => {
  const classes = classNames('brand', className);

  return (
    <div {...props} className={classes}>
      <h1 className="m-0">
        <Link href="/">
            <>
            <i className="icon-stagg-antlers" />
            <span>Stagg</span>
            </>
        </Link>
      </h1>
    </div>
  )
}
