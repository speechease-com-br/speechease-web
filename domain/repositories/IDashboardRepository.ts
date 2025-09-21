export interface IDashboardRepository {
  getDashboardData(accessToken?: string): Promise<any>;
  getUserProgress(accessToken?: string): Promise<any>;
  getStatistics(accessToken?: string): Promise<any>;
}
