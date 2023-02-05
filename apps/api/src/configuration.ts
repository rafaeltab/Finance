export type Configuration = {
	auth: {
		auth0: {
			issuer: string;
			audience: string;
		}
	}
}

export default () => { 
	return {
		auth: {
			"auth0": {
				"issuer": process.env["AUTH0_ISSUER_URL"],
				"audience": process.env["AUTH0_AUDIENCE"]
			}
		}
	}
}