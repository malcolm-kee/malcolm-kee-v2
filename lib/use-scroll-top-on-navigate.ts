import { useRouter } from 'next/router';
import * as React from 'react';
import { useConstant } from './use-constant';

export const useScrollTopOnNavigate = <ScrollElement extends HTMLElement>() => {
  const scrollRef = React.useRef<ScrollElement>(null);
  const scrollPositionMap = useConstant(() => new Map<string, number>());

  const router = useRouter();

  React.useEffect(() => {
    const storeScrollPosition = () => {
      if (scrollRef.current) {
        scrollPositionMap.set(router.asPath, scrollRef.current.scrollTop);
      }
    };

    const scrollElementToTop = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollPositionMap.get(router.asPath) || 0;
      }
    };

    router.events.on('routeChangeStart', storeScrollPosition);
    router.events.on('routeChangeComplete', scrollElementToTop);

    return () => {
      router.events.off('routeChangeStart', storeScrollPosition);
      router.events.off('routeChangeComplete', scrollElementToTop);
    };
  }, [router]);

  return scrollRef;
};
