import { z } from "zod";

export const feedbackSchema = z.object({
	rating: z
		.number({
			required_error: "Rating is required",
			invalid_type_error: "Rating is required",
		})
		.int("Rating must be a whole number")
		.min(1, "Please select at least 1 star")
		.max(5, "Rating cannot exceed 5 stars"),
	comment: z.string().max(300, "Comment cannot exceed 300 characters").optional().or(z.literal("")),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
