/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['avatars.githubusercontent.com', 'utfs.io'],
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
};

module.exports = nextConfig;
