"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { useRole } from "@/hooks/useRole";
import { ProfileDropdown } from "./ProfileDropdown";
import { ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function Navbar() {
	const { token, isHydrated } = useAuthStore();
	const { isStaff } = useRole();
	const pathname = usePathname();
	const [isScrolled, setIsScrolled] = useState(false);
	const navRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			gsap.from(navRef.current, {
				y: -20,
				opacity: 0,
				duration: 0.8,
				ease: "power3.out",
			});
		},
		{ scope: navRef, dependencies: [isHydrated] }
	);

	useEffect(() => {
		const scrollContainer = document.getElementById("main-content");
		if (!scrollContainer) return;

		const handleScroll = () => {
			setIsScrolled(scrollContainer.scrollTop > 20);
		};
		scrollContainer.addEventListener("scroll", handleScroll);
		return () => scrollContainer.removeEventListener("scroll", handleScroll);
	}, []);

	// Prevent flicker before Zustand rehydrates
	if (!isHydrated) {
		return null;
	}

	const isLoggedIn = Boolean(token);
	const isLandingPage = pathname === "/";

	// Navigation Items logic
	const navLinks = isLoggedIn
		? isStaff
			? [
					{ label: "Dashboard", href: "/staff" },
					{ label: "Slots", href: "/staff/slots" },
				]
			: [
					{ label: "Explore Menu", href: "/menu" },
					{ label: "My Bookings", href: "/my-bookings" },
				]
		: [];

	// Dynamic styling based on background
	const navBg = isLandingPage
		? isScrolled
			? "bg-white/90 border-white/40 shadow-xl shadow-black/5"
			: "bg-white/70 border-white/20 shadow-lg shadow-black/5"
		: "bg-blue-100/95 border-blue-200/60 shadow-xl shadow-blue-900/10";

	return (
		<header
			ref={navRef}
			className={`w-full z-10 transition-all duration-500 py-3 sm:py-4 px-4 sm:px-6 lg:px-8 bg-transparent`}
		>
			<nav
				className={`mx-auto max-w-6xl transition-all duration-500 backdrop-blur-2xl border ${navBg} rounded-2xl`}
			>
				<div
					className={`flex items-center justify-between transition-all duration-500 px-4 sm:px-6 ${
						isScrolled ? "py-2" : "py-3 sm:py-4"
					}`}
				>
					{/* Left: Logo & Nav Links */}
					<div className="flex items-center gap-8">
						<Link
							href="/"
							className="group flex items-center gap-2 text-lg font-bold text-blue-600 transition-all duration-300 hover:text-blue-700 sm:text-xl"
						>
							<span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
								SC
							</span>
							<span className="hidden leading-none tracking-tight sm:inline">Smart Cafeteria</span>
						</Link>

						{/* Quick Links (Desktop) */}
						<div className="hidden items-center gap-1 md:flex">
							{navLinks.map((link) => {
								const isActive = pathname === link.href;
								return (
									<Link
										key={link.href}
										href={link.href}
										className={`group relative rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300 ${
											isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
										}`}
									>
										{link.label}
										{isActive && (
											<span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-blue-600" />
										)}
									</Link>
								);
							})}
						</div>
					</div>

					{/* Right side */}
					<div className="flex items-center gap-2 sm:gap-4">
						{!isLoggedIn && (
							<>
								<Link
									href="/login"
									className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-blue-600 sm:px-4"
								>
									Login
								</Link>

								<Link
									href="/register"
									className="group relative flex items-center gap-1 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40 sm:px-5 sm:py-2.5"
								>
									<span className="relative z-10">Sign Up</span>
									<ChevronRight
										size={16}
										className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
									/>
									<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-transform duration-500 group-hover:translate-x-0" />
								</Link>
							</>
						)}

						{isLoggedIn && (
							<div className="flex items-center gap-2 sm:gap-3">
								{/* Only show "Staff" badge if staff */}
								{isStaff && (
									<span className="hidden rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-600 sm:inline-block">
										Staff
									</span>
								)}
								<ProfileDropdown />
							</div>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
