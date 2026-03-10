import { apiGet, apiPost } from "@/lib/api";
import type {
	CreateMealSlotPayload,
	CreateMealSlotResponse,
	CreateSlotMenuMappingPayload,
	CreateSlotMenuMappingResponse,
	AllMenuItemsResponse,
} from "@/src/types/staff/mealSlot.types";

export const MealSlotService = {
	// Create a new meal slot
	createMealSlot: (payload: CreateMealSlotPayload): Promise<CreateMealSlotResponse> =>
		apiPost("api/meal-slots", payload),

	// Create slot-menu mappings
	createSlotMenuMapping: (
		payload: CreateSlotMenuMappingPayload
	): Promise<CreateSlotMenuMappingResponse> => apiPost("api/meal-slots/menu-mapping", payload),

	// Get all available menu items
	getAllMenuItems: (): Promise<AllMenuItemsResponse> => apiGet("api/meal-slots/menu-items"),
};
