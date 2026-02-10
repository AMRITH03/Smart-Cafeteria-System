"use client";

import Image from "next/image";
import type { MenuItemFromDB } from "@/src/types/staff/mealSlot.types";

interface MenuItemRowProps {
	item: MenuItemFromDB;
	isSelected: boolean;
	quantity: number;
	onToggle: (menuItemId: number) => void;
	onQuantityChange: (menuItemId: number, quantity: number) => void;
}

export function MenuItemRow({
	item,
	isSelected,
	quantity,
	onToggle,
	onQuantityChange,
}: MenuItemRowProps) {
	return (
		<button
			type="button"
			className={`flex items-center gap-3 p-3 border rounded-xl transition-colors cursor-pointer w-full text-left ${
				isSelected
					? "border-blue-400 bg-blue-50/60"
					: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
			}`}
			onClick={() => onToggle(item.menu_item_id)}
		>
			{/* Checkbox */}
			<input
				type="checkbox"
				checked={isSelected}
				onChange={() => onToggle(item.menu_item_id)}
				onClick={(e) => e.stopPropagation()}
				className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
			/>

			{/* Image */}
			{item.image_url ? (
				<Image
					src={item.image_url}
					alt={item.item_name}
					width={40}
					height={40}
					className="rounded-lg object-cover flex-shrink-0"
				/>
			) : (
				<div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
					<span className="text-gray-400 text-xs">🍽</span>
				</div>
			)}

			{/* Info */}
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium text-gray-900 truncate">{item.item_name}</p>
				<div className="flex items-center gap-2">
					<span className="text-xs text-gray-500 capitalize">{item.category}</span>
					{item.is_vegetarian && <span className="text-xs text-green-600 font-medium">Veg</span>}
					<span className="text-xs text-gray-500">₹{item.price}</span>
				</div>
			</div>

			{/* Quantity input */}
			{isSelected && (
				// biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation wrapper for nested input
				// biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation wrapper for nested input
				<div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
					<label
						htmlFor={`qty-${item.menu_item_id}`}
						className="text-xs text-gray-500 hidden sm:inline"
					>
						Qty:
					</label>
					<input
						id={`qty-${item.menu_item_id}`}
						type="number"
						min={1}
						value={quantity}
						onChange={(e) =>
							onQuantityChange(item.menu_item_id, Math.max(1, parseInt(e.target.value, 10) || 1))
						}
						className="w-16 h-8 text-sm text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					/>
				</div>
			)}
		</button>
	);
}
