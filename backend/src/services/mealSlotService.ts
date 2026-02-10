import { service_client } from "../config/supabase";
import type {
	CreateMealSlotRequest,
	CreateSlotMenuMappingRequest,
	CreateMealSlotResponse,
	SlotMenuMappingResponse,
	MenuItemResponse,
} from "../interfaces/mealSlot.types";
import { type ServiceResponse, STATUS } from "../interfaces/status.types";

/**
 * Subtract minutes from a time string (HH:MM or HH:MM:SS)
 */
function subtractMinutes(time: string, minutes: number): string {
	const parts = time.split(":");
	const hours = parseInt(parts[0], 10);
	const mins = parseInt(parts[1], 10);

	const totalMinutes = hours * 60 + mins - minutes;
	const newHours = Math.floor((((totalMinutes % 1440) + 1440) % 1440) / 60);
	const newMins = ((totalMinutes % 60) + 60) % 60;

	return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}:00`;
}

/**
 * Create a new meal slot
 */
export const createMealSlot = async (
	request: CreateMealSlotRequest
): Promise<ServiceResponse<CreateMealSlotResponse>> => {
	try {
		const paymentWindowStart = subtractMinutes(request.start_time, 30);
		const paymentWindowEnd = `${request.start_time.substring(0, 5)}:00`;

		const { data, error } = await service_client
			.from("meal_slots")
			.insert({
				slot_name: request.slot_name,
				slot_date: request.slot_date,
				start_time: request.start_time,
				end_time: request.end_time,
				max_capacity: request.max_capacity,
				current_occupancy: 0,
				is_active: true,
				payment_window_start: paymentWindowStart,
				payment_window_end: paymentWindowEnd,
			})
			.select(
				"slot_id, slot_name, slot_date, start_time, end_time, max_capacity, payment_window_start, payment_window_end"
			)
			.single();

		if (error) {
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: data as CreateMealSlotResponse,
			statusCode: STATUS.CREATED,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Create slot-menu mappings for a given slot
 */
export const createSlotMenuMappings = async (
	request: CreateSlotMenuMappingRequest
): Promise<ServiceResponse<SlotMenuMappingResponse[]>> => {
	try {
		// Verify the slot exists
		const { data: slotData, error: slotError } = await service_client
			.from("meal_slots")
			.select("slot_id")
			.eq("slot_id", request.slot_id)
			.single();

		if (slotError || !slotData) {
			return {
				success: false,
				error: "Meal slot not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		const mappings = request.items.map((item) => ({
			slot_id: request.slot_id,
			menu_item_id: item.menu_item_id,
			available_quantity: item.available_quantity,
			reserved_quantity: 0,
			consumed_quantity: 0,
			leftover_quantity: item.available_quantity,
			is_available: true,
		}));

		const { data, error } = await service_client
			.from("slot_menu_mapping")
			.insert(mappings)
			.select("*");

		if (error) {
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: data as SlotMenuMappingResponse[],
			statusCode: STATUS.CREATED,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Get all menu items
 */
export const getAllMenuItems = async (): Promise<ServiceResponse<MenuItemResponse[]>> => {
	try {
		const { data, error } = await service_client
			.from("menu_items")
			.select("*")
			.eq("is_available", true)
			.order("category", { ascending: true })
			.order("item_name", { ascending: true });

		if (error) {
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: data as MenuItemResponse[],
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};
