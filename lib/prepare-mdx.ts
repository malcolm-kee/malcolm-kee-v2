import { bundleMDX } from 'mdx-bundler';
import path from 'path';

export const prepareMdx = (source: string) => {
  console.log(__dirname, '__dirname');
  console.log('cwd', process.cwd());
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

  console.log('ESBUILD_BINARY_PATH', process.env.ESBUILD_BINARY_PATH);

  return bundleMDX(source);
};
