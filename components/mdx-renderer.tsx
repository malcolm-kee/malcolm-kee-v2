import { getMDXComponent } from 'mdx-bundler/client';
import * as React from 'react';

export interface MdxRendererProps {
  code: string;
}

const components = {
  pre: function Pre({ children }: { children?: React.ReactNode }) {
    const isCodeSnippet =
      React.Children.count(children) === 1 &&
      React.Children.toArray(children).every(
        (child) => React.isValidElement(child) && child.type === 'code'
      );

    return (
      <pre className={isCodeSnippet ? 'lg:-mx-24 xl:-mx-36' : undefined}>
        {children}
      </pre>
    );
  },
};

export const MdxRenderer = ({ code }: MdxRendererProps) => {
  const Component = React.useMemo(() => (code ? getMDXComponent(code) : null), [
    code,
  ]);

  return Component && <Component components={components} />;
};

const IsInlineCodeContext = React.createContext(true);
IsInlineCodeContext.displayName = 'IsInlineCodeContext';
