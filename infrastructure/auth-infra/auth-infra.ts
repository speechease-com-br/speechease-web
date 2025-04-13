import { httpClient } from "../httpClient/httpClient";
import { HttpResponse } from "../httpClient/types";
interface IAuthService {
  login(params: LoginParams): Promise<HttpResponse<{ data: any }>>;
  signup(params: SignupParams): Promise<HttpResponse<{ data: any }>>;
}

type LoginParams = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};

type SignupParams = {
  email: string;
  password: string;
};

export class HttpAuthService implements IAuthService {
  async signup(params: LoginParams): Promise<any> {
    return httpClient.request({
      path: "/create/account",
      method: "post",
      body: params,
    });
  }

  async login(params: SignupParams): Promise<any> {
    return httpClient.request({
      path: "/account/login",
      method: "post",
      body: params,
    });
  }
}
