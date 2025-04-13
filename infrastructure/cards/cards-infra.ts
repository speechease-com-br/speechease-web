import { CardReadAloud } from "@/main/entities/card-read-aloud.type";
import { httpClient } from "../httpClient/httpClient";
import { HttpResponse } from "../httpClient/types";
import { PronunciationFeedback } from "@/main/entities/pronunciation-feedback";

export interface ICardService {
  getAll(userId?: string): Promise<HttpResponse<{ data: CardReadAloud[] }>>;
  edit(value: CardReadAloud): Promise<HttpResponse<{ data: CardReadAloud }>>;
  delete(cardId: string): Promise<HttpResponse<{ data: HttpResponse }>>;
  create(card: CardReadAloud): Promise<HttpResponse<{ data: HttpResponse }>>;
  speechAnalysis({ audioBase64, expectedText }: { audioBase64: string; expectedText: string }): Promise<HttpResponse<{ data: PronunciationFeedback }>>
}

export class HttpCardService implements ICardService {
  async getAll(userId?: string) {
    return httpClient.request({
      path: `/read-aloud/all/${userId}`,
      method: "get",
    });
  }

  async speechAnalysis({ audioBase64, expectedText }: { audioBase64: string; expectedText: string }) {
    return httpClient.request({
      path: "/speech/analysis/unscripted",
      method: "post",
      body: {
        audioBase64,
        expectedText,
      }
    })
  }

  async getById(userId?: string) {
    return httpClient.request({
      path: `/read-aloud/card/${userId}`,
      method: "get",
    });
  }

  async edit(value: CardReadAloud) {
    return httpClient.request({
      path: `/read-aloud/update/${value.uuid}`,
      method: "put",
      body: {
        ...value
      }
    });
  }

  async delete(cardId?: string) {
    return httpClient.request({
      path: `/read-aloud/delete/${cardId}`,
      method: "delete",
    });
  }
  async create({
    category,
    createdAt,
    difficulty,
    englishText,
    translation,
    userId,
  }: CardReadAloud) {
    return httpClient.request({
      method: "post",
      path: "/read-aloud/create",
      body: {
        category,
        createdAt,
        difficulty,
        englishText,
        translation,
        userId,
      },
    });
  }
}
