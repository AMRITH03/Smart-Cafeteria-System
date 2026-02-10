"use client";

import { useState, useRef, useEffect } from "react";
import { useMenuItems } from "@/src/hooks/menu/useMenuItems";
import { MenuItemCard } from "./MenuItemCard";
import { MenuItemSkeleton } from "./MenuItemSkeleton";
import { useCartStore } from "@/src/stores/cart.store";
import { useBookingStore } from "@/src/stores/booking.store";
import { useRouter } from "next/navigation";
import { ShoppingBag, UtensilsCrossed, Leaf, Search, SlidersHorizontal, X } from "lucide-react";
import type { MenuItemData } from "@/src/types/booking.types";

type VegFilter = "all" | "veg" | "non-veg";

const MEAL_PLACEHOLDERS: Record<string, string> = {
	breakfast: "Search breakfast items, eggs, toast...",
	lunch: "Search lunch items, rice, curry...",
	snack: "Search snacks, tea, samosa...",
	dinner: "Search dinner items, biryani, roti...",
};

export function MenuItemList() {
	const router = useRouter();
	const { mealType, slotId } = useBookingStore();
	const { data: items, isLoading, isError } = useMenuItems(slotId);
	const { items: cartItems, addItem, incrementItem, decrementItem } = useCartStore();
	const [vegFilter, setVegFilter] = useState<VegFilter>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const filterRef = useRef<HTMLDivElement>(null);

	// Close filter panel on outside click
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
				setIsFilterOpen(false);
			}
		}
		if (isFilterOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isFilterOpen]);

	if (isError) {
		return (
			<div className="p-8 text-center text-red-500 rounded-xl bg-red-50 border border-red-100">
				Failed to load menu. Please try again later.
			</div>
		);
	}

	const getItemQuantity = (id: number) => {
		return cartItems.find((i) => i.id === id)?.quantity || 0;
	};

	const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
	const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

	// Filter available items
	const availableItems = items?.filter((item) => item.is_available && item.is_slot_available) ?? [];

	// Apply search + vegetarian filter
	const filteredItems = availableItems.filter((item) => {
		// Veg filter
		if (vegFilter === "veg" && !item.is_vegetarian) return false;
		if (vegFilter === "non-veg" && item.is_vegetarian) return false;
		// Search filter
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			return (
				item.item_name.toLowerCase().includes(q) ||
				item.description.toLowerCase().includes(q) ||
				item.category.toLowerCase().includes(q)
			);
		}
		return true;
	});

	const handleAddItem = (item: MenuItemData) => {
		const cartItem = {
			id: item.menu_item_id,
			name: item.item_name.replace(/-/g, " "),
			price: item.price,
			image: item.image_url,
			quantity: 1,
		};
		addItem(cartItem);
	};

	const activeFilterCount = vegFilter !== "all" ? 1 : 0;
	const placeholder = MEAL_PLACEHOLDERS[mealType || ""] || "Search menu items...";

	return (
		<div className="space-y-5 pb-32">
			{/* Search Bar + Filter Button */}
			<div className="flex items-center gap-3">
				<div className="relative flex-1">
					<Search
						size={18}
						className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
					/>
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder={placeholder}
						className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
						>
							<X size={16} />
						</button>
					)}
				</div>

				{/* Filter Button */}
				<div className="relative" ref={filterRef}>
					<button
						onClick={() => setIsFilterOpen((prev) => !prev)}
						className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${
							isFilterOpen || activeFilterCount > 0
								? "border-blue-300 bg-blue-50 text-blue-700"
								: "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
						}`}
					>
						<SlidersHorizontal size={16} />
						<span>Filters</span>
						{activeFilterCount > 0 && (
							<span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
								{activeFilterCount}
							</span>
						)}
					</button>

					{/* Filter Dropdown Panel */}
					{isFilterOpen && (
						<div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
							<div className="flex items-center justify-between mb-3">
								<h4 className="text-sm font-semibold text-gray-900">Diet Preference</h4>
								{vegFilter !== "all" && (
									<button
										onClick={() => setVegFilter("all")}
										className="text-xs text-blue-600 hover:text-blue-800 font-medium"
									>
										Clear
									</button>
								)}
							</div>
							<div className="flex flex-col gap-2">
								{(
									[
										{ key: "all", label: "All Items", color: "blue", icon: false },
										{ key: "veg", label: "Vegetarian", color: "green", icon: true },
										{ key: "non-veg", label: "Non-Vegetarian", color: "red", icon: false },
									] as const
								).map(({ key, label, color, icon }) => {
									const isActive = vegFilter === key;
									return (
										<button
											key={key}
											onClick={() => {
												setVegFilter(key);
												if (key !== "all") setIsFilterOpen(false);
											}}
											className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-left ${
												isActive
													? color === "green"
														? "bg-green-50 text-green-700 border border-green-200"
														: color === "red"
															? "bg-red-50 text-red-700 border border-red-200"
															: "bg-blue-50 text-blue-700 border border-blue-200"
													: "bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100"
											}`}
										>
											{icon && (
												<Leaf size={15} className={isActive ? "text-green-600" : "text-gray-400"} />
											)}
											{!icon && key === "non-veg" && (
												<div
													className={`h-4 w-4 rounded border-2 ${isActive ? "border-red-500 bg-red-500" : "border-gray-300"}`}
												/>
											)}
											{!icon && key === "all" && (
												<div
													className={`h-4 w-4 rounded-full border-2 ${isActive ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}
												/>
											)}
											{label}
											{isActive && <span className="ml-auto text-xs">&#10003;</span>}
										</button>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Results count + active filter tag */}
			<div className="flex items-center gap-2 flex-wrap">
				<div className="flex items-center gap-2 text-gray-500">
					<UtensilsCrossed size={16} />
					<span className="text-sm">{filteredItems.length} items available</span>
				</div>
				{vegFilter !== "all" && (
					<button
						onClick={() => setVegFilter("all")}
						className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
							vegFilter === "veg" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
						}`}
					>
						{vegFilter === "veg" && <Leaf size={12} />}
						{vegFilter === "veg" ? "Vegetarian" : "Non-Vegetarian"}
						<X size={12} className="ml-0.5" />
					</button>
				)}
				{searchQuery.trim() && (
					<button
						onClick={() => setSearchQuery("")}
						className="flex items-center gap-1 rounded-full bg-gray-100 text-gray-600 px-2.5 py-1 text-xs font-medium"
					>
						&ldquo;{searchQuery}&rdquo;
						<X size={12} className="ml-0.5" />
					</button>
				)}
			</div>

			{/* Responsive Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				{isLoading ? (
					Array.from({ length: 6 }).map((_, i) => <MenuItemSkeleton key={i} />)
				) : filteredItems.length === 0 ? (
					<div className="col-span-full p-8 text-center text-gray-500 rounded-xl bg-gray-50 border border-gray-100">
						{searchQuery.trim()
							? `No items matching "${searchQuery}".`
							: vegFilter === "all"
								? "No menu items available for this slot."
								: `No ${vegFilter === "veg" ? "vegetarian" : "non-vegetarian"} items available.`}
					</div>
				) : (
					filteredItems.map((item) => (
						<MenuItemCard
							key={item.menu_item_id}
							item={item}
							quantity={getItemQuantity(item.menu_item_id)}
							onIncrement={(id) => {
								const exists = cartItems.find((i) => i.id === Number(id));
								if (exists) {
									incrementItem(Number(id));
								} else {
									handleAddItem(item);
								}
							}}
							onDecrement={(id) => decrementItem(Number(id))}
						/>
					))
				)}
			</div>

			{/* Floating Cart Bar */}
			{cartCount > 0 && (
				<div className="fixed bottom-6 left-4 right-4 z-50 max-w-3xl mx-auto">
					<button
						onClick={() => router.push("/checkout")}
						className="flex w-full items-center justify-between rounded-2xl bg-blue-600 p-4 text-white shadow-2xl shadow-blue-300 transition-all hover:bg-blue-700 active:scale-[0.98]"
					>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
								<ShoppingBag size={20} />
							</div>
							<div className="text-left">
								<p className="text-xs font-medium text-blue-100">{cartCount} items added</p>
								<p className="font-bold">Review Order</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="text-right">
								<p className="text-xs font-medium text-blue-100">Total</p>
								<p className="text-lg font-black">₹{cartTotal}</p>
							</div>
							<div className="flex items-center pl-3 border-l border-white/20">
								<span className="text-sm font-bold">Next →</span>
							</div>
						</div>
					</button>
				</div>
			)}
		</div>
	);
}
