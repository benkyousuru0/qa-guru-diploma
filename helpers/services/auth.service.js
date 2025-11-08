export class AuthService {
  constructor(api) {
    this.api = api;
  }

  async login(username, password) {
    const response = await this.api.post("/api/signin", { userName: username, password });
    const body = await response.json();
    return { response, body };
  }
}
