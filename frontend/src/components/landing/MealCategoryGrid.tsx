"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAvailableCategories } from "@/src/hooks/useSlots";
import { MealCategoryGridSkeleton } from "./MealCategoryGridSkeleton";
import type { MealCategoryConfig } from "@/src/types/booking.types";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

// Dumb component: MealCategoryCard
interface MealCategoryCardProps {
	meal: MealCategoryConfig;
}

function MealCategoryCard({ meal }: MealCategoryCardProps) {
	return (
		<Link
			href={meal.href}
			className="meal-card group relative overflow-hidden rounded-3xl border border-[var(--color-primary)]/15 bg-white p-6 text-center shadow-md shadow-[var(--color-primary)]/8 transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl hover:shadow-[var(--color-primary)]/25 sm:p-8"
		>
			{/* Full brand gradient revealed on hover */}
			<div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

			<div className="relative">
				<div className="relative mx-auto mb-6 h-28 w-28 sm:h-32 sm:w-32">
					{/* Subtle resting ring that becomes white glow on hover */}
					<div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-primary)]/15 to-[var(--color-secondary)]/15 transition-all duration-500 group-hover:from-white/25 group-hover:to-white/10" />
					<Image
						src={meal.image}
						alt={meal.title}
						fill
						className="object-contain transition-transform duration-500 group-hover:scale-110"
					/>
				</div>

				<h3 className="mb-2 text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-white sm:text-xl">
					{meal.title}
				</h3>

				<p className="text-sm leading-relaxed text-gray-500 transition-colors duration-300 group-hover:text-white/80 sm:text-base">
					{meal.caption}
				</p>

				{/* Arrow indicator */}
				<div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] opacity-0 transition-all duration-300 group-hover:text-white group-hover:opacity-100">
					<span>View Menu</span>
					<svg
						aria-hidden="true"
						className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
					</svg>
				</div>
			</div>
		</Link>
	);
}

// Smart component: MealCategoryGrid
export function MealCategoryGrid() {
	const { data: categories, isLoading, isError } = useAvailableCategories();
	const sectionRef = useRef<HTMLElement>(null);
	const headingRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (!categories || categories.length === 0) return;

			// Animate heading
			gsap.fromTo(
				headingRef.current,
				{ opacity: 0, y: 50 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power3.out",
					scrollTrigger: {
						trigger: sectionRef.current,
						start: "top 80%",
						toggleActions: "play none none reverse",
					},
				}
			);

			// Animate cards with stagger
			gsap.fromTo(
				gridRef.current?.querySelectorAll(".meal-card") ?? [],
				{ opacity: 0, y: 60, scale: 0.9 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.7,
					ease: "power3.out",
					stagger: 0.15,
					scrollTrigger: {
						trigger: gridRef.current,
						start: "top 75%",
						toggleActions: "play none none reverse",
					},
				}
			);
		},
		{ scope: sectionRef, dependencies: [categories] }
	);

	if (isLoading) {
		return <MealCategoryGridSkeleton />;
	}

	if (isError) {
		return (
			<section className="bg-gradient-to-b from-[var(--color-secondary)]/20 to-[#fff5e1] py-24">
				<div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
					<p className="text-lg text-[var(--color-primary)]">
						Unable to load meal categories. Please try again later.
					</p>
				</div>
			</section>
		);
	}

	if (!categories || categories.length === 0) {
		return (
			<section className="bg-gradient-to-b from-[var(--color-secondary)]/20 to-[#fff5e1] py-24">
				<div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
					<h2 className="mb-6 text-3xl font-semibold text-gray-900">Explore Meals</h2>
					<p className="text-lg text-gray-500">
						No meal slots available at this time. Please check back later.
					</p>
				</div>
			</section>
		);
	}

	// Dynamically set grid columns based on number of categories
	const gridCols =
		categories.length === 1
			? "grid-cols-1 max-w-md"
			: categories.length === 2
				? "grid-cols-1 sm:grid-cols-2 max-w-2xl"
				: categories.length === 3
					? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl"
					: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl";

	return (
		<section
			id="meal-categories"
			ref={sectionRef}
			className="relative bg-gradient-to-b from-[var(--color-secondary)]/25 via-[#fff5e1] to-[#fff5e1] pt-16 pb-24 sm:pt-20 sm:pb-32"
		>
			{/* Top accent line */}
			<div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent" />

			{/* Ambient decorative orbs */}
			<div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-[var(--color-primary)]/8 blur-3xl" />
			<div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-[var(--color-secondary)]/15 blur-3xl" />

			<div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
				{/* Heading group */}
				<div ref={headingRef} className="mb-12 text-center opacity-0 sm:mb-16">
					{/* Eyebrow badge */}
					<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20">
						<span aria-hidden="true">🍽️</span>
						<span>EXPLORE OUR MENU</span>
					</div>

					<h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
						Discover{" "}
						<span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
							Delicious
						</span>{" "}
						Meals
					</h2>

					<p className="mx-auto mt-4 max-w-xl text-base text-gray-500 sm:text-lg">
						Choose a category and pre-book your favourite meal — fast, easy, and hassle-free.
					</p>
				</div>

				<div ref={gridRef} className={`mx-auto grid ${gridCols} gap-6 sm:gap-8`}>
					{categories.map((meal) => (
						<MealCategoryCard key={meal.id} meal={meal} />
					))}
				</div>
			</div>
		</section>
	);
}
