import { hash, verify } from "@node-rs/argon2";
import bcrypt from "bcryptjs";

const ARGON2 = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export function isBcryptHash(stored: string) {
  return stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$");
}

export async function hashPin(pin: string) {
  return hash(pin, ARGON2);
}

export async function verifyPin(pin: string, stored: string) {
  if (isBcryptHash(stored)) {
    return bcrypt.compare(pin, stored);
  }
  return verify(stored, pin);
}
