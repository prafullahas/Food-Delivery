import { describe, it, expect } from "vitest";
import { calculateOrderAmount, validateOrderItems } from "../utils/orderPricingUtils.js";

describe("Order Pricing Utils", () => {
  describe("calculateOrderAmount", () => {
    it("should calculate correct total for valid items", () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 }
      ];
      expect(calculateOrderAmount(items, 2)).toBe(252); // 200 + 50 + 2 delivery
    });

    it("should add delivery fee to total", () => {
      const items = [
        { price: 100, quantity: 1 }
      ];
      expect(calculateOrderAmount(items, 5)).toBe(105); // 100 + 5 delivery
    });

    it("should use default delivery fee of 2 when not specified", () => {
      const items = [
        { price: 100, quantity: 1 }
      ];
      expect(calculateOrderAmount(items)).toBe(102); // 100 + 2 delivery
    });

    it("should return 0 for empty items array", () => {
      expect(calculateOrderAmount([])).toBe(0); // No items = no order = 0
    });

    it("should return 0 for null or undefined items", () => {
      expect(calculateOrderAmount(null)).toBe(0);
      expect(calculateOrderAmount(undefined)).toBe(0);
    });

    it("should skip items with invalid price", () => {
      const items = [
        { price: 100, quantity: 1 },
        { price: -10, quantity: 1 }, // invalid negative price
        { price: "invalid", quantity: 1 } // invalid non-number price
      ];
      expect(calculateOrderAmount(items)).toBe(102); // 100 + 2 delivery
    });

    it("should skip items with invalid quantity", () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: -1 }, // invalid negative quantity
        { price: 50, quantity: 0 }, // invalid zero quantity
        { price: 50, quantity: "invalid" } // invalid non-integer quantity
      ];
      expect(calculateOrderAmount(items)).toBe(202); // 200 + 2 delivery
    });

    it("should handle items with missing quantity (default to 0)", () => {
      const items = [
        { price: 100, quantity: 1 },
        { price: 50 } // missing quantity
      ];
      expect(calculateOrderAmount(items)).toBe(102); // 100 + 2 delivery
    });

    it("should calculate correctly for large quantities", () => {
      const items = [
        { price: 10, quantity: 100 }
      ];
      expect(calculateOrderAmount(items)).toBe(1002); // 1000 + 2 delivery
    });
  });

  describe("validateOrderItems", () => {
    it("should return valid for correct item structure", () => {
      const items = [
        { _id: "123", quantity: 2 },
        { _id: "456", quantity: 1 }
      ];
      const result = validateOrderItems(items);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should return invalid for non-array items", () => {
      const result = validateOrderItems("not an array");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Items must be an array");
    });

    it("should return invalid for empty items array", () => {
      const result = validateOrderItems([]);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Items array cannot be empty");
    });

    it("should return invalid for items missing _id", () => {
      const items = [
        { quantity: 2 }
      ];
      const result = validateOrderItems(items);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("missing or invalid _id");
    });

    it("should return invalid for items with invalid _id type", () => {
      const items = [
        { _id: 123, quantity: 2 } // number instead of string
      ];
      const result = validateOrderItems(items);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("missing or invalid _id");
    });

    it("should return invalid for items with invalid quantity", () => {
      const items = [
        { _id: "123", quantity: -1 }
      ];
      const result = validateOrderItems(items);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("quantity must be a positive integer");
    });

    it("should return invalid for items with zero quantity", () => {
      const items = [
        { _id: "123", quantity: 0 }
      ];
      const result = validateOrderItems(items);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("quantity must be a positive integer");
    });

    it("should return invalid for items with non-integer quantity", () => {
      const items = [
        { _id: "123", quantity: 1.5 }
      ];
      const result = validateOrderItems(items);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("quantity must be a positive integer");
    });

    it("should collect multiple validation errors", () => {
      const items = [
        { quantity: 2 }, // missing _id
        { _id: "456", quantity: -1 } // invalid quantity
      ];
      const result = validateOrderItems(items);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(2);
    });

    it("should handle items with missing quantity", () => {
      const items = [
        { _id: "123" } // missing quantity
      ];
      const result = validateOrderItems(items);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("quantity must be a positive integer");
    });
  });
});
