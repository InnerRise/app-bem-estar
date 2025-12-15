"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp,
  Calendar,
  Flame,
  Trophy,
  Target,
  Award,
  CheckCircle2,
  Star,
  Zap,
  Crown
} from "lucide-react";

interface ProgressProps {
  userStats: {
    currentStreak: number;
    totalXP: number;
    level: number;
    tasksCompleted: number;
    weekProgress: number;
  };
}

export function Progress({ userStats }: ProgressProps) {
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const currentDay = new Date().getDay();
  
  // Simula atividade da semana (3 dias completados)
  const weekActivity = [false, true, true, true, false, false, false];

  const achievements = [
    {
      id: '1',
      title: 'Iniciante Dedicado',
      description: 'Complete 3 dias seguidos',
      icon: Flame,
      unlocked: true,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: '2',
      title: 'Primeira Semana',
      description: 'Complete 7 dias seguidos',
      icon: Calendar,
      unlocked: false,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '3',
      title: 'Mestre da Consistência',
      description: 'Complete 30 dias seguidos',
      icon: Crown,
      unlocked: false,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: '4',
      title: 'Colecionador de XP',
      description: 'Alcance 500 XP',
      icon: Star,
      unlocked: false,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const nextLevelXP = userStats.level * 100;
  const progressToNextLevel = (userStats.totalXP % 100) / nextLevelXP * 100;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/40 to-black p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Seu Progresso</h1>
          <p className="text-gray-400">Acompanhe sua evolução</p>
        </div>

        {/* Level Card */}
        <Card className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border-purple-500/30">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Nível Atual</p>
                  <p className="text-3xl font-bold">Nível {userStats.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">XP Total</p>
                <p className="text-2xl font-bold text-yellow-400">{userStats.totalXP}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Próximo nível</span>
                <span className="text-purple-400 font-semibold">
                  {userStats.totalXP % 100}/{nextLevelXP} XP
                </span>
              </div>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${progressToNextLevel}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Streak Card */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            Sequência Atual
          </h2>
          <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border-orange-500/30">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text">
                {userStats.currentStreak}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">dias seguidos</p>
                <p className="text-gray-400 mt-2">Continue assim para manter sua sequência!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Week Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            Atividade da Semana
          </h2>
          <Card className="bg-gray-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, index) => {
                  const isToday = index === currentDay;
                  const isCompleted = weekActivity[index];
                  return (
                    <div key={day} className="text-center space-y-2">
                      <p className={`text-xs ${isToday ? "text-purple-400 font-bold" : "text-gray-400"}`}>
                        {day}
                      </p>
                      <div className={`w-full aspect-square rounded-lg flex items-center justify-center ${
                        isCompleted 
                          ? "bg-gradient-to-br from-green-500 to-emerald-500" 
                          : isToday
                          ? "bg-purple-500/20 border-2 border-purple-500"
                          : "bg-gray-800"
                      }`}>
                        {isCompleted && <CheckCircle2 className="w-5 h-5 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Estatísticas
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30">
              <CardContent className="p-6 text-center space-y-2">
                <Target className="w-8 h-8 mx-auto text-blue-400" />
                <p className="text-3xl font-bold">{userStats.tasksCompleted}</p>
                <p className="text-sm text-gray-400">Tarefas Concluídas</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-500/30">
              <CardContent className="p-6 text-center space-y-2">
                <Zap className="w-8 h-8 mx-auto text-green-400" />
                <p className="text-3xl font-bold">{userStats.weekProgress}%</p>
                <p className="text-sm text-gray-400">Progresso Semanal</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            Conquistas
          </h2>
          <div className="space-y-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <Card 
                  key={achievement.id}
                  className={`transition-all duration-300 ${
                    achievement.unlocked
                      ? `bg-gradient-to-br ${achievement.color.replace('from-', 'from-').replace('to-', 'to-')}/20 border-2 border-white/30`
                      : "bg-gray-900/50 border-gray-700/30 opacity-60"
                  }`}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      achievement.unlocked
                        ? `bg-gradient-to-br ${achievement.color}`
                        : "bg-gray-800"
                    }`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white">{achievement.title}</h3>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Motivational Message */}
        <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-500/30">
          <CardContent className="p-6 text-center space-y-3">
            <div className="text-4xl">🌟</div>
            <p className="text-xl font-bold text-white">
              Você está indo muito bem!
            </p>
            <p className="text-gray-400">
              Continue assim e você alcançará seus objetivos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
