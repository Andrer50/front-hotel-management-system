export interface Pagination<T> {
	content: T;
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
}

export interface ApiResponse<T> {
	code: string;
	message: string;
	data: T;
}