import { startBackend, stopBackend, BASE_URL } from "./serverHelper";

jest.setTimeout(60000);

describe("Payment integration tests (Reachability)", () => {
  beforeAll(async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = BASE_URL;
    await startBackend();
  });

  afterAll(() => {
    stopBackend();
  });

  test("Payment Service Reachability", async () => {
    const { PaymentService } = await import("../../frontend/src/services/payment/PaymentService");

    let reached = false;
    try {
      await PaymentService.getBillSummary("test-id");
      reached = true;
    } catch (err: any) {
      if (err.response) {
        reached = true;
      }
    }

    expect(reached).toBe(true);
  });
});
