# Arquitetura do Projeto SpeechEase

Este projeto foi reorganizado seguindo os princípios de **Clean Architecture** e **MVVM (Model-View-ViewModel)** para melhorar a manutenibilidade, testabilidade e escalabilidade do código.

## Estrutura de Pastas

```
src/
├── domain/                    # Camada de Domínio (Core Business Logic)
│   ├── entities/             # Entidades de negócio
│   │   ├── card-read-aloud.type.ts
│   │   └── pronunciation-feedback.ts
│   ├── repositories/         # Interfaces dos repositórios
│   │   ├── IAuthRepository.ts
│   │   ├── ICardRepository.ts
│   │   └── IDashboardRepository.ts
│   └── use-cases/           # Casos de uso (Interactors)
│       ├── AuthUseCases.ts
│       ├── CardUseCases.ts
│       └── DashboardUseCases.ts
├── infrastructure/          # Camada de Infraestrutura
│   ├── repositories/        # Implementações dos repositórios
│   │   ├── auth-infra.ts
│   │   ├── cards-infra.ts
│   │   └── dashboard-infra.ts
│   ├── http/               # Cliente HTTP
│   │   ├── httpClient.ts
│   │   └── types.ts
│   └── di/                 # Injeção de Dependência
│       └── Container.ts
├── presentation/           # Camada de Apresentação
│   ├── view-models/        # ViewModels (MVVM)
│   │   ├── LoginViewModel.ts
│   │   └── CardViewModel.ts
│   ├── views/             # Views (Páginas)
│   │   ├── login/
│   │   ├── signup/
│   │   └── ...
│   └── components/        # Componentes reutilizáveis
│       └── ui/
└── shared/                # Código compartilhado
    ├── types/             # Tipos compartilhados
    ├── utils/             # Utilitários
    └── constants/         # Constantes
```

## Princípios da Clean Architecture

### 1. **Camada de Domínio (Domain Layer)**
- **Entidades**: Representam os objetos de negócio fundamentais
- **Repositórios (Interfaces)**: Contratos que definem como os dados são acessados
- **Casos de Uso**: Contêm a lógica de negócio específica da aplicação

### 2. **Camada de Infraestrutura (Infrastructure Layer)**
- **Repositórios (Implementações)**: Implementam as interfaces do domínio
- **Serviços Externos**: HTTP clients, APIs, banco de dados
- **Injeção de Dependência**: Container para gerenciar dependências

### 3. **Camada de Apresentação (Presentation Layer)**
- **Views**: Componentes React que renderizam a UI
- **Hooks**: Hooks customizados que gerenciam estado e lógica de apresentação
- **Providers**: Providers para configuração global (React Query, etc.)
- **Componentes**: Componentes reutilizáveis da UI

## Padrão MVVM com Hooks React

### **Model**
- Representado pelas entidades do domínio e casos de uso
- Contém a lógica de negócio e dados

### **View**
- Componentes React que renderizam a interface
- Não contém lógica de negócio, apenas apresentação

### **ViewModel (Hooks Customizados)**
- **Conceito**: ViewModels são a camada de abstração entre View e Model
- **Implementação**: No React, ViewModels são implementados como hooks customizados
- **Funcionalidade**: 
  - Gerenciam o estado da apresentação usando React Query
  - Executam casos de uso e atualizam a View automaticamente
  - Fornecem estado de loading, erro e dados de forma reativa
  - Exposem actions (métodos) e state (dados) de forma organizada

### **Por que Hooks ao invés de Classes?**
- **React Nativo**: Hooks são o padrão nativo do React para gerenciar estado
- **Reatividade**: Atualizações automáticas da UI quando o estado muda
- **Composição**: Hooks podem ser compostos e reutilizados facilmente
- **Performance**: React Query otimiza automaticamente re-renders e cache
- **TypeScript**: Melhor inferência de tipos com hooks

## Exemplo de Uso

### ViewModel como Hook (useAuthViewModel)
```typescript
export const useAuthViewModel = () => {
  const queryClient = useQueryClient();
  const container = DIContainer.getInstance();
  const authUseCases = container.getAuthUseCases();

  // Estado do ViewModel (queries e mutations)
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      return await authUseCases.getCurrentUser(token);
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const result = await authUseCases.login(credentials);
      localStorage.setItem('accessToken', result.accessToken);
      return result;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
  });

  // Estado consolidado do ViewModel
  const state: AuthViewModelState = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoadingUser,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    // ... outros estados
  };

  // Actions do ViewModel
  const actions = {
    login: (email: string, password: string) => 
      loginMutation.mutateAsync({ email, password }),
    resetLoginError: () => loginMutation.reset(),
    // ... outras actions
  };

  return {
    state,        // Estado completo do ViewModel
    actions,      // Métodos do ViewModel
    // Getters individuais para conveniência
    user,
    isAuthenticated: !!user,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
};
```

