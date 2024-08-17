import { test, expect } from "@playwright/test";
const url = process.env.Url;

test("create and delete session", async ({ page }) => {
  await page.context().storageState({ path: "storageState.json" });
  await page.goto(url); // comment this out for local testing
  // await page.goto("http://localhost:3000/xlogs/calendar"); // uncomment for local testing

  // a walkme popup shows here sometimes
  const walkmePopup = page.locator(".wm-shoutout").getByText("Close", { exact: true });
  await page.waitForTimeout(500);
  if (await walkmePopup.isVisible()) {
    await walkmePopup.click();
    await walkmePopup.isHidden();
  }

  await page.getByRole("button", { name: "Create Session" }).click();
  await page.getByLabel("Title").click();
  await page.getByLabel("Title").fill("playwrightsessiontest");
  await page.getByLabel("Type student name...").click();
  await page.getByRole("combobox", { name: "Type student name..." }).fill("test");
  await page.getByRole("option", { name: "test student" }).click();
  await page.getByRole("button", { name: "Create" }).click();
  await page.waitForURL(`${url}xlogs/calendar`); // comment out for local testing
  await page.waitForTimeout(500);
  const regex = /\+\d+ more/;
  const more = await page.locator("a").getByText(regex);
  const locator = page.locator('a:has-text("playwrightsessiontest")');
  let count = await locator.count();
  while (count > 0) {
    if (await more.count()) {
      await more.first().click();
      await page
        .locator(".fc-popover-body > div:nth-child(2) > .fc-event > div > .css-1l597ps")
        .click();
    } else {
      await locator.first().click();
    }
    await page
      .locator("div")
      .filter({ hasText: /^BackAll Student ViewDocumentation View$/ })
      .getByRole("img")
      .nth(1)
      .click();
    await page
      .locator("div")
      .filter({ hasText: /^Delete Session\(s\)$/ })
      .click();
    await page.getByRole("button", { name: "DELETE" }).click();
    await page.waitForURL(`${url}xlogs/calendar`);
    await page.waitForTimeout(500);
    count = await locator.count();
  }
  await expect(locator).toHaveCount(0);
});
