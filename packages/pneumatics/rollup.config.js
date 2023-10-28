import { defineConfig } from 'rollup'
import typescriptPlugin from '@rollup/plugin-typescript'
import { readPackageUpSync } from 'read-pkg-up'
import urlPlugin from '@rollup/plugin-url'
import Module from 'module'

const packageJson = readPackageUpSync({ normalize: true }).packageJson

export default defineConfig([{
  input: 'src/index.ts',
  plugins: [
    typescriptPlugin(),
    urlPlugin({
      limit: 2000,
    }),
  ],
  output: [{
    file: 'bin/gqlss.js',
    format: 'esm',
    banner: '#!/usr/bin/env node\n'
  }],
  external: [
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {}),
    ...Module.builtinModules.map(m => `node:${m}`)
  ],
}])
