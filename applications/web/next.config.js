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
	},
	images: {
		domains: [
			"lh3.googleusercontent.com",
			"tailwindui.com"
		],
		dangerouslyAllowSVG: true
	}
}

module.exports = nextConfig
