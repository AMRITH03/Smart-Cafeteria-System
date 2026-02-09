"use client";

import Link from "next/link";
import { useStaffSlots } from "@/hooks/staff/useStaffSlots";
import { Clock, Users, Calendar, CreditCard, AlertCircle } from "lucide-react";

interface StaffSlotListProps {
	mealType: string;
}

// Dumb component: StaffSlotCard
interface StaffSlotCardProps {
	slot: {
		slot_id: number;
		slot_name: string;
		slot_date: string;
		start_time: string;
		end_time: string;
		max_capacity: number;
		current_occupancy: number;
		is_active: boolean;
		payment_window_start: string;
		payment_window_end: string;
		remaining_capacity: number;
		is_full: boolean;
		occupancy_percentage: number;
	};
}

function StaffSlotCard({ slot }: StaffSlotCardProps) {
	const formatTime = (time: string) => {
		const [hours, minutes] = time.split(":");
		const hour = parseInt(hours, 10);
		const ampm = hour >= 12 ? "PM" : "AM";
		const formattedHour = hour % 12 || 12;
		return `${formattedHour}:${minutes} ${ampm}`;
	};

	const getStatusColor = () => {
		if (slot.is_full) return "bg-red-100 text-red-700 border-red-200";
		if (slot.is_active) return "bg-green-100 text-green-700 border-green-200";
		return "bg-gray-100 text-gray-700 border-gray-200";
	};

	const getStatusLabel = () => {
		if (slot.is_full) return "Full";
		if (slot.is_active) return "Active";
		return "Inactive";
	};

	const getOccupancyColor = () => {
		if (slot.occupancy_percentage > 80) return "bg-red-500";
		if (slot.occupancy_percentage > 50) return "bg-yellow-500";
		return "bg-blue-500";
	};

	return (
		<Link
			href={`/staff/slots/${slot.slot_id}`}
			className="block bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all p-5 group"
		>
			<div className="flex items-start justify-between gap-4">
				{/* Left section */}
				<div className="flex-1">
					<div className="flex items-center gap-3 mb-3">
						<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
							<Clock size={20} />
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
								{slot.slot_name}
							</h3>
							<div className="flex items-center gap-2 text-sm text-gray-500">
								<span>
									{formatTime(slot.start_time)} - {formatTime(slot.end_time)}
								</span>
							</div>
						</div>
					</div>

					{/* Date and Payment Window */}
					<div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
						<div className="flex items-center gap-1">
							<Calendar size={14} />
							<span>
								{new Date(slot.slot_date).toLocaleDateString("en-US", {
									weekday: "short",
									month: "short",
									day: "numeric",
								})}
							</span>
						</div>
						<div className="flex items-center gap-1">
							<CreditCard size={14} />
							<span>
								Payment: {formatTime(slot.payment_window_start)} -{" "}
								{formatTime(slot.payment_window_end)}
							</span>
						</div>
					</div>

					{/* Progress bar */}
					<div>
						<div className="flex items-center justify-between text-sm mb-1">
							<span className="text-gray-600">Occupancy</span>
							<span className="font-medium text-gray-900">
								{slot.current_occupancy} / {slot.max_capacity} ({slot.occupancy_percentage}%)
							</span>
						</div>
						<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
							<div
								className={`h-full rounded-full transition-all ${getOccupancyColor()}`}
								style={{ width: `${slot.occupancy_percentage}%` }}
							/>
						</div>
					</div>
				</div>

				{/* Right section */}
				<div className="flex flex-col items-end gap-2">
					<span
						className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor()}`}
					>
						{getStatusLabel()}
					</span>
					<div className="flex items-center gap-1 text-sm text-gray-500">
						<Users size={14} />
						<span>{slot.remaining_capacity} available</span>
					</div>
					{slot.is_full && (
						<div className="flex items-center gap-1 text-xs text-red-500">
							<AlertCircle size={12} />
							<span>Slot Full</span>
						</div>
					)}
				</div>
			</div>
		</Link>
	);
}

// Skeleton component
function StaffSlotCardSkeleton() {
	return (
		<div className="bg-white rounded-2xl border shadow-sm p-5 animate-pulse">
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-10 h-10 bg-gray-200 rounded-lg" />
						<div>
							<div className="h-5 bg-gray-200 rounded w-32 mb-1" />
							<div className="h-4 bg-gray-100 rounded w-24" />
						</div>
					</div>
					<div className="mt-4">
						<div className="h-4 bg-gray-100 rounded w-full mb-1" />
						<div className="h-2 bg-gray-100 rounded-full" />
					</div>
				</div>
				<div className="flex flex-col items-end gap-2">
					<div className="h-6 bg-gray-200 rounded-full w-16" />
					<div className="h-4 bg-gray-100 rounded w-20" />
				</div>
			</div>
		</div>
	);
}

// Smart component: StaffSlotList
export function StaffSlotList({ mealType }: StaffSlotListProps) {
	const today = new Date().toISOString().split("T")[0];
	const { data, isLoading, isError } = useStaffSlots(mealType, today);

	if (isLoading) {
		return (
			<div className="space-y-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<StaffSlotCardSkeleton key={i} />
				))}
			</div>
		);
	}

	if (isError) {
		return (
			<div className="text-center py-12">
				<p className="text-red-500 font-medium">Failed to load slots. Please try again.</p>
			</div>
		);
	}

	const slots = data?.data || [];

	if (slots.length === 0) {
		return (
			<div className="text-center py-12 bg-white rounded-2xl border">
				<div className="text-gray-400 mb-4">
					<Clock size={48} className="mx-auto" />
				</div>
				<h3 className="text-lg font-semibold text-gray-900 mb-2">No slots available</h3>
				<p className="text-gray-500">
					There are no {mealType} slots for today. Create a new slot to get started.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{slots.map((slot) => (
				<StaffSlotCard key={slot.slot_id} slot={slot} />
			))}
		</div>
	);
}
