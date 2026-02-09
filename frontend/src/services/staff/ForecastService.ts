import { apiPost } from "@/lib/api";

// Forecast input types
export interface ForecastInput {
	date: string;
	crowd_expected: number;
	weather: "sunny" | "cloudy" | "rainy" | "hot" | "cold";
}

// Meal prediction for a single slot
export interface MealPrediction {
	menu_item_id: number;
	item_name: string;
	category: string;
	predicted_quantity: number;
	confidence: number; // 0-100
}

// Forecast response for a slot
export interface SlotForecast {
	slot_name: string;
	slot_id: number;
	start_time: string;
	end_time: string;
	expected_footfall: number;
	predictions: MealPrediction[];
}

// Full forecast response
export interface ForecastResponse {
	success: boolean;
	data: {
		date: string;
		weather: string;
		total_expected_crowd: number;
		slots: SlotForecast[];
	};
}

export const ForecastService = {
	// Generate meal forecast
	generateForecast: (payload: ForecastInput): Promise<ForecastResponse> =>
		apiPost("/api/forecast/generate", payload),
};
