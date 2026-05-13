import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
	export interface User extends DefaultUser {
		id: string;
		email: string;
		name: string;
		profilePicture: string;
		phone: string;
		role: string;
		status: string;
		accessToken: string;
		refreshToken: string;
		accessTokenExpires?: number;
		error?: "AccessTokenExpired";
	}

	interface Session extends DefaultSession {
		user: {
			id: string;
			email: string;
			name: string;
			phone: string;
			role: string;
			status: string;
		};
		accessToken: string;
		accessTokenExpires: number;
		error?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		email: string;
		name: string;
		phone: string;
		role: string;
		status: string;
		accessToken: string;
		refreshToken: string;
		accessTokenExpires: number;
		error?: string;
	}
}
