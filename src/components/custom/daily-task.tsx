"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2,
  Clock,
  Heart,
  Activity,
  Utensils,
  Brain,
  Sparkles,
  Trophy,
  Flame,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  category: 'mindfulness' | 'movement' | 'nutrition' | 'reflection';
  estimatedTime: string;
}

interface DailyTaskProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
  userStats: {
    currentStreak: number;
    totalXP: number;
    level: number;
  };
}

export function DailyTask({ tasks, onCompleteTask, userStats }: DailyTaskProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const getCategoryIcon = (category: Task['category']) => {
    switch (category) {
      case 'mindfulness':
        return <Brain className="w-6 h-6 text-purple-400" />;
      case 'movement':
        return <Activity className="w-6 h-6 text-blue-400" />;
      case 'nutrition':
        return <Utensils className="w-6 h-6 text-green-400" />;
      case 'reflection':
        return <Heart className="w-6 h-6 text-pink-400" />;
    }
  };

  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'mindfulness':
        return 'from-purple-900/40 to-purple-800/40 border-purple-500/30';
      case 'movement':
        return 'from-blue-900/40 to-blue-800/40 border-blue-500/30';
      case 'nutrition':
        return 'from-green-900/40 to-green-800/40 border-green-500/30';
      case 'reflection':
        return 'from-pink-900/40 to-pink-800/40 border-pink-500/30';
    }
  };

  const handleCompleteTask = (taskId: string) => {
    onCompleteTask(taskId);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setSelectedTask(null);
    }, 2000);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  // Task Detail View
  if (selectedTask) {
    return (
      <div className="min-h-screen bg-black text-white p-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedTask(null)}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Tarefa do Dia</h1>
              <p className="text-sm text-gray-400">Sua primeira tarefa</p>
            </div>
          </div>

          {/* Task Card */}
          <Card className={`bg-gradient-to-br ${getCategoryColor(selectedTask.category)}`}>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  {getCategoryIcon(selectedTask.category)}
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedTask.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge className="bg-white/20 text-white border-white/30">
                      <Clock className="w-3 h-3 mr-1" />
                      {selectedTask.estimatedTime}
                    </Badge>
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                      <Trophy className="w-3 h-3 mr-1" />
                      +{selectedTask.xp} XP
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Por que fazer isso?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedTask.description}
                  </p>
                </div>
              </div>

              {selectedTask.completed ? (
                <div className="space-y-4 pt-6">
                  <div className="flex items-center justify-center gap-2 text-green-400 animate-in fade-in duration-500">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="text-lg font-semibold">Tarefa concluída!</span>
                  </div>
                  {showConfetti && (
                    <div className="text-center text-6xl animate-bounce">
                      🎉
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => handleCompleteTask(selectedTask.id)}
                  size="lg"
                  className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 border-0"
                >
                  Marcar como concluída
                  <CheckCircle2 className="ml-2 w-5 h-5" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Motivational Message */}
          {!selectedTask.completed && (
            <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-500/30">
              <CardContent className="p-6 text-center space-y-2">
                <p className="text-lg font-semibold text-white">
                  Cada pequeno passo importa
                </p>
                <p className="text-gray-400">
                  Você está construindo a melhor versão de você mesmo
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Tasks List View
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/40 to-black p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tarefas do Dia</h1>
            <p className="text-gray-400">
              {completedCount} de {totalCount} concluídas
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full">
            <Flame className="w-5 h-5" />
            <span className="font-bold">{userStats.currentStreak} dias</span>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progresso Diário</span>
              <span className="text-purple-400 font-semibold">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
            {completedCount === totalCount && (
              <div className="flex items-center justify-center gap-2 text-green-400 pt-2 animate-in fade-in duration-500">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Todas as tarefas concluídas! 🎉</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <div className="p-6 space-y-4">
        {tasks.map((task, index) => (
          <Card 
            key={task.id}
            className={`cursor-pointer transition-all duration-300 animate-in fade-in ${
              task.completed 
                ? "bg-green-900/20 border-green-500/30" 
                : "bg-gray-900/50 border-purple-500/30 hover:border-purple-500/60 hover:scale-102"
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setSelectedTask(task)}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  task.completed ? "bg-green-500/20" : "bg-white/10"
                }`}>
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    getCategoryIcon(task.category)
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className={`text-lg font-semibold ${
                    task.completed ? "line-through text-gray-500" : "text-white"
                  }`}>
                    {task.title}
                  </h3>
                  <p className={`text-sm ${
                    task.completed ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {task.description.substring(0, 80)}...
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      {task.estimatedTime}
                    </span>
                    <Badge className={`text-xs ${
                      task.completed 
                        ? "bg-green-500/20 text-green-300 border-green-500/50" 
                        : "bg-purple-500/20 text-purple-300 border-purple-500/50"
                    }`}>
                      {task.completed ? "Concluída" : `+${task.xp} XP`}
                    </Badge>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 flex-shrink-0 ${
                  task.completed ? "text-gray-600" : "text-gray-400"
                }`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Motivational Footer */}
      {completedCount < totalCount && (
        <div className="px-6 pb-6">
          <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-500/30">
            <CardContent className="p-6 text-center space-y-2">
              <p className="text-lg font-semibold text-white">
                Continue assim! 💪
              </p>
              <p className="text-gray-400">
                Você está a {totalCount - completedCount} {totalCount - completedCount === 1 ? 'tarefa' : 'tarefas'} de completar o dia
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
