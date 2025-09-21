import { httpClient } from "../http/httpClient";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";

export class HttpAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<{ accessToken: string; user: any }> {
    const response = await httpClient.request({
      path: "/account/login",
      method: "post",
      body: { email, password },
    });

    return {
      accessToken: response.body.data.accessToken,
      user: response.body.data.user,
    };
  }

  async signup(email: string, password: string, name: string): Promise<{ accessToken: string; user: any }> {
    const response = await httpClient.request({
      path: "/create/account",
      method: "post",
      body: { email, password, name },
    });

    return {
      accessToken: response.body.data.accessToken,
      user: response.body.data.user,
    };
  }

  async logout(): Promise<void> {
    // Implementar logout se necessário
    return Promise.resolve();
  }

  async getCurrentUser(accessToken: string): Promise<any> {
    const response = await httpClient.request({
      path: "/me",
      method: "get",
      param: {
        accessToken: accessToken?.replace(/"/g, ""),
      },
    });

    return response.body.data;
  }
}
