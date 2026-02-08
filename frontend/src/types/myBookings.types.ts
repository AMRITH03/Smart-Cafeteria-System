// Types for GET /api/bookings/my-bookings response

export type MyBookingStatus =
	| "pending_payment"
	| "confirmed"
	| "completed"
	| "cancelled"
	| "no_show";

export interface MyBookingSlot {
	slot_id: number;
	slot_name: string;
	slot_date: string;
	start_time: string;
	end_time: string;
	is_active: boolean;
	max_capacity: number;
	current_occupancy: number;
	payment_window_start: string;
	payment_window_end: string;
	created_at: string;
}

export interface MyBookingMenuItem {
	id: number;
	user_id: string;
	quantity: number;
	subtotal: number;
	booking_id: number;
	unit_price: number;
	menu_item_id: number;
	menu_items: {
		price: number;
		category: string;
		image_url: string;
		item_name: string;
		created_at: string;
		description: string;
		total_stock: number;
		is_available: boolean;
		menu_item_id: number;
		is_vegetarian: boolean;
	};
}

export interface MyBookingGroupMember {
	user_id: string;
	joined_at: string;
	member_id: string;
	booking_id: number;
}

export interface MyBooking {
	booking_id: number;
	booking_reference: string;
	slot_id: number;
	primary_user_id: string;
	is_group_booking: boolean;
	group_size: number;
	booking_status: MyBookingStatus;
	total_amount: number;
	wallet_balance: number;
	payment_deadline: string;
	created_at: string;
	booking_type: string;
	meal_slots: MyBookingSlot;
	booking_menu_items: MyBookingMenuItem[];
	booking_group_members: MyBookingGroupMember[];
	slot: MyBookingSlot;
	menu_items: MyBookingMenuItem[];
	group_members: MyBookingGroupMember[];
}

export interface MyBookingsResponse {
	success: boolean;
	message: string;
	data: MyBooking[];
}

// Types for GET /api/bookings/:bookingId response
export interface BookingDetailResponse {
	success: boolean;
	message: string;
	data: MyBooking;
}

// Types for PUT /api/bookings/:bookingId request
export interface UpdateBookingPayload {
	menu_items_add?: { menu_item_id: number; quantity: number }[];
	menu_items_remove?: { menu_item_id: number; quantity: number }[];
	group_member_ids_add?: string[];
	group_member_ids_remove?: string[];
}

// Types for PUT /api/bookings/:bookingId response
export interface UpdateBookingResponse {
	success: boolean;
	message: string;
	data: MyBooking;
}

// Types for DELETE /api/bookings/:bookingId response
export interface CancelBookingResponse {
	success: boolean;
	message: string;
}

// Types for GET /auth/user/:userId response
export interface UserDetailResponse {
	success: boolean;
	data: {
		id: string;
		email: string;
		first_name: string;
		last_name: string;
		college_id: string;
	};
}
