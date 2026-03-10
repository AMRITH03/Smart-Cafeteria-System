"use client";

import { useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

interface Props {
	onConfirm: (reason?: string) => void;
	onClose: () => void;
	isLoading: boolean;
}

export function CancelBookingModal({ onConfirm, onClose, isLoading }: Props) {
	const [reason, setReason] = useState("");

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b bg-red-50">
					<div className="flex items-center gap-2">
						<AlertTriangle size={18} className="text-red-500" />
						<h3 className="text-base font-bold text-red-700">Cancel Booking</h3>
					</div>
					<button onClick={onClose} className="p-1.5 rounded-lg hover:bg-red-100 transition-colors">
						<X size={18} className="text-red-400" />
					</button>
				</div>

				<div className="p-6 space-y-4">
					<p className="text-sm text-gray-600">
						Are you sure you want to cancel this booking? This action cannot be undone.
					</p>

					{/* Optional reason */}
					<div>
						<label
							htmlFor="cancel-reason"
							className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
						>
							Reason (optional)
						</label>
						<textarea
							id="cancel-reason"
							placeholder="Why are you cancelling?"
							rows={3}
							maxLength={500}
							className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors resize-none"
						/>
					</div>

					{/* Actions */}
					<div className="flex gap-3">
						<button
							onClick={onClose}
							disabled={isLoading}
							className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
						>
							Keep Booking
						</button>
						<button
							onClick={() => onConfirm(reason || undefined)}
							disabled={isLoading}
							className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
						>
							{isLoading ? (
								<>
									<Loader2 size={14} className="animate-spin" />
									Cancelling...
								</>
							) : (
								"Cancel Booking"
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
