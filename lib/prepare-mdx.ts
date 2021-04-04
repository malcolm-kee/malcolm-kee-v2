import { bundleMDX } from 'mdx-bundler';
import path from 'path';

export const prepareMdx = (source: string) => {
  if (__dirname === '' && !process.env.ESBUILD_BINARY_PATH) {
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

  return bundleMDX(source);
};