import dotenv from "dotenv";
dotenv.config();

import { test, expect } from "@playwright/test";
import { ApiService, AuthService, ProductsService, OrdersService } from "../../helpers/services/index.js";
import config from "../../playwright.config.js";

test.describe("API Tests", () => {
  let api, auth, products, orders;
  
  test.beforeEach(async () => {
    api = new ApiService(config.use.baseURL);
    await api.initContext();

    auth = new AuthService(api);
    products = new ProductsService(api);
    orders = new OrdersService(api);
  });

  test("Логин под активного юзера @api @positive", async () => {
    const { response } = await auth.login(process.env.USER_WITH_ORDERS, process.env.PASSWORD);
    expect(response.status()).toBe(200);
  });

  test("Логин под заблокированного юзера @api @negative", async () => {
    const { response, body } = await auth.login(process.env.BLOCKED_USER, process.env.PASSWORD);
    expect(response.status()).toBe(422);
    expect(body.errorMessage).toBe("Your account has been locked.");
  });

  test("Список продуктов @api @positive", async () => {
    const list = await products.getProducts(process.env.USER_WITH_ORDERS);
    expect(list.length).toBeGreaterThan(0);
  });
  
  test("Оформление заказа с пустой корзиной @api @negative", async () => {
    await auth.login(process.env.USER_WITH_ORDERS, process.env.PASSWORD);
    const { response } = await orders.checkout();
    expect(response.status()).toBe(422);
  });

  test("Список оформленных заказов @api @positive", async () => {
    await auth.login(process.env.USER_WITH_ORDERS, process.env.PASSWORD);
    const { response } = await orders.getOrders(process.env.USER_WITH_ORDERS);
    expect(response.status()).toBe(200);
  });

  test("Список оформленных заказов пуст @api @negative", async () => {
    await auth.login(process.env.USER_NO_ORDERS, process.env.PASSWORD);
    const { response, body } = await orders.getOrders();
    expect(response.status()).toBe(404);
    expect(body.message).toBe("No orders found");
  });
});