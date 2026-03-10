export const API_ROUTES = {
	//Backend routes
	AUTH: {
		OAUTH_CALLBACK: "/api/auth/oauth/callback",
		COMPLETE_PROFILE: "/api/auth/complete-profile",
		LOGOUT: "/api/auth/signOut",
		PROFILE: "/api/auth/profile",
		USER_BY_ID: "/api/auth/user",
	},
	BOOKINGS: {
		SLOTS: "/api/bookings/slots",
		CREATE: "/api/bookings",
		SEARCH_USERS: "/api/bookings/users/search",
		MY_BOOKINGS: "/api/bookings/my-bookings",
		BY_ID: "/api/bookings", // GET/PUT/DELETE /api/bookings/:bookingId
		PAYMENTS: "/api/bookings/payments",
	},
	WALLET: {
		TRANSACTIONS: "/api/payments/personal-wallet/transactions",
	},
};
