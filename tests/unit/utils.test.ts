import { describe, expect, it } from "vitest";
import { generateOrderCode, isValidBdPhone, normalizePhone, poishaToTaka } from "@/lib/utils";

describe("phone", () => {
  it("accepts BD 01NXXXXXXXX", () => {
    expect(isValidBdPhone("01700000000")).toBe(true);
    expect(isValidBdPhone("8801711111111")).toBe(true);
    expect(isValidBdPhone("123")).toBe(false);
  });

  it("normalizes 880 prefix", () => {
    expect(normalizePhone("8801712345678")).toBe("01712345678");
  });
});

describe("money", () => {
  it("stores poisha as integers", () => {
    expect(poishaToTaka(500)).toBe(5);
    expect(poishaToTaka(50000)).toBe(500);
  });
});

describe("order code", () => {
  it("matches HL-YYMMDD-NNNN", () => {
    expect(generateOrderCode(new Date("2026-09-16T00:00:00Z"))).toMatch(/^HL-260916-\d{4}$/);
  });
});
