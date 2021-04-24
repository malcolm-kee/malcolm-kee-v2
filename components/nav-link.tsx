import Link from 'next/link';
import * as React from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';

export interface NavLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  href: string;
  activeClassName: string;
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  function NavLink({ href, activeClassName, ...props }, ref) {
    const router = useRouter();
    const url = router.asPath;

    return (
      <Link href={href}>
        <a
          {...props}
          className={cx(url === href && activeClassName, props.className)}
          ref={ref}
        />
      </Link>
    );
  }
);
