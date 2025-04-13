
import axios, { AxiosResponse } from "axios";
import { HttpClient, HttpRequest, HttpResponse } from "./types";

export class AxiosHttpClient implements HttpClient {
  private apiUrl = "http://localhost:5002/api";
  async request(data: HttpRequest) {
    let axiosResponse: AxiosResponse<any, any> | undefined;
    try {
      axiosResponse = await axios.request({
        url: `${this.apiUrl}${data.path}`,
        method: data.method,
        data: data.body,
        headers: data.headers,
        params: { ...data.param },
      });
    } catch (error) {
      throw error;
    }
    return {
      body: axiosResponse?.data,
    };
  }
}

export const httpClient = new AxiosHttpClient();