"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { AuthService } from "@/services/auth.service";
import { User, LogOut, ReceiptText, BookCheck, Package, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/hooks/useRole";

export function ProfileDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const logout = useAuthStore((s) => s.logout);
	const { isStaff } = useRole();

	// Close when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await AuthService.logout();
		} catch (error) {
			// Continue with logout even if backend call fails
			console.warn("Backend logout failed:", error);
		} finally {
			logout();
			setIsOpen(false);
			toast.success("Logged out successfully");
			router.push("/");
			setIsLoggingOut(false);
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-100 bg-white text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm overflow-hidden"
				aria-label="User menu"
			>
				<div className="flex h-full w-full items-center justify-center bg-blue-50">
					<User size={20} />
				</div>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-white/40 bg-white/90 p-1.5 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 z-50">
					<div className="px-3 py-3 border-b border-gray-100/50 mb-1">
						<p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.1em]">
							Account Settings
						</p>
					</div>

					<div className="space-y-0.5">
						<Link
							href="/profile"
							className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-[0.98]"
							onClick={() => setIsOpen(false)}
						>
							<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
								<User size={18} />
							</div>
							My Profile
						</Link>
					</div>

					<div className="px-3 py-3 border-b border-gray-100/50 my-1 mt-2">
						<p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.1em]">
							{isStaff ? "Staff Management" : "Quick Access"}
						</p>
					</div>

					<div className="space-y-0.5">
						{isStaff ? (
							<>
								<Link
									href="/staff/inventory"
									className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-[0.98]"
									onClick={() => setIsOpen(false)}
								>
									<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
										<Package size={18} />
									</div>
									Inventory
								</Link>

								<Link
									href="/staff/forecast"
									className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-[0.98]"
									onClick={() => setIsOpen(false)}
								>
									<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
										<BarChart3 size={18} />
									</div>
									Forecaster
								</Link>
							</>
						) : (
							<>
								<Link
									href="/my-bookings"
									className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-[0.98]"
									onClick={() => setIsOpen(false)}
								>
									<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
										<BookCheck size={18} />
									</div>
									My Bookings
								</Link>

								<Link
									href="/transaction-history"
									className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-[0.98]"
									onClick={() => setIsOpen(false)}
								>
									<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
										<ReceiptText size={18} />
									</div>
									Transaction History
								</Link>
							</>
						)}
					</div>

					<div className="my-1.5 border-t border-gray-100/50" />

					<button
						onClick={handleLogout}
						disabled={isLoggingOut}
						className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-all active:scale-[0.98] disabled:opacity-50"
					>
						<div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
							<LogOut size={18} />
						</div>
						{isLoggingOut ? "Logging out..." : "Logout"}
					</button>
				</div>
			)}
		</div>
	);
}
