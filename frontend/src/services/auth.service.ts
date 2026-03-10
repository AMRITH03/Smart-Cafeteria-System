import { apiPost } from "@/lib/api";
import type {
	OAuthCallbackPayload,
	OAuthCallbackResponse,
	CompleteProfilePayload,
	CompleteProfileResponse,
} from "../types/auth.types";

export const AuthService = {
	// OAuth callback — exchange tokens with backend
	oauthCallback: (payload: OAuthCallbackPayload): Promise<OAuthCallbackResponse> =>
		apiPost<OAuthCallbackResponse>("api/auth/oauth/callback", payload, { skipAuth: true }),

	// Complete profile for new OAuth users
	completeProfile: (payload: CompleteProfilePayload): Promise<CompleteProfileResponse> =>
		apiPost<CompleteProfileResponse>("api/auth/complete-profile", payload),

	// Logout
	logout: (): Promise<{ message: string }> => apiPost<{ message: string }>("api/auth/signOut", {}),
};
