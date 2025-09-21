export interface IAuthRepository {
  login(email: string, password: string): Promise<{ accessToken: string; user: any }>;
  signup(email: string, password: string, name: string): Promise<{ accessToken: string; user: any }>;
  logout(): Promise<void>;
  getCurrentUser(accessToken: string): Promise<any>;
}
