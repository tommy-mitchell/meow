#!/usr/bin/env node
import meow from '../../../source/index.js';

const cli = meow({
	importMeta: import.meta,
	input: {
		isRequired: () => true,
	},
});

console.log(cli.input.join(','));
