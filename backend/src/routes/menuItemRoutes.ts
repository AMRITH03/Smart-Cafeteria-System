import { Router } from "express";
import {
	getAllMenuItemsController,
	createMenuItemController,
	updateMenuItemController,
	deleteMenuItemController,
} from "../controllers/menuItemController";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

/**
 * GET /api/menu-items
 * Get all menu items
 */
router.get("/", requireAuth, getAllMenuItemsController);

/**
 * POST /api/menu-items
 * Create a new menu item
 */
router.post("/", requireAuth, createMenuItemController);

/**
 * PUT /api/menu-items/:id
 * Update an existing menu item
 */
router.put("/:id", requireAuth, updateMenuItemController);

/**
 * DELETE /api/menu-items/:id
 * Delete a menu item
 */
router.delete("/:id", requireAuth, deleteMenuItemController);

export default router;
