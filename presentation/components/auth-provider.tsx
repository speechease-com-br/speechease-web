"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

// Lista de rotas públicas que não requerem autenticação
const publicRoutes = ["/login", "/signup", "/forgot-password"]

// Interface para o usuário autenticado
interface User {
  id: string
  email: string
  name: string
}

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Componente provedor de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    // Simulação de verificação de autenticação
    // Em uma aplicação real, você verificaria um token JWT ou uma sessão
    const checkAuth = async () => {
      try {
        // Simulando uma verificação de autenticação
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
        // Removed the redirection logic
        // No longer redirects to login page for non-public routes
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  // Função de login
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulação de login
      // Em uma aplicação real, você faria uma chamada à API
      const mockUser = {
        id: "1",
        email,
        name: "Usuário Teste",
      }

      // Armazenar usuário no localStorage (apenas para demonstração)
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Função de logout
  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

