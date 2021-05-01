import { getMDXComponent, ComponentMap } from 'mdx-bundler/client';
import cx from 'classnames';
import * as React from 'react';
import { CodeRenderer } from './code-renderer';

export interface MdxRendererProps {
  code: string;
  components?: ComponentMap;
  globals?: Record<string, unknown>;
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

export const MdxRenderer = ({
  code,
  components: providedComponents,
  globals,
}: MdxRendererProps) => {
  const Component = React.useMemo(
    () => (code ? getMDXComponent(code, globals) : null),
    [code, globals]
  );

  const allComponents = React.useMemo(
    () =>
      providedComponents
        ? {
            ...components,
            ...providedComponents,
          }
        : components,
    [providedComponents]
  );

  return Component && <Component components={allComponents} />;
};

export const IsInlineCodeContext = React.createContext(true);
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
