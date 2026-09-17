import { getSessionUser, isAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await isAdmin();
    const user = await getSessionUser();
    if (!user && !admin) {
      return NextResponse.json({ loggedIn: false });
    }
    const isPlatformAdmin =
      admin || user?.role === "owner" || user?.role === "admin" || user?.phone === "01700000000";
    const dashboardUrl = isPlatformAdmin
      ? "/admin"
      : user?.shop
      ? "/app"
      : "/#register";

    return NextResponse.json({
      loggedIn: true,
      phone: user?.phone ?? null,
      role: isPlatformAdmin ? "owner" : user?.role ?? "seller",
      hasShop: Boolean(user?.shop),
      shopName: user?.shop?.name ?? null,
      dashboardUrl,
    });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}
