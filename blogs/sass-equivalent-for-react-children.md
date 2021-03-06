---
title: '@content: SASS equivalent of React children'
date: '2019-09-19'
tags: ['sass']
summary: 'Use @content to inject arbitrary content into your SASS @mixin'
---

Do you know that you can use `@content` in SASS `mixin`? It works like React Children.

```scss
@mixin focusedByMouse {
  &:focus:not(:focus-visible) {
    @content;
  }
}

.button {
  @include focusedByMouse {
    filter: none;
    border-color: transparent;
  }
}
```

Would transpile to:

```css
.button:focus:not(:focus-visible) {
  filter: none;
  border-color: transparent;
}
```

Huh, you already know that?

Well, I just know it today, and this is my blog. Meh.
