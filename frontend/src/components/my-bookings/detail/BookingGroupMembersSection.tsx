"use client";

import { useState, useRef, useEffect } from "react";
import { Users, Pencil, Trash2, UserPlus, Search, X, Loader2, Check } from "lucide-react";
import { useGroupMemberDetails, useUpdateBooking } from "@/src/hooks/myBookings/useBookingDetail";
import { useSearchUsers } from "@/src/hooks/useBooking";
import type { MyBookingGroupMember } from "@/src/types/myBookings.types";
import type { UserSearchResult } from "@/src/types/booking.types";

interface Props {
	bookingId: number;
	groupMembers: MyBookingGroupMember[];
	isEditable: boolean;
}

export function BookingGroupMembersSection({ bookingId, groupMembers, isEditable }: Props) {
	const [isEditing, setIsEditing] = useState(false);
	const [membersToRemove, setMembersToRemove] = useState<string[]>([]);
	const [membersToAdd, setMembersToAdd] = useState<UserSearchResult[]>([]);
	const [showAddModal, setShowAddModal] = useState(false);

	const memberIds = groupMembers.map((m) => m.user_id);
	const { data: memberDetails, isLoading: loadingDetails } = useGroupMemberDetails(memberIds);
	const { mutateAsync: updateBooking, isPending: isUpdating } = useUpdateBooking(bookingId);

	const handleToggleRemove = (userId: string) => {
		setMembersToRemove((prev) =>
			prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
		);
	};

	const handleAddMember = (user: UserSearchResult) => {
		if (!membersToAdd.find((m) => m.id === user.id) && !memberIds.includes(user.id)) {
			setMembersToAdd((prev) => [...prev, user]);
		}
		setShowAddModal(false);
	};

	const handleRemoveNewMember = (userId: string) => {
		setMembersToAdd((prev) => prev.filter((m) => m.id !== userId));
	};

	const handleSave = async () => {
		const payload: { group_member_ids_add?: string[]; group_member_ids_remove?: string[] } = {};

		if (membersToAdd.length > 0) {
			payload.group_member_ids_add = membersToAdd.map((m) => m.id);
		}
		if (membersToRemove.length > 0) {
			payload.group_member_ids_remove = membersToRemove;
		}

		if (!payload.group_member_ids_add && !payload.group_member_ids_remove) {
			setIsEditing(false);
			return;
		}

		await updateBooking(payload);
		setMembersToRemove([]);
		setMembersToAdd([]);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setMembersToRemove([]);
		setMembersToAdd([]);
		setIsEditing(false);
	};

	return (
		<div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
			<div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Users size={18} className="text-blue-500" />
					<h3 className="text-base font-bold text-gray-800">
						Group Members ({groupMembers.length})
					</h3>
				</div>
				{isEditable && !isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
					>
						<Pencil size={12} />
						Edit Members
					</button>
				)}
				{isEditing && (
					<div className="flex items-center gap-2">
						<button
							onClick={handleCancel}
							className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={handleSave}
							disabled={isUpdating}
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
						>
							{isUpdating ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
							Update
						</button>
					</div>
				)}
			</div>

			<div className="divide-y divide-gray-100">
				{loadingDetails ? (
					<div className="px-6 py-8 text-center text-sm text-gray-400">
						<Loader2 size={20} className="animate-spin inline mr-2" />
						Loading members...
					</div>
				) : (
					<>
						{/* Existing members */}
						{groupMembers.map((member, index) => {
							const detail = memberDetails?.[index];
							const isMarkedForRemoval = membersToRemove.includes(member.user_id);

							return (
								<div
									key={member.user_id}
									className={`flex items-center gap-3 px-6 py-4 transition-colors ${
										isMarkedForRemoval ? "bg-red-50/60 opacity-60" : ""
									}`}
								>
									{/* Avatar */}
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
										{detail ? `${detail.first_name[0]}${detail.last_name[0]}` : "?"}
									</div>

									{/* Info */}
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold text-gray-900">
											{detail ? `${detail.first_name} ${detail.last_name}` : "Loading..."}
										</p>
										<p className="text-xs text-gray-500 truncate">
											{detail?.email ?? member.user_id}
										</p>
									</div>

									{/* College ID */}
									<span className="text-xs text-gray-400 font-mono shrink-0">
										{detail?.college_id ?? ""}
									</span>

									{/* Remove button in edit mode */}
									{isEditing && (
										<button
											onClick={() => handleToggleRemove(member.user_id)}
											className={`p-2 rounded-lg transition-colors ${
												isMarkedForRemoval
													? "text-red-500 bg-red-100"
													: "text-gray-400 hover:text-red-500 hover:bg-red-100"
											}`}
											title={isMarkedForRemoval ? "Undo remove" : "Remove member"}
										>
											<Trash2 size={16} />
										</button>
									)}
								</div>
							);
						})}

						{/* Newly added members (not yet saved) */}
						{membersToAdd.map((member) => (
							<div key={member.id} className="flex items-center gap-3 px-6 py-4 bg-green-50/40">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-sm shrink-0">
									{member.first_name[0]}
									{member.last_name[0]}
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold text-gray-900">
										{member.first_name} {member.last_name}
										<span className="ml-2 text-[10px] text-green-600 font-bold uppercase">New</span>
									</p>
									<p className="text-xs text-gray-500 truncate">{member.email}</p>
								</div>
								<span className="text-xs text-gray-400 font-mono shrink-0">
									{member.college_id}
								</span>
								<button
									onClick={() => handleRemoveNewMember(member.id)}
									className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-100 transition-colors"
								>
									<Trash2 size={16} />
								</button>
							</div>
						))}
					</>
				)}
			</div>

			{/* Add Members button in edit mode */}
			{isEditing && (
				<div className="px-6 py-4 border-t">
					<button
						onClick={() => setShowAddModal(true)}
						className="flex items-center gap-2 w-full justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 py-3 text-sm font-bold text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all"
					>
						<UserPlus size={16} />
						Add Members
					</button>
				</div>
			)}

			{/* Add Members Modal */}
			{showAddModal && (
				<AddMembersModal
					existingMemberIds={[...memberIds, ...membersToAdd.map((m) => m.id)]}
					onSelect={handleAddMember}
					onClose={() => setShowAddModal(false)}
				/>
			)}
		</div>
	);
}

