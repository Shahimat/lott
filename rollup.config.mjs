import terser from '@rollup/plugin-terser';
import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  input: 'src/index.ts',
  output: [{ dir: 'dist/cjs', format: 'cjs', plugins: [terser()] }],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: path.resolve(__dirname, 'tsconfig.build.json'),
    }),
  ],
};
