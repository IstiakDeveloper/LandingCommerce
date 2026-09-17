import { describe, expect, it } from "vitest";
import { hashPin, isBcryptHash, verifyPin } from "@/lib/hash";

describe("pin hashing", () => {
  it("hashes with argon2 and verifies", async () => {
    const hashed = await hashPin("1234");
    expect(hashed.startsWith("$argon2")).toBe(true);
    expect(isBcryptHash(hashed)).toBe(false);
    expect(await verifyPin("1234", hashed)).toBe(true);
    expect(await verifyPin("0000", hashed)).toBe(false);
  });

  it("still verifies legacy bcrypt hashes", async () => {
    const bcrypt = await import("bcryptjs");
    const legacy = await bcrypt.hash("1234", 10);
    expect(isBcryptHash(legacy)).toBe(true);
    expect(await verifyPin("1234", legacy)).toBe(true);
  });
});
