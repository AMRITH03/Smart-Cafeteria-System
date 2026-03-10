"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
	ArrowLeft,
	Plus,
	Search,
	X,
	Loader2,
	Pencil,
	Trash2,
	UtensilsCrossed,
	Upload,
} from "lucide-react";

import {
	useMenuItems,
	useCreateMenuItem,
	useUpdateMenuItem,
	useDeleteMenuItem,
} from "@/hooks/staff/useMenuItems";
import { useMenuItemStore } from "@/stores/menuItemStore";
import { StaffMenuItemCard } from "@/components/staff/StaffMenuItemCard";
import { StaffMenuItemCardSkeleton } from "@/components/staff/StaffMenuItemCardSkeleton";
import { supabase } from "@/lib/supabase";
import type { MenuItem } from "@/types/staff/menuItem.types";
import {
	createMenuItemSchema,
	updateMenuItemSchema,
	type CreateMenuItemFormValues,
	type UpdateMenuItemFormValues,
} from "@/validations/menuItem.schema";

/* ==================== CATEGORY HELPERS ==================== */

const CATEGORIES = ["breakfast", "lunch", "snacks", "dinner"] as const;

const categoryColors: Record<string, string> = {
	breakfast: "bg-amber-50 text-amber-700 border-amber-200",
	lunch: "bg-blue-50 text-blue-700 border-blue-200",
	snacks: "bg-purple-50 text-purple-700 border-purple-200",
	dinner: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

/* ==================== IMAGE UPLOAD HELPER ==================== */

async function uploadMenuItemImage(file: File, category: string): Promise<string> {
	const fileExt = file.name.split(".").pop();
	const fileName = `${crypto.randomUUID()}.${fileExt}`;
	const filePath = `${category}/${fileName}`;

	const { error } = await supabase.storage.from("menu-items").upload(filePath, file, {
		cacheControl: "3600",
		upsert: false,
	});

	if (error) throw new Error(`Image upload failed: ${error.message}`);

	const { data } = supabase.storage.from("menu-items").getPublicUrl(filePath);
	return data.publicUrl;
}

/* ==================== CREATE MODAL ==================== */

interface CreateMenuItemModalProps {
	onClose: () => void;
}

function CreateMenuItemModal({ onClose }: CreateMenuItemModalProps) {
	const createMutation = useCreateMenuItem();
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<CreateMenuItemFormValues>({
		resolver: zodResolver(createMenuItemSchema),
		defaultValues: {
			is_vegetarian: true,
		},
	});

	const selectedCategory = watch("category");

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setImageFile(file);
		const reader = new FileReader();
		reader.onloadend = () => setImagePreview(reader.result as string);
		reader.readAsDataURL(file);
	};

	const onSubmit = async (data: CreateMenuItemFormValues) => {
		let imageUrl: string | undefined;

		if (imageFile && data.category) {
			setIsUploading(true);
			try {
				imageUrl = await uploadMenuItemImage(imageFile, data.category);
			} catch {
				setIsUploading(false);
				return;
			}
			setIsUploading(false);
		}

		createMutation.mutate(
			{
				...data,
				image_url: imageUrl,
			},
			{ onSuccess: () => onClose() }
		);
	};

	const isPending = createMutation.isPending || isUploading;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-gray-900">Add New Menu Item</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={20} className="text-gray-500" />
					</button>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Item Name */}
					<div>
						<label
							htmlFor="create-item-name"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Item Name <span className="text-red-500">*</span>
						</label>
						<input
							id="create-item-name"
							{...register("item_name")}
							placeholder="e.g. Chicken Biryani"
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
						/>
						{errors.item_name && (
							<p className="text-sm text-red-500 mt-1">{errors.item_name.message}</p>
						)}
					</div>

					{/* Category */}
					<div>
						<label
							htmlFor="create-category"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Category <span className="text-red-500">*</span>
						</label>
						<select
							id="create-category"
							{...register("category")}
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all capitalize"
						>
							<option value="">Select category</option>
							{CATEGORIES.map((cat) => (
								<option key={cat} value={cat} className="capitalize">
									{cat}
								</option>
							))}
						</select>
						{errors.category && (
							<p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
						)}
					</div>

					{/* Description */}
					<div>
						<label
							htmlFor="create-description"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Description
						</label>
						<textarea
							id="create-description"
							{...register("description")}
							rows={3}
							placeholder="Brief description of the dish..."
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all resize-none"
						/>
						{errors.description && (
							<p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
						)}
					</div>

					{/* Price */}
					<div>
						<label
							htmlFor="create-price"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Price (₹) <span className="text-red-500">*</span>
						</label>
						<input
							id="create-price"
							{...register("price")}
							type="number"
							min="0"
							step="0.01"
							placeholder="e.g. 120"
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
						/>
						{errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
					</div>

					{/* Vegetarian Toggle */}
					<div className="flex items-center gap-3">
						<input
							{...register("is_vegetarian")}
							type="checkbox"
							id="create-is-veg"
							className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
						/>
						<label htmlFor="create-is-veg" className="text-sm font-medium text-gray-700">
							Vegetarian
						</label>
					</div>

					{/* Image Upload */}
					<div>
						<label
							htmlFor="create-image"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Image{" "}
							{!selectedCategory && (
								<span className="text-xs text-gray-400">(select category first)</span>
							)}
						</label>
						{imagePreview ? (
							<div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
								<Image src={imagePreview} alt="Preview" fill className="object-cover" />
								<button
									type="button"
									onClick={() => {
										setImageFile(null);
										setImagePreview(null);
										if (fileInputRef.current) fileInputRef.current.value = "";
									}}
									className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
								>
									<X size={14} className="text-gray-600" />
								</button>
							</div>
						) : (
							<button
								type="button"
								disabled={!selectedCategory}
								onClick={() => fileInputRef.current?.click()}
								className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Upload size={24} />
								<span className="text-sm">Click to upload image</span>
							</button>
						)}
						<input
							id="create-image"
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
						/>
					</div>

					{/* Buttons */}
					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isPending}
							className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)]/90 transition-colors shadow-lg shadow-[var(--primary)]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isPending ? (
								<>
									<Loader2 size={18} className="animate-spin" />
									{isUploading ? "Uploading..." : "Creating..."}
								</>
							) : (
								<>
									<Plus size={18} />
									Create Item
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

/* ==================== EDIT MODAL ==================== */

interface EditMenuItemModalProps {
	item: MenuItem;
	onClose: () => void;
}

function EditMenuItemModal({ item, onClose }: EditMenuItemModalProps) {
	const updateMutation = useUpdateMenuItem();
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(item.image_url);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<UpdateMenuItemFormValues>({
		resolver: zodResolver(updateMenuItemSchema),
		defaultValues: {
			item_name: item.item_name,
			category: item.category as (typeof CATEGORIES)[number],
			description: item.description ?? "",
			price: item.price,
			is_vegetarian: item.is_vegetarian,
		},
	});

	const selectedCategory = watch("category");

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setImageFile(file);
		const reader = new FileReader();
		reader.onloadend = () => setImagePreview(reader.result as string);
		reader.readAsDataURL(file);
	};

	const onSubmit = async (data: UpdateMenuItemFormValues) => {
		let imageUrl: string | undefined;

		if (imageFile && data.category) {
			setIsUploading(true);
			try {
				imageUrl = await uploadMenuItemImage(imageFile, data.category);
			} catch {
				setIsUploading(false);
				return;
			}
			setIsUploading(false);
		}

		updateMutation.mutate(
			{
				id: item.menu_item_id,
				payload: {
					...data,
					...(imageUrl !== undefined ? { image_url: imageUrl } : {}),
				},
			},
			{ onSuccess: () => onClose() }
		);
	};

	const isPending = updateMutation.isPending || isUploading;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-gray-900">Edit Menu Item</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={20} className="text-gray-500" />
					</button>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Item Name */}
					<div>
						<label
							htmlFor="edit-item-name"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Item Name <span className="text-red-500">*</span>
						</label>
						<input
							id="edit-item-name"
							{...register("item_name")}
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
						/>
						{errors.item_name && (
							<p className="text-sm text-red-500 mt-1">{errors.item_name.message}</p>
						)}
					</div>

					{/* Category */}
					<div>
						<label
							htmlFor="edit-category"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Category <span className="text-red-500">*</span>
						</label>
						<select
							id="edit-category"
							{...register("category")}
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all capitalize"
						>
							{CATEGORIES.map((cat) => (
								<option key={cat} value={cat} className="capitalize">
									{cat}
								</option>
							))}
						</select>
						{errors.category && (
							<p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
						)}
					</div>

					{/* Description */}
					<div>
						<label
							htmlFor="edit-description"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Description
						</label>
						<textarea
							id="edit-description"
							{...register("description")}
							rows={3}
							placeholder="Brief description of the dish..."
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all resize-none"
						/>
						{errors.description && (
							<p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
						)}
					</div>

					{/* Price */}
					<div>
						<label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1.5">
							Price (₹) <span className="text-red-500">*</span>
						</label>
						<input
							id="edit-price"
							{...register("price")}
							type="number"
							min="0"
							step="0.01"
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
						/>
						{errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
					</div>

					{/* Vegetarian Toggle */}
					<div className="flex items-center gap-3">
						<input
							{...register("is_vegetarian")}
							type="checkbox"
							id="edit-is-veg"
							className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
						/>
						<label htmlFor="edit-is-veg" className="text-sm font-medium text-gray-700">
							Vegetarian
						</label>
					</div>

					{/* Image Upload */}
					<div>
						<label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-1.5">
							Image
						</label>
						{imagePreview ? (
							<div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
								<Image src={imagePreview} alt="Preview" fill className="object-cover" />
								<button
									type="button"
									onClick={() => {
										setImageFile(null);
										setImagePreview(null);
										if (fileInputRef.current) fileInputRef.current.value = "";
									}}
									className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
								>
									<X size={14} className="text-gray-600" />
								</button>
							</div>
						) : (
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
							>
								<Upload size={24} />
								<span className="text-sm">Click to upload image</span>
							</button>
						)}
						<input
							id="edit-image"
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
						/>
					</div>

					{/* Buttons */}
					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isPending}
							className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)]/90 transition-colors shadow-lg shadow-[var(--primary)]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isPending ? (
								<>
									<Loader2 size={18} className="animate-spin" />
									{isUploading ? "Uploading..." : "Saving..."}
								</>
							) : (
								<>
									<Pencil size={18} />
									Save Changes
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

/* ==================== DELETE CONFIRM MODAL ==================== */

interface DeleteMenuItemModalProps {
	item: MenuItem;
	onClose: () => void;
}

function DeleteMenuItemModal({ item, onClose }: DeleteMenuItemModalProps) {
	const deleteMutation = useDeleteMenuItem();

	const handleDelete = () => {
		deleteMutation.mutate(item.menu_item_id, {
			onSuccess: () => onClose(),
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold text-gray-900">Delete Menu Item</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={20} className="text-gray-500" />
					</button>
				</div>

				<p className="text-gray-600 mb-2">
					Are you sure you want to delete{" "}
					<span className="font-semibold text-gray-900">{item.item_name}</span>?
				</p>
				<p className="text-sm text-red-500 mb-6">This action cannot be undone.</p>

				<div className="flex gap-3">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={handleDelete}
						disabled={deleteMutation.isPending}
						className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{deleteMutation.isPending ? (
							<>
								<Loader2 size={18} className="animate-spin" />
								Deleting...
							</>
						) : (
							<>
								<Trash2 size={18} />
								Delete
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

/* ==================== MAIN PAGE ==================== */

export default function StaffMenuPage() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");

	const { data, isLoading } = useMenuItems();
	const {
		isCreateModalOpen,
		editTarget,
		deleteTarget,
		openCreateModal,
		closeCreateModal,
		setEditTarget,
		setDeleteTarget,
	} = useMenuItemStore();

	const menuItems: MenuItem[] = data?.data ?? [];

	const filteredItems = useMemo(() => {
		let items = menuItems;

		if (categoryFilter !== "all") {
			items = items.filter((item) => item.category === categoryFilter);
		}

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			items = items.filter(
				(item) =>
					item.item_name.toLowerCase().includes(query) ||
					item.description?.toLowerCase().includes(query)
			);
		}

		return items;
	}, [menuItems, categoryFilter, searchQuery]);

	const categoryCounts = useMemo(() => {
		const counts: Record<string, number> = { all: menuItems.length };
		for (const cat of CATEGORIES) {
			counts[cat] = menuItems.filter((item) => item.category === cat).length;
		}
		return counts;
	}, [menuItems]);

	return (
		<div className="min-h-screen bg-white">
			{/* HEADER */}
			<div className="bg-[var(--primary)] text-white">
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center gap-4 mb-6">
						<button
							onClick={() => router.push("/staff")}
							className="p-2 hover:bg-white/10 rounded-full"
						>
							<ArrowLeft size={24} />
						</button>
						<div>
							<h1 className="text-3xl font-bold">Menu Management</h1>
							<p className="opacity-80">Manage cafeteria menu items</p>
						</div>
					</div>
				</div>
			</div>

			{/* CONTENT */}
			<div className="container mx-auto px-4 py-6">
				{/* Search & Filters */}
				<div className="flex flex-col sm:flex-row gap-4 mb-6">
					<div className="relative flex-1">
						<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search menu items..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
						/>
					</div>

					<button
						onClick={openCreateModal}
						className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition-colors shadow-lg shadow-[var(--primary)]/25 shrink-0"
					>
						<Plus size={18} />
						<span className="hidden sm:inline">Add Menu Item</span>
						<span className="sm:hidden">Add</span>
					</button>
				</div>

				{/* Category Tabs */}
				<div className="flex gap-2 mb-6 overflow-x-auto pb-1">
					{[{ label: "All", key: "all" }, ...CATEGORIES.map((c) => ({ label: c, key: c }))].map(
						({ label, key }) => (
							<button
								key={key}
								onClick={() => setCategoryFilter(key)}
								className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap capitalize ${
									categoryFilter === key
										? "bg-[var(--primary)] text-white border-[var(--primary)]"
										: key !== "all" && categoryColors[key]
											? categoryColors[key]
											: "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
								}`}
							>
								{label} ({categoryCounts[key] ?? 0})
							</button>
						)
					)}
				</div>

				{/* Grid */}
				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<StaffMenuItemCardSkeleton key={i} />
						))}
					</div>
				) : filteredItems.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16">
						<UtensilsCrossed size={48} className="text-gray-300 mb-4" />
						<p className="text-gray-500 font-medium text-lg">No menu items found</p>
						<p className="text-gray-400 text-sm mt-1">
							{searchQuery || categoryFilter !== "all"
								? "Try adjusting your search or filters"
								: "Add your first menu item to get started"}
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{filteredItems.map((item) => (
							<StaffMenuItemCard
								key={item.menu_item_id}
								item={item}
								onEdit={setEditTarget}
								onDelete={setDeleteTarget}
							/>
						))}
					</div>
				)}

				{/* Footer count */}
				{!isLoading && filteredItems.length > 0 && (
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-500">
							Showing {filteredItems.length} of {menuItems.length} items
						</p>
					</div>
				)}
			</div>

			{/* MODALS */}
			{isCreateModalOpen && <CreateMenuItemModal onClose={closeCreateModal} />}

			{editTarget && <EditMenuItemModal item={editTarget} onClose={() => setEditTarget(null)} />}

			{deleteTarget && (
				<DeleteMenuItemModal item={deleteTarget} onClose={() => setDeleteTarget(null)} />
			)}
		</div>
	);
}
