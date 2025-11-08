import { test as baseTest, expect } from "@playwright/test";
import HomePage from "../pages/HomePage.js";
import LoginPage from "../pages/LoginPage.js";

export const test = baseTest.extend({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  }
});

export function createPages(page) {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  return { homePage, loginPage };
};

export { expect };