### View (Componente React)
```typescript
export default function LoginPage() {
  // Usar o ViewModel
  const {
    state,
    actions,
    user,
    isAuthenticated,
    isLoggingIn,
    loginError,
  } = useAuthViewModel();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      actions.resetLoginError();
      await actions.login(data.email, data.password);
    } catch (error) {
      // Erro já é gerenciado pelo ViewModel
    }
  };

  return (
    // JSX da interface usando isLoggingIn e loginError
  );
}
```

## ViewModels Disponíveis

### **useAuthViewModel**
ViewModel para autenticação do usuário:
- **Estado**: `state.user`, `state.isAuthenticated`, `state.isLoading`, etc.
- **Actions**: `actions.login(email, password)`, `actions.signup(email, password)`, `actions.logout()`
- **Getters**: `user`, `isAuthenticated`, `isLoggingIn`, `loginError`, etc.
- **Funcionalidades**: Login, signup, logout, gerenciamento de token, estado de autenticação

### **useCardViewModel**
ViewModel para operações com cards:
- **Estado**: `state.cards`, `state.isLoading`, `state.isCreating`, etc.
- **Actions**: `actions.createCard(cardData)`, `actions.updateCard(id, cardData)`, `actions.deleteCard(id)`
- **Getters**: `cards`, `isLoading`, `isCreating`, `error`, etc.
- **Funcionalidades**: CRUD de cards, filtros por categoria/dificuldade, cache automático

### **useCard(id)**
Gerencia um card específico:
- `card`: Dados do card
- `isLoading`: Estado de loading
- `error`: Erro da operação
- `refetch`: Função para recarregar dados

### **useDashboard**
Gerencia dados do dashboard:
- `dashboardData`: Dados do dashboard
- `isLoading`: Estado de loading
- `error`: Erro da operação
- `refetch`: Função para recarregar dados

### **useUserProgress**
Gerencia progresso do usuário:
- `progressData`: Dados de progresso
- `isLoading`: Estado de loading
- `error`: Erro da operação
- `refetch`: Função para recarregar dados

### **useUserStatistics**
Gerencia estatísticas do usuário:
- `statisticsData`: Dados de estatísticas
- `isLoading`: Estado de loading
- `error`: Erro da operação
- `refetch`: Função para recarregar dados

### **useSpeechAnalysis**
Gerencia análise de fala:
- `analyzeSpeech(audioBase64, expectedText)`: Analisar fala
- `isAnalyzing`: Estado de loading
- `analysisResult`: Resultado da análise
- `error`: Erro da operação

### **useAuthGuard**
Protege páginas que requerem autenticação:
- `isAuthenticated`: Status de autenticação
- `isLoading`: Estado de loading
- `canAccess`: Se o usuário pode acessar a página

### **useGuestGuard**
Protege páginas que não devem ser acessadas por usuários autenticados:
- `isAuthenticated`: Status de autenticação
- `isLoading`: Estado de loading
- `canAccess`: Se o usuário pode acessar a página

## Benefícios da Nova Arquitetura

### 1. **Separação de Responsabilidades**
- Cada camada tem uma responsabilidade específica
- Facilita manutenção e testes

### 2. **Inversão de Dependência**
- O domínio não depende da infraestrutura
- Facilita mudanças de implementação

### 3. **Testabilidade**
- Cada camada pode ser testada independentemente
- Mocks podem ser facilmente injetados

### 4. **Escalabilidade**
- Novas funcionalidades podem ser adicionadas sem afetar código existente
- Estrutura clara para novos desenvolvedores

### 5. **Reutilização**
- Casos de uso podem ser reutilizados em diferentes contextos
- Componentes são mais reutilizáveis

## Como Adicionar Novas Funcionalidades

1. **Defina a entidade** no domínio se necessário
2. **Crie a interface do repositório** no domínio
3. **Implemente o caso de uso** no domínio
4. **Implemente o repositório** na infraestrutura
5. **Crie o ViewModel** na apresentação
6. **Implemente a View** (componente React)
7. **Registre no Container** de injeção de dependência

## Configuração de Paths

O `tsconfig.json` foi atualizado para incluir aliases de importação:

```json
{
  "paths": {
    "@/*": ["./*"],
    "@/src/*": ["./src/*"],
    "@/domain/*": ["./src/domain/*"],
    "@/infrastructure/*": ["./src/infrastructure/*"],
    "@/presentation/*": ["./src/presentation/*"],
    "@/shared/*": ["./src/shared/*"]
  }
}
```

Isso permite importações mais limpas:
```typescript
import { AuthUseCases } from '@/domain/use-cases/AuthUseCases';
import { LoginViewModel } from '@/presentation/view-models/LoginViewModel';
```
