import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { StaffService, QueueToken, ServingToken } from "@/services/staff/StaffService";

// Get slots for staff management
export function useStaffSlots(mealType?: string, date?: string) {
	const params: { date?: string; meal_type?: string } = {};
	if (date) params.date = date;
	if (mealType) params.meal_type = mealType;

	return useQuery({
		queryKey: ["staffSlots", mealType, date],
		queryFn: () => StaffService.getSlots(params),
		staleTime: 30 * 1000, // 30 seconds for staff dashboard
	});
}

// Get single slot details
export function useSlotDetails(slotId: string) {
	return useQuery({
		queryKey: ["slotDetails", slotId],
		queryFn: () => StaffService.getSlotDetails(slotId),
		staleTime: 10 * 1000,
		enabled: !!slotId,
	});
}

// Get service counters
export function useServiceCounters() {
	return useQuery({
		queryKey: ["serviceCounters"],
		queryFn: () => StaffService.getCounters(),
		staleTime: 10 * 1000, // 10 seconds - counters update frequently
		refetchInterval: 10 * 1000, // Auto-refetch every 10 seconds
	});
}

// Get queue status for a slot
export function useQueueStatus(slotId: string, date?: string) {
	return useQuery({
		queryKey: ["queueStatus", slotId, date],
		queryFn: () => StaffService.getQueueStatus(slotId, date),
		staleTime: 5 * 1000, // 5 seconds - queue updates very frequently
		refetchInterval: 5 * 1000, // Auto-refetch every 5 seconds
		enabled: !!slotId,
	});
}

// Activate meal slot (activate all pending tokens)
export function useActivateMealSlot() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (slotId: string) => StaffService.activateMealSlot(slotId),
		onSuccess: (data) => {
			toast.success(`Slot activated! ${data.data.activated_tokens} tokens activated.`);
			queryClient.invalidateQueries({ queryKey: ["slotDetails"] });
			queryClient.invalidateQueries({ queryKey: ["queueStatus"] });
			queryClient.invalidateQueries({ queryKey: ["serviceCounters"] });
		},
		onError: () => {
			toast.error("Failed to activate meal slot.");
		},
	});
}

// Mark token as served
export function useMarkTokenServed() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tokenId: string) => StaffService.markTokenServed(tokenId),
		onSuccess: () => {
			toast.success("Token marked as served!");
			queryClient.invalidateQueries({ queryKey: ["queueStatus"] });
			queryClient.invalidateQueries({ queryKey: ["serviceCounters"] });
		},
		onError: () => {
			toast.error("Failed to mark token as served.");
		},
	});
}

// Call next token for a counter
export function useCallNextToken() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (counterId: string) => StaffService.callNextToken(counterId),
		onSuccess: (data) => {
			if (data.data) {
				toast.success(`Now serving token ${data.data.token_number}`);
			} else {
				toast.success("No more tokens in queue");
			}
			queryClient.invalidateQueries({ queryKey: ["queueStatus"] });
			queryClient.invalidateQueries({ queryKey: ["serviceCounters"] });
		},
		onError: () => {
			toast.error("Failed to call next token.");
		},
	});
}

// Close a counter
export function useCloseCounter() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (counterId: string) => StaffService.closeCounter(counterId),
		onSuccess: () => {
			toast.success("Counter closed. Tokens reassigned.");
			queryClient.invalidateQueries({ queryKey: ["serviceCounters"] });
			queryClient.invalidateQueries({ queryKey: ["queueStatus"] });
		},
		onError: () => {
			toast.error("Failed to close counter.");
		},
	});
}

// Reopen a counter
export function useReopenCounter() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (counterId: string) => StaffService.reopenCounter(counterId),
		onSuccess: () => {
			toast.success("Counter reopened successfully!");
			queryClient.invalidateQueries({ queryKey: ["serviceCounters"] });
		},
		onError: () => {
			toast.error("Failed to reopen counter.");
		},
	});
}

// Activate a token
export function useActivateToken() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tokenId: string) => StaffService.activateToken(tokenId),
		onSuccess: () => {
			toast.success("Token activated!");
			queryClient.invalidateQueries({ queryKey: ["queueStatus"] });
		},
		onError: () => {
			toast.error("Failed to activate token.");
		},
	});
}

export type { QueueToken, ServingToken };
