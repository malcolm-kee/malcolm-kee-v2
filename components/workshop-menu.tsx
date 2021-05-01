import { Dialog, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import cx from 'classnames';
import * as React from 'react';
import { NavLink } from './nav-link';
import styles from './workshop-menu.module.css';

export interface WorkshopMenuProps {
  workshopName: string;
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
  const router = useRouter();

  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const dismissMobileMenu = React.useCallback(
    () => setShowMobileMenu(false),
    []
  );

  React.useEffect(() => {
    router.events.on('routeChangeComplete', dismissMobileMenu);

    return () => router.events.off('routeChangeComplete', dismissMobileMenu);
  }, [router, dismissMobileMenu]);

  return (
    <>
      <nav
        className={cx(
          'hidden md:block px-2 md:px-6 py-3',
          props.className,
          styles.wrapper
        )}
      >
        <ul className={styles.content}>
          {sections.map((section, i) => (
            <WorkshopMenuSection
              section={section}
              key={`${section.text}-${i}`}
            />
          ))}
        </ul>
      </nav>
      <button
        className="md:hidden fixed z-10 bottom-2 right-2 p-3 rounded-full focus-ring bg-green-700 text-white shadow-lg"
        type="button"
        onClick={() => setShowMobileMenu(true)}
        aria-label="table of content"
      >
        <MenuIcon className="w-6 h-6" />
      </button>
      <Transition show={showMobileMenu} as={React.Fragment}>
        <Dialog
          open={showMobileMenu}
          onClose={dismissMobileMenu}
          as="div"
          className="fixed inset-0 z-20 overflow-y-auto"
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-40" />
            </Transition.Child>

            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-full"
            >
              <div className="fixed inset-0 overflow-y-auto text-left align-middle transition-all transform bg-white">
                <div className="flex justify-between items-center pl-4 pr-2 py-2 bg-green-700 text-white">
                  <Dialog.Title className="text-lg font-medium leading-6">
                    {props.workshopName}
                  </Dialog.Title>
                  <button
                    onClick={dismissMobileMenu}
                    type="button"
                    aria-label="Dismiss"
                    className="p-1 focus-ring rounded-full"
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className={`px-2 py-2 ${styles.mobileMenu}`}>
                  <ul>
                    {sections.map((section, i) => (
                      <WorkshopMenuSection
                        section={section}
                        key={`${section.text}-${i}`}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
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
