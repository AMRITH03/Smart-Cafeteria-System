import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MenuItemService } from "@/services/staff/MenuItemService";
import type { CreateMenuItemPayload, UpdateMenuItemPayload } from "@/types/staff/menuItem.types";

export function useMenuItems() {
	return useQuery({
		queryKey: ["menuItems"],
		queryFn: MenuItemService.getAll,
		staleTime: 30 * 1000,
	});
}

export function useCreateMenuItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateMenuItemPayload) => MenuItemService.create(payload),
		onSuccess: () => {
			toast.success("Menu item created successfully!");
			queryClient.invalidateQueries({ queryKey: ["menuItems"] });
		},
		onError: () => {
			toast.error("Failed to create menu item.");
		},
	});
}

export function useUpdateMenuItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: UpdateMenuItemPayload }) =>
			MenuItemService.update(id, payload),
		onSuccess: () => {
			toast.success("Menu item updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["menuItems"] });
		},
		onError: () => {
			toast.error("Failed to update menu item.");
		},
	});
}

export function useDeleteMenuItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => MenuItemService.delete(id),
		onSuccess: () => {
			toast.success("Menu item deleted successfully!");
			queryClient.invalidateQueries({ queryKey: ["menuItems"] });
		},
		onError: () => {
			toast.error("Failed to delete menu item.");
		},
	});
}
