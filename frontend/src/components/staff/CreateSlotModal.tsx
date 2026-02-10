"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Search, Loader2, UtensilsCrossed } from "lucide-react";
import {
	useAllMenuItems,
	useCreateMealSlot,
	useCreateSlotMenuMapping,
} from "@/hooks/staff/useMealSlot";
import { createSlotFormSchema, type CreateSlotFormValues } from "@/src/validations/mealSlot.schema";
import type { SlotMenuMappingItem } from "@/src/types/staff/mealSlot.types";
import { MenuItemRow } from "./MenuItemRow";
import { MenuItemRowSkeleton } from "./MenuItemRowSkeleton";

interface CreateSlotModalProps {
	isOpen: boolean;
	onClose: () => void;
	mealType: string;
}

export function CreateSlotModal({ isOpen, onClose, mealType }: CreateSlotModalProps) {
	const today = new Date().toISOString().split("T")[0];

	// Form
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CreateSlotFormValues>({
		resolver: zodResolver(createSlotFormSchema),
		defaultValues: {
			slot_name: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Slot`,
			slot_date: today,
			start_time: "",
			end_time: "",
			max_capacity: 50,
		},
	});

	// Menu items state
	const [selectedItems, setSelectedItems] = useState<Map<number, number>>(new Map());
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");

	// Hooks
	const { data: menuItemsData, isLoading: isMenuLoading } = useAllMenuItems();
	const createSlotMutation = useCreateMealSlot();
	const createMappingMutation = useCreateSlotMenuMapping();

	const isSubmitting = createSlotMutation.isPending || createMappingMutation.isPending;

	// Menu items from API
	const menuItems = menuItemsData?.data || [];

	// Get unique categories
	const categories = useMemo(() => {
		const cats = new Set(menuItems.map((item) => item.category));
		return ["all", ...Array.from(cats)];
	}, [menuItems]);

	// Filtered items
	const filteredItems = useMemo(() => {
		return menuItems.filter((item) => {
			const matchesSearch =
				!searchQuery || item.item_name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
			return matchesSearch && matchesCategory;
		});
	}, [menuItems, searchQuery, categoryFilter]);

	// Toggle menu item selection
	const handleToggle = useCallback((menuItemId: number) => {
		setSelectedItems((prev) => {
			const next = new Map(prev);
			if (next.has(menuItemId)) {
				next.delete(menuItemId);
			} else {
				next.set(menuItemId, 1);
			}
			return next;
		});
	}, []);

	// Update quantity
	const handleQuantityChange = useCallback((menuItemId: number, quantity: number) => {
		setSelectedItems((prev) => {
			const next = new Map(prev);
			next.set(menuItemId, quantity);
			return next;
		});
	}, []);

	// Submit handler
	const onSubmit = async (formData: CreateSlotFormValues) => {
		if (selectedItems.size === 0) {
			return;
		}

		try {
			// Step 1: Create the meal slot
			const slotResult = await createSlotMutation.mutateAsync({
				slot_name: formData.slot_name,
				slot_date: formData.slot_date,
				start_time: formData.start_time,
				end_time: formData.end_time,
				max_capacity: formData.max_capacity,
			});

			const slotId = slotResult.data.slot_id;

			// Step 2: Create slot-menu mappings
			const items: SlotMenuMappingItem[] = Array.from(selectedItems.entries()).map(
				([menu_item_id, available_quantity]) => ({
					menu_item_id,
					available_quantity,
				})
			);

			await createMappingMutation.mutateAsync({
				slot_id: slotId,
				items,
			});

			// Cleanup & close
			reset();
			setSelectedItems(new Map());
			setSearchQuery("");
			setCategoryFilter("all");
			onClose();
		} catch {
			// Errors handled by mutation callbacks
		}
	};

	// Close & reset
	const handleClose = () => {
		if (!isSubmitting) {
			reset();
			setSelectedItems(new Map());
			setSearchQuery("");
			setCategoryFilter("all");
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
			{/* Backdrop */}
			<button
				type="button"
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={handleClose}
				aria-label="Close modal"
			/>

			{/* Modal */}
			<div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-gray-50/80">
					<div>
						<h2 className="text-lg sm:text-xl font-bold text-gray-900">
							Create {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Slot
						</h2>
						<p className="text-xs sm:text-sm text-gray-500">
							Set up a meal slot and assign menu items
						</p>
					</div>
					<button
						onClick={handleClose}
						disabled={isSubmitting}
						className="p-2 hover:bg-gray-200 rounded-full transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				{/* Scrollable body */}
				<div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5">
					{/* ———— Slot Details Section ———— */}
					<div>
						<h3 className="text-sm font-semibold text-gray-700 mb-3">Slot Details</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{/* Slot Name */}
							<div className="sm:col-span-2">
								<label htmlFor="slot_name" className="block text-xs font-medium text-gray-600 mb-1">
									Slot Name
								</label>
								<input
									id="slot_name"
									{...register("slot_name")}
									className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
									placeholder="e.g. Breakfast Slot A"
								/>
								{errors.slot_name && (
									<p className="text-xs text-red-500 mt-1">{errors.slot_name.message}</p>
								)}
							</div>

							{/* Date */}
							<div>
								<label htmlFor="slot_date" className="block text-xs font-medium text-gray-600 mb-1">
									Slot Date
								</label>
								<input
									id="slot_date"
									type="date"
									{...register("slot_date")}
									className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								/>
								{errors.slot_date && (
									<p className="text-xs text-red-500 mt-1">{errors.slot_date.message}</p>
								)}
							</div>

							{/* Max Capacity */}
							<div>
								<label
									htmlFor="max_capacity"
									className="block text-xs font-medium text-gray-600 mb-1"
								>
									Max Capacity
								</label>
								<input
									id="max_capacity"
									type="number"
									{...register("max_capacity")}
									className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
									placeholder="50"
								/>
								{errors.max_capacity && (
									<p className="text-xs text-red-500 mt-1">{errors.max_capacity.message}</p>
								)}
							</div>

							{/* Start Time */}
							<div>
								<label
									htmlFor="start_time"
									className="block text-xs font-medium text-gray-600 mb-1"
								>
									Start Time
								</label>
								<input
									id="start_time"
									type="time"
									{...register("start_time")}
									className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								/>
								{errors.start_time && (
									<p className="text-xs text-red-500 mt-1">{errors.start_time.message}</p>
								)}
							</div>

							{/* End Time */}
							<div>
								<label htmlFor="end_time" className="block text-xs font-medium text-gray-600 mb-1">
									End Time
								</label>
								<input
									id="end_time"
									type="time"
									{...register("end_time")}
									className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								/>
								{errors.end_time && (
									<p className="text-xs text-red-500 mt-1">{errors.end_time.message}</p>
								)}
							</div>
						</div>
					</div>

					{/* Separator */}
					<hr className="border-gray-200" />

					{/* ———— Menu Items Section ———— */}
					<div>
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-sm font-semibold text-gray-700">Assign Menu Items</h3>
							{selectedItems.size > 0 && (
								<span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
									{selectedItems.size} selected
								</span>
							)}
						</div>

						{/* Search & filter */}
						<div className="flex flex-col sm:flex-row gap-2 mb-3">
							<div className="relative flex-1">
								<Search
									size={16}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
								/>
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search menu items..."
									className="w-full h-9 pl-9 pr-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								/>
							</div>
							<select
								value={categoryFilter}
								onChange={(e) => setCategoryFilter(e.target.value)}
								className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white capitalize"
							>
								{categories.map((cat) => (
									<option key={cat} value={cat} className="capitalize">
										{cat === "all" ? "All Categories" : cat}
									</option>
								))}
							</select>
						</div>

						{/* Menu items list */}
						<div className="space-y-2 max-h-52 sm:max-h-64 overflow-y-auto pr-1">
							{isMenuLoading ? (
								Array.from({ length: 5 }).map((_, i) => <MenuItemRowSkeleton key={i} />)
							) : filteredItems.length === 0 ? (
								<div className="text-center py-8">
									<UtensilsCrossed size={32} className="mx-auto text-gray-300 mb-2" />
									<p className="text-sm text-gray-500">No menu items found</p>
								</div>
							) : (
								filteredItems.map((item) => (
									<MenuItemRow
										key={item.menu_item_id}
										item={item}
										isSelected={selectedItems.has(item.menu_item_id)}
										quantity={selectedItems.get(item.menu_item_id) || 1}
										onToggle={handleToggle}
										onQuantityChange={handleQuantityChange}
									/>
								))
							)}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t bg-gray-50/80">
					<button
						type="button"
						onClick={handleClose}
						disabled={isSubmitting}
						className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleSubmit(onSubmit)}
						disabled={isSubmitting || selectedItems.size === 0}
						className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						{isSubmitting && <Loader2 size={16} className="animate-spin" />}
						{isSubmitting ? "Creating..." : "Create Slot"}
					</button>
				</div>
			</div>
		</div>
	);
}
