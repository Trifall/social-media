const path = require('path');

const buildEslintCommand = (filenames) =>
	`next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`;

module.exports = {
	'*.{js,jsx,ts,tsx}': [buildEslintCommand, 'prettier --write --ignore-unknown'],
	'src/**/*.{css,scss,md,json}': 'prettier --write --ignore-unknown',
};
