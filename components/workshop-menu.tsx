import Link from 'next/link';
import { NavLink } from './nav-link';

export interface WorkshopMenuProps {
  items: Array<{
    workshop: string;
    slug: string;
    frontMatter: {
      title: string;
      section: string;
    };
  }>;
}

export const WorkshopMenu = (props: WorkshopMenuProps) => {
  return (
    <nav className={`px-4 md:px-8 py-3`}>
      <ul>
        {props.items.map((item) => (
          <li key={item.slug}>
            <NavLink
              href={`/${item.workshop}/${item.slug}`}
              className="block py-2"
              activeClassName="text-green-700"
            >
              {item.frontMatter.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
