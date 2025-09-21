import { CardReadAloud } from "../../domain/entities/card-read-aloud.type";
import { httpClient } from "../http/httpClient";
import { ICardRepository } from "../../domain/repositories/ICardRepository";
import { PronunciationFeedback } from "../../domain/entities/pronunciation-feedback";

export class HttpCardRepository implements ICardRepository {
  async getCards(category?: string, difficulty?: string): Promise<CardReadAloud[]> {
    const response = await httpClient.request({
      path: "/read-aloud/all",
      method: "get",
      param: { category, difficulty },
    });

    return response.body.data;
  }

  async getCardById(id: string): Promise<CardReadAloud> {
    const response = await httpClient.request({
      path: `/read-aloud/card/${id}`,
      method: "get",
    });

    return response.body.data;
  }

  async createCard(card: Omit<CardReadAloud, 'uuid' | 'createdAt'>): Promise<CardReadAloud> {
    const response = await httpClient.request({
      method: "post",
      path: "/read-aloud/create",
      body: {
        ...card,
        createdAt: new Date().toISOString(),
      },
    });

    return response.body.data;
  }

  async updateCard(id: string, card: Partial<CardReadAloud>): Promise<CardReadAloud> {
    const response = await httpClient.request({
      path: `/read-aloud/update/${id}`,
      method: "put",
      body: card,
    });

    return response.body.data;
  }

  async deleteCard(id: string): Promise<void> {
    await httpClient.request({
      path: `/read-aloud/delete/${id}`,
      method: "delete",
    });
  }

  // Método adicional para análise de fala
  async speechAnalysis({ audioBase64, expectedText }: { audioBase64: string; expectedText: string }): Promise<PronunciationFeedback> {
    const response = await httpClient.request({
      path: "/speech/analysis/unscripted",
      method: "post",
      body: {
        audioBase64,
        expectedText,
      }
    });

    return response.body.data;
  }
}
