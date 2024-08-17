import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";
const password = process.env.UserPass || process.env.REACT_APP_USERPASS;
const email = process.env.REACT_APP_USEREMAIL || "test@msbconnect.com";
const url = process.env.Url || "http://localhost:3000/";
/**
 * Use the below variables when testing locally, always undo your changes before pushing
 * set your URL to http://localhost:3000 or whatever port you use
 */
// const password = process.env.REACT_APP_USERPASS;
// const url = process.env.REACT_APP_URL;
// const email = process.env.REACT_APP_USEREMAIL;

setup("authenticate", async ({ page, context }) => {
  // Perform authentication steps.
  await page.goto(url);
  await page.getByPlaceholder("Email Address").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  // const requestPromise = page.waitForRequest((request) =>
  //   request.url().includes("/xlogs/calendar"),
  // );
  await page.getByRole("button", { name: "Sign in" }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL(`${url}xlogs/calendar`);
  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
