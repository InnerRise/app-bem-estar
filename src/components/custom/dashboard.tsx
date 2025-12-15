"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Target, 
  User, 
  Calendar,
  Flame,
  Trophy,
  CheckCircle2,
  Clock,
  TrendingUp,
  Heart,
  Zap,
  Star,
  ChevronRight,
  Award
} from "lucide-react";
import { DailyTask } from "./daily-task";
import { Profile } from "./profile";
import { Progress } from "./progress";

type TabType = 'home' | 'tasks' | 'progress' | 'profile';

interface UserStats {
  currentStreak: number;
  totalXP: number;
  level: number;
  tasksCompleted: number;
  weekProgress: number;
}

interface DailyTaskData {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  category: 'mindfulness' | 'movement' | 'nutrition' | 'reflection';
  estimatedTime: string;
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 3,
    totalXP: 150,
    level: 2,
    tasksCompleted: 12,
    weekProgress: 42
  });

  const [todayTasks, setTodayTasks] = useState<DailyTaskData[]>([
    {
      id: '1',
      title: 'Escrever 3 coisas pelas quais sou grato',
      description: 'Praticar gratidão fortalece sua mentalidade positiva e reduz o estresse. Reserve 2 minutos para refletir sobre o que há de bom na sua vida hoje.',
      xp: 10,
      completed: false,
      category: 'reflection',
      estimatedTime: '2 min'
    },
    {
      id: '2',
      title: 'Alongamento matinal de 5 minutos',
      description: 'Despertar o corpo com movimentos suaves prepara você para o dia. Foque em respiração profunda e movimentos lentos.',
      xp: 15,
      completed: false,
      category: 'movement',
      estimatedTime: '5 min'
    },
    {
      id: '3',
      title: 'Beber 2 copos de água',
      description: 'Hidratação adequada melhora energia, foco e disposição. Comece o dia hidratando seu corpo.',
      xp: 5,
      completed: false,
      category: 'nutrition',
      estimatedTime: '1 min'
    }
  ]);

  const handleCompleteTask = (taskId: string) => {
    setTodayTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
    
    // Atualiza stats
    setUserStats(prev => ({
      ...prev,
      totalXP: prev.totalXP + (todayTasks.find(t => t.id === taskId)?.xp || 0),
      tasksCompleted: prev.tasksCompleted + 1
    }));
  };

  const completedToday = todayTasks.filter(t => t.completed).length;
  const totalToday = todayTasks.length;
  const progressPercentage = (completedToday / totalToday) * 100;

  // Home Tab
  if (activeTab === 'home') {
    return (
      <div className="min-h-screen bg-black text-white pb-24">
        {/* Header */}
        <div className="bg-gradient-to-b from-purple-900/40 to-black p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Olá! 👋</h1>
              <p className="text-gray-400">Vamos continuar sua jornada</p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full">
              <Flame className="w-5 h-5" />
              <span className="font-bold">{userStats.currentStreak} dias</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-gradient-to-br from-purple-900/60 to-purple-800/40 border-purple-500/30">
              <CardContent className="p-4 text-center space-y-1">
                <Trophy className="w-6 h-6 mx-auto text-yellow-400" />
                <p className="text-2xl font-bold">{userStats.totalXP}</p>
                <p className="text-xs text-gray-400">XP Total</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/60 to-blue-800/40 border-blue-500/30">
              <CardContent className="p-4 text-center space-y-1">
                <Star className="w-6 h-6 mx-auto text-blue-400" />
                <p className="text-2xl font-bold">Nível {userStats.level}</p>
                <p className="text-xs text-gray-400">Progresso</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/60 to-green-800/40 border-green-500/30">
              <CardContent className="p-4 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto text-green-400" />
                <p className="text-2xl font-bold">{userStats.tasksCompleted}</p>
                <p className="text-xs text-gray-400">Tarefas</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Progresso do Dia */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Progresso de Hoje</h2>
              <span className="text-sm text-purple-400">{completedToday}/{totalToday} concluídas</span>
            </div>

            <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Progresso Diário</span>
                  <span className="text-purple-400 font-semibold">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {completedToday === totalToday && (
                  <div className="flex items-center gap-2 text-green-400 animate-in fade-in duration-500">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Todas as tarefas concluídas! 🎉</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tarefas de Hoje */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Tarefas de Hoje</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveTab('tasks')}
                className="text-purple-400 hover:text-purple-300"
              >
                Ver todas
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {todayTasks.slice(0, 2).map(task => (
                <Card 
                  key={task.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    task.completed 
                      ? "bg-green-900/20 border-green-500/30" 
                      : "bg-gray-900/50 border-purple-500/30 hover:border-purple-500/60"
                  }`}
                  onClick={() => !task.completed && setActiveTab('tasks')}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          {task.completed && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                          <h3 className={`font-semibold ${task.completed ? "line-through text-gray-500" : "text-white"}`}>
                            {task.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.estimatedTime}
                          </span>
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                            +{task.xp} XP
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Conquistas Recentes */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Conquistas Recentes</h2>
            <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-500/30">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Iniciante Dedicado</h3>
                  <p className="text-sm text-gray-400">Complete 3 dias seguidos</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </CardContent>
            </Card>
          </div>

          {/* Dica do Dia */}
          <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-500/30">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Zap className="w-5 h-5" />
                <h3 className="font-bold">Dica do Dia</h3>
              </div>
              <p className="text-gray-300">
                Pequenos hábitos diários criam grandes transformações. Foque em consistência, não em perfeição.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  // Tasks Tab
  if (activeTab === 'tasks') {
    return (
      <>
        <DailyTask 
          tasks={todayTasks}
          onCompleteTask={handleCompleteTask}
          userStats={userStats}
        />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    );
  }

  // Progress Tab
  if (activeTab === 'progress') {
    return (
      <>
        <Progress userStats={userStats} />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    );
  }

  // Profile Tab
  if (activeTab === 'profile') {
    return (
      <>
        <Profile userStats={userStats} />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    );
  }

  return null;
}

// Bottom Navigation Component
function BottomNav({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: TabType; 
  onTabChange: (tab: TabType) => void;
}) {
  const tabs = [
    { id: 'home' as TabType, icon: Home, label: 'Início' },
    { id: 'tasks' as TabType, icon: Target, label: 'Tarefas' },
    { id: 'progress' as TabType, icon: TrendingUp, label: 'Progresso' },
    { id: 'profile' as TabType, icon: User, label: 'Perfil' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-purple-500/30 z-50">
      <div className="flex items-center justify-around p-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "scale-110" : ""}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
