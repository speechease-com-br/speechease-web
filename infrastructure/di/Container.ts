import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { ICardRepository } from '../../domain/repositories/ICardRepository';
import { IDashboardRepository } from '../../domain/repositories/IDashboardRepository';
import { HttpAuthRepository } from '../repositories/auth-infra';
import { HttpCardRepository } from '../repositories/cards-infra';
import { HttpDashboardRepository } from '../repositories/dashboard-infra';
import { AuthUseCases } from '../../domain/use-cases/AuthUseCases';
import { CardUseCases } from '../../domain/use-cases/CardUseCases';
import { DashboardUseCases } from '../../domain/use-cases/DashboardUseCases';

export class DIContainer {
  private static instance: DIContainer;
  private authRepository: IAuthRepository;
  private cardRepository: ICardRepository;
  private dashboardRepository: IDashboardRepository;
  private authUseCases: AuthUseCases;
  private cardUseCases: CardUseCases;
  private dashboardUseCases: DashboardUseCases;

  private constructor() {
    // Inicializar repositórios
    this.authRepository = new HttpAuthRepository();
    this.cardRepository = new HttpCardRepository();
    this.dashboardRepository = new HttpDashboardRepository();

    // Inicializar casos de uso
    this.authUseCases = new AuthUseCases(this.authRepository);
    this.cardUseCases = new CardUseCases(this.cardRepository);
    this.dashboardUseCases = new DashboardUseCases(this.dashboardRepository);
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Getters para repositórios
  public getAuthRepository(): IAuthRepository {
    return this.authRepository;
  }

  public getCardRepository(): ICardRepository {
    return this.cardRepository;
  }

  public getDashboardRepository(): IDashboardRepository {
    return this.dashboardRepository;
  }

  // Getters para casos de uso
  public getAuthUseCases(): AuthUseCases {
    return this.authUseCases;
  }

  public getCardUseCases(): CardUseCases {
    return this.cardUseCases;
  }

  public getDashboardUseCases(): DashboardUseCases {
    return this.dashboardUseCases;
  }
}
