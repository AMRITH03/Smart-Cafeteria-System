"use client";

import { useState } from "react";
import Link from "next/link";
import {
	ArrowLeft,
	ClipboardList,
	ChevronLeft,
	ChevronRight,
	Filter,
	Activity,
	Shield,
	Search,
	RefreshCw,
} from "lucide-react";
import { useAuditLogs, useSystemLogs } from "@/hooks/admin/useAdmin";
import type { AuditLogFilters, SystemLogFilters } from "@/types/admin.types";

type TabType = "admin" | "system";

export default function AuditLogsPage() {
	const [activeTab, setActiveTab] = useState<TabType>("system");

	// ── Admin action filters ──
	const [adminFilters, setAdminFilters] = useState<AuditLogFilters>({
		page: 1,
		limit: 20,
		action_type: "",
		target_entity: "",
	});

	// ── System log filters ──
	const [systemFilters, setSystemFilters] = useState<SystemLogFilters>({
		level: "",
		event: "",
		search: "",
		limit: 100,
	});

	const { data: adminData, isLoading: adminLoading } = useAuditLogs(adminFilters);
	const {
		data: systemData,
		isLoading: systemLoading,
		refetch: refetchSystem,
	} = useSystemLogs(systemFilters);

	const actionColors: Record<string, string> = {
		CREATE: "bg-green-100 text-green-700",
		UPDATE: "bg-blue-100 text-blue-700",
		BLOCK: "bg-red-100 text-red-700",
		UNBLOCK: "bg-emerald-100 text-emerald-700",
		DEACTIVATE: "bg-gray-100 text-gray-600",
		REACTIVATE: "bg-teal-100 text-teal-700",
		ROLE_CHANGE: "bg-purple-100 text-purple-700",
	};

	const levelColors: Record<string, string> = {
		error: "bg-red-100 text-red-700",
		warn: "bg-amber-100 text-amber-700",
		info: "bg-blue-100 text-blue-700",
		debug: "bg-gray-100 text-gray-600",
		http: "bg-cyan-100 text-cyan-700",
	};

	const eventLabels: Record<string, string> = {
		http_request: "HTTP Request",
		auth_login: "Login",
		auth_logout: "Logout",
		auth_login_error: "Login Error",
		auth_logout_error: "Logout Error",
		auth_profile_complete: "Profile Complete",
		auth_profile_complete_error: "Profile Error",
	};

	const statusCodeColor = (code?: number) => {
		if (!code) return "text-gray-400";
		if (code >= 500) return "text-red-600 font-semibold";
		if (code >= 400) return "text-amber-600 font-semibold";
		if (code >= 300) return "text-blue-600";
		return "text-green-600 font-semibold";
	};

	return (
		<div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-secondary)]">
			{/* Header */}
			<div className="container mx-auto px-4 pt-8 pb-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-3">
					<Link
						href="/admin"
						className="rounded-xl bg-white/20 p-2 text-white hover:bg-white/30 transition"
					>
						<ArrowLeft size={20} />
					</Link>
					<div className="flex items-center gap-2">
						<ClipboardList className="text-white/90" size={24} />
						<div>
							<h1 className="text-2xl font-bold text-white sm:text-3xl">Audit Logs</h1>
							<p className="text-sm text-white/80">Track all system activity &amp; admin actions</p>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4">
				<div className="flex gap-2">
					<button
						onClick={() => setActiveTab("system")}
						className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
							activeTab === "system"
								? "bg-white text-orange-600 shadow-lg"
								: "bg-white/20 text-white hover:bg-white/30"
						}`}
					>
						<Activity size={16} />
						System Logs
					</button>
					<button
						onClick={() => setActiveTab("admin")}
						className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
							activeTab === "admin"
								? "bg-white text-orange-600 shadow-lg"
								: "bg-white/20 text-white hover:bg-white/30"
						}`}
					>
						<Shield size={16} />
						Admin Actions
					</button>
				</div>
			</div>

			{/* ════════════════════════ SYSTEM LOGS TAB ════════════════════════ */}
			{activeTab === "system" && (
				<>
					{/* Filters */}
					<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4">
						<div className="rounded-2xl bg-white/95 backdrop-blur-sm p-4 shadow-lg">
							<div className="flex flex-wrap gap-3 items-center">
								<Filter size={16} className="text-gray-400" />

								<select
									value={systemFilters.level || ""}
									onChange={(e) => setSystemFilters((prev) => ({ ...prev, level: e.target.value }))}
									className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
								>
									<option value="">All Levels</option>
									<option value="error">Error</option>
									<option value="warn">Warning</option>
									<option value="info">Info</option>
								</select>

								<select
									value={systemFilters.event || ""}
									onChange={(e) => setSystemFilters((prev) => ({ ...prev, event: e.target.value }))}
									className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
								>
									<option value="">All Events</option>
									<option value="http_request">HTTP Requests</option>
									<option value="auth_login">Login</option>
									<option value="auth_logout">Logout</option>
									<option value="auth_login_error">Login Errors</option>
									<option value="auth_profile_complete">Profile Complete</option>
								</select>

								<div className="relative">
									<Search
										size={14}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
									/>
									<input
										type="text"
										value={systemFilters.search || ""}
										onChange={(e) =>
											setSystemFilters((prev) => ({ ...prev, search: e.target.value }))
										}
										placeholder="Search logs..."
										className="rounded-xl border border-gray-200 bg-white pl-8 pr-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
									/>
								</div>

								<select
									value={systemFilters.limit || 100}
									onChange={(e) =>
										setSystemFilters((prev) => ({ ...prev, limit: Number(e.target.value) }))
									}
									className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
								>
									<option value={50}>50 logs</option>
									<option value={100}>100 logs</option>
									<option value={200}>200 logs</option>
									<option value={500}>500 logs</option>
								</select>

								<button
									onClick={() => refetchSystem()}
									className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2.5 text-sm text-white hover:bg-orange-600 transition"
								>
									<RefreshCw size={14} />
									Refresh
								</button>
							</div>
						</div>
					</div>

					{/* System Logs List */}
					<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10">
						<div className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden">
							{systemLoading ? (
								<div className="p-6 space-y-3">
									{Array.from({ length: 10 }).map((_, i) => (
										<div key={i} className="animate-pulse h-16 bg-gray-100 rounded-xl" />
									))}
								</div>
							) : systemData && systemData.logs.length > 0 ? (
								<>
									<div className="border-b px-5 py-3 bg-gray-50/50">
										<p className="text-sm text-gray-500 font-medium">
											{systemData.total} log entries from Grafana Loki
										</p>
									</div>
									<div className="divide-y max-h-[70vh] overflow-y-auto">
										{systemData.logs.map((log, idx) => (
											<div
												key={`${log.timestamp}-${idx}`}
												className="px-5 py-3 hover:bg-orange-50/30 transition-colors"
											>
												<div className="flex items-start justify-between gap-4 flex-wrap">
													<div className="min-w-0 flex-1">
														<div className="flex items-center gap-2 mb-1 flex-wrap">
															<span
																className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
																	levelColors[log.level] || "bg-gray-100 text-gray-600"
																}`}
															>
																{log.level.toUpperCase()}
															</span>

															{log.event && (
																<span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
																	{eventLabels[log.event] || log.event}
																</span>
															)}

															{log.method && (
																<span className="text-xs font-mono text-indigo-600 bg-indigo-50 rounded-full px-2 py-0.5">
																	{log.method}
																</span>
															)}

															{log.status_code && (
																<span
																	className={`text-xs font-mono ${statusCodeColor(log.status_code)}`}
																>
																	{log.status_code}
																</span>
															)}

															{log.duration_ms !== undefined && (
																<span className="text-xs text-gray-400">{log.duration_ms}ms</span>
															)}
														</div>

														<p className="text-sm text-gray-700 truncate">
															{log.path ? (
																<>
																	<span className="font-mono text-xs">{log.path}</span>
																	{log.message !== "HTTP request completed" && (
																		<span className="ml-2 text-gray-500">— {log.message}</span>
																	)}
																</>
															) : (
																log.message
															)}
														</p>

														{(log.user_email || log.user_id || log.ip) && (
															<p className="text-xs text-gray-400 mt-0.5">
																{log.user_email && (
																	<span className="mr-3">
																		{log.user_email}
																		{log.user_role && (
																			<span className="text-gray-300"> ({log.user_role})</span>
																		)}
																	</span>
																)}
																{log.ip && <span className="mr-3">IP: {log.ip}</span>}
															</p>
														)}

														{log.error && (
															<p className="text-xs text-red-500 mt-0.5 truncate">
																Error: {log.error}
															</p>
														)}
													</div>
													<span className="text-xs text-gray-400 whitespace-nowrap">
														{new Date(log.timestamp).toLocaleString()}
													</span>
												</div>
											</div>
										))}
									</div>
								</>
							) : (
								<div className="flex flex-col items-center justify-center p-12 text-center">
									<Activity className="text-gray-300 mb-3" size={48} />
									<p className="text-lg font-medium text-gray-500">No system logs found</p>
									<p className="text-sm text-gray-400 mt-1">
										Logs will appear here once the system starts generating activity
									</p>
								</div>
							)}
						</div>
					</div>
				</>
			)}

			{/* ════════════════════════ ADMIN ACTIONS TAB ════════════════════════ */}
			{activeTab === "admin" && (
				<>
					{/* Filters */}
					<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4">
						<div className="rounded-2xl bg-white/95 backdrop-blur-sm p-4 shadow-lg">
							<div className="flex flex-wrap gap-3 items-center">
								<Filter size={16} className="text-gray-400" />
								<select
									value={adminFilters.action_type || ""}
									onChange={(e) =>
										setAdminFilters((prev) => ({
											...prev,
											action_type: e.target.value,
											page: 1,
										}))
									}
									className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
								>
									<option value="">All Actions</option>
									<option value="CREATE">Create</option>
									<option value="UPDATE">Update</option>
									<option value="BLOCK">Block</option>
									<option value="UNBLOCK">Unblock</option>
									<option value="DEACTIVATE">Deactivate</option>
									<option value="REACTIVATE">Reactivate</option>
									<option value="ROLE_CHANGE">Role Change</option>
								</select>

								<select
									value={adminFilters.target_entity || ""}
									onChange={(e) =>
										setAdminFilters((prev) => ({
											...prev,
											target_entity: e.target.value,
											page: 1,
										}))
									}
									className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
								>
									<option value="">All Entities</option>
									<option value="user">User</option>
									<option value="staff">Staff</option>
									<option value="menu_item">Menu Item</option>
									<option value="meal_slot">Meal Slot</option>
								</select>

								<input
									type="date"
									value={adminFilters.start_date || ""}
									onChange={(e) =>
										setAdminFilters((prev) => ({
											...prev,
											start_date: e.target.value,
											page: 1,
										}))
									}
									className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
									placeholder="Start date"
								/>

								<input
									type="date"
									value={adminFilters.end_date || ""}
									onChange={(e) =>
										setAdminFilters((prev) => ({
											...prev,
											end_date: e.target.value,
											page: 1,
										}))
									}
									className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
									placeholder="End date"
								/>
							</div>
						</div>
					</div>

					{/* Admin Logs */}
					<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10">
						<div className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden">
							{adminLoading ? (
								<div className="p-6 space-y-3">
									{Array.from({ length: 10 }).map((_, i) => (
										<div key={i} className="animate-pulse h-16 bg-gray-100 rounded-xl" />
									))}
								</div>
							) : adminData && adminData.logs.length > 0 ? (
								<>
									<div className="divide-y">
										{adminData.logs.map((log) => (
											<div
												key={log.audit_id}
												className="px-5 py-4 hover:bg-orange-50/30 transition-colors"
											>
												<div className="flex items-start justify-between gap-4 flex-wrap">
													<div className="min-w-0 flex-1">
														<div className="flex items-center gap-2 mb-1 flex-wrap">
															<span
																className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
																	actionColors[log.action_type] || "bg-gray-100 text-gray-600"
																}`}
															>
																{log.action_type}
															</span>
															<span className="text-xs text-gray-400 bg-gray-50 rounded-full px-2 py-0.5">
																{log.target_entity}
															</span>
														</div>
														<p className="text-sm text-gray-700">
															{log.description || `${log.action_type} on ${log.target_entity}`}
														</p>
														<p className="text-xs text-gray-400 mt-1">
															by {log.admin_name || log.admin_email || log.admin_id}
														</p>
													</div>
													<span className="text-xs text-gray-400 whitespace-nowrap">
														{new Date(log.created_at).toLocaleString()}
													</span>
												</div>
											</div>
										))}
									</div>

									{/* Pagination */}
									{adminData.totalPages > 1 && (
										<div className="flex items-center justify-between border-t px-5 py-3">
											<p className="text-sm text-gray-500">
												Page {adminData.page} of {adminData.totalPages} ({adminData.total} logs)
											</p>
											<div className="flex items-center gap-2">
												<button
													onClick={() =>
														setAdminFilters((prev) => ({
															...prev,
															page: (prev.page || 1) - 1,
														}))
													}
													disabled={adminData.page <= 1}
													className="rounded-lg border p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
												>
													<ChevronLeft size={16} />
												</button>
												<button
													onClick={() =>
														setAdminFilters((prev) => ({
															...prev,
															page: (prev.page || 1) + 1,
														}))
													}
													disabled={adminData.page >= adminData.totalPages}
													className="rounded-lg border p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
												>
													<ChevronRight size={16} />
												</button>
											</div>
										</div>
									)}
								</>
							) : (
								<div className="flex flex-col items-center justify-center p-12 text-center">
									<ClipboardList className="text-gray-300 mb-3" size={48} />
									<p className="text-lg font-medium text-gray-500">No audit logs found</p>
									<p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
