import { expect, test } from "@playwright/test";

test("landing shows ৳5 pricing and register", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toContainText(/৫|5/);
  await expect(page.locator("body")).toContainText(/দোকান|register|দোকানদারি|DokanDari/i);
});

test("health endpoint reports db", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.db).toBe(true);
});
