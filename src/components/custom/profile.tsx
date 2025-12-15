"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  User,
  Settings,
  Bell,
  Crown,
  Trophy,
  Target,
  Heart,
  LogOut,
  ChevronRight,
  Mail,
  Calendar,
  Flame,
  Star,
  Edit2,
  Save,
  X,
  CheckCircle
} from "lucide-react";

interface ProfileProps {
  userStats: {
    currentStreak: number;
    totalXP: number;
    level: number;
    tasksCompleted: number;
  };
}

export function Profile({ userStats }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("Você");
  const [userEmail, setUserEmail] = useState("seu@email.com");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Estado para tarefas
  const [tasks, setTasks] = useState([
    { id: 1, title: "Meditação matinal", completed: false },
    { id: 2, title: "Exercício físico", completed: false },
    { id: 3, title: "Refeição saudável", completed: false },
    { id: 4, title: "Leitura de 15 minutos", completed: false },
    { id: 5, title: "Registro de gratidão", completed: false }
  ]);

  // Carrega dados do localStorage ao montar o componente
  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        if (userData.name) setUserName(userData.name);
        if (userData.email) setUserEmail(userData.email);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }

    // Carrega estado das tarefas do localStorage
    const savedTasks = localStorage.getItem('userTasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      }
    }
  }, []);

  const handleEditClick = () => {
    setEditName(userName);
    setEditEmail(userEmail);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName("");
    setEditEmail("");
  };

  const handleSaveUser = () => {
    if (editName.trim() && editEmail.trim()) {
      const userData = { name: editName.trim(), email: editEmail.trim() };
      
      // Salva no localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Atualiza o estado local
      setUserName(userData.name);
      setUserEmail(userData.email);
      
      // Fecha o modo de edição
      setIsEditing(false);
      setEditName("");
      setEditEmail("");
    }
  };

  const handleTaskComplete = (taskId: number) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    
    // Salva no localStorage
    localStorage.setItem('userTasks', JSON.stringify(updatedTasks));
  };

  const canSave = editName.trim() !== "" && editEmail.trim() !== "";

  const menuItems = [
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notificações',
      description: 'Gerencie seus lembretes',
      color: 'text-blue-400'
    },
    {
      id: 'preferences',
      icon: Settings,
      label: 'Preferências',
      description: 'Personalize sua experiência',
      color: 'text-purple-400'
    },
    {
      id: 'subscription',
      icon: Crown,
      label: 'Assinatura Premium',
      description: 'Desbloqueie recursos exclusivos',
      color: 'text-yellow-400',
      badge: 'Premium'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/40 to-black p-6 space-y-6">
        {/* Profile Info */}
        {!isEditing ? (
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{userName}</h1>
              <p className="text-gray-400 text-sm">{userEmail}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-white">Perfil ativo ✅</p>
              </div>
            </div>
            <Button
              onClick={handleEditClick}
              size="sm"
              variant="outline"
              className="border-purple-500/30 hover:border-purple-500 text-purple-400 hover:text-purple-300"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
                <Button
                  onClick={handleCancelEdit}
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm text-gray-400 font-medium">
                    Nome
                  </label>
                  <Input
                    id="edit-name"
                    type="text"
                    placeholder="Digite seu nome"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-12 text-base bg-gray-900/50 border-purple-500/30 focus:border-purple-500 text-white placeholder:text-gray-500"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-email" className="text-sm text-gray-400 font-medium">
                    E-mail
                  </label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="h-12 text-base bg-gray-900/50 border-purple-500/30 focus:border-purple-500 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveUser}
                disabled={!canSave}
                size="lg"
                className={`w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-2xl transition-all duration-300 border-0 font-bold ${
                  !canSave ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                <Save className="mr-2 w-5 h-5" />
                Atualizar usuário
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Level Badge */}
        {!isEditing && (
          <Card className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border-purple-500/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Nível</p>
                  <p className="text-xl font-bold text-white">Nível {userStats.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">XP Total</p>
                <p className="text-xl font-bold text-yellow-400">{userStats.totalXP}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      {!isEditing && (
        <div className="p-6 space-y-6">
          {/* Tasks Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Tarefas de Hoje</h2>
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card 
                  key={task.id}
                  className={`bg-gray-900/50 border transition-all duration-300 ${
                    task.completed 
                      ? "border-green-500/60 bg-green-900/20" 
                      : "border-purple-500/30 hover:border-purple-500/60"
                  }`}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {task.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-purple-400"></div>
                      )}
                      <span className={`font-medium ${task.completed ? "text-green-300 line-through" : "text-white"}`}>
                        {task.title}
                      </span>
                    </div>
                    {!task.completed && (
                      <Button
                        onClick={() => handleTaskComplete(task.id)}
                        size="sm"
                        className="bg-transparent hover:bg-purple-500/20 text-white hover:text-purple-300 border border-purple-500/30 hover:border-purple-500 transition-colors duration-200"
                      >
                        Concluir
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border-orange-500/30">
              <CardContent className="p-4 text-center space-y-1">
                <Flame className="w-6 h-6 mx-auto text-orange-400" />
                <p className="text-2xl font-bold text-white">{userStats.currentStreak}</p>
                <p className="text-xs text-white">Dias</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30">
              <CardContent className="p-4 text-center space-y-1">
                <Target className="w-6 h-6 mx-auto text-blue-400" />
                <p className="text-2xl font-bold text-white">{userStats.tasksCompleted}</p>
                <p className="text-xs text-white">Tarefas</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/30">
              <CardContent className="p-4 text-center space-y-1">
                <Star className="w-6 h-6 mx-auto text-purple-400" />
                <p className="text-2xl font-bold text-white">{userStats.level}</p>
                <p className="text-xs text-white">Nível</p>
              </CardContent>
            </Card>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.id}
                  className="bg-gray-900/50 border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all duration-300 hover:scale-102"
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{item.label}</h3>
                        {item.badge && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Achievements Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Conquistas Recentes</h2>
              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                Ver todas
              </Button>
            </div>
            <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-500/30">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white">Iniciante Dedicado</h3>
                  <p className="text-sm text-white">Complete 3 dias seguidos</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Section */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">Suporte</h2>
            <Card className="bg-gray-900/50 border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-cyan-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Fale Conosco</h3>
                  <p className="text-sm text-gray-400">Tire suas dúvidas</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-pink-400">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Avaliar App</h3>
                  <p className="text-sm text-gray-400">Compartilhe sua experiência</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </CardContent>
            </Card>
          </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60"
          >
            <LogOut className="mr-2 w-5 h-5" />
            Sair da Conta
          </Button>

          {/* App Version */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-600">InnerRise v1.0.0</p>
          </div>
        </div>
      )}
    </div>
  );
}
