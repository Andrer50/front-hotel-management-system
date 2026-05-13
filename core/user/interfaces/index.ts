import { Role, Status } from "@/core/shared";

export interface UserResponse {
	id: string;
	authId: string;
	firstName: string;
	lastName: string;
	profilePicture: string;
	phone: string;
	email: string;
	role: Role;
	balance: number;
	status: Status;
	createdAt: string;
	updatedAt: string;
}