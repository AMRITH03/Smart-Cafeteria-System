import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MealSlotService } from "@/services/staff/MealSlotService";
import type {
	CreateMealSlotPayload,
	CreateSlotMenuMappingPayload,
} from "@/src/types/staff/mealSlot.types";

// Get all available menu items from DB
export function useAllMenuItems() {
	return useQuery({
		queryKey: ["allMenuItems"],
		queryFn: () => MealSlotService.getAllMenuItems(),
		staleTime: 5 * 60 * 1000,
	});
}

// Create a meal slot
export function useCreateMealSlot() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateMealSlotPayload) => MealSlotService.createMealSlot(payload),
		onSuccess: () => {
			toast.success("Meal slot created successfully!");
			queryClient.invalidateQueries({ queryKey: ["staffSlots"] });
		},
		onError: () => {
			toast.error("Failed to create meal slot.");
		},
	});
}

// Create slot-menu mappings
export function useCreateSlotMenuMapping() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateSlotMenuMappingPayload) =>
			MealSlotService.createSlotMenuMapping(payload),
		onSuccess: () => {
			toast.success("Menu items mapped to slot successfully!");
			queryClient.invalidateQueries({ queryKey: ["staffSlots"] });
		},
		onError: () => {
			toast.error("Failed to map menu items to slot.");
		},
	});
}
