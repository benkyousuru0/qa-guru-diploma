import { request } from "@playwright/test";

export class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.context = null;
  }

  async initContext() {
    this.context = await request.newContext({ baseURL: this.baseUrl });
  }

  async post(endpoint, data) {
    return this.context.post(endpoint, {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      data
    });
  }

  async get(endpoint) {
    return this.context.get(endpoint);
  }
}
