import { describe, expect, it } from "vitest";
import { DUE_CAP_POISHA, PLATFORM_FEE_POISHA } from "@/lib/billing/ledger";
import { shopScope } from "@/lib/tenant";

describe("platform fee", () => {
  it("is ৳5 per order", () => {
    expect(PLATFORM_FEE_POISHA).toBe(500);
    expect(DUE_CAP_POISHA).toBe(50000);
  });
});

describe("tenancy", () => {
  it("scopes queries by shopId", () => {
    expect(shopScope("shop_1")).toEqual({ shopId: "shop_1" });
  });
});
