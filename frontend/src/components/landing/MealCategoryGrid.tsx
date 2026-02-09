"use client";

import { useRef, useEffect } from "react";
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
			className="meal-card group relative overflow-hidden rounded-3xl bg-white p-6 text-center shadow-lg shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 sm:p-8"
		>
			{/* Gradient overlay on hover */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

			<div className="relative">
				<div className="relative mx-auto mb-6 h-28 w-28 sm:h-32 sm:w-32">
					<div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
					<Image
						src={meal.image}
						alt={meal.title}
						fill
						className="object-contain transition-transform duration-500 group-hover:scale-110"
					/>
				</div>

				<h3 className="mb-2 text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-600 sm:text-xl">
					{meal.title}
				</h3>

				<p className="text-sm leading-relaxed text-gray-500 sm:text-base">{meal.caption}</p>

				{/* Arrow indicator */}
				<div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-500 opacity-0 transition-all duration-300 group-hover:opacity-100">
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
	const headingRef = useRef<HTMLHeadingElement>(null);
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
			<section className="bg-gradient-to-b from-blue-600 to-blue-700 py-24">
				<div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
					<p className="text-lg text-white">
						Unable to load meal categories. Please try again later.
					</p>
				</div>
			</section>
		);
	}

	if (!categories || categories.length === 0) {
		return (
			<section className="bg-gradient-to-b from-blue-600 to-blue-700 py-24">
				<div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
					<h2 className="mb-6 text-3xl font-semibold text-white">Explore Meals</h2>
					<p className="text-lg text-white/80">
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
			className="relative bg-gradient-to-b from-blue-600 via-blue-600 to-indigo-700 py-24 sm:py-32"
		>
			{/* Decorative elements */}
			<div className="absolute left-1/2 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					ref={headingRef}
					className="mb-14 text-center text-3xl font-bold text-white opacity-0 sm:mb-16 sm:text-4xl lg:text-5xl"
				>
					Explore Our{" "}
					<span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
						Delicious Meals
					</span>
				</h2>

				<div ref={gridRef} className={`mx-auto grid ${gridCols} gap-6 sm:gap-8`}>
					{categories.map((meal) => (
						<MealCategoryCard key={meal.id} meal={meal} />
					))}
				</div>
			</div>
		</section>
	);
}
