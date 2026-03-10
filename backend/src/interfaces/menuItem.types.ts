// Request Types
export interface CreateMenuItemRequest {
	item_name: string;
	category: string;
	description?: string;
	price: number;
	image_url?: string;
	is_vegetarian?: boolean;
	is_available?: boolean;
	total_stock?: number;
}

export interface UpdateMenuItemRequest {
	item_name?: string;
	category?: string;
	description?: string | null;
	price?: number;
	image_url?: string | null;
	is_vegetarian?: boolean;
	is_available?: boolean;
	total_stock?: number;
}

// Response Types
export interface MenuItemResponse {
	menu_item_id: number;
	item_name: string;
	category: string;
	description: string | null;
	price: number;
	image_url: string | null;
	is_vegetarian: boolean;
}
