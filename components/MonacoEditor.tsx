'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@monaco-editor/react').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-3 text-sm text-gray-500 dark:text-gray-400">
      Loading editor...
    </div>
  ),
});

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: number;
  theme?: 'light' | 'dark';
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  height = 200,
  theme = 'light',
}) => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      <Suspense
        fallback={
          <div className="w-full bg-gray-100 dark:bg-gray-800 p-3 text-sm text-gray-500 dark:text-gray-400">
            Loading editor...
          </div>
        }
      >
        <Editor
          height={height}
          defaultLanguage={language}
          language={language}
          value={value}
          onChange={(val) => onChange(val || '')}
          theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
          }}
        />
      </Suspense>
    </div>
  );
};

