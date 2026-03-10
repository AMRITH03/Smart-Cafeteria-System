import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import type {
	MenuItemsResponse,
	MenuItemResponse,
	CreateMenuItemPayload,
	UpdateMenuItemPayload,
} from "@/types/staff/menuItem.types";

export const MenuItemService = {
	getAll: (): Promise<MenuItemsResponse> => apiGet("/api/menu-items"),

	create: (payload: CreateMenuItemPayload): Promise<MenuItemResponse> =>
		apiPost("/api/menu-items", payload),

	update: (id: number, payload: UpdateMenuItemPayload): Promise<MenuItemResponse> =>
		apiPut(`/api/menu-items/${id}`, payload),

	delete: (id: number): Promise<{ success: boolean; message: string }> =>
		apiDelete(`/api/menu-items/${id}`),
};
