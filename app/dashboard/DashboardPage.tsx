"use client";

import { useAuth } from "@/presentation/hooks/useAuth";
import { useDashboard, useUserProgress, useUserStatistics } from "@/presentation/hooks/useDashboard";
import { useAuthGuard } from "@/presentation/hooks/useAuthGuard";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";

export default function DashboardPage() {
  // Proteger a página - redireciona para login se não autenticado
  const { canAccess } = useAuthGuard();
  
  const { user, logout, isLoggingOut } = useAuth();
  const { dashboardData, isLoading: isLoadingDashboard } = useDashboard();
  const { progressData, isLoading: isLoadingProgress } = useUserProgress();
  const { statisticsData, isLoading: isLoadingStatistics } = useUserStatistics();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Verificando autenticação...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Olá, <span className="font-medium">{user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Saindo..." : "Sair"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta!
            </h2>
            <p className="text-gray-600">
              Continue sua jornada de aprendizado de inglês
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Dashboard Data */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Dados do Dashboard
                </CardTitle>
                <Badge variant="secondary">Ativo</Badge>
              </CardHeader>
              <CardContent>
                {isLoadingDashboard ? (
                  <div className="text-sm text-gray-500">Carregando...</div>
                ) : (
                  <div className="text-2xl font-bold">
                    {dashboardData ? "Conectado" : "N/A"}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Status da conexão
                </p>
              </CardContent>
            </Card>

            {/* Progress Data */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Progresso
                </CardTitle>
                <Badge variant="outline">Em andamento</Badge>
              </CardHeader>
              <CardContent>
                {isLoadingProgress ? (
                  <div className="text-sm text-gray-500">Carregando...</div>
                ) : (
                  <div className="text-2xl font-bold">
                    {progressData?.percentage || 0}%
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Completado hoje
                </p>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Estatísticas
                </CardTitle>
                <Badge variant="secondary">Total</Badge>
              </CardHeader>
              <CardContent>
                {isLoadingStatistics ? (
                  <div className="text-sm text-gray-500">Carregando...</div>
                ) : (
                  <div className="text-2xl font-bold">
                    {statisticsData?.totalCards || 0}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Cards estudados
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ações Rápidas
                </CardTitle>
                <Badge variant="outline">Disponível</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    Praticar Pronúncia
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Ver Cards
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Suas últimas atividades de aprendizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Card "Hello, how are you?" completado</p>
                    <p className="text-xs text-gray-500">Há 2 horas</p>
                  </div>
                  <Badge variant="outline">Pronúncia</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Novo card criado</p>
                    <p className="text-xs text-gray-500">Há 4 horas</p>
                  </div>
                  <Badge variant="outline">Criação</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sessão de estudo iniciada</p>
                    <p className="text-xs text-gray-500">Ontem</p>
                  </div>
                  <Badge variant="outline">Estudo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
