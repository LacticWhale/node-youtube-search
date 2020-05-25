import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser, } from 'rollup-plugin-terser';

import { 
	resolve as resolvePath,
	join as joinPath,
} from 'path';

const 
	srcDir = resolvePath('./src'),
	distDir = resolvePath('./dist'),
	extensions = [
		'.js',
		'.mjs',
		'.cjs',
		'.jsx',
		'.ts',
		'.tsx',
	];

export default {
	treeshake: true,
	input    : joinPath(srcDir, 'index.ts'),
	output   : {
		file: joinPath(distDir, 'boundle.js'),
		format: 'cjs',
		sourcemap: true,
	},
	plugins: [
		commonjs({
			extensions,
		}),
		resolve({
			extensions,
		}),
		typescript(),
		terser({
			output: {
				comments: 'all',
			},
		}),
	],
	external: [
		'https',
		'querystring',
	],
};
