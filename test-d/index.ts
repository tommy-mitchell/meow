import {expectAssignable, expectError, expectType} from 'tsd';
import type {PackageJson} from 'type-fest';
import meow, {type AnyFlag, type AnyFlags} from '../source/index.js';

const importMeta = import.meta;

// Missing importMeta should error
expectError(meow('Help text'));
expectError(meow('Help text', {}));

// Input options
meow({importMeta, input: 'number'});
meow({importMeta, input: {type: 'number'}});
meow({importMeta, input: {type: 'number', isRequired: true}});
meow({importMeta, input: {isRequired: true}});

// Commands
expectType<string | undefined>(meow({importMeta, commands: ['run', 'list']}).command);

// Flag types
expectAssignable<{flags: {foo: number}}>(meow({importMeta, flags: {foo: {type: 'number', isRequired: true}}}));
expectAssignable<{flags: {foo: string | undefined}}>(meow({importMeta, flags: {foo: {type: 'string'}}}));
expectAssignable<{flags: {foo: boolean[] | undefined}}>(meow({importMeta, flags: {foo: {type: 'boolean', isMultiple: true}}}));

// Complete result test
const result = meow('Help text', {
	importMeta,
	flags: {
		foo: {type: 'boolean', shortFlag: 'f'},
		'foo-bar': {type: 'number', aliases: ['foobar']},
		bar: {type: 'string', default: ''},
		abc: {type: 'string', isMultiple: true},
		baz: {type: 'string', choices: ['rainbow', 'cat']},
	},
});

expectType<string[]>(result.input);
expectType<PackageJson>(result.pkg);
expectType<string>(result.help);
expectType<boolean | undefined>(result.flags.foo);
expectType<number | undefined>(result.flags.fooBar);
expectType<string>(result.flags.bar);
expectType<string[] | undefined>(result.flags.abc);
expectType<string | undefined>(result.flags.baz);

result.showHelp();
result.showHelp(1);
result.showVersion();

// Const assertion
const options = {
	importMeta,
	flags: {
		rainbow: {type: 'boolean', shortFlag: 'r'},
	},
} as const;

meow('', options);

// Flag validation - defaults
expectAssignable<AnyFlag>({type: 'string', default: 'cat'});
expectAssignable<AnyFlag>({type: 'number', default: 42});
expectAssignable<AnyFlag>({type: 'string', isMultiple: true, default: ['cat']});
expectError<AnyFlag>({type: 'string', isMultiple: true, default: 'cat'});

// Flag validation - choices
expectAssignable<AnyFlag>({type: 'string', choices: ['cat', 'unicorn']});
expectAssignable<AnyFlag>({choices: ['cat']});
expectError<AnyFlag>({type: 'string', choices: 'cat'});
expectError<AnyFlag>({type: 'string', choices: [1]});
expectError<AnyFlag>({choices: ['cat', 1, true]});

// Defining flags separately with `satisfies`
const separateFlags = {
	unicorn: {type: 'string', shortFlag: 'u'},
	verbose: {type: 'boolean'},
} satisfies AnyFlags;

expectAssignable<{flags: {unicorn: string | undefined; verbose: boolean | undefined}}>(meow({importMeta, flags: separateFlags}));
