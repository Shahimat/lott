import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [{ dir: 'dist/cjs', format: 'cjs', plugins: [terser()] }],
  plugins: [typescript({ useTsconfigDeclarationDir: true })],
};
