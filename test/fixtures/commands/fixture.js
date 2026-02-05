#!/usr/bin/env node
import meow from '../../../source/index.js';

const cli = meow({
	importMeta: import.meta,
	description: false,
	helpIndent: 0,
	help: `
		Usage
		  foo <command>

		Options
		  --parent-flag  Parent flag
	`,
	allowUnknownFlags: false,
	flags: {
		parentFlag: {
			type: 'boolean',
		},
	},
	commands: ['run', 'list'],
});

console.log(cli.command);
console.log(cli.input.join(','));
console.log(cli.flags.parentFlag);
