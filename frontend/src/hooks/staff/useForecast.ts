import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ForecastService, ForecastInput } from "@/services/staff/ForecastService";

export function useGenerateForecast() {
	return useMutation({
		mutationFn: (payload: ForecastInput) => ForecastService.generateForecast(payload),
		onSuccess: () => {
			toast.success("Forecast generated successfully!");
		},
		onError: () => {
			toast.error("Failed to generate forecast. Please try again.");
		},
	});
}
