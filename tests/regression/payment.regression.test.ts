import { startBackend, stopBackend, BASE_URL } from "../integration/serverHelper";

jest.setTimeout(60000);

describe("Payment Regression Tests", () => {
  beforeAll(async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = BASE_URL;
    await startBackend();
  });

  afterAll(() => {
    stopBackend();
  });

  test("Create transaction with invalid payload should return a valid error response", async () => {
    const { PaymentService } = await import("../../frontend/src/services/payment/PaymentService");

    const invalidPayload: any = { 
      amount: -100, 
      payment_method: "INVALID", 
      order_id: "" 
    };

    try {
      await PaymentService.createTransaction(invalidPayload);
      fail("PaymentService.createTransaction should have thrown an error for invalid payload");
    } catch (err: any) {
      expect(err.response).toBeDefined();
      expect(err.response.status).toBeGreaterThanOrEqual(400);
      console.log("Caught expected error response for invalid transaction payload");
    }
  });

  test("Get bill summary for invalid order ID should return a valid error response", async () => {
    const { PaymentService } = await import("../../frontend/src/services/payment/PaymentService");

    try {
      await PaymentService.getBillSummary("invalid-order-id");
      fail("PaymentService.getBillSummary should have thrown an error for invalid order ID");
    } catch (err: any) {
      expect(err.response).toBeDefined();
      expect(err.response.status).toBeGreaterThanOrEqual(400);
      console.log("Caught expected error response for invalid order ID");
    }
  });
});
