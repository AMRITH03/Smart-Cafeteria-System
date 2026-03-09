import { startBackend, stopBackend, BASE_URL } from "./serverHelper";

jest.setTimeout(60000);

describe("Profile integration tests (Reachability)", () => {
  beforeAll(async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = BASE_URL;
    await startBackend();
  });

  afterAll(() => {
    stopBackend();
  });

  test("Profile Service Reachability", async () => {
    const { ProfileService } = await import("../../frontend/src/services/profile/ProfileService");

    let reached = false;
    try {
      await ProfileService.getProfile();
      reached = true;
    } catch (err: any) {
      if (err.response) {
        reached = true;
      }
    }

    expect(reached).toBe(true);
  });
});
