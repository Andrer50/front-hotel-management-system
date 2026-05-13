import { Role, Status } from "@/core/shared";
import { UserResponse } from "@/core/user/interfaces";

export interface RegisterAuthenticationRequest {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
	repeatPassword: string;
	role: Role;
	status: Status;
}

export interface RegisterAuthenticationResponse extends Omit<UserResponse, "authId" | "createdAt" | "updatedAt"> {
	token: string;
}

export interface LoginAuthenticationRequest {
	email: string;
	password: string;
}

export interface LoginAuthenticationResponse {
	tokenType: string;
	accessToken: string;
	expiresInSeconds: string;
	refreshToken: string;
}

export interface AuthenticateDecodeToken {
	sub: string;
	aud: string;
	uid: number;
	roles: string[];
	iss: string;
	exp: number;
	iat: number;
}
