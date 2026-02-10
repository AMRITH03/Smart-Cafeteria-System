"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MenuItemList } from "@/src/components/menu/MenuItemList";
import { useBookingStore } from "@/src/stores/booking.store";
import { useCartStore } from "@/stores/cart.store";
import { ArrowLeft } from "lucide-react";

function MenuPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { mealType, slotId, setMealType, setSlot, setAvailableSlots } = useBookingStore();
	const { addItem, incrementItem, clearCart, items: cartItems } = useCartStore();

	const editBookingId = searchParams.get("edit_booking");
	const typeParam = searchParams.get("type");

	// Wait for Zustand persist hydration before checking store values
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => {
		setHydrated(true);
	}, []);

	// If in edit mode, set up the booking store from session storage context
	useEffect(() => {
		if (!hydrated || !editBookingId) return;

		try {
			const editContextStr = sessionStorage.getItem("booking_edit_context");
			if (editContextStr) {
				const editContext = JSON.parse(editContextStr);

				// Set the slot in the booking store
				if (editContext.slotId) {
					if (typeParam) {
						setMealType(typeParam as "breakfast" | "lunch" | "snack" | "dinner");
					}
					setSlot(String(editContext.slotId));

					// We need to provide a minimal available slot so the menu can load
					setAvailableSlots([
						{
							slot_id: editContext.slotId,
							slot_name: editContext.slotName || "",
							slot_date: "",
							start_time: "",
							end_time: "",
							max_capacity: 0,
							current_occupancy: 0,
							is_active: true,
							payment_window_start: "",
							payment_window_end: "",
							created_at: "",
							remaining_capacity: 0,
							is_full: false,
							occupancy_percentage: 0,
						},
					]);
				}

				// Pre-populate the cart with existing menu items
				if (editContext.currentMenuItems && cartItems.length === 0) {
					clearCart();
					for (const item of editContext.currentMenuItems) {
						// Add the item once (quantity = 1)
						addItem({
							id: item.menu_item_id,
							name: item.name || "Menu Item",
							price: item.price || 0,
							image: "",
						});
						// Increment to reach the desired quantity
						for (let i = 1; i < item.quantity; i++) {
							incrementItem(item.menu_item_id);
						}
					}
				}
			}
		} catch {
			// ignore
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hydrated, editBookingId]);

	if (!hydrated) {
		return <div className="p-8 text-center text-gray-500">Loading menu...</div>;
	}

	// Protective redirect: Must have a slot to see menu (unless in edit mode)
	if (!slotId && !editBookingId) {
		return (
			<div className="p-8 text-center space-y-4">
				<p className="text-gray-600">Please select a time slot first.</p>
				<button
					onClick={() => router.push(`/slots?type=${mealType || "breakfast"}`)}
					className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold"
				>
					Go back to Slots
				</button>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl p-4 md:p-6 space-y-6">
			<header className="flex items-center gap-4">
				<button
					onClick={() => {
						if (editBookingId) {
							clearCart();
							router.push(`/my-bookings/${editBookingId}`);
						} else {
							router.back();
						}
					}}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors"
				>
					<ArrowLeft size={24} />
				</button>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 capitalize">
						{typeParam || mealType} Menu
					</h1>
					<p className="text-gray-500">
						{editBookingId ? "Edit your meal order" : "Add items to your cart"}
					</p>
				</div>
				{editBookingId && (
					<span className="ml-auto px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
						Editing
					</span>
				)}
			</header>

			<Suspense
				fallback={<div className="p-8 text-center text-gray-500">Loading delicious food...</div>}
			>
				<MenuItemList />
			</Suspense>
		</div>
	);
}
export default function MenuPage() {
	return (
		<Suspense fallback={<div className="p-8 text-center text-gray-500">Loading menu...</div>}>
			<MenuPageContent />
		</Suspense>
	);
}
