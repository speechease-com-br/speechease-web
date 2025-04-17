
import axios, { AxiosResponse } from "axios";
import { HttpClient, HttpRequest, HttpResponse } from "./types";

export class AxiosHttpClient implements HttpClient {
  private apiUrl = process.env.SPEECH_EASE_API_URL;
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