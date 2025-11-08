import { expect } from "@playwright/test";
import BasePage from "./BasePage.js";
import { SORTING } from "../helpers/constants/homePageConstants.js";

const LOCATORS = {
  productCards: ".shelf-item",
  productTitle: ".shelf-item__title",
  productPrice: ".shelf-item__price .val b",
  addToCartButton: ".shelf-item__buy-btn",
  cartIconQuantity: ".bag__quantity",
  cartItems: ".float-cart__shelf-container .shelf-item",
  cartSubtotal: ".sub-price__val",
  cartCheckoutButton: ".buy-btn",
  cartItemDelete: ".shelf-item__del",
  bagIcon: ".bag",
  floatCartOpen: ".float-cart--open",
  logoLink: ".Navbar_logo__26S5Y",
  sortSelect: ".sort select",
  loadingSpinner: ".loading-spinner",
  vendorCheckbox: (vendor) => `label:has(input[value="${vendor}"]) span.checkmark`,
};

class HomePage extends BasePage {
  constructor(page) {
    super(page);

    this.logoLink = page.locator(LOCATORS.logoLink);
    this.vendorFilters = {
      apple: page.locator(LOCATORS.vendorCheckbox("Apple")),
      samsung: page.locator(LOCATORS.vendorCheckbox("Samsung")),
      google: page.locator(LOCATORS.vendorCheckbox("Google")),
      oneplus: page.locator(LOCATORS.vendorCheckbox("OnePlus")),
    };
    this.sortSelect = page.locator(LOCATORS.sortSelect);
  
    this.productCards = page.locator(LOCATORS.productCards);
    this.addToCartButtons = page.locator(LOCATORS.addToCartButton);
    this.cartIconQuantity = page.locator(LOCATORS.cartIconQuantity);
    this.cartItems = page.locator(LOCATORS.cartItems);
    this.cartSubtotal = page.locator(LOCATORS.cartSubtotal);
    this.cartCheckoutButton = page.locator(LOCATORS.cartCheckoutButton);
    this.bagIcon = page.locator(LOCATORS.bagIcon).first();
    this.floatCartOpen = page.locator(LOCATORS.floatCartOpen);
    this.someLoadingIndicator = this.page.locator(LOCATORS.loadingSpinner);
  }

  async _click(locator) {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  async open() {
    await this.page.goto("/");
  }

  async clickLogo() {
    await this._click(this.logoLink);
  }

  //фильтры и сортировка
  async toggleVendorFilter(vendor) {
    const checkboxSpan = this.vendorFilters[vendor.toLowerCase()];
    await checkboxSpan.click();
    await this.page.waitForTimeout(500);
  }

  async getProductTitle(index) {
    return await this.productCards.nth(index).locator(LOCATORS.productTitle).innerText();
  }

  async sortBy(optionValue) {
    const countBefore = await this.getProductCount();
    await this.sortSelect.selectOption(optionValue);

    // Используйте селектор из LOCATORS, а не this.productCards.selector()
    await this.page.waitForFunction(
      (selector, firstTitle) => {
        const firstElement = document.querySelector(selector);
        if (!firstElement) {return false;}
        const title = firstElement.querySelector(".shelf-item__title").innerText;
        return title !== firstTitle;
      },
      LOCATORS.productCards,
      (await this.getProductTitle(0))
    );

    await this.page.waitForTimeout(200);
  }

  async getProductCount() {
    return await this.productCards.count();
  }

  async getProductPrice(index) {
    const priceText = await this.productCards.nth(index).locator(LOCATORS.productPrice).innerText();
    return parseFloat(priceText);
  }

  async expectPricesSorted(direction = SORTING.LOWEST_PRICE) {
    const prices = [];
    const count = await this.getProductCount();
    for (let i = 0; i < count; i++) {
      prices.push(await this.getProductPrice(i));
    }

    for (let i = 1; i < prices.length; i++) {
      if (direction === SORTING.LOWEST_PRICE) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      } else if (direction === SORTING.HIGHEST_PRICE) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
      } 
    }
  }

  //корзина
  async addProductToCart(index) {
    await this._click(this.addToCartButtons.nth(index));
  }

  async expectCartQuantity(expected) {
    const quantityText = await this.cartIconQuantity.innerText();
    expect(parseInt(quantityText, 10)).toBe(expected);
  }
  
  async getCartItemsCount() {
    return await this.cartItems.count();
  }

  async expectCartItemsCount(expected) {
    expect(await this.getCartItemsCount()).toBe(expected);
  }

  async getCartSubtotalValue() {
    const subtotalText = await this.cartSubtotal.innerText();
    return parseFloat(subtotalText.replace(/[^0-9.]/g, ""));
  }

  async removeCartItem(index = 0) {
    await this._click(this.bagIcon);
    await this.floatCartOpen.waitFor({ state: "visible" });
    const deleteButton = this.cartItems.nth(index).locator(LOCATORS.cartItemDelete);
    await this._click(deleteButton);
  }

  async expectCartEmpty() {
    await this.expectCartQuantity(0);
    await this.expectCartItemsCount(0);
    expect(await this.getCartSubtotalValue()).toBe(0);
  }
}

export default HomePage;
