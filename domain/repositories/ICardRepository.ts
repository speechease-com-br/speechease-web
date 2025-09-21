import { CardReadAloud } from '../entities/card-read-aloud.type';

export interface ICardRepository {
  getCards(category?: string, difficulty?: string): Promise<CardReadAloud[]>;
  getCardById(id: string): Promise<CardReadAloud>;
  createCard(card: Omit<CardReadAloud, 'uuid' | 'createdAt'>): Promise<CardReadAloud>;
  updateCard(id: string, card: Partial<CardReadAloud>): Promise<CardReadAloud>;
  deleteCard(id: string): Promise<void>;
}
