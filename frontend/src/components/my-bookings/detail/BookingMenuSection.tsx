"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { UtensilsCrossed, Pencil, Leaf } from "lucide-react";
import type { MyBookingMenuItem } from "@/src/types/myBookings.types";

interface Props {
	bookingId: number;
	menuItems: MyBookingMenuItem[];
	slotId: number;
	slotName: string;
	isEditable: boolean;
}

function getMealTypeFromSlotName(slotName: string): string {
	const lower = slotName.toLowerCase();
	if (lower.includes("breakfast")) return "breakfast";
	if (lower.includes("lunch")) return "lunch";
	if (lower.includes("snack")) return "snack";
	if (lower.includes("dinner")) return "dinner";
	return "lunch";
}

export function BookingMenuSection({ bookingId, menuItems, slotId, slotName, isEditable }: Props) {
	const router = useRouter();

	const handleEditMeals = () => {
		// Store booking context for edit flow
		sessionStorage.setItem(
			"booking_edit_context",
			JSON.stringify({
				bookingId,
				slotId,
				slotName,
				currentMenuItems: menuItems.map((item) => ({
					menu_item_id: item.menu_item_id,
					quantity: item.quantity,
					name: item.menu_items?.item_name,
					price: item.unit_price,
				})),
			})
		);

		const mealType = getMealTypeFromSlotName(slotName);
		router.push(`/menu?type=${mealType}&edit_booking=${bookingId}`);
	};

	const totalItemsAmount = menuItems.reduce((sum, item) => sum + item.subtotal, 0);

	return (
		<div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
			<div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
				<div className="flex items-center gap-2">
					<UtensilsCrossed size={18} className="text-orange-500" />
					<h3 className="text-base font-bold text-gray-800">Menu Items ({menuItems.length})</h3>
				</div>
				{isEditable && (
					<button
						onClick={handleEditMeals}
						className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
					>
						<Pencil size={12} />
						Edit Meals
					</button>
				)}
			</div>

			<div className="divide-y divide-gray-100">
				{menuItems.map((item) => (
					<div key={item.id ?? item.menu_item_id} className="flex items-center gap-4 px-6 py-4">
						{/* Image */}
						<div className="relative shrink-0">
							{item.menu_items?.image_url ? (
								<Image
									src={item.menu_items.image_url}
									alt={item.menu_items.item_name}
									width={56}
									height={56}
									className="h-14 w-14 rounded-xl object-cover border"
								/>
							) : (
								<div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center">
									<UtensilsCrossed size={20} className="text-gray-300" />
								</div>
							)}
							{item.menu_items?.is_vegetarian && (
								<div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
									<Leaf size={8} className="text-white" />
								</div>
							)}
						</div>

						{/* Details */}
						<div className="flex-1 min-w-0">
							<p className="text-sm font-semibold text-gray-900 truncate">
								{item.menu_items?.item_name ?? "Unknown Item"}
							</p>
							<p className="text-xs text-gray-400 truncate">
								{item.menu_items?.category ?? ""} · ₹{item.unit_price.toFixed(2)} × {item.quantity}
							</p>
						</div>

						{/* Subtotal */}
						<div className="text-right shrink-0">
							<p className="text-sm font-bold text-gray-900">₹{item.subtotal.toFixed(2)}</p>
							<p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
						</div>
					</div>
				))}
			</div>

			{/* Total */}
			<div className="bg-gray-50 px-6 py-3 border-t flex justify-between items-center">
				<span className="text-xs font-bold text-gray-500">Menu Total</span>
				<span className="text-base font-black text-gray-900">₹{totalItemsAmount.toFixed(2)}</span>
			</div>
		</div>
	);
}
