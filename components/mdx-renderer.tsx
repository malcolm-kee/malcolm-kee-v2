import { getMDXComponent } from 'mdx-bundler/client';
import cx from 'classnames';
import * as React from 'react';
import { CodeRenderer } from './code-renderer';

export interface MdxRendererProps {
  code: string;
}

const components = {
  pre: function Pre({ children }: { children?: React.ReactNode }) {
    const isCodeSnippet =
      React.Children.count(children) === 1 &&
      React.Children.toArray(children).every(
        (child) => React.isValidElement(child) && child.type === Code
      );

    if (isCodeSnippet) {
      return (
        <>
          <IsInlineCodeContext.Provider value={false}>
            {children}
          </IsInlineCodeContext.Provider>
        </>
      );
    }

    return <pre>{children}</pre>;
  },
  code: Code,
};

export const MdxRenderer = ({ code }: MdxRendererProps) => {
  const Component = React.useMemo(() => (code ? getMDXComponent(code) : null), [
    code,
  ]);

  return Component && <Component components={components} />;
};

const IsInlineCodeContext = React.createContext(true);
IsInlineCodeContext.displayName = 'IsInlineCodeContext';

function Code(props: {
  children?: React.ReactNode;
  className?: string;
  highlightedLines?: string;
  live?: boolean;
}) {
  const isInlineCode = React.useContext(IsInlineCodeContext);

  if (!isInlineCode) {
    return (
      <CodeRenderer
        {...props}
        className={cx(props.className, 'lg:-mx-24 xl:-mx-36')}
      />
    );
  }

  return <code {...props} />;
}
