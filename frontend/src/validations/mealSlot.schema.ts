import { z } from "zod";

export const createSlotFormSchema = z.object({
	slot_name: z.string().min(1, "Slot name is required").max(100, "Max 100 characters"),
	slot_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	start_time: z.string().regex(/^\d{2}:\d{2}$/, "Start time is required"),
	end_time: z.string().regex(/^\d{2}:\d{2}$/, "End time is required"),
	max_capacity: z.coerce.number().int().positive("Must be a positive number"),
});

export type CreateSlotFormValues = z.infer<typeof createSlotFormSchema>;
