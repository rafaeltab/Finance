/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	redirects: async () => {
		return [
			{
				source: '/',
				destination: '/dashboard',
				permanent: true,
			},
		]
	}
}

module.exports = nextConfig
