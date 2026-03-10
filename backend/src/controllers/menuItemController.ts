import type { Request, Response } from "express";
import { STATUS } from "../interfaces/status.types";
import {
	getAllMenuItems,
	createMenuItem,
	updateMenuItem,
	deleteMenuItem,
} from "../services/menuItemService";
import { createMenuItemSchema, updateMenuItemSchema } from "../validations/menuItem.schema";

/**
 * GET /api/menu-items
 * Get all menu items
 */
export const getAllMenuItemsController = async (_req: Request, res: Response): Promise<void> => {
	try {
		const result = await getAllMenuItems();

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * POST /api/menu-items
 * Create a new menu item
 */
export const createMenuItemController = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedBody = createMenuItemSchema.safeParse(req.body);

		if (!validatedBody.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedBody.error.message}`,
			});
			return;
		}

		const result = await createMenuItem(validatedBody.data);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * PUT /api/menu-items/:id
 * Update an existing menu item
 */
export const updateMenuItemController = async (req: Request, res: Response): Promise<void> => {
	try {
		const menuItemId = parseInt(req.params.id as string, 10);

		if (Number.isNaN(menuItemId)) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid menu item ID",
			});
			return;
		}

		const validatedBody = updateMenuItemSchema.safeParse(req.body);

		if (!validatedBody.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedBody.error.message}`,
			});
			return;
		}

		const result = await updateMenuItem(menuItemId, validatedBody.data);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * DELETE /api/menu-items/:id
 * Delete a menu item
 */
export const deleteMenuItemController = async (req: Request, res: Response): Promise<void> => {
	try {
		const menuItemId = parseInt(req.params.id as string, 10);

		if (Number.isNaN(menuItemId)) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid menu item ID",
			});
			return;
		}

		const result = await deleteMenuItem(menuItemId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Menu item deleted successfully",
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};
