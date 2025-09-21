# SpeechEase Web - Clean Architecture + MVVM

Uma aplicação web moderna para aprendizado de inglês com foco em pronúncia, construída com **Clean Architecture** e **MVVM** usando **React** e **TypeScript**.

## 🏗️ Arquitetura

### Clean Architecture + MVVM com Hooks React

O projeto segue os princípios de **Clean Architecture** com **MVVM** implementado usando **hooks React customizados**:

```
src/
├── domain/                    # Camada de Domínio (Core Business Logic)
│   ├── entities/             # Entidades de negócio
│   ├── repositories/         # Interfaces dos repositórios  
│   └── use-cases/           # Casos de uso (lógica de negócio)
├── infrastructure/          # Camada de Infraestrutura
│   ├── repositories/        # Implementações dos repositórios
│   ├── http/               # Cliente HTTP
│   └── di/                 # Container de injeção de dependência
├── presentation/           # Camada de Apresentação
│   ├── view-models/        # ViewModels (hooks customizados)
│   ├── hooks/             # Hooks adicionais
│   ├── providers/         # Providers (React Query, etc.)
│   ├── views/             # Views (páginas)
│   └── components/        # Componentes reutilizáveis
└── shared/                # Código compartilhado
    ├── types/             # Tipos compartilhados
    ├── utils/             # Utilitários
    └── constants/         # Constantes
```

## 🎯 ViewModels Disponíveis

### **useAuthViewModel**
ViewModel para autenticação do usuário:
```typescript
const {
  state,        // Estado completo
  actions,      // Métodos (login, signup, logout)
  user,         // Getters individuais
  isAuthenticated,
  isLoggingIn,
  loginError,
} = useAuthViewModel();
```

### **useCardViewModel**
ViewModel para operações com cards:
```typescript
const {
  state,        // Estado completo
  actions,      // Métodos (createCard, updateCard, deleteCard)
  cards,        // Getters individuais
  isLoading,
  isCreating,
  error,
} = useCardViewModel(category, difficulty);
```

### **useChatViewModel**
ViewModel para chat com IA:
```typescript
const {
  state,        // Estado completo
  actions,      // Métodos (sendMessage, sendAudioMessage)
  messages,     // Getters individuais
  isSending,
  currentMessage,
} = useChatViewModel();
```

### **useReadAloudViewModel**
ViewModel para exercícios de leitura em voz alta:
```typescript
const {
  state,        // Estado completo
  actions,      // Métodos (startRecording, analyzePronunciation)
  currentCard,  // Getters individuais
  isRecording,
  feedback,
  progress,
} = useReadAloudViewModel(cardId);
```

### **useProgressMapViewModel**
ViewModel para mapa de progresso:
```typescript
const {
  state,        // Estado completo
  actions,      // Métodos (refetchData, setTimeRange)
  progressData, // Getters individuais
  isLoading,
  error,
} = useProgressMapViewModel();
```

## 🛡️ Hooks de Proteção

### **useAuthGuard**
Protege páginas que requerem autenticação:
```typescript
const { canAccess } = useAuthGuard('/login');
```

### **useGuestGuard**
Protege páginas que não devem ser acessadas por usuários autenticados:
```typescript
const { canAccess } = useGuestGuard('/dashboard');
```

## 🚀 Como Usar

### 1. Configurar Providers

Envolva sua aplicação com os providers necessários:

```typescript
// app/layout.tsx
import { AppProviders } from '@/src/presentation/providers/AppProviders';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
```

### 2. Usar ViewModels em Componentes

```typescript
// pages/login/page.tsx
import { useAuthViewModel } from '@/src/presentation/view-models/useAuthViewModel';

export default function LoginPage() {
  const {
    state,
    actions,
    user,
    isAuthenticated,
    isLoggingIn,
    loginError,
  } = useAuthViewModel();

  const onSubmit = async (data) => {
    try {
      await actions.login(data.email, data.password);
    } catch (error) {
      // Erro já é gerenciado pelo ViewModel
    }
  };

  return (
    // JSX usando isLoggingIn, loginError, etc.
  );
}
```

### 3. Proteger Páginas

```typescript
// pages/dashboard/page.tsx
import { useAuthGuard } from '@/src/presentation/hooks/useAuthGuard';

export default function DashboardPage() {
  const { canAccess } = useAuthGuard();
  
  if (!canAccess) {
    return <div>Verificando autenticação...</div>;
  }

  return (
    // Conteúdo da página
  );
}
```

## 🎨 Componentes UI

O projeto usa **shadcn/ui** para componentes de interface:

```typescript
import { Button } from '@/src/presentation/components/ui/button';
import { Card } from '@/src/presentation/components/ui/card';
import { Input } from '@/src/presentation/components/ui/input';
```

## 📊 Gerenciamento de Estado

- **React Query**: Cache, sincronização e gerenciamento de estado servidor
- **ViewModels**: Estado local e lógica de apresentação
- **Context API**: Estado global quando necessário

## 🔧 Tecnologias

- **Next.js 15**: Framework React
- **TypeScript**: Tipagem estática
- **React Query**: Gerenciamento de estado servidor
- **Tailwind CSS**: Estilização
- **shadcn/ui**: Componentes UI
- **Zod**: Validação de schemas
- **React Hook Form**: Gerenciamento de formulários

## 📁 Estrutura de Arquivos

```
src/
├── domain/
│   ├── entities/           # Entidades de negócio
│   ├── repositories/       # Interfaces dos repositórios
│   └── use-cases/         # Casos de uso
├── infrastructure/
│   ├── repositories/      # Implementações dos repositórios
│   ├── http/             # Cliente HTTP
│   └── di/               # Injeção de dependência
├── presentation/
│   ├── view-models/      # ViewModels (hooks)
│   ├── hooks/           # Hooks adicionais
│   ├── providers/       # Providers
│   ├── views/           # Páginas
│   └── components/      # Componentes UI
└── shared/
    ├── types/           # Tipos compartilhados
    ├── utils/           # Utilitários
    └── constants/       # Constantes
```

## 🎯 Benefícios da Arquitetura

- ✅ **Separação de Responsabilidades**: Cada camada tem uma função específica
- ✅ **Testabilidade**: Fácil de testar cada camada independentemente
- ✅ **Manutenibilidade**: Código organizado e fácil de manter
- ✅ **Escalabilidade**: Fácil adicionar novas funcionalidades
- ✅ **Reutilização**: ViewModels e hooks podem ser reutilizados
- ✅ **TypeScript**: Tipagem completa e segura
- ✅ **Performance**: React Query otimiza automaticamente

## 📚 Documentação Adicional

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Documentação detalhada da arquitetura
- [VIEWMODEL_VS_HOOKS.md](./VIEWMODEL_VS_HOOKS.md) - Explicação da relação entre ViewModels e hooks

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint

# Migração de imports
node migrate-imports.js
```

## 🤝 Contribuindo

1. Siga a arquitetura estabelecida
2. Use ViewModels para lógica de apresentação
3. Mantenha a separação de camadas
4. Escreva testes para novos ViewModels
5. Documente mudanças na arquitetura

---

**SpeechEase** - Aprenda inglês com IA e melhore sua pronúncia! 🎤✨
