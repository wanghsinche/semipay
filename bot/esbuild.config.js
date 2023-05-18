const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.js',
  platform: 'node',
  format: 'cjs',
  target: 'node16',
  sourcemap: true,
  bundle: true,
  external: ['express', 'fs', 'http', 'https', 'path', 'stream', 'url', 'wechaty', 'wechaty-puppet'], // Add any external dependencies here
  tsconfig: './tsconfig.json',
}).catch((e) => {
  console.log(e);
  process.exit(1);});