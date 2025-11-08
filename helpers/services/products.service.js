export class ProductsService {
  constructor(api) {
    this.api = api;
  }

  async getProducts(userName) {
    const response = await this.api.get(`/api/products?userName=${userName}`);
    const body = await response.json();
    return body.products || []; 
  }
}
