export class OrdersService {
  constructor(api) {
    this.api = api;
  }

  async checkout(userName) {
    const payload = { userName }; 
    const response = await this.api.post("/api/checkout", {
      data: payload
    });
    const body = await response.json();
    return { response, body };
  }

  async getOrders(userName) {
    const response = await this.api.get(`/api/orders?userName=${userName}`);
    const body = await response.json();
    return { response, body };
  }

}
