import { Router } from "express";
import {
	createMealSlotController,
	createSlotMenuMappingController,
	getAllMenuItemsController,
} from "../controllers/mealSlotController";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * GET /api/meal-slots/menu-items
 * Get all available menu items
 */
router.get("/menu-items", getAllMenuItemsController);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

/**
 * POST /api/meal-slots
 * Create a new meal slot
 */
router.post("/", requireAuth, createMealSlotController);

/**
 * POST /api/meal-slots/menu-mapping
 * Map menu items to a slot
 */
router.post("/menu-mapping", requireAuth, createSlotMenuMappingController);

export default router;
