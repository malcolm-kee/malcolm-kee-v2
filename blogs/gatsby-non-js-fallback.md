---
title: 'Provide Fallback UI with useLayoutEffect in Gatsby'
date: '2019-07-14'
tags: ['react', 'GatsbyJS', 'react hooks']
summary: 'Embracing graceful degradation in Gatsby site by providing fallback UI without JS with useLayoutEffect hooks'
---

[Gatsby][gatsbyjs] is one of the libraries that bring me joy when using it. The site that you're looking at right now is built with Gatsby too.

In addition of the out-of-the-box performance, one thing I really love Gatsby is the site generated by Gatsby usually degrate gracefully to just HTML/CSS when there is some JS error or syntax error because the site is pre-rendered in advanced.

## The Problem

The graceful degration in Gatsby site will be lost in some use case. For instance, if you use dialog to display some of the content, those contents are no longer accessible when JS is not running. Another example is some features that relies on JS to operate, such as Dark Mode of this site.

## The Solution

To avoid this problem, the solution that I've come up with is to provide a fallback UI when JS is not available and another UI when JS is available. For the app to know which one is available, I create a custom hooks that will only returns true when JS is available:

```javascript
import * as React from 'react';

export function useIsJsEnabled() {
  const [isJsEnabled, setIsJsEnabled] = React.useState(false);

  React.useLayoutEffect(() => {
    setIsJsEnabled(true);
  }, []);

  return isJsEnabled;

```

To use it:

```jsx
import * as React from 'react';
import { useIsJsEnabled } from './use-is-js-enabled';

export const MyPage = () => {
  const isJsEnabled = useIsJsEnabled();

  return isJsEnabled ? (
    <div>Enhanced, fancy UI that requires JS in runtime</div>
  ) : (
    <div>Plain content that doesn't requires JS</div>
  );
};
```

- the custom hook rely on the fact that `useLayoutEffect` is not run during prerender phase during Gatsby build phase. This will allows the pre-rendered HTML are contents that does not require JS in runtime.
- Why `useLayoutEffect` not `useEffect`? This is because we doesn't want the flash of content of switching from fallback UI to the enhanced UI. `useEffect` commits the initial UI to HTML before the effect is executed asynchronously, therefore user can see it. On the other hand, `useLayoutEffect` fires synchronously, therefore we can make sure user will not see the fallback UI.

You can see it in action in [Projects](/projects) page of this site with and without JS.

## The Limitation

There is one limitation of this approach though, the flash of content still visible if the component use this custom hook is on the initial page that user visits to the site. To illustrate, if you go to the [Projects](/projects) page from [Home](/) page, no flash of content will be visible; if you refresh your browser while you're at the Projects page, then you can see the flash of content.

This is because the original HTML will be visible in the initial page load while the JS is being download (thus `useLayoutEffect` would not be executed), but I can't think of a possible solution that would fix this.

For now, I would rather have a split second content flash for some page, instead of making the page _completely_ inaccessible when JS not available.

[gatsbyjs]: https://www.gatsbyjs.org/