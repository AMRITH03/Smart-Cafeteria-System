import { startBackend, stopBackend, BASE_URL } from "../integration/serverHelper";

jest.setTimeout(60000);

describe("Auth Regression Tests", () => {
  beforeAll(async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = BASE_URL;
    await startBackend();
  });

  afterAll(() => {
    stopBackend();
  });

  test("Login with invalid credentials should return a valid error response", async () => {
    const { AuthService } = await import("../../frontend/src/services/auth.service");

    const invalidPayload = { email: "nonexistent@example.com", password: "wrongpassword" };

    try {
      await AuthService.login(invalidPayload);
      // If it doesn't throw, the test should fail because invalid credentials should fail
      fail("AuthService.login should have thrown an error for invalid credentials");
    } catch (err: any) {
      expect(err.response).toBeDefined();
      expect(err.response.status).toBeGreaterThanOrEqual(400);
      console.log("Caught expected error response for invalid login");
    }
  });

  test("Login with empty payload should return a valid error response", async () => {
    const { AuthService } = await import("../../frontend/src/services/auth.service");

    const emptyPayload = { email: "", password: "" };

    try {
      await AuthService.login(emptyPayload);
      fail("AuthService.login should have thrown an error for empty payload");
    } catch (err: any) {
      expect(err.response).toBeDefined();
      expect(err.response.status).toBeGreaterThanOrEqual(400);
      console.log("Caught expected error response for empty login payload");
    }
  });
});
