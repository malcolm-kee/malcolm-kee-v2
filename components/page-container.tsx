import * as React from 'react';
import Link from 'next/link';

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer = (props: PageContainerProps) => {
  return (
    <div className="h-full flex flex-col">
      <header className="py-4 px-4 sm:px-6 bg-green-700 text-white flex-shrink-0">
        <div className="max-w-7xl mx-auto text-right">
          <Link href="/">
            <a className="text-2xl md:text-3xl">Malcolm Kee</a>
          </Link>
        </div>
      </header>
      <div className="flex-1 bg-gray-50">{props.children}</div>
      <footer className="py-6 px-4 sm:px-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto text-center">
          <small>Copyright Malcolm Kee. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
};
