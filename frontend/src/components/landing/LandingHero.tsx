"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FloatingFoodIcons } from "./FloatingFoodIcons";

type LandingHeroProps = {
	title: string;
	subtitle: string;
};

export function LandingHero(_props: LandingHeroProps) {
	const containerRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const subtitleRef = useRef<HTMLDivElement>(null);
	const ctaRef = useRef<HTMLAnchorElement>(null);

	useGSAP(
		() => {
			const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

			// Animate title
			tl.fromTo(titleRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1 });

			// Animate subtitle paragraphs with stagger
			tl.fromTo(
				subtitleRef.current?.children ?? [],
				{ opacity: 0, y: 40 },
				{ opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
				"-=0.5"
			);

			// Animate CTA button
			tl.fromTo(
				ctaRef.current,
				{ opacity: 0, scale: 0.8 },
				{ opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
				"-=0.3"
			);
		},
		{ scope: containerRef }
	);

	return (
		<section
			ref={containerRef}
			className="relative -mt-24 min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 pt-24 text-white"
		>
			{/* RANDOM FLOATING ICONS */}
			<FloatingFoodIcons />

			{/* Decorative gradient orbs */}
			<div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl" />
			<div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl" />

			{/* HERO CONTENT */}
			<div className="relative z-10 container mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-16 text-center sm:px-6 lg:px-8">
				{/* MAIN HEADING */}
				<h1
					ref={titleRef}
					className="mb-6 text-4xl font-extrabold leading-tight tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
				>
					<span className="block">Smart Cafeteria</span>
					<span className="mt-2 block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
						Management System
					</span>
				</h1>

				{/* SUB HEADING */}
				<div
					ref={subtitleRef}
					className="mx-auto max-w-3xl space-y-4 text-base leading-relaxed text-blue-100 sm:text-lg md:text-xl"
				>
					<p className="opacity-0">
						Tired of waiting in long cafeteria queues or missing your favorite meals?
					</p>

					<p className="opacity-0">
						With Smart Cafeteria, you can pre-book meals, manage orders effortlessly, and enjoy a
						hassle-free dining experience.
					</p>

					<p className="font-semibold text-white opacity-0">
						Smarter planning, faster service, and better meals — all in one place.
					</p>
				</div>

				{/* CTA Button */}
				<a
					ref={ctaRef}
					href="#meal-categories"
					className="group mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 opacity-0 shadow-xl shadow-black/10 transition-all duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-2xl hover:shadow-blue-500/20 sm:px-10 sm:py-5 sm:text-xl"
				>
					Explore Menu
					<svg
						aria-hidden="true"
						className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
					</svg>
				</a>
			</div>
		</section>
	);
}