// ---- Add Members Modal (similar to GroupMemberSearch in checkout) ----

function AddMembersModal({
	existingMemberIds,
	onSelect,
	onClose,
}: {
	existingMemberIds: string[];
	onSelect: (user: UserSearchResult) => void;
	onClose: () => void;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const { data: searchResults, isLoading, isFetching } = useSearchUsers(debouncedQuery);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const filteredResults =
		searchResults?.filter((user) => !existingMemberIds.includes(user.id)) ?? [];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
					<div className="flex items-center gap-2">
						<UserPlus size={18} className="text-blue-600" />
						<h3 className="text-base font-bold text-gray-800">Add Members</h3>
					</div>
					<button
						onClick={onClose}
						className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
					>
						<X size={18} className="text-gray-500" />
					</button>
				</div>

				{/* Search */}
				<div className="p-4">
					<div className="relative">
						<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							ref={inputRef}
							type="text"
							placeholder="Search by email..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
						/>
						{isFetching && debouncedQuery.length >= 2 && (
							<Loader2
								size={16}
								className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-500"
							/>
						)}
					</div>
				</div>

				{/* Results */}
				<div className="max-h-60 overflow-y-auto border-t">
					{isLoading && debouncedQuery.length >= 2 ? (
						<div className="p-6 text-center text-sm text-gray-400">
							<Loader2 size={16} className="animate-spin inline mr-2" />
							Searching...
						</div>
					) : debouncedQuery.length < 2 ? (
						<div className="p-6 text-center text-sm text-gray-400">
							Type at least 2 characters to search
						</div>
					) : filteredResults.length > 0 ? (
						filteredResults.map((user) => (
							<button
								key={user.id}
								onClick={() => onSelect(user)}
								className="flex w-full items-center gap-3 px-6 py-3 text-left hover:bg-blue-50 transition-colors border-b last:border-0"
							>
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
									{user.first_name[0]}
									{user.last_name[0]}
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold text-gray-900 truncate">
										{user.first_name} {user.last_name}
									</p>
									<p className="text-xs text-gray-500 truncate">{user.email}</p>
								</div>
								<span className="text-xs text-gray-400 font-mono">{user.college_id}</span>
							</button>
						))
					) : (
						<div className="p-6 text-center text-sm text-gray-400">
							No users found for &quot;{debouncedQuery}&quot;
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
