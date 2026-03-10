import { z } from "zod";

export const createMenuItemSchema = z.object({
	item_name: z
		.string()
		.min(1, "Item name is required")
		.max(200, "Item name cannot exceed 200 characters"),
	category: z.enum(["breakfast", "lunch", "snacks", "dinner"], {
		required_error: "Category is required",
	}),
	description: z.string().max(1000, "Description cannot exceed 1000 characters").optional(),
	price: z.coerce.number().positive("Price must be a positive number"),
	is_vegetarian: z.boolean().optional(),
});

export const updateMenuItemSchema = z.object({
	item_name: z
		.string()
		.min(1, "Item name is required")
		.max(200, "Item name cannot exceed 200 characters"),
	category: z.enum(["breakfast", "lunch", "snacks", "dinner"], {
		required_error: "Category is required",
	}),
	description: z.string().max(1000, "Description cannot exceed 1000 characters").optional(),
	price: z.coerce.number().positive("Price must be a positive number"),
	is_vegetarian: z.boolean().optional(),
});

export type CreateMenuItemFormValues = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemFormValues = z.infer<typeof updateMenuItemSchema>;
