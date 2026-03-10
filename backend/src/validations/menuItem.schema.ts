import { z } from "zod";

export const createMenuItemSchema = z.object({
	item_name: z
		.string()
		.min(1, "Item name is required")
		.max(200, "Item name cannot exceed 200 characters"),
	category: z.string().min(1, "Category is required"),
	description: z.string().max(1000, "Description cannot exceed 1000 characters").optional(),
	price: z.number().positive("Price must be a positive number"),
	image_url: z.string().url("Invalid image URL").optional(),
	is_vegetarian: z.boolean().optional(),
	is_available: z.boolean().optional(),
	total_stock: z.number().int().min(0, "Total stock must be non-negative").optional(),
});

export const updateMenuItemSchema = z.object({
	item_name: z
		.string()
		.min(1, "Item name is required")
		.max(200, "Item name cannot exceed 200 characters")
		.optional(),
	category: z.string().min(1, "Category is required").optional(),
	description: z
		.string()
		.max(1000, "Description cannot exceed 1000 characters")
		.nullable()
		.optional(),
	price: z.number().positive("Price must be a positive number").optional(),
	image_url: z.string().url("Invalid image URL").nullable().optional(),
	is_vegetarian: z.boolean().optional(),
	is_available: z.boolean().optional(),
	total_stock: z.number().int().min(0, "Total stock must be non-negative").optional(),
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
