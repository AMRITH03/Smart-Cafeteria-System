"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import type { MenuItem } from "@/types/staff/menuItem.types";

interface StaffMenuItemCardProps {
	item: MenuItem;
	onEdit: (item: MenuItem) => void;
	onDelete: (item: MenuItem) => void;
}

export function StaffMenuItemCard({ item, onEdit, onDelete }: StaffMenuItemCardProps) {
	return (
		<div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
			{/* Image */}
			<div className="relative w-full h-40 bg-gray-100">
				{item.image_url ? (
					<Image
						src={item.image_url}
						alt={item.item_name}
						fill
						className="object-cover"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				) : (
					<div className="flex items-center justify-center h-full">
						<span className="text-4xl">🍽</span>
					</div>
				)}
				{/* Category badge */}
				<span className="absolute top-2 left-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-full capitalize">
					{item.category}
				</span>
				{item.is_vegetarian && (
					<span className="absolute top-2 right-2 px-2 py-1 bg-green-500/90 backdrop-blur-sm text-xs font-semibold text-white rounded-full">
						Veg
					</span>
				)}
			</div>

			{/* Content */}
			<div className="p-4">
				<div className="flex items-start justify-between gap-2 mb-1">
					<h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-1">
						{item.item_name}
					</h3>
					<span className="text-sm font-bold text-[var(--primary)] whitespace-nowrap">
						₹{item.price}
					</span>
				</div>

				{item.description && (
					<p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>
				)}

				{!item.description && <div className="mb-3" />}

				{/* Actions */}
				<div className="flex gap-2">
					<button
						onClick={() => onEdit(item)}
						className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-xl hover:bg-blue-100 transition-colors"
					>
						<Pencil size={14} />
						Edit
					</button>
					<button
						onClick={() => onDelete(item)}
						className="inline-flex items-center justify-center p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
						title="Delete menu item"
					>
						<Trash2 size={16} />
					</button>
				</div>
			</div>
		</div>
	);
}
