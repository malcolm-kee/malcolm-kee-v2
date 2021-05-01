import * as React from 'react';
import { CodeSnippet } from './code-snippet';
import { TypeScriptEditor } from './typescript-editor';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import nightOwl from 'prism-react-renderer/themes/nightOwl';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import styles from './code-renderer.module.css';
import { CodeGlobalsContext } from './code-globals';

export interface CodeRendererProps {
  className?: string;
  children?: React.ReactNode;
  live?: boolean;
  noInline?: boolean;
  previewOnly?: boolean;
  highlightedLines?: string;
}

export const CodeRenderer = (props: CodeRendererProps) => {
  const language = React.useMemo(
    () => getLanguageFromClassName(props.className),
    [props.className]
  );

  const code = typeof props.children === 'string' ? props.children.trim() : '';

  const renderLiveEditor =
    props.live && /^(ts|typescript|jsx?|javascript)$/.test(language);

  return renderLiveEditor ? (
    /^(ts|typescript)$/.test(language) ? (
      <TypeScriptEditor
        language={language}
        defaultValue={code}
        className={props.className}
      />
    ) : (
      <CodeLiveEditor
        code={code}
        language={language}
        noInline={props.noInline}
        previewOnly={props.previewOnly}
        className={props.className}
      />
    )
  ) : (
    <CodeSnippet
      language={language as any}
      code={code}
      highlightedLines={props.highlightedLines}
      className={props.className}
    />
  );
};

const getLanguageFromClassName = (className?: string): string => {
  if (!className) {
    return '';
  }

  const classes = className.split(' ');

  const languageClass = classes.find((cs) => /^language\-/.test(cs));

  return languageClass ? (languageClass.split('-').pop() as string) : '';
};

interface CodeLiveEditorProps {
  code: string;
  language: string;
  noInline?: boolean;
  previewOnly?: boolean;
  className?: string;
}

const CodeLiveEditor = ({
  code,
  language,
  noInline,
  previewOnly,
  className,
}: CodeLiveEditorProps) => {
  const [isEditMode, setIsEditMode] = React.useState(!!previewOnly);
  const codeGlobals = React.useContext(CodeGlobalsContext);
  const finalScope = React.useMemo(
    () => ({
      ...scope,
      ...codeGlobals,
    }),
    [codeGlobals]
  );

  return (
    <div className={cx('shadow-inner p-1', className)}>
      <div className="flex justify-between py-1">
        <span></span>
        <button
          onClick={() => setIsEditMode(true)}
          type="button"
          className={cx('text-sm px-3 focus-ring', isEditMode && 'invisible')}
        >
          EDIT
        </button>
      </div>

      <div className="text-sm">
        <LiveProvider
          code={removeHighlightComment(code)}
          transformCode={language === 'js' ? wrapJsCode : undefined}
          theme={nightOwl}
          scope={finalScope}
          language="jsx"
          noInline={language === 'js' ? false : noInline}
        >
          {!isEditMode ? (
            <CodeSnippet
              language={language as any}
              code={code}
              className={styles.snippet}
            />
          ) : (
            !previewOnly && (
              <LiveEditor
                className="rounded-md"
                autoFocus
                onKeyDown={(ev) => {
                  if (ev.key === 'Escape') {
                    setIsEditMode(false);
                  }
                }}
                onBlur={() => setIsEditMode(false)}
              />
            )
          )}
          <LiveError />
          <LivePreview className="p-2 shadow-inner" />
        </LiveProvider>
      </div>
    </div>
  );
};

const scope = {
  ReactDOM,
  sanitize,
  shallowConcat,
};

export const wrapJsCode = (code: string) => `
  class CodeWrapper extends React.Component {
      constructor(props) {
          super(props);
          this.state = {
            logs: []
          };
      }

      componentDidMount() {
        const log = content => 
          this.setState(prevState => ({
              logs: shallowConcat(prevState.logs, content)
            }));

        const console = {
          log: log,
          info: log,
          error: log
        }
        
        ${code}
      }

      render() {
          return (
              <div className="${styles.logOutputContainer}" tabIndex={0}> ${
  '' /* add tabIndex as this is scrollable */
}
              {this.state.logs.map((log, index) => 
                <div
                  className="${styles.logOutput}" 
                  key={index} 
                  dangerouslySetInnerHTML={{ __html: sanitize(log) }} 
                />)
              }
              </div>
          );
      }
  }
`;

function sanitize(data: any): any {
  return Array.isArray(data)
    ? `[${data.map(sanitize).join(',')}]`
    : data instanceof Error
    ? data.toString()
    : typeof data === 'object'
    ? JSON.stringify(data, null, 2)
    : typeof data === 'string'
    ? `"${data}"`
    : data;
}

function shallowConcat<T>(targetArr: T[], item: T) {
  if (!Array.isArray(targetArr)) return targetArr;

  const newArr = targetArr.slice();
  newArr.push(item);
  return newArr;
}

/**
 * Sanitize code by removing line start with the following:
 * - `// highlight-next-line`
 * - `// highlight-start`
 * - `// highlight-end`
 *
 * The following comments will be remove without removing other character in the same line:
 * - `// highlight-line`
 *
 * @param {string} code
 */
export const removeHighlightComment = (code: string) =>
  typeof code === 'string'
    ? code.replace(
        /(^\s*\/\/\s*[highlight\-next\-line|highlight\-start|highlight\-end].*\n?|\/\/\s*highlight-line)/gm,
        ''
      )
    : code;
