import { Calendar, Clock, Users, MapPin, Timer } from "lucide-react";
import type { MyBookingSlot } from "@/src/types/myBookings.types";

interface Props {
	slot: MyBookingSlot | undefined;
	bookingType: string;
	groupSize: number;
	createdAt: string;
	paymentDeadline: string;
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("en-IN", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function formatTime(time: string): string {
	const [hours, minutes] = time.split(":");
	const h = Number(hours);
	const suffix = h >= 12 ? "PM" : "AM";
	const displayHour = h % 12 || 12;
	return `${displayHour}:${minutes} ${suffix}`;
}

function formatDateTime(dateStr: string): string {
	const d = new Date(dateStr);
	return d.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function BookingInfoSection({
	slot,
	bookingType,
	groupSize,
	createdAt,
	paymentDeadline,
}: Props) {
	if (!slot) return null;

	const infoItems = [
		{
			icon: <Clock size={16} className="text-indigo-500" />,
			label: "Meal Slot",
			value: slot.slot_name,
		},
		{
			icon: <Calendar size={16} className="text-blue-500" />,
			label: "Date",
			value: formatDate(slot.slot_date),
		},
		{
			icon: <Timer size={16} className="text-violet-500" />,
			label: "Time",
			value: `${formatTime(slot.start_time)} – ${formatTime(slot.end_time)}`,
		},
		{
			icon: <Users size={16} className="text-emerald-500" />,
			label: "Group Size",
			value: `${groupSize} ${groupSize === 1 ? "person" : "people"}`,
		},
		{
			icon: <MapPin size={16} className="text-orange-500" />,
			label: "Booking Type",
			value: bookingType === "take-away" ? "Take Away" : "Dine In",
		},
	];

	return (
		<div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
			<div className="bg-gray-50 px-6 py-4 border-b">
				<h3 className="text-base font-bold text-gray-800">Booking Information</h3>
			</div>
			<div className="p-5 space-y-0 divide-y divide-gray-100">
				{infoItems.map((item) => (
					<div key={item.label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
						<div className="shrink-0 p-2 bg-gray-50 rounded-lg">{item.icon}</div>
						<div className="min-w-0">
							<p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
								{item.label}
							</p>
							<p className="text-sm font-semibold text-gray-900">{item.value}</p>
						</div>
					</div>
				))}
			</div>

			{/* Footer timestamps */}
			<div className="bg-gray-50 px-6 py-3 border-t flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-gray-400">
				<span>Booked: {formatDateTime(createdAt)}</span>
				{paymentDeadline && <span>Payment Deadline: {formatDateTime(paymentDeadline)}</span>}
			</div>
		</div>
	);
}
