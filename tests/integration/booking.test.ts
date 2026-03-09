import { startBackend, stopBackend, BASE_URL } from "./serverHelper";

jest.setTimeout(60000);

describe("Booking integration tests (Reachability)", () => {
  beforeAll(async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = BASE_URL;
    await startBackend();
  });

  afterAll(() => {
    stopBackend();
  });

  test("Booking Service Reachability", async () => {
    const { BookingService } = await import("../../frontend/src/services/booking.service");

    let reached = false;
    try {
      await BookingService.getAvailableSlots();
      reached = true;
    } catch (err: any) {
      if (err.response) {
        reached = true;
      }
    }

    expect(reached).toBe(true);
  });
});