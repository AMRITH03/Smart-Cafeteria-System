import type { Request, Response } from "express";
import { STATUS } from "../interfaces/status.types";
import {
	createMealSlot,
	createSlotMenuMappings,
	getAllMenuItems,
} from "../services/mealSlotService";
import { createMealSlotSchema, createSlotMenuMappingSchema } from "../validations/mealSlot.schema";

/**
 * POST /api/meal-slots
 * Create a new meal slot
 */
export const createMealSlotController = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedBody = createMealSlotSchema.safeParse(req.body);

		if (!validatedBody.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedBody.error.message}`,
			});
			return;
		}

		const result = await createMealSlot(validatedBody.data);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Meal slot created successfully",
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
 * POST /api/meal-slots/menu-mapping
 * Map menu items to a slot
 */
export const createSlotMenuMappingController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const validatedBody = createSlotMenuMappingSchema.safeParse(req.body);

		if (!validatedBody.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedBody.error.message}`,
			});
			return;
		}

		const result = await createSlotMenuMappings(validatedBody.data);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Slot menu mappings created successfully",
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
 * GET /api/meal-slots/menu-items
 * Get all available menu items
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
			message: "Menu items retrieved successfully",
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
