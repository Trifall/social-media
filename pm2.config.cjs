module.exports = {
	apps: [
		{
			name: 'social-media',
			script: 'yarn',
			args: 'start -p 3030',
			autorestart: true,
			watch: './next',
			ignore_watch: ['node_modules', '*.json'],
			max_memory_restart: '300M',
			time: true,
		},
	],
};
