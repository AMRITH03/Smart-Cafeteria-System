import { z } from "zod";

// Schema for creating a meal slot
export const createMealSlotSchema = z.object({
	slot_name: z
		.string()
		.min(1, "Slot name is required")
		.max(100, "Slot name cannot exceed 100 characters"),
	slot_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	start_time: z
		.string()
		.regex(/^\d{2}:\d{2}(:\d{2})?$/, "Start time must be in HH:MM or HH:MM:SS format"),
	end_time: z
		.string()
		.regex(/^\d{2}:\d{2}(:\d{2})?$/, "End time must be in HH:MM or HH:MM:SS format"),
	max_capacity: z.number().int().positive("Max capacity must be a positive integer"),
});

// Schema for a single slot-menu mapping item
const slotMenuItemSchema = z.object({
	menu_item_id: z.number().int().positive("Menu item ID must be a positive integer"),
	available_quantity: z.number().int().min(0, "Available quantity must be non-negative"),
});

// Schema for creating slot-menu mappings
export const createSlotMenuMappingSchema = z.object({
	slot_id: z.number().int().positive("Slot ID must be a positive integer"),
	items: z.array(slotMenuItemSchema).min(1, "At least one menu item must be provided"),
});

// Type exports
export type CreateMealSlotInput = z.infer<typeof createMealSlotSchema>;
export type CreateSlotMenuMappingInput = z.infer<typeof createSlotMenuMappingSchema>;
