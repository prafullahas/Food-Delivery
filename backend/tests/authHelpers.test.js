import { describe, it, expect } from "vitest";

describe("Auth Helpers", () => {
  describe("requireRole logic", () => {
    it("should allow access when user role matches required role", () => {
      const req = { user: { role: "admin" } };
      const res = {};
      const next = () => {};
      
      // Simulate requireRole("admin") middleware
      const requireRole = (role) => (req, res, next) => {
        if (req.user && req.user.role === role) {
          next();
        } else {
          throw new Error(`Access denied. ${role} role required.`);
        }
      };
      
      const middleware = requireRole("admin");
      
      expect(() => middleware(req, res, next)).not.toThrow();
    });

    it("should deny access when user role does not match required role", () => {
      const req = { user: { role: "user" } };
      const res = {};
      const next = () => {};
      
      const requireRole = (role) => (req, res, next) => {
        if (req.user && req.user.role === role) {
          next();
        } else {
          throw new Error(`Access denied. ${role} role required.`);
        }
      };
      
      const middleware = requireRole("admin");
      
      expect(() => middleware(req, res, next)).toThrow("Access denied. admin role required.");
    });

    it("should deny access when user is not set", () => {
      const req = {};
      const res = {};
      const next = () => {};
      
      const requireRole = (role) => (req, res, next) => {
        if (req.user && req.user.role === role) {
          next();
        } else {
          throw new Error(`Access denied. ${role} role required.`);
        }
      };
      
      const middleware = requireRole("admin");
      
      expect(() => middleware(req, res, next)).toThrow("Access denied. admin role required.");
    });
  });
});
