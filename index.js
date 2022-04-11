const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const actions = {
	noop: {
		fn: () => console.log('.'),
	},
	sayhello: {
		fn: () => console.log('Hello!'),
		definitions: [
			{ name: 'input', alias: 'i', type: String },
		],
		parseArgs: (options) => {
			console.log(`args: ${JSON.stringify(options, null, ' ')}`);
			return options;
		},
	}
}

function run() {
	const options = Object.keys(actions).reduce((acc, key) => {
		const action = actions[key];
		acc[key] = {
			fn: action.fn || (() => function() { console.log(`No function defined for ${key}`); }),
			definitions: action.definitions || [],
			parseArgs: action.parseArgs || (() => []),
		};
		return acc;
	}, {});

	const mainDefinitions = [
		{ name: 'command', defaultOption: true }
	];

	const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });

	const actionKey = mainOptions.command;
	if (!actionKey) {
		console.warn('No action specified.')
		process.exit(!mainOptions.help);
	}

	const action = options[actionKey];
	const argv = mainOptions._unknown || [];	

	if (!actions[actionKey]) {
		console.warn(`Invalid action specifed: ${actionKey}`);
		process.exit(!mainOptions.help);
	}

	const actionOptions = commandLineArgs(action.definitions, { argv });
	action.fn.call(null, action.parseArgs.call(null, actionOptions));
}

run();
