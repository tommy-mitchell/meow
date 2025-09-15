import {expectAssignable, expectError, expectType} from 'tsd';
import type {PackageJson} from 'type-fest';
import meow from '../source/index.js';

type AnyFlag = NonNullable<NonNullable<Parameters<typeof meow>[0]>['flags']>[string];

const importMeta = import.meta;

// Missing importMeta should error
expectError(meow('Help text'));
expectError(meow('Help text', {}));

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
