import dotenv from "dotenv";
dotenv.config();

import { expect } from "@playwright/test";
import config from "../playwright.config.js";
import BasePage from "./BasePage.js";

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.usernameInput = page.locator("#react-select-2-input");
    this.passwordInput = page.locator("#react-select-3-input");
    this.loginButton = page.locator("#login-btn");
    this.logo = page.locator(".Navbar_logo__26S5Y");

    this.waitingOverlay = page.locator("div.css-1s9izoc");
  }
  async open() {
    await this.page.goto(`${config.use.baseURL}/signin`);
    await this.loginButton.waitFor({ state: "visible" });
  }

  async isLogoVisible() {
    await expect(this.logo).toBeVisible();
  }

  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }
  
  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.passwordInput.press("Tab");
    await this.loginButton.waitFor({ state: "visible" });
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.submit();
  }
}

export default LoginPage;
