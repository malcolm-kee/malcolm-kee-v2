import { includes } from 'lib/array';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import nightOwl from 'prism-react-renderer/themes/nightOwl';
import * as React from 'react';
import cx from 'classnames';

interface CodeSnippetProps {
  code: string;
  language: Language;
  className?: string;
  highlightedLines?: string;
}

export const CodeSnippet = (props: CodeSnippetProps) => {
  const lineIndexesToHighlight =
    typeof props.highlightedLines === 'string'
      ? props.highlightedLines.split(',').map((num) => Number(num) - 1)
      : [];

  return (
    <Highlight
      {...defaultProps}
      theme={nightOwl}
      language={props.language}
      code={props.code}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={cx(className, props.className)} style={style}>
          {transformTokens(tokens, lineIndexesToHighlight).map(
            ({ line, isHighlighted }, i) => (
              <div
                {...getLineProps({
                  line,
                  className: isHighlighted
                    ? 'highlighted-code-line'
                    : undefined,
                  key: i,
                })}
              >
                {line.map((token: any, key: any) => {
                  return <span {...getTokenProps({ token, key })} />;
                })}
              </div>
            )
          )}
        </pre>
      )}
    </Highlight>
  );
};

export const transformTokens = (
  tokens: Token[][],
  highlightedLineIndexes: number[]
) => {
  const results: Array<{
    line: Token[];
    isHighlighted: boolean;
  }> = [];

  let keepHighlighting = false;

  tokens
    .map((currentLine) => ({
      line: currentLine,
      isNextLineHighlighted: isHighlightNextLine(currentLine),
    }))
    .forEach((currentLine, index, allTokens) => {
      if (isHighlightStart(currentLine.line)) {
        keepHighlighting = true;
        return;
      }

      if (isHighlightEnd(currentLine.line)) {
        keepHighlighting = false;
        return;
      }

      if (!currentLine.isNextLineHighlighted) {
        const prevLine = allTokens[index - 1];

        const highlightLineCommentIndex = findHighlightLineCommentIndex(
          currentLine.line
        );

        const sanitizedToken =
          highlightLineCommentIndex === -1
            ? currentLine.line
            : currentLine.line.filter(
                (_, index) => index !== highlightLineCommentIndex
              );

        const highlightCurrentLine =
          keepHighlighting ||
          !!(prevLine && prevLine.isNextLineHighlighted) ||
          includes(highlightedLineIndexes, index) ||
          highlightLineCommentIndex !== -1;

        results.push({
          line: sanitizedToken,
          isHighlighted: highlightCurrentLine,
        });
      }
    });

  return results;
};

const isHighlightNextLine = (tokens: Token[]) =>
  Array.isArray(tokens) &&
  tokens.some(
    (token) =>
      includes(token.types, 'comment') &&
      includes(token.content, 'highlight-next-line')
  );

const isHighlightStart = (tokens: Token[]) =>
  Array.isArray(tokens) &&
  tokens.some(
    (token) =>
      includes(token.types, 'comment') &&
      includes(token.content, 'highlight-start')
  );

const isHighlightEnd = (tokens: Token[]) =>
  Array.isArray(tokens) &&
  tokens.some(
    (token) =>
      includes(token.types, 'comment') &&
      includes(token.content, 'highlight-end')
  );

const findHighlightLineCommentIndex = (tokens: Token[]) =>
  tokens.findIndex(
    (token) =>
      includes(token.types, 'comment') &&
      includes(token.content, 'highlight-line')
  );

type Token = {
  types: string[];
  content: string;
  empty?: boolean;
};
