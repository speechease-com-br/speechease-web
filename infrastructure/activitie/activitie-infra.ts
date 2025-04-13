import { httpClient } from "../httpClient/httpClient";
import { HttpResponse } from "../httpClient/types";

interface IActivitie {
  register({
    endPractice,
    startPractice,
    userId,
  }: ActivitieProps): Promise<HttpResponse<{ data: any }>>;
}

type ActivitieProps = {
  userId: string;
  startPractice: string;
  endPractice: string;
};

export class HttpActivitie implements IActivitie {
  async register(body: ActivitieProps): Promise<any> {
    return httpClient.request({
      path: "/student/create/activitie",
      method: "post",
      body: body,
    });
  }
}
