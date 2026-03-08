export interface OAuthCallbackRequest {
	access_token: string;
	refresh_token: string;
}

export interface OAuthCallbackResponse {
	profileComplete: boolean;
	role?: string;
	email?: string;
}

export interface CompleteProfileRequest {
	first_name: string;
	last_name: string;
	college_id: string;
	mobile?: string;
	department?: string;
}
