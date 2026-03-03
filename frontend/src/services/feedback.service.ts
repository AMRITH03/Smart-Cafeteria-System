import { apiPost } from "@/lib/api";

export interface SubmitTokenFeedbackPayload {
	tokenId: number;
	rating: number;
	comment?: string;
}

export interface SubmitTokenFeedbackResponse {
	success: boolean;
	message: string;
	data?: {
		feedback_id?: number;
		rating?: number;
		feedback_text?: string | null;
		created_at?: string;
	};
}

export const FeedbackService = {
	submitTokenFeedback: (
		payload: SubmitTokenFeedbackPayload
	): Promise<SubmitTokenFeedbackResponse> =>
		apiPost<SubmitTokenFeedbackResponse>(`/api/tokens/${payload.tokenId}/feedback`, {
			rating: payload.rating,
			feedback_text: payload.comment,
		}),
};
