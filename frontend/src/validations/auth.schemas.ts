import { z } from "zod";

/* ===================== COMPLETE PROFILE (REGISTER) ===================== */

export const completeProfileSchema = z.object({
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
	college_id: z.string().min(5, "College ID is required"),
	mobile: z.string().length(10, "Mobile number must be 10 digits"),
	department: z.string().min(2, "Department is required"),
});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;
