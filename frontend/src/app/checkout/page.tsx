"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { useBookingStore } from "@/src/stores/booking.store";
import { GroupMemberSearch } from "@/src/components/bookings/GroupMemberSearch";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
	const router = useRouter();
	const { items, totalAmount } = useCartStore();
	const { token } = useAuthStore();
	const { slotId, groupMembers, getSelectedSlot } = useBookingStore();

	// Check if this is a booking edit flow
	const [editBookingId, setEditBookingId] = useState<number | null>(null);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setHydrated(true);
		try {
			const editContextStr = sessionStorage.getItem("booking_edit_context");
			if (editContextStr) {
				const editContext = JSON.parse(editContextStr);
				if (editContext.bookingId) {
					setEditBookingId(editContext.bookingId);
				}
			}
		} catch {
			// ignore
		}
	}, []);

	if (!hydrated) {
		return <div className="p-8 text-center text-gray-500">Loading checkout...</div>;
	}

	const isEditMode = editBookingId !== null && editBookingId > 0;

	const handleCheckout = () => {
		if (!token) {
			toast.error("Please login to proceed");
			router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
			return;
		}

		if (items.length === 0) {
			toast.error("Your cart is empty.");
			return;
		}

		if (isEditMode) {
			// Redirect to booking update confirmation
			router.replace(`/booking-update-confirmation?bookingId=${editBookingId}`);
			return;
		}

		if (!slotId) {
			toast.error("No slot selected. Please go back and select a slot.");
			return;
		}

		const slot = getSelectedSlot();
		if (!slot) {
			toast.error("Selected slot not found. Please go back and re-select.");
			return;
		}

		if (groupMembers.length > 5) {
			toast.error("Cannot add more than 5 additional group members.");
			return;
		}

		router.replace("/booking-confirmation");
	};

	return (
		<div className="mx-auto max-w-xl space-y-6 p-4 pb-20">
			{/* Header */}
			<div className="flex items-center gap-4">
				<button
					onClick={() => router.back()}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors"
				>
					<ArrowLeft size={20} />
				</button>
				<h2 className="text-2xl font-bold text-gray-900">
					{isEditMode ? "Update Order" : "Checkout"}
				</h2>
				{isEditMode && (
					<span className="ml-auto px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
						Editing Booking
					</span>
				)}
			</div>

			{/* Order Summary */}
			<div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
				<div className="bg-gray-50 px-6 py-4 border-b">
					<h3 className="text-lg font-bold text-gray-800">Order Summary</h3>
				</div>

				{/* Column Headers */}
				<div className="px-6 pt-4 pb-2">
					<div className="grid grid-cols-12 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
						<span className="col-span-5">Item</span>
						<span className="col-span-2 text-center">Qty</span>
						<span className="col-span-2 text-right">Price</span>
						<span className="col-span-3 text-right">Total</span>
					</div>
				</div>

				{/* Items */}
				<div className="px-6 divide-y divide-gray-100">
					{items.map((item) => (
						<div key={item.id} className="grid grid-cols-12 items-center py-3 text-sm">
							<span className="col-span-5 font-medium text-gray-900 truncate pr-2">
								{item.name}
							</span>
							<span className="col-span-2 text-center">
								<span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-gray-100 text-xs font-bold text-gray-700">
									{item.quantity}
								</span>
							</span>
							<span className="col-span-2 text-right text-gray-500">₹{item.price}</span>
							<span className="col-span-3 text-right font-semibold text-gray-900">
								₹{(item.price * item.quantity).toFixed(2)}
							</span>
						</div>
					))}
				</div>

				{/* Total */}
				<div className="bg-gray-50 px-6 py-4 mt-2 border-t">
					<div className="flex justify-between items-center">
						<span className="text-base font-bold text-gray-900">Total Amount</span>
						<span className="text-xl font-black text-blue-600">₹{totalAmount().toFixed(2)}</span>
					</div>
					<p className="text-[11px] text-gray-400 mt-1">
						{items.length} item{items.length !== 1 ? "s" : ""} &middot;{" "}
						{items.reduce((sum, i) => sum + i.quantity, 0)} unit
						{items.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? "s" : ""}
					</p>
				</div>
			</div>

			{/* Add Group Members (hidden in edit mode) */}
			{!isEditMode && <GroupMemberSearch />}

			{/* Confirm Button */}
			<button
				onClick={handleCheckout}
				className="w-full rounded-2xl bg-blue-600 p-5 text-xl font-black text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-[0.98] flex items-center justify-center gap-2"
			>
				{isEditMode ? "Update Order" : "Confirm Order"}
			</button>
		</div>
	);
}
