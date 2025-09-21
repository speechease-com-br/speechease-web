import { CardReadAloud } from '../entities/card-read-aloud.type';
import { ICardRepository } from '../repositories/ICardRepository';

export interface GetCardsRequest {
  category?: string;
  difficulty?: string;
}

export interface CreateCardRequest {
  userId: string;
  category: "daily" | "business" | "travel" | "academic";
  englishText: string;
  translation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export class CardUseCases {
  constructor(private cardRepository: ICardRepository) {}

  async getCards(request: GetCardsRequest): Promise<CardReadAloud[]> {
    return await this.cardRepository.getCards(request.category, request.difficulty);
  }

  async getCardById(id: string): Promise<CardReadAloud> {
    if (!id) {
      throw new Error('ID do card é obrigatório');
    }

    return await this.cardRepository.getCardById(id);
  }

  async createCard(request: CreateCardRequest): Promise<CardReadAloud> {
    // Validações de negócio
    if (!request.userId || !request.englishText || !request.translation) {
      throw new Error('Dados obrigatórios não fornecidos');
    }

    if (request.englishText.length < 3) {
      throw new Error('Texto em inglês deve ter pelo menos 3 caracteres');
    }

    return await this.cardRepository.createCard(request);
  }

  async updateCard(id: string, card: Partial<CardReadAloud>): Promise<CardReadAloud> {
    if (!id) {
      throw new Error('ID do card é obrigatório');
    }

    return await this.cardRepository.updateCard(id, card);
  }

  async deleteCard(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID do card é obrigatório');
    }

    return await this.cardRepository.deleteCard(id);
  }
}
