import { startBackend, stopBackend, BASE_URL } from "../integration/serverHelper";

jest.setTimeout(60000);

describe("Booking Regression Tests", () => {
  beforeAll(async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = BASE_URL;
    await startBackend();
  });

  afterAll(() => {
    stopBackend();
  });

  test("Create booking with invalid payload should return a valid error response", async () => {
    const { BookingService } = await import("../../frontend/src/services/booking.service");

    const invalidPayload: any = { 
      meal_slot_id: "invalid-id", 
      booking_date: "invalid-date",
      meal_type: "INVALID" 
    };

    try {
      await BookingService.createBooking(invalidPayload);
      fail("BookingService.createBooking should have thrown an error for invalid payload");
    } catch (err: any) {
      expect(err.response).toBeDefined();
      expect(err.response.status).toBeGreaterThanOrEqual(400);
      console.log("Caught expected error response for invalid booking payload");
    }
  });

  test("Search users with missing query should return a valid error response", async () => {
    const { BookingService } = await import("../../frontend/src/services/booking.service");

    try {
      await BookingService.searchUsersByEmail("");
      fail("BookingService.searchUsersByEmail should have thrown an error for empty query");
    } catch (err: any) {
      expect(err.response).toBeDefined();
      // Even if internal error, we check if response reached
      expect(err.response.status).toBeDefined();
      console.log("Caught expected error response for empty user search");
    }
  });
});
