"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, X, ArrowRight, Loader2, IndianRupee } from "lucide-react";
import { useWalletBalance, useContribute } from "@/src/hooks/wallet/useWallet";

interface Props {
	bookingId: number;
	totalAmount: number;
	bookingWalletBalance: number;
	onClose: () => void;
}

export function AddMoneyModal({ bookingId, totalAmount, bookingWalletBalance, onClose }: Props) {
	const router = useRouter();
	const { data: personalWallet, isLoading: isLoadingWallet } = useWalletBalance();
	const { mutateAsync: contribute, isPending: isContributing } = useContribute();

	const [amount, setAmount] = useState("");

	const personalBalance = personalWallet?.wallet_balance ?? 0;
	const remainingBill = Math.max(totalAmount - bookingWalletBalance, 0);
	const maxContribution = Math.min(personalBalance, remainingBill);

	const numericAmount = Number.parseFloat(amount) || 0;
	const isValidAmount = numericAmount > 0 && numericAmount <= maxContribution;

	const handleContribute = async () => {
		if (!isValidAmount) return;
		await contribute({ bookingId: String(bookingId), amount: numericAmount });
		onClose();
	};

	const handleMaxClick = () => {
		if (maxContribution > 0) {
			setAmount(maxContribution.toFixed(2));
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
			<div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
				{/* Header */}
				<div className="bg-linear-to-r from-amber-500 to-amber-600 px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-2 text-white">
						<Wallet size={20} />
						<h2 className="text-lg font-bold">Add Money to Booking</h2>
					</div>
					<button
						onClick={onClose}
						className="text-white/80 hover:text-white transition-colors rounded-full p-1 hover:bg-white/20"
					>
						<X size={20} />
					</button>
				</div>

				<div className="p-6 space-y-5">
					{/* Personal Wallet Balance */}
					<div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
						<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
							Personal Wallet Balance
						</p>
						{isLoadingWallet ? (
							<div className="flex items-center gap-2 text-gray-400">
								<Loader2 size={16} className="animate-spin" />
								<span className="text-sm">Loading...</span>
							</div>
						) : (
							<p className="text-2xl font-black text-gray-900 font-mono">
								₹{personalBalance.toFixed(2)}
							</p>
						)}
					</div>

					{/* Bill breakdown */}
					<div className="space-y-2 text-sm">
						<div className="flex justify-between text-gray-500">
							<span>Total Bill</span>
							<span className="font-mono font-semibold text-gray-700">
								₹{totalAmount.toFixed(2)}
							</span>
						</div>
						<div className="flex justify-between text-gray-500">
							<span>Booking Wallet</span>
							<span className="font-mono font-semibold text-gray-700">
								₹{bookingWalletBalance.toFixed(2)}
							</span>
						</div>
						<div className="flex justify-between border-t pt-2">
							<span className="font-bold text-gray-900">Remaining Due</span>
							<span className="font-mono font-black text-amber-600">
								₹{remainingBill.toFixed(2)}
							</span>
						</div>
					</div>

					{/* Amount Input */}
					{remainingBill > 0 ? (
						<div className="space-y-2">
							<label
								htmlFor="amount-input"
								className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Amount to Add
							</label>
							<div className="relative">
								<IndianRupee
									size={16}
									className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
								/>
								<input
									id="amount-input"
									type="number"
									min="0"
									max={maxContribution}
									step="0.01"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									placeholder="0.00"
									className="w-full rounded-xl border-2 border-gray-200 py-3 pl-10 pr-20 text-lg font-bold font-mono text-gray-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all"
								/>
								<button
									type="button"
									onClick={handleMaxClick}
									disabled={maxContribution <= 0}
									className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-200 transition-colors disabled:opacity-50"
								>
									MAX
								</button>
							</div>
							<p className="text-[11px] text-gray-400">
								Max: ₹{maxContribution.toFixed(2)} (min of personal balance & remaining due)
							</p>
							{numericAmount > maxContribution && numericAmount > 0 && (
								<p className="text-[11px] text-red-500 font-semibold">
									Amount exceeds maximum allowed contribution.
								</p>
							)}
						</div>
					) : (
						<div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center">
							<p className="text-sm font-bold text-green-700">✓ Booking wallet is fully funded</p>
						</div>
					)}

					{/* Recharge Wallet link */}
					{personalBalance < remainingBill && remainingBill > 0 && (
						<button
							type="button"
							onClick={() => router.push("/profile")}
							className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all"
						>
							<Wallet size={16} />
							Recharge Wallet
							<ArrowRight size={14} />
						</button>
					)}

					{/* Action Buttons */}
					<div className="flex gap-3 pt-1">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
						>
							Cancel
						</button>
						{remainingBill > 0 && (
							<button
								type="button"
								onClick={handleContribute}
								disabled={!isValidAmount || isContributing}
								className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-amber-200"
							>
								{isContributing ? (
									<>
										<Loader2 size={16} className="animate-spin" />
										Adding...
									</>
								) : (
									"Add Money"
								)}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
