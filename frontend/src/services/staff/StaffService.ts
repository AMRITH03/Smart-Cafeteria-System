import { apiGet, apiPost } from "@/lib/api";

export interface SlotResponse {
	slot_id: number;
	slot_name: string;
	slot_date: string;
	start_time: string;
	end_time: string;
	max_capacity: number;
	current_occupancy: number;
	is_active: boolean;
	payment_window_start: string;
	payment_window_end: string;
	created_at: string;
	remaining_capacity: number;
	is_full: boolean;
	occupancy_percentage: number;
}

export interface SlotsListResponse {
	success: boolean;
	data: SlotResponse[];
}

export interface SingleSlotResponse {
	success: boolean;
	data: SlotResponse;
}

// Updated to match actual API response
export interface CounterResponse {
	counter_id: number;
	counter_name: string;
	is_active: boolean;
	current_queue_length: number;
	estimated_wait_time: number;
	current_serving_token: string | null;
}

export interface CountersResponse {
	success: boolean;
	data: CounterResponse[];
}

export interface MealItem {
	item_name: string;
	quantity: number;
}

export interface ServingToken {
	token_id: number;
	token_number: string;
	booking_reference: string;
	counter_id: number;
	token_status: string;
	queue_position: number;
	group_size: number;
	activated_at: string;
	meal_items: MealItem[];
}

export interface QueueToken {
	id: number;
	token_number: string;
	user_name: string;
	user_email: string;
	status: "pending" | "active" | "serving" | "served" | "cancelled";
	queue_position: number;
	counter_id: number | null;
	created_at: string;
}

export interface QueueStatusResponse {
	success: boolean;
	data: {
		slot_id: number;
		total_in_queue: number;
		currently_serving: string | null;
		tokens: QueueToken[];
	};
}

export interface MealSlotActivationResponse {
	success: boolean;
	data: {
		slot_id: number;
		total_tokens: number;
		activated_tokens: number;
		failed_tokens: number;
	};
}

export interface CounterActionResponse {
	success: boolean;
	data: CounterResponse;
}

// Helper to build query string
function buildQueryString(params: Record<string, string | undefined>): string {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined) {
			searchParams.append(key, value);
		}
	});
	const queryString = searchParams.toString();
	return queryString ? `?${queryString}` : "";
}

export const StaffService = {
	// Get available slots for a date and meal type
	getSlots: (params: { date?: string; meal_type?: string }): Promise<SlotsListResponse> =>
		apiGet(`api/bookings/slots${buildQueryString(params)}`),

	// Get single slot details
	getSlotDetails: (slotId: string): Promise<SingleSlotResponse> =>
		apiGet(`api/bookings/slots/${slotId}`),

	// Get service counters
	getCounters: (): Promise<CountersResponse> => apiGet("api/tokens/counters"),

	// Get queue status for a slot
	getQueueStatus: (slotId: string, date?: string): Promise<QueueStatusResponse> =>
		apiGet(`api/tokens/queue/status${buildQueryString({ slot_id: slotId, date })}`),

	// Activate meal slot (activate all pending tokens)
	activateMealSlot: (slotId: string): Promise<MealSlotActivationResponse> =>
		apiPost(`api/tokens/meal-slot/${slotId}/activate`, {}),

	// Mark token as served
	markTokenServed: (tokenId: string): Promise<{ success: boolean }> =>
		apiPost(`api/tokens/${tokenId}/mark-served`, {}),

	// Call next token for a counter
	callNextToken: (
		counterId: string
	): Promise<{ success: boolean; message: string; data: ServingToken | null }> =>
		apiPost(`api/tokens/counters/${counterId}/call-next`, {}),

	// Close a counter
	closeCounter: (counterId: string): Promise<CounterActionResponse> =>
		apiPost(`api/tokens/counters/${counterId}/close`, {}),

	// Reopen a counter
	reopenCounter: (counterId: string): Promise<CounterActionResponse> =>
		apiPost(`api/tokens/counters/${counterId}/reopen`, {}),

	// Activate a token
	activateToken: (tokenId: string): Promise<{ success: boolean }> =>
		apiPost(`api/tokens/${tokenId}/activate`, {}),
};
