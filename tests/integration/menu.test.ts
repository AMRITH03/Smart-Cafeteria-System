import { startBackend, stopBackend, BASE_URL } from "./serverHelper";

jest.setTimeout(60000);

describe("Menu integration tests (Reachability)", () => {
  beforeAll(async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = BASE_URL;
    await startBackend();
  });

  afterAll(() => {
    stopBackend();
  });

  test("MealSlot Service Reachability", async () => {
    const { MealSlotService } = await import("../../frontend/src/services/staff/MealSlotService");

    let reached = false;
    try {
      await MealSlotService.getAllMenuItems();
      reached = true;
    } catch (err: any) {
      if (err.response) {
        reached = true;
      }
    }

    expect(reached).toBe(true);
  });
});
