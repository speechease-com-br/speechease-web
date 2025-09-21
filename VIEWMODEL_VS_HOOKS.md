# ViewModels vs Hooks: A Mesma Coisa?

## 🤔 A Pergunta

Você está certo ao questionar se ViewModels e hooks são a mesma coisa. Na verdade, **conceitualmente são muito similares**, mas há diferenças importantes na implementação e no contexto.

## 📚 Conceitos

### **ViewModel (Padrão MVVM)**
- **Definição**: Camada de abstração entre View e Model
- **Responsabilidade**: Gerenciar estado de apresentação e lógica de UI
- **Implementação tradicional**: Classes com métodos e propriedades

### **Hooks (React)**
- **Definição**: Funções que permitem usar estado e outros recursos do React
- **Responsabilidade**: Gerenciar estado e efeitos colaterais em componentes funcionais
- **Implementação**: Funções que retornam estado e funções

## 🔄 A Relação

### **ViewModels SÃO hooks quando implementados em React**

```typescript
// ViewModel tradicional (classe)
class LoginViewModel {
  private state: LoginState;
  private setState: (state: LoginState) => void;
  
  constructor(repository: IAuthRepository, setState: (state: LoginState) => void) {
    this.repository = repository;
    this.setState = setState;
  }
  
  async login(email: string, password: string) {
    this.setState({ isLoading: true });
    try {
      const result = await this.repository.login(email, password);
      this.setState({ user: result.user, isAuthenticated: true });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
}

// ViewModel como hook (React)
const useAuthViewModel = () => {
  const [state, setState] = useState<LoginState>();
  
  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await authUseCases.login({ email, password });
      setState(prev => ({ ...prev, user: result.user, isAuthenticated: true }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
    }
  };
  
  return { state, actions: { login } };
};
```

## 🎯 Por que Usar Hooks ao Invés de Classes?

### **1. React Nativo**
- Hooks são o padrão nativo do React para gerenciar estado
- Classes são mais verbosas e menos performáticas no React

### **2. Reatividade Automática**
```typescript
// Com hooks, a UI atualiza automaticamente
const { user, isAuthenticated } = useAuthViewModel();
// Quando user muda, o componente re-renderiza automaticamente

// Com classes, você precisa gerenciar manualmente
const [state, setState] = useState();
const viewModel = new LoginViewModel(repository, setState);
// Você precisa chamar setState manualmente
```

### **3. Composição e Reutilização**
```typescript
// Hooks podem ser compostos facilmente
const useAuthViewModel = () => {
  const { user } = useUser();
  const { login } = useLogin();
  const { logout } = useLogout();
  
  return { user, login, logout };
};

// Classes são mais difíceis de compor
```

### **4. TypeScript e Inferência**
```typescript
// Hooks têm melhor inferência de tipos
const { user, login } = useAuthViewModel();
// TypeScript sabe exatamente os tipos de user e login

// Classes requerem mais anotações de tipo
```

## 🏗️ Nossa Implementação

### **Estrutura Híbrida**
Mantivemos a **nomenclatura de ViewModel** mas implementamos como **hooks**:

```typescript
// useAuthViewModel.ts - ViewModel implementado como hook
export const useAuthViewModel = () => {
  // Estado do ViewModel
  const state: AuthViewModelState = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoadingUser,
    // ...
  };
  
  // Actions do ViewModel
  const actions = {
    login: (email: string, password: string) => loginMutation.mutateAsync({ email, password }),
    logout: () => logoutMutation.mutateAsync(),
    // ...
  };
  
  return {
    state,        // Estado completo (como getState() de uma classe)
    actions,      // Métodos (como métodos de uma classe)
    // Getters individuais para conveniência
    user,
    isAuthenticated,
    // ...
  };
};
```

### **Uso no Componente**
```typescript
export default function LoginPage() {
  // Usar o ViewModel (que é um hook)
  const {
    state,        // Estado completo
    actions,      // Métodos
    user,         // Getters individuais
    isAuthenticated,
    isLoggingIn,
    loginError,
  } = useAuthViewModel();
  
  const onSubmit = async (data: LoginFormValues) => {
    await actions.login(data.email, data.password);
  };
  
  return (
    // JSX usando isLoggingIn, loginError, etc.
  );
}
```

## ✅ Conclusão

### **ViewModels e hooks são conceitualmente a mesma coisa:**
- Ambos gerenciam estado de apresentação
- Ambos conectam View com Model
- Ambos encapsulam lógica de UI

### **A diferença está na implementação:**
- **ViewModels tradicionais**: Classes com métodos
- **ViewModels em React**: Hooks customizados

### **Nossa abordagem:**
- Mantemos a **nomenclatura de ViewModel** para clareza conceitual
- Implementamos como **hooks** para aproveitar o React nativo
- Organizamos com `state` e `actions` para simular a estrutura de classes
- Fornecemos getters individuais para conveniência

### **Benefícios:**
- ✅ Conceito familiar (ViewModel)
- ✅ Implementação moderna (hooks)
- ✅ Performance otimizada (React Query)
- ✅ TypeScript nativo
- ✅ Reatividade automática
- ✅ Composição fácil

**Resumindo**: ViewModels e hooks são a mesma coisa conceitualmente, mas hooks são a implementação moderna e nativa do React para esse padrão! 🎉
