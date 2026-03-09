import { startBackend, stopBackend, BASE_URL } from "../integration/serverHelper";

jest.setTimeout(60000);

describe("Menu Regression Tests", () => {
  beforeAll(async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = BASE_URL;
    await startBackend();
  });

  afterAll(() => {
    stopBackend();
  });

  test("Create meal slot with invalid payload should return a valid error response", async () => {
    const { MealSlotService } = await import("../../frontend/src/services/staff/MealSlotService");

    const invalidPayload: any = { 
      name: "", 
      start_time: "invalid", 
      end_time: "invalid" 
    };

    try {
      await MealSlotService.createMealSlot(invalidPayload);
      fail("MealSlotService.createMealSlot should have thrown an error for invalid payload");
    } catch (err: any) {
      expect(err.response).toBeDefined();
      expect(err.response.status).toBeGreaterThanOrEqual(400);
      console.log("Caught expected error response for invalid meal slot payload");
    }
  });

  test("Create slot menu mapping with invalid payload should return a valid error response", async () => {
    const { MealSlotService } = await import("../../frontend/src/services/staff/MealSlotService");

    const invalidPayload: any = { 
      meal_slot_id: "invalid", 
      menu_item_ids: [] 
    };

    try {
      await MealSlotService.createSlotMenuMapping(invalidPayload);
      fail("MealSlotService.createSlotMenuMapping should have thrown an error for invalid payload");
    } catch (err: any) {
      expect(err.response).toBeDefined();
      expect(err.response.status).toBeGreaterThanOrEqual(400);
      console.log("Caught expected error response for invalid menu mapping payload");
    }
  });
});
