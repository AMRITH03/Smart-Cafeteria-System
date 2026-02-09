"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useCartStore } from "@/stores/cart.store";
import { useUpdateBooking } from "@/src/hooks/myBookings/useBookingDetail";

type UpdateStatus = "loading" | "success" | "error";

function BookingUpdateConfirmationPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const bookingId = Number(searchParams.get("bookingId"));

	const { items, clearCart } = useCartStore();
	const { mutateAsync: updateBookingAsync } = useUpdateBooking(bookingId);

	const loaderRef = useRef<HTMLDivElement>(null);
	const successRef = useRef<HTMLDivElement>(null);
	const checkRef = useRef<SVGSVGElement>(null);
	const textRef = useRef<HTMLDivElement>(null);

	const [currentStatus, setCurrentStatus] = useState<UpdateStatus>("loading");
	const hasFiredRef = useRef(false);

	// Snapshot data
	const snapshotRef = useRef<{
		bookingId: number;
		menuItemsAdd: { menu_item_id: number; quantity: number }[];
		menuItemsRemove: { menu_item_id: number; quantity: number }[];
	} | null>(null);

	if (!snapshotRef.current && bookingId > 0) {
		try {
			const editContextStr = sessionStorage.getItem("booking_edit_context");
			if (editContextStr) {
				const editContext = JSON.parse(editContextStr);
				const currentMenuItems: {
					menu_item_id: number;
					quantity: number;
					name: string;
					price: number;
				}[] = editContext.currentMenuItems || [];

				// Compute diff: items to add and items to remove
				const newItems = items.map((item) => ({
					menu_item_id: item.id,
					quantity: item.quantity,
				}));

				// Items to remove: in old but not in new, or quantity decreased
				const menuItemsRemove: { menu_item_id: number; quantity: number }[] = [];
				for (const old of currentMenuItems) {
					const newItem = newItems.find((n) => n.menu_item_id === old.menu_item_id);
					if (!newItem) {
						menuItemsRemove.push({ menu_item_id: old.menu_item_id, quantity: old.quantity });
					} else if (newItem.quantity < old.quantity) {
						menuItemsRemove.push({
							menu_item_id: old.menu_item_id,
							quantity: old.quantity - newItem.quantity,
						});
					}
				}

				// Items to add: in new but not in old, or quantity increased
				const menuItemsAdd: { menu_item_id: number; quantity: number }[] = [];
				for (const newItem of newItems) {
					const old = currentMenuItems.find((o) => o.menu_item_id === newItem.menu_item_id);
					if (!old) {
						menuItemsAdd.push({ menu_item_id: newItem.menu_item_id, quantity: newItem.quantity });
					} else if (newItem.quantity > old.quantity) {
						menuItemsAdd.push({
							menu_item_id: newItem.menu_item_id,
							quantity: newItem.quantity - old.quantity,
						});
					}
				}

				snapshotRef.current = {
					bookingId,
					menuItemsAdd,
					menuItemsRemove,
				};
			}
		} catch {
			// ignore parse errors
		}
	}

	// Fire the update mutation once
	useEffect(() => {
		if (hasFiredRef.current) return;
		hasFiredRef.current = true;

		const snapshot = snapshotRef.current;
		if (!snapshot || snapshot.bookingId <= 0) {
			setCurrentStatus("error");
			return;
		}

		if (snapshot.menuItemsAdd.length === 0 && snapshot.menuItemsRemove.length === 0) {
			// No changes
			setCurrentStatus("success");
			clearCart();
			sessionStorage.removeItem("booking_edit_context");
			return;
		}

		const fire = async () => {
			try {
				const payload: {
					menu_items_add?: { menu_item_id: number; quantity: number }[];
					menu_items_remove?: { menu_item_id: number; quantity: number }[];
				} = {};

				if (snapshot.menuItemsAdd.length > 0) payload.menu_items_add = snapshot.menuItemsAdd;
				if (snapshot.menuItemsRemove.length > 0)
					payload.menu_items_remove = snapshot.menuItemsRemove;

				await updateBookingAsync(payload);
				clearCart();
				sessionStorage.removeItem("booking_edit_context");
				setCurrentStatus("success");
			} catch {
				setCurrentStatus("error");
			}
		};

		fire();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Loading animation
	useEffect(() => {
		if (currentStatus !== "loading" || !loaderRef.current) return;

		const dots = loaderRef.current.querySelectorAll(".loader-dot");
		const ring = loaderRef.current.querySelector(".loader-ring");

		if (ring) {
			gsap.to(ring, {
				rotation: 360,
				duration: 1.5,
				repeat: -1,
				ease: "linear",
				transformOrigin: "center center",
			});
		}

		if (dots.length > 0) {
			gsap.to(dots, {
				y: -12,
				duration: 0.4,
				stagger: 0.15,
				repeat: -1,
				yoyo: true,
				ease: "power2.inOut",
			});
		}
	}, [currentStatus]);

	// Success animation
	useEffect(() => {
		if (currentStatus !== "success") return;

		const tl = gsap.timeline();

		if (loaderRef.current) {
			tl.to(loaderRef.current, {
				opacity: 0,
				scale: 0.8,
				duration: 0.3,
				ease: "power2.in",
				onComplete: () => {
					if (loaderRef.current) loaderRef.current.style.display = "none";
				},
			});
		}

		if (successRef.current) {
			tl.set(successRef.current, { display: "flex" });

			const circle = successRef.current.querySelector(".success-circle");
			if (circle) {
				tl.fromTo(
					circle,
					{ scale: 0, opacity: 0 },
					{ scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
				);
			}
		}

		if (checkRef.current) {
			const path = checkRef.current.querySelector(".check-path");
			if (path) {
				const length = (path as SVGPathElement).getTotalLength();
				tl.set(path, { strokeDasharray: length, strokeDashoffset: length });
				tl.to(path, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" });
			}
		}

		if (textRef.current) {
			tl.fromTo(
				textRef.current,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
				"-=0.2"
			);
		}

		tl.call(
			() => {
				setTimeout(() => {
					router.replace(`/my-bookings/${bookingId}`);
				}, 2000);
			},
			[],
			"+=0.5"
		);

		return () => {
			tl.kill();
		};
	}, [currentStatus, router, bookingId]);

	// Error → redirect back
	useEffect(() => {
		if (currentStatus !== "error") return;

		if (loaderRef.current) {
			gsap.to(loaderRef.current, {
				opacity: 0,
				scale: 0.8,
				duration: 0.3,
				ease: "power2.in",
			});
		}

		const timer = setTimeout(() => {
			router.push(`/my-bookings/${bookingId}`);
		}, 3000);

		return () => clearTimeout(timer);
	}, [currentStatus, router, bookingId]);

	return (
		<div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white">
			{/* Loading State */}
			{currentStatus === "loading" && (
				<div ref={loaderRef} className="flex flex-col items-center gap-8">
					<div className="relative">
						<svg
							className="loader-ring h-20 w-20"
							viewBox="0 0 80 80"
							fill="none"
							role="img"
							aria-label="Loading"
						>
							<circle cx="40" cy="40" r="35" stroke="#E5E7EB" strokeWidth="5" fill="none" />
							<path
								d="M40 5 a35 35 0 0 1 35 35"
								stroke="#3B82F6"
								strokeWidth="5"
								strokeLinecap="round"
								fill="none"
							/>
						</svg>
					</div>

					<div className="flex items-center gap-2">
						<div className="loader-dot h-3 w-3 rounded-full bg-blue-500" />
						<div className="loader-dot h-3 w-3 rounded-full bg-blue-400" />
						<div className="loader-dot h-3 w-3 rounded-full bg-blue-300" />
					</div>

					<p className="text-gray-500 font-medium text-sm">Updating your booking...</p>
				</div>
			)}

			{/* Success State */}
			<div ref={successRef} className="flex-col items-center gap-6" style={{ display: "none" }}>
				<div className="success-circle flex h-28 w-28 items-center justify-center rounded-full bg-green-50 ring-4 ring-green-100">
					<svg
						ref={checkRef}
						className="h-16 w-16"
						viewBox="0 0 64 64"
						fill="none"
						role="img"
						aria-label="Success"
					>
						<path
							className="check-path"
							d="M16 34 L26 44 L48 20"
							stroke="#22C55E"
							strokeWidth="5"
							strokeLinecap="round"
							strokeLinejoin="round"
							fill="none"
						/>
					</svg>
				</div>

				<div ref={textRef} className="text-center space-y-2">
					<h1 className="text-2xl font-black text-gray-900">Booking Updated!</h1>
					<p className="text-gray-500 text-sm">Your meal order has been updated successfully.</p>
				</div>

				<p className="text-xs text-gray-400 mt-2">Redirecting to booking details...</p>
			</div>

			{/* Error State */}
			{currentStatus === "error" && (
				<div className="flex flex-col items-center gap-6 text-center">
					<div className="flex h-28 w-28 items-center justify-center rounded-full bg-red-50 ring-4 ring-red-100">
						<svg
							className="h-16 w-16"
							viewBox="0 0 64 64"
							fill="none"
							role="img"
							aria-label="Error"
						>
							<path d="M20 20 L44 44" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
							<path d="M44 20 L20 44" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
						</svg>
					</div>
					<div className="space-y-2">
						<h1 className="text-2xl font-black text-gray-900">Update Failed</h1>
						<p className="text-gray-500 text-sm">Something went wrong. Redirecting back...</p>
					</div>
				</div>
			)}
		</div>
	);
}
export default function BookingUpdateConfirmationPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					<div className="text-center text-gray-500">Loading...</div>
				</div>
			}
		>
			<BookingUpdateConfirmationPageContent />
		</Suspense>
	);
}
