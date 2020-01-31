import babel from 'rollup-plugin-babel';
import pkg from './package.json';
import { builtinModules } from 'module';

const external = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  ...builtinModules,
]);

const isExternal = (id) => external.has(id);

function getBinFile() {
  if (typeof pkg.bin === 'string') {
    return pkg.bin;
  }
  const bins = Object.values(pkg.bin);
  if (bins.length !== 1) {
    throw new Error('no bins defined');
  }
  return bins[0];
}

export default [
  {
    input: './src/index.js',
    external: isExternal,
    plugins: [
      babel({
        configFile: './babel.rollup.config.js',
      }),
    ],
    output: {
      format: 'cjs',
      file: pkg.main,
    },
  },
  {
    input: './src/bin/index.js',
    external: isExternal,
    plugins: [
      babel({
        configFile: './babel.rollup.config.js',
      }),
    ],
    output: {
      banner: '#!/usr/bin/env node',
      format: 'cjs',
      file: getBinFile(),
    },
  },
];
