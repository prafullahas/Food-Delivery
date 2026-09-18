import { describe, it, expect } from "vitest";
import { canTransitionStatus, normalizeStatus, isValidStatus, isTerminalStatus } from "../utils/orderStatusUtils.js";

describe("Order Status Utils", () => {
  describe("canTransitionStatus", () => {
    it("should allow valid forward transitions", () => {
      expect(canTransitionStatus("Placed", "Preparing")).toBe(true);
      expect(canTransitionStatus("Preparing", "Ready for Pickup")).toBe(true);
      expect(canTransitionStatus("Ready for Pickup", "Out for Delivery")).toBe(true);
      expect(canTransitionStatus("Out for Delivery", "Delivered")).toBe(true);
    });

    it("should allow cancellation from active states", () => {
      expect(canTransitionStatus("Placed", "Cancelled")).toBe(true);
      expect(canTransitionStatus("Preparing", "Cancelled")).toBe(true);
      expect(canTransitionStatus("Ready for Pickup", "Cancelled")).toBe(true);
      expect(canTransitionStatus("Out for Delivery", "Cancelled")).toBe(true);
    });

    it("should reject skipped transitions", () => {
      expect(canTransitionStatus("Placed", "Delivered")).toBe(false);
      expect(canTransitionStatus("Placed", "Out for Delivery")).toBe(false);
      expect(canTransitionStatus("Preparing", "Delivered")).toBe(false);
    });

    it("should reject backward transitions", () => {
      expect(canTransitionStatus("Delivered", "Preparing")).toBe(false);
      expect(canTransitionStatus("Out for Delivery", "Preparing")).toBe(false);
      expect(canTransitionStatus("Preparing", "Placed")).toBe(false);
    });

    it("should reject transitions from terminal states", () => {
      expect(canTransitionStatus("Delivered", "Preparing")).toBe(false);
      expect(canTransitionStatus("Delivered", "Cancelled")).toBe(false);
      expect(canTransitionStatus("Cancelled", "Placed")).toBe(false);
      expect(canTransitionStatus("Cancelled", "Preparing")).toBe(false);
    });

    it("should handle legacy status 'Food Processing'", () => {
      expect(canTransitionStatus("Food Processing", "Preparing")).toBe(true);
      expect(canTransitionStatus("Food Processing", "Cancelled")).toBe(true);
      expect(canTransitionStatus("Food Processing", "Delivered")).toBe(false);
    });

    it("should handle legacy status 'Out for delivery'", () => {
      expect(canTransitionStatus("Out for delivery", "Delivered")).toBe(true);
      expect(canTransitionStatus("Out for delivery", "Cancelled")).toBe(true);
      expect(canTransitionStatus("Out for delivery", "Preparing")).toBe(false);
    });

    it("should reject invalid status values", () => {
      expect(canTransitionStatus("InvalidStatus", "Placed")).toBe(false);
      expect(canTransitionStatus("Placed", "InvalidStatus")).toBe(false);
      expect(canTransitionStatus("", "Placed")).toBe(false);
      expect(canTransitionStatus("Placed", "")).toBe(false);
    });
  });

  describe("normalizeStatus", () => {
    it("should normalize legacy statuses", () => {
      expect(normalizeStatus("Food Processing")).toBe("Placed");
      expect(normalizeStatus("Out for delivery")).toBe("Out for Delivery");
    });

    it("should return unchanged for new statuses", () => {
      expect(normalizeStatus("Placed")).toBe("Placed");
      expect(normalizeStatus("Preparing")).toBe("Preparing");
      expect(normalizeStatus("Delivered")).toBe("Delivered");
      expect(normalizeStatus("Cancelled")).toBe("Cancelled");
    });

    it("should return unchanged for unknown statuses", () => {
      expect(normalizeStatus("UnknownStatus")).toBe("UnknownStatus");
    });
  });

  describe("isValidStatus", () => {
    it("should return true for valid statuses", () => {
      expect(isValidStatus("Placed")).toBe(true);
      expect(isValidStatus("Preparing")).toBe(true);
      expect(isValidStatus("Ready for Pickup")).toBe(true);
      expect(isValidStatus("Out for Delivery")).toBe(true);
      expect(isValidStatus("Delivered")).toBe(true);
      expect(isValidStatus("Cancelled")).toBe(true);
    });

    it("should return true for legacy statuses", () => {
      expect(isValidStatus("Food Processing")).toBe(true);
      expect(isValidStatus("Out for delivery")).toBe(true);
    });

    it("should return false for invalid statuses", () => {
      expect(isValidStatus("InvalidStatus")).toBe(false);
      expect(isValidStatus("")).toBe(false);
      expect(isValidStatus("Processing")).toBe(false);
    });
  });

  describe("isTerminalStatus", () => {
    it("should return true for terminal states", () => {
      expect(isTerminalStatus("Delivered")).toBe(true);
      expect(isTerminalStatus("Cancelled")).toBe(true);
    });

    it("should return false for active states", () => {
      expect(isTerminalStatus("Placed")).toBe(false);
      expect(isTerminalStatus("Preparing")).toBe(false);
      expect(isTerminalStatus("Ready for Pickup")).toBe(false);
      expect(isTerminalStatus("Out for Delivery")).toBe(false);
    });

    it("should handle legacy statuses", () => {
      expect(isTerminalStatus("Food Processing")).toBe(false);
      expect(isTerminalStatus("Out for delivery")).toBe(false);
    });
  });
});
