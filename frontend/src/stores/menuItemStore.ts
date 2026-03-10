import { create } from "zustand";
import type { MenuItem } from "@/types/staff/menuItem.types";

interface MenuItemStoreState {
	isCreateModalOpen: boolean;
	editTarget: MenuItem | null;
	deleteTarget: MenuItem | null;
	openCreateModal: () => void;
	closeCreateModal: () => void;
	setEditTarget: (item: MenuItem | null) => void;
	setDeleteTarget: (item: MenuItem | null) => void;
}

export const useMenuItemStore = create<MenuItemStoreState>((set) => ({
	isCreateModalOpen: false,
	editTarget: null,
	deleteTarget: null,
	openCreateModal: () => set({ isCreateModalOpen: true }),
	closeCreateModal: () => set({ isCreateModalOpen: false }),
	setEditTarget: (item) => set({ editTarget: item }),
	setDeleteTarget: (item) => set({ deleteTarget: item }),
}));
