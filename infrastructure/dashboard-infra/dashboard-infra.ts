import { httpClient } from "../httpClient/httpClient";

export interface IDashboardService {
  me(accessToken?: string): Promise<any>;
}

export class HttpDashboardService implements IDashboardService {
  async me(accessToken?: string) {
    return httpClient.request({
      path: "/me",
      method: "get",
      param: {
        accessToken: accessToken?.replace(/"/g, ""),
      },
    });
  }
}
