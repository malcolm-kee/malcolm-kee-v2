import * as React from 'react';

export const CodeGlobalsContext = React.createContext<Record<string, unknown>>(
  {}
);
CodeGlobalsContext.displayName = 'CodeGlobalsContext';
