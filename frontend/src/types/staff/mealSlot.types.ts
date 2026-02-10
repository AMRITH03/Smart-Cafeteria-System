// Types for meal slot management (staff)

export interface CreateMealSlotPayload {
	slot_name: string;
	slot_date: string;
	start_time: string;
	end_time: string;
	max_capacity: number;
}

export interface CreateMealSlotResponse {
	success: boolean;
	message: string;
	data: {
		slot_id: number;
		slot_name: string;
		slot_date: string;
		start_time: string;
		end_time: string;
		max_capacity: number;
		payment_window_start: string;
		payment_window_end: string;
	};
}

export interface SlotMenuMappingItem {
	menu_item_id: number;
	available_quantity: number;
}

export interface CreateSlotMenuMappingPayload {
	slot_id: number;
	items: SlotMenuMappingItem[];
}

export interface CreateSlotMenuMappingResponse {
	success: boolean;
	message: string;
	data: {
		mapping_id: number;
		slot_id: number;
		menu_item_id: number;
		available_quantity: number;
		reserved_quantity: number;
		consumed_quantity: number;
		leftover_quantity: number;
		is_available: boolean;
	}[];
}

export interface MenuItemFromDB {
	menu_item_id: number;
	item_name: string;
	category: string;
	description: string | null;
	price: number;
	image_url: string | null;
	is_vegetarian: boolean;
	is_available: boolean;
	created_at: string;
	total_stock: number;
}

export interface AllMenuItemsResponse {
	success: boolean;
	message: string;
	data: MenuItemFromDB[];
}
