import { bundleMDX } from 'mdx-bundler';
import path from 'path';
import gfm from 'remark-gfm';
import { rehypeMetaAsAttribute } from './rehype-meta-as-attribute';

export const prepareMdx = (
  source: string,
  options: { files?: Record<string, string>; cwd?: string } = {}
) => {
  if (process.env.NETLIFY && !process.env.ESBUILD_BINARY_PATH) {
    if (process.platform === 'win32') {
      process.env.ESBUILD_BINARY_PATH = path.join(
        process.cwd(),
        'node_modules',
        'esbuild',
        'esbuild.exe'
      );
    } else {
      process.env.ESBUILD_BINARY_PATH = path.join(
        process.cwd(),
        'node_modules',
        'esbuild',
        'bin',
        'esbuild'
      );
    }
  }

  return bundleMDX(source, {
    files: options.files,
    cwd: options.cwd,
    xdmOptions(_, options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), gfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeMetaAsAttribute,
      ];
      return options;
    },
    esbuildOptions(options) {
      options.target = ['es2020', 'chrome58', 'firefox57'];

      return options;
    },
  });
};
