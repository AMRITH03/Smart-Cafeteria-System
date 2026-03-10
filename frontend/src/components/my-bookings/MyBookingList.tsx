"use client";

import { useState, useMemo } from "react";
import { useMyBookings } from "@/src/hooks/myBookings/useMyBookings";
import { useSettleBill } from "@/src/hooks/wallet/useWallet";
import { MyBookingCard } from "./MyBookingCard";
import { MyBookingCardSkeleton } from "./MyBookingCardSkeleton";
import { MyBookingSearchBar } from "./MyBookingSearchBar";
import { AddMoneyModal } from "./detail/AddMoneyModal";
import type { MyBookingStatus, MyBooking } from "@/src/types/myBookings.types";

function formatDateForSearch(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("en-IN", {
		weekday: "short",
		day: "numeric",
		month: "short",
	});
}

function formatTimeForSearch(time: string): string {
	const [hours, minutes] = time.split(":");
	const h = Number(hours);
	const suffix = h >= 12 ? "PM" : "AM";
	const displayHour = h % 12 || 12;
	return `${displayHour}:${minutes} ${suffix}`;
}

function matchesSearch(booking: MyBooking, query: string): boolean {
	if (!query) return true;
	const q = query.toLowerCase();

	const slotDate = booking.slot?.slot_date ?? booking.meal_slots?.slot_date ?? "";
	const slotName = booking.slot?.slot_name ?? booking.meal_slots?.slot_name ?? "";
	const startTime = booking.slot?.start_time ?? booking.meal_slots?.start_time ?? "";

	const searchFields = [
		booking.booking_reference,
		String(booking.group_size),
		booking.booking_status.replace(/_/g, " "),
		String(booking.total_amount),
		slotDate,
		formatDateForSearch(slotDate),
		slotName,
		startTime,
		formatTimeForSearch(startTime),
	];

	return searchFields.some((field) => field.toLowerCase().includes(q));
}

export function MyBookingList() {
	const { data: bookings, isLoading, error } = useMyBookings();
	const {
		mutateAsync: settleBill,
		isPending: isSettling,
		variables: settlingBookingId,
	} = useSettleBill();

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<MyBookingStatus | "all">("all");
	const [slotFilter, setSlotFilter] = useState("all");
	const [addMoneyTarget, setAddMoneyTarget] = useState<{
		bookingId: number;
		totalAmount: number;
		walletBalance: number;
	} | null>(null);

	const filteredBookings = useMemo(() => {
		if (!bookings) return [];
		return bookings.filter((booking) => {
			if (!matchesSearch(booking, searchQuery)) return false;
			if (statusFilter !== "all" && booking.booking_status !== statusFilter) return false;
			const bSlotName = booking.slot?.slot_name ?? booking.meal_slots?.slot_name ?? "";
			if (slotFilter !== "all" && bSlotName.toLowerCase() !== slotFilter.toLowerCase())
				return false;
			return true;
		});
	}, [bookings, searchQuery, statusFilter, slotFilter]);

	if (isLoading) {
		return (
			<div className="space-y-4">
				{/* Skeleton search bar */}
				<div className="h-11 rounded-xl bg-gray-100 animate-pulse" />
				<div className="space-y-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<MyBookingCardSkeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	if (error || !bookings) {
		return (
			<div className="p-6 text-center text-red-500 bg-white rounded-xl shadow">
				Failed to load bookings. Please try again.
			</div>
		);
	}

	if (bookings.length === 0) {
		return (
			<div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow">
				<p className="text-lg font-semibold">No bookings yet</p>
				<p className="text-sm mt-1">Your bookings will appear here once you make one.</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<MyBookingSearchBar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				statusFilter={statusFilter}
				onStatusChange={setStatusFilter}
				slotFilter={slotFilter}
				onSlotChange={setSlotFilter}
			/>

			{filteredBookings.length === 0 ? (
				<div className="p-8 text-center text-gray-400 bg-white rounded-xl border">
					<p className="font-semibold">No bookings match your search</p>
					<p className="text-sm mt-1">Try adjusting your search terms or filters.</p>
				</div>
			) : (
				<div className="space-y-3">
					{filteredBookings.map((booking) => {
						const slot = booking.slot ?? booking.meal_slots;
						return (
							<MyBookingCard
								key={booking.booking_id}
								bookingId={booking.booking_id}
								bookingReference={booking.booking_reference}
								groupSize={booking.group_size}
								bookingStatus={booking.booking_status}
								totalAmount={booking.total_amount}
								walletBalance={booking.wallet_balance}
								slotDate={slot?.slot_date ?? ""}
								slotName={slot?.slot_name ?? ""}
								startTime={slot?.start_time ?? ""}
								paymentWindowStart={slot?.payment_window_start ?? ""}
								paymentWindowEnd={slot?.payment_window_end ?? ""}
								onAddMoney={() =>
									setAddMoneyTarget({
										bookingId: booking.booking_id,
										totalAmount: booking.total_amount,
										walletBalance: booking.wallet_balance,
									})
								}
								onPayBill={() => settleBill(booking.booking_id)}
								isSettling={isSettling && settlingBookingId === booking.booking_id}
							/>
						);
					})}
				</div>
			)}

			{/* Results count */}
			<p className="text-xs text-gray-400 text-center pt-1">
				Showing {filteredBookings.length} of {bookings.length} booking
				{bookings.length !== 1 ? "s" : ""}
			</p>

			{/* Add Money Modal */}
			{addMoneyTarget && (
				<AddMoneyModal
					bookingId={addMoneyTarget.bookingId}
					totalAmount={addMoneyTarget.totalAmount}
					bookingWalletBalance={addMoneyTarget.walletBalance}
					onClose={() => setAddMoneyTarget(null)}
				/>
			)}
		</div>
	);
}
