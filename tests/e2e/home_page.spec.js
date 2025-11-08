import dotenv from "dotenv";
dotenv.config();

import config from "../../playwright.config.js";
import { test, expect } from "../../helpers/fixtures.js";
import { FILTERS, EXPECTED_PRODUCT_NAMES } from "../../helpers/constants/homePageConstants.js";

test.describe("Главный экран", () => {
  test.beforeEach(async ({ homePage, loginPage }) => {
    await homePage.open();
    await loginPage.open();
    await loginPage.login(process.env.LOGIN, process.env.PASSWORD);
    await homePage.open();
  });

  test("Логотип отправляет на главную страницу @ui @positive", async ({ homePage, page }) => {
    await expect(homePage.logoLink).toBeVisible();
    await homePage.clickLogo();
    await expect(page).toHaveURL(config.use.baseURL);
  });

  test.describe("Фильтры", () => {
    test("Выбор фильтра и проверка товаров @ui @positive", async ({ homePage }) => {
      await homePage.toggleVendorFilter(FILTERS.APPLE);

      const expectedName = EXPECTED_PRODUCT_NAMES[FILTERS.APPLE];
      const productCount = await homePage.getProductCount();
      expect(productCount).toBeGreaterThan(0);

      for (let i = 0; i < productCount; i++) {
        const title = (await homePage.getProductTitle(i)).toLowerCase();
        expect(title).toContain(expectedName);
      }

      await homePage.toggleVendorFilter(FILTERS.APPLE);
    });

    test("Снятие фильтра @ui @positive", async ({ homePage }) => {
      await homePage.toggleVendorFilter(FILTERS.GOOGLE);
      await expect(homePage.someLoadingIndicator).toBeHidden();
      const filteredCount = await homePage.getProductCount();

      await homePage.toggleVendorFilter(FILTERS.GOOGLE);
      await expect(homePage.someLoadingIndicator).toBeHidden();
      expect(await homePage.getProductCount()).toBeGreaterThan(filteredCount);
    });
  });

  test.describe("Корзина", () => {
    test("Добавление товара в корзину @ui @positive", async ({ homePage }) => {
      await homePage.addProductToCart(0);
      await homePage.expectCartQuantity(1);
      await homePage.expectCartItemsCount(1);
    });

    test("Удаление товара из корзины @ui @positive", async ({ homePage }) => {
      await homePage.addProductToCart(0);
      await homePage.removeCartItem(0);
      await homePage.expectCartEmpty();
    });
  });

});
