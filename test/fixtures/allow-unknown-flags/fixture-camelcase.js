#!/usr/bin/env node
import meow from '../../../source/index.js';

const cli = meow({
	importMeta: import.meta,
	allowUnknownFlags: false,
	flags: {
		outDir: {
			type: 'string',
		},
	},
});

console.log(cli.flags.outDir);
