#!/usr/bin/env node
import meow from '../../../source/index.js';

const cli = meow({
	importMeta: import.meta,
	description: 'Custom description',
	help: `
		Usage
		  foo <input>
	`,
	input: {
		isRequired: true,
	},
});

console.log(cli.input.join(','));
