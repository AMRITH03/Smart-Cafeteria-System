export interface MenuItem {
	menu_item_id: number;
	item_name: string;
	category: string;
	description: string | null;
	price: number;
	image_url: string | null;
	is_vegetarian: boolean;
}

export interface MenuItemsResponse {
	success: boolean;
	data: MenuItem[];
}

export interface MenuItemResponse {
	success: boolean;
	data: MenuItem;
}

export interface CreateMenuItemPayload {
	item_name: string;
	category: string;
	description?: string;
	price: number;
	image_url?: string;
	is_vegetarian?: boolean;
	is_available?: boolean;
	total_stock?: number;
}

export interface UpdateMenuItemPayload {
	item_name?: string;
	category?: string;
	description?: string | null;
	price?: number;
	image_url?: string | null;
	is_vegetarian?: boolean;
	is_available?: boolean;
	total_stock?: number;
}
