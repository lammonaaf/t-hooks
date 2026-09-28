import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: { 't-hooks': 'src/index.ts' },
  tsconfig: 'tsconfig.build.json',
  target: 'es2020',
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  platform: 'neutral',
  outExtensions: ({ format }) => ({
    js: format === 'es' ? '.esm.js' : '.js',
    dts: '.d.ts',
  }),
})
