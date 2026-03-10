import { service_client } from "../config/supabase";
import type {
	CreateMenuItemRequest,
	UpdateMenuItemRequest,
	MenuItemResponse,
} from "../interfaces/menuItem.types";
import { type ServiceResponse, STATUS } from "../interfaces/status.types";

const MENU_ITEM_SELECT_FIELDS =
	"menu_item_id, item_name, category, description, price, image_url, is_vegetarian";

/**
 * Get all menu items (selected fields only)
 */
export const getAllMenuItems = async (): Promise<ServiceResponse<MenuItemResponse[]>> => {
	try {
		const { data, error } = await service_client
			.from("menu_items")
			.select(MENU_ITEM_SELECT_FIELDS)
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

/**
 * Create a new menu item
 */
export const createMenuItem = async (
	menuItem: CreateMenuItemRequest
): Promise<ServiceResponse<MenuItemResponse>> => {
	try {
		const { data, error } = await service_client
			.from("menu_items")
			.insert(menuItem)
			.select(MENU_ITEM_SELECT_FIELDS)
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
			data: data as MenuItemResponse,
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
 * Update an existing menu item
 */
export const updateMenuItem = async (
	menuItemId: number,
	updates: UpdateMenuItemRequest
): Promise<ServiceResponse<MenuItemResponse>> => {
	try {
		const { data, error } = await service_client
			.from("menu_items")
			.update(updates)
			.eq("menu_item_id", menuItemId)
			.select(MENU_ITEM_SELECT_FIELDS)
			.single();

		if (error) {
			if (error.code === "PGRST116") {
				return {
					success: false,
					error: "Menu item not found",
					statusCode: STATUS.NOTFOUND,
				};
			}
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: data as MenuItemResponse,
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

/**
 * Delete a menu item by ID
 */
export const deleteMenuItem = async (menuItemId: number): Promise<ServiceResponse<null>> => {
	try {
		const { error } = await service_client
			.from("menu_items")
			.delete()
			.eq("menu_item_id", menuItemId);

		if (error) {
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: null,
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
