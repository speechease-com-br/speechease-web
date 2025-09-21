import { IAuthRepository } from '../repositories/IAuthRepository';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: any;
}

export class AuthUseCases {
  constructor(private authRepository: IAuthRepository) {}

  async login(request: LoginRequest): Promise<AuthResponse> {
    // Validações de negócio podem ser adicionadas aqui
    if (!request.email || !request.password) {
      throw new Error('Email e senha são obrigatórios');
    }

    return await this.authRepository.login(request.email, request.password);
  }

  async signup(request: SignupRequest): Promise<AuthResponse> {
    // Validações de negócio podem ser adicionadas aqui
    if (!request.email || !request.password) {
      throw new Error('Email e senha são obrigatórios');
    }

    if (request.password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    return await this.authRepository.signup(request.email, request.password, request.name);
  }

  async logout(): Promise<void> {
    return await this.authRepository.logout();
  }

  async getCurrentUser(accessToken: string): Promise<any> {
    if (!accessToken) {
      throw new Error('Token de acesso é obrigatório');
    }

    return await this.authRepository.getCurrentUser(accessToken);
  }
}
