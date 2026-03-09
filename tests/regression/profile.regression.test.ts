import { startBackend, stopBackend, BASE_URL } from "../integration/serverHelper";

jest.setTimeout(60000);

describe("Profile Regression Tests", () => {
  beforeAll(async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = BASE_URL;
    await startBackend();
  });

  afterAll(() => {
    stopBackend();
  });

  test("Unauthorized profile access should return a valid error response", async () => {
    const { ProfileService } = await import("../../frontend/src/services/profile/ProfileService");

    // We don't call setAuthToken, so this should fail
    try {
      await ProfileService.getProfile();
      fail("ProfileService.getProfile should have thrown an error for unauthorized access");
    } catch (err: any) {
      expect(err.response).toBeDefined();
      expect(err.response.status).toBeGreaterThanOrEqual(401);
      console.log("Caught expected error response for unauthorized profile access");
    }
  });

  test("Update profile with invalid payload should return a valid error response", async () => {
    const { ProfileService } = await import("../../frontend/src/services/profile/ProfileService");

    const invalidPayload: any = { 
      name: "", 
      phone: "invalid-phone" 
    };

    try {
      await ProfileService.updateProfile(invalidPayload);
      fail("ProfileService.updateProfile should have thrown an error for invalid payload");
    } catch (err: any) {
      expect(err.response).toBeDefined();
      expect(err.response.status).toBeGreaterThanOrEqual(400);
      console.log("Caught expected error response for invalid profile update payload");
    }
  });
});
