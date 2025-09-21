import { httpClient } from "../http/httpClient";
import { IDashboardRepository } from "../../domain/repositories/IDashboardRepository";

export class HttpDashboardRepository implements IDashboardRepository {
  async getDashboardData(accessToken?: string): Promise<any> {
    const response = await httpClient.request({
      path: "/me",
      method: "get",
      param: {
        accessToken: accessToken?.replace(/"/g, ""),
      },
    });

    return response.body.data;
  }

  async getUserProgress(accessToken?: string): Promise<any> {
    const response = await httpClient.request({
      path: "/user/progress",
      method: "get",
      param: {
        accessToken: accessToken?.replace(/"/g, ""),
      },
    }); 

    return response.body.data;
  }

  async getStatistics(accessToken?: string): Promise<any> {
    const response = await httpClient.request({
      path: "/user/statistics",
      method: "get",
      param: {
        accessToken: accessToken?.replace(/"/g, ""),
      },
    });

    return response.body.data;
  }
}
