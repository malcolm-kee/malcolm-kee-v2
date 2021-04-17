import { getMDXComponent } from 'mdx-bundler/client';
import { CodeSnippet } from './code-snippet';
import * as React from 'react';

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
}) {
  const isInlineCode = React.useContext(IsInlineCodeContext);

  if (!isInlineCode) {
    const language = props.className && props.className.split('-')[1];

    return (
      <CodeSnippet
        code={props.children as string}
        language={language as any}
        highlightedLines={props.highlightedLines}
        className="lg:-mx-24 xl:-mx-36"
      />
    );
  }

  return <code {...props} />;
}
