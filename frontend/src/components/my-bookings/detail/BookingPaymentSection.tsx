import { Wallet, Receipt } from "lucide-react";
import type { MyBookingMenuItem } from "@/src/types/myBookings.types";

interface Props {
	totalAmount: number;
	walletBalance: number;
	menuItems: MyBookingMenuItem[];
	groupSize: number;
	bookingReference: string;
}

export function BookingPaymentSection({
	totalAmount,
	walletBalance,
	menuItems,
	groupSize,
	bookingReference,
}: Props) {
	const totalItemsCount = menuItems.reduce((sum, item) => sum + item.quantity, 0);
	const shortfall = totalAmount - walletBalance;
	const itemsSubtotal = menuItems.reduce((sum, item) => sum + item.subtotal, 0);

	return (
		<div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
			{/* Bill header */}
			<div className="bg-gray-900 px-6 py-5 text-center">
				<Receipt size={22} className="text-emerald-400 mx-auto mb-2" />
				<h3 className="text-base font-bold text-white tracking-wide">BILL SUMMARY</h3>
				<p className="text-[11px] text-gray-400 mt-1 font-mono">Ref: {bookingReference}</p>
			</div>

			{/* Line items table */}
			<div className="px-5 pt-4 pb-2">
				{/* Table header */}
				<div className="grid grid-cols-[1fr_50px_60px_70px] gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-dashed border-gray-200">
					<span>Item</span>
					<span className="text-center">Qty</span>
					<span className="text-right">Price</span>
					<span className="text-right">Subtotal</span>
				</div>

				{/* Line items */}
				<div className="divide-y divide-gray-100">
					{menuItems.map((item) => (
						<div
							key={item.id}
							className="grid grid-cols-[1fr_50px_60px_70px] gap-2 py-2.5 items-center"
						>
							<span className="text-[13px] text-gray-700 font-medium truncate">
								{item.menu_items.item_name}
							</span>
							<span className="text-[13px] text-gray-500 text-center font-mono">
								×{item.quantity}
							</span>
							<span className="text-[12px] text-gray-400 text-right font-mono">
								₹{item.unit_price.toFixed(0)}
							</span>
							<span className="text-[13px] text-gray-800 text-right font-semibold font-mono">
								₹{item.subtotal.toFixed(2)}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Totals section */}
			<div className="mx-5 border-t border-dashed border-gray-300 pt-3 pb-1">
				{/* Items subtotal */}
				<div className="flex justify-between text-sm text-gray-500 mb-1.5">
					<span>
						Subtotal ({totalItemsCount} item{totalItemsCount !== 1 ? "s" : ""})
					</span>
					<span className="font-mono">₹{itemsSubtotal.toFixed(2)}</span>
				</div>

				{/* Group split info */}
				{groupSize > 1 && (
					<div className="flex justify-between text-sm text-gray-500 mb-1.5">
						<span>Split across {groupSize} members</span>
						<span className="font-mono text-gray-400">
							~₹{(totalAmount / groupSize).toFixed(2)}/person
						</span>
					</div>
				)}
			</div>

			{/* Grand total */}
			<div className="mx-5 border-t-2 border-gray-900 mt-1 py-3 flex justify-between items-center">
				<span className="text-base font-extrabold text-gray-900">TOTAL</span>
				<span className="text-2xl font-black text-gray-900 font-mono">
					₹{totalAmount.toFixed(2)}
				</span>
			</div>

			{/* Wallet & payment status */}
			<div className="mx-5 mb-4 mt-1 space-y-2.5">
				{/* Wallet balance row */}
				<div className="flex items-center justify-between text-sm rounded-xl bg-gray-50 px-4 py-2.5">
					<span className="flex items-center gap-2 text-gray-500">
						<Wallet size={14} className="text-amber-500" />
						Wallet Balance
					</span>
					<span className="font-bold text-gray-700 font-mono">₹{walletBalance.toFixed(2)}</span>
				</div>

				{/* Shortfall / sufficient indicator */}
				{shortfall > 0 ? (
					<div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center justify-between">
						<p className="text-xs font-bold text-amber-700">Amount Due</p>
						<p className="text-sm font-black text-amber-700 font-mono">₹{shortfall.toFixed(2)}</p>
					</div>
				) : (
					<div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3">
						<p className="text-xs font-bold text-green-700 text-center">
							✓ Sufficient balance to complete payment
						</p>
					</div>
				)}
			</div>

			{/* Bill footer */}
			<div className="bg-gray-50 border-t px-5 py-3 text-center">
				<p className="text-[10px] text-gray-400 tracking-wide">Smart Cafeteria System</p>
			</div>
		</div>
	);
}
