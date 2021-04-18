import { bundleMDX } from 'mdx-bundler';
import path from 'path';
import { rehypeMetaAsAttribute } from './rehype-meta-as-attribute';

export const prepareMdx = (source: string) => {
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
    xdmOptions(_, options) {
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
