import { startBackend, stopBackend, BASE_URL } from "./serverHelper";

jest.setTimeout(60000);

describe("Auth integration tests (Reachability)", () => {
  beforeAll(async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = BASE_URL;
    await startBackend();
  });

  afterAll(() => {
    stopBackend();
  });

  test("Login Service Reachability", async () => {
    const { AuthService } = await import("../../frontend/src/services/auth.service");

    const payload = { email: "test@example.com", password: "password" };

    let reached = false;
    try {
      await AuthService.login(payload);
      reached = true;
    } catch (err: any) {
      if (err.response) {
        reached = true;
      }
    }

    expect(reached).toBe(true);
  });
});
