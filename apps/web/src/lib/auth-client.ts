import type { auth } from "@aero-ssh/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_SERVER_URL,
	plugins: [inferAdditionalFields<typeof auth>()],
	fetchOptions: {
		auth: {
			type: "Bearer",
			token: () => localStorage.getItem("bearer_token") || "",
		},
		onSuccess: (ctx) => {
			const authToken = ctx.response.headers.get("set-auth-token"); // get the token from the response headers
			// Store the token securely (e.g., in localStorage)
			if (authToken) {
				localStorage.setItem("bearer_token", authToken);
			}
		},
	},
});
