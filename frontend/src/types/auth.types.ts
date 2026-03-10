/* ============= OAuth Callback ============= */

export interface OAuthCallbackPayload {
	access_token: string;
	refresh_token: string;
}

export interface OAuthCallbackData {
	profileComplete: boolean;
	role?: string;
	email?: string;
}

export interface OAuthCallbackResponse {
	success: boolean;
	data: OAuthCallbackData;
}

/* ============= Complete Profile (Register) ============= */

export interface CompleteProfilePayload {
	first_name: string;
	last_name: string;
	college_id: string;
	mobile: string;
	department: string;
}

export interface CompleteProfileResponse {
	success: boolean;
	message: string;
}
