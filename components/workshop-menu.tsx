import cx from 'classnames';
import * as React from 'react';
import { NavLink } from './nav-link';
import styles from './workshop-menu.module.css';

export interface WorkshopMenuProps {
  items: Array<{
    workshop: string;
    slug: string;
    frontMatter: {
      title: string;
      section: string;
    };
  }>;
  className?: string;
}

export const WorkshopMenu = (props: WorkshopMenuProps) => {
  const sections = React.useMemo(() => groupMenuItems(props.items), [
    props.items,
  ]);

  return (
    <nav className={cx('px-2 md:px-6 py-3', props.className, styles.wrapper)}>
      <ul className={styles.content}>
        {sections.map((section, i) => (
          <WorkshopMenuSection section={section} key={`${section.text}-${i}`} />
        ))}
      </ul>
    </nav>
  );
};

const WorkshopMenuSection = ({ section }: { section: MenuSection }) => {
  if (section.text) {
    return (
      <li className="mb-8">
        <div>
          <div className="text-xs px-2 font-bold tracking-wide uppercase mb-3 text-gray-400">
            {section.text}
          </div>
          <ul className="space-y-2">
            {section.items.map((item) => (
              <li key={item.slug}>
                <WorkshopMenuItem item={item} />
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }

  return (
    <>
      {section.items.map((item) => (
        <li key={item.slug}>
          <WorkshopMenuItem item={item} />
        </li>
      ))}
    </>
  );
};

const WorkshopMenuItem = ({ item }: { item: MenuItem }) => {
  return (
    <NavLink
      href={`/${item.workshop}/${item.slug}`}
      className="block px-2 text-sm border-l-2 border-transparent transition-transform transform translate-x-0 duration-150"
      activeClassName="text-green-700 border-green-700 translate-x-3"
    >
      {item.frontMatter.title}
    </NavLink>
  );
};

interface MenuItem {
  workshop: string;
  slug: string;
  frontMatter: {
    title: string;
    section: string;
  };
}

interface MenuSection {
  text: string;
  items: Array<MenuItem>;
}

const groupMenuItems = (items: Array<MenuItem>) => {
  const sections: Array<MenuSection> = [];

  items.forEach((item) => {
    const lastSection = sections[sections.length - 1];

    if (lastSection && lastSection.text === item.frontMatter.section) {
      lastSection.items.push(item);
    } else {
      sections.push({
        text: item.frontMatter.section,
        items: [item],
      });
    }
  });

  return sections;
};
