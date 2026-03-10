import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStoreState {
	isAuthenticated: boolean;
	isHydrated: boolean;
	token: string | null;
	email: string | null;
	setAuthenticated: (value: boolean) => void;
	setToken: (token: string | null) => void;
	setEmail: (email: string | null) => void;
	logout: () => void;
	setHydrated: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
	persist(
		(set) => ({
			isAuthenticated: false,
			isHydrated: false,
			token: null,
			email: null,

			setToken: (token) => set({ token }),

			setEmail: (email) => set({ email }),

			setAuthenticated: (value) => set({ isAuthenticated: value }),

			logout: () => set({ isAuthenticated: false }),

			setHydrated: () => set({ isHydrated: true }),
		}),
		{
			name: "auth-store",

			onRehydrateStorage: () => (state) => {
				state?.setHydrated();
			},

			partialize: (state) => ({
				isAuthenticated: state.isAuthenticated,
				token: state.token,
				email: state.email,
			}),
		}
	)
);
