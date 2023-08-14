import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import license from 'rollup-plugin-license';
import filesize from 'rollup-plugin-filesize';
import {defineConfig} from 'rollup';

const outDir = 'build';

export default defineConfig({
	input: [
		'source/index.js',
		'source/options.js',
		'source/parser.js',
		'source/utils.js',
		'source/validate.js',
	],
	output: {
		dir: outDir,
		interop: 'esModule',
		generatedCode: {
			preset: 'es2015',
		},
		chunkFileNames: '[name].js',
		manualChunks(id) {
			if (id.includes('node_modules')) {
				return 'dependencies';
			}
		},
	},
	preserveEntrySignatures: 'allow-extension',
	plugins: [
		nodeResolve(),
		commonjs({
			include: 'node_modules/**',
		}),
		json(),
		license({
			thirdParty: {
				output: `${outDir}/licenses.md`,
			},
		}),
		filesize(),
	],
});
