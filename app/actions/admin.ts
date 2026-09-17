"use server";

import { createAdminSession, destroyAdmin, destroySession, isAdmin, hashPin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function adminLogin(pin: string) {
  if (pin !== (process.env.ADMIN_PIN ?? "123456")) return { error: "wrong" };
  await createAdminSession();
  redirect("/admin");
}

export async function adminLogout() {
  await destroyAdmin();
  await destroySession();
  redirect("/login");
}

export async function toggleShopDisabled(shopId: string, disabled: boolean) {
  if (!(await isAdmin())) return { error: "auth" };
  await prisma.shop.update({ where: { id: shopId }, data: { disabled } });
  revalidatePath("/admin");
  return { ok: true };
}

export async function resetSellerPin(userId: string) {
  if (!(await isAdmin())) return { error: "auth" };
  await prisma.user.update({
    where: { id: userId },
    data: { pinHash: await hashPin("1234") },
  });
  return { ok: true };
}
