import Editor, { useMonaco } from '@monaco-editor/react';
import * as React from 'react';

export interface TypescriptEditorProps {
  language: string;
  defaultValue: string;
  className?: string;
}

export const TypeScriptEditor = ({
  className,
  language,
  defaultValue,
}: TypescriptEditorProps) => {
  const monaco = useMonaco();

  React.useEffect(() => {
    if (monaco) {
      import('monaco-themes/themes/Night Owl.json').then((themeData) => {
        monaco.editor.defineTheme('nightOwl', themeData as any);
        monaco.editor.setTheme('nightOwl');
      });
    }
  }, [monaco]);

  return (
    <div className={className}>
      <Editor
        height="40vh"
        theme="nightOwl"
        options={options}
        defaultValue={defaultValue}
        language={language === 'ts' ? 'typescript' : language}
      />
    </div>
  );
};

const options = {
  minimap: {
    enabled: false,
  },
};
