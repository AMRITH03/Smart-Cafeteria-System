import { z } from "zod";

export const oauthCallbackSchema = z.object({
	access_token: z.string().min(1, "Access token is required"),
	refresh_token: z.string().min(1, "Refresh token is required"),
});

export const completeProfileSchema = z.object({
	first_name: z.string().min(2, "First Name is too short"),
	last_name: z.string().min(1, "Last Name is too short"),
	college_id: z.string().min(5, "College ID is required"),
	mobile: z
		.string()
		.regex(/^[6-9]\d{9}$/, "Mobile number must be exactly 10 digits")
		.optional(),
	department: z.string().optional(),
});

export const updateProfileSchema = z.object({
	first_name: z.string().min(2, "First Name is too short").optional(),
	last_name: z.string().min(1, "Last Name is too short").optional(),
	mobile: z
		.string()
		.regex(/^[6-9]\d{9}$/, "Mobile number must be exactly 10 digits")
		.optional(),
	department: z.string().optional(),
});

export type OAuthCallbackInput = z.infer<typeof oauthCallbackSchema>;
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
