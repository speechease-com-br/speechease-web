import { IDashboardRepository } from '../repositories/IDashboardRepository';

export class DashboardUseCases {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async getDashboardData(accessToken?: string): Promise<any> {
    return await this.dashboardRepository.getDashboardData(accessToken);
  }

  async getUserProgress(accessToken?: string): Promise<any> {
    if (!accessToken) {
      throw new Error('Token de acesso é obrigatório para obter progresso do usuário');
    }

    return await this.dashboardRepository.getUserProgress(accessToken);
  }

  async getStatistics(accessToken?: string): Promise<any> {
    if (!accessToken) {
      throw new Error('Token de acesso é obrigatório para obter estatísticas');
    }

    return await this.dashboardRepository.getStatistics(accessToken);
  }
}
