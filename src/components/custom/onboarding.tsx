"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Check, Sparkles, Heart, Target, Clock, Utensils, Activity, Brain, Zap, Calendar, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { analytics } from "@/lib/analytics";
import { useABTest, loadingTest, ctaTest, firstTaskTest } from "@/lib/ab-testing";
import { LoadingEmotional } from "@/components/custom/loading-emotional";
import { FirstTaskModal } from "@/components/custom/first-task-modal";
import { PlanSummaryCard } from "@/components/custom/plan-summary-card";
import { Paywall } from "@/components/custom/paywall";

interface OnboardingData {
  name: string;
  age: string;
  intention: string;
  rhythm: string;
  movement: string;
  emotions: string[];
  nutrition: string;
  time: string;
}

interface Plan {
  planId: string;
  summary: string;
  week1: Array<{
    day: string;
    activity: string;
    time: string;
    taskId: string;
  }>;
  nutrition: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  firstTask: {
    id: string;
    title: string;
    description: string;
    emoji: string;
    xp: number;
    why?: string;
  };
  focus: {
    intention: string;
    emotions: string[];
    time: string;
    rhythm: string;
    movement: string;
    nutrition: string;
  };
  profile?: 'leve' | 'moderado' | 'ativo';
  planVolume?: 'ultraleve' | 'leve/moderado' | 'completo';
  objectiveDirection?: string;
  rhythmPlan?: {
    mind: string;
    body: string;
  };
}

type FlowStep = 'onboarding' | 'loading' | 'paywall' | 'plan' | 'firstHabit' | 'confirmation' | 'error';
type ButtonState = 'idle' | 'loading' | 'error';
type UserProfile = 'leve' | 'moderado' | 'ativo';
type PlanVolume = 'ultraleve' | 'leve/moderado' | 'completo';

// Lógica por Objetivo Pessoal
function getObjectiveDirection(intention: string): string {
  const objectiveMap: Record<string, string> = {
    "Quero mais energia no meu dia": "Foco em movimento + respiração + nutrição energética",
    "Quero me sentir melhor com meu corpo": "Treino funcional + mindfulness + alimentação consciente",
    "Quero cuidar da minha mente": "Meditação + journaling + práticas de presença",
    "Quero criar hábitos que eu consiga manter": "Micro-hábitos + rotina flexível + acompanhamento semanal",
    "Ainda não sei — só quero me sentir eu de novo": "Equilíbrio mente-corpo + autoconhecimento + sem pressão"
  };

  return objectiveMap[intention] || "Plano personalizado baseado nas suas respostas";
}

// Lógica do Ritmo de Vida Atual
function getRhythmPlan(rhythm: string): { mind: string; body: string } {
  const rhythmMap: Record<string, { mind: string; body: string }> = {
    "Correria total": {
      mind: "Respiração guiada de 3 min + Micro-pausas ao longo do dia",
      body: "Treinos de 5-10 min (HIIT rápido ou alongamento)"
    },
    "Consigo respirar, mas não sobra muito tempo": {
      mind: "Meditação de 5-10 min + Journaling semanal",
      body: "Treinos de 15-20 min (funcional ou yoga)"
    },
    "Tenho algum espaço para mim": {
      mind: "Meditação de 10-15 min + Práticas de gratidão",
      body: "Treinos de 20-30 min (treino completo + alongamento)"
    },
    "Quero reorganizar tudo do zero": {
      mind: "Sessão de planejamento semanal + Meditação diária",
      body: "Rotina progressiva de treinos (começando leve)"
    }
  };

  return rhythmMap[rhythm] || {
    mind: "Práticas de mindfulness personalizadas",
    body: "Treinos adaptados ao seu ritmo"
  };
}

// Lógica de Personalização por Tempo Disponível
function getPlanVolume(time: string): PlanVolume {
  if (time === "5 a 10 minutos") {
    return "ultraleve";
  } else if (time === "15 a 20 minutos") {
    return "leve/moderado";
  } else if (time === "30 minutos") {
    return "completo";
  } else {
    return "leve/moderado"; // Default para "Depende do meu dia"
  }
}

// Mensagens por volume de plano
function getPlanVolumeMessage(volume: PlanVolume): { title: string; description: string; emoji: string } {
  const messages = {
    ultraleve: {
      title: "Plano Ultraleve",
      description: "Sessões rápidas de 5-10 minutos. Perfeito para quem tem pouco tempo mas quer consistência.",
      emoji: "⚡"
    },
    "leve/moderado": {
      title: "Plano Leve/Moderado",
      description: "Sessões de 10-20 minutos. Equilíbrio ideal entre eficiência e resultados.",
      emoji: "🎯"
    },
    completo: {
      title: "Plano Completo",
      description: "Sessões de 20-30+ minutos. Transformação profunda com tempo dedicado.",
      emoji: "🚀"
    }
  };

  return messages[volume];
}

// Sistema de classificação de perfil
function classifyUserProfile(data: OnboardingData): UserProfile {
  let scoreLight = 0;
  let scoreModerate = 0;
  let scoreActive = 0;

  // Análise do ritmo de vida
  if (data.rhythm === "Correria total") {
    scoreLight += 3;
  } else if (data.rhythm === "Consigo respirar, mas não sobra muito tempo") {
    scoreModerate += 2;
    scoreLight += 1;
  } else if (data.rhythm === "Tenho algum espaço para mim") {
    scoreModerate += 3;
  } else if (data.rhythm === "Quero reorganizar tudo do zero") {
    scoreLight += 2;
  }

  // Análise do nível de movimento
  if (data.movement === "Nunca treinei e nem sei por onde começar") {
    scoreLight += 3;
  } else if (data.movement === "Já tentei, mas não consigo manter") {
    scoreLight += 2;
    scoreModerate += 1;
  } else if (data.movement === "Treino às vezes, sem rotina") {
    scoreModerate += 3;
  } else if (data.movement === "Treino com frequência") {
    scoreActive += 3;
  }

  // Análise do tempo disponível
  if (data.time === "5 a 10 minutos") {
    scoreLight += 3;
  } else if (data.time === "15 a 20 minutos") {
    scoreModerate += 3;
  } else if (data.time === "30 minutos") {
    scoreActive += 3;
  } else if (data.time === "Depende do meu dia") {
    scoreLight += 1;
    scoreModerate += 1;
  }

  // Análise das emoções (indicadores de sobrecarga)
  const overloadEmotions = ["Me cobro demais", "Tenho dificuldade de descansar", "Me sinto perdido(a) às vezes"];
  const readyEmotions = ["Estou pronto(a) para mudar"];
  
  data.emotions.forEach(emotion => {
    if (overloadEmotions.includes(emotion)) {
      scoreLight += 1;
    }
    if (readyEmotions.includes(emotion)) {
      scoreActive += 1;
      scoreModerate += 1;
    }
  });

  // Análise da intenção
  if (data.intention === "Ainda não sei — só quero me sentir eu de novo") {
    scoreLight += 2;
  } else if (data.intention === "Quero criar hábitos que eu consiga manter") {
    scoreModerate += 2;
  } else if (data.intention === "Quero mais energia no meu dia") {
    scoreActive += 1;
    scoreModerate += 1;
  }

  // Determina o perfil com maior pontuação
  const scores = [
    { profile: 'leve' as UserProfile, score: scoreLight },
    { profile: 'moderado' as UserProfile, score: scoreModerate },
    { profile: 'ativo' as UserProfile, score: scoreActive }
  ];

  scores.sort((a, b) => b.score - a.score);
  return scores[0].profile;
}

// Mensagens personalizadas por perfil
function getProfileMessage(profile: UserProfile): { title: string; description: string; emoji: string } {
  const messages = {
    leve: {
      title: "Perfil Leve — Preciso retomar o equilíbrio",
      description: "Vamos começar com sessões rápidas de 5-10 minutos. Sem pressão, apenas cuidado. Foco inicial: mente → corpo.",
      emoji: "🌱"
    },
    moderado: {
      title: "Perfil Moderado — Quero criar consistência",
      description: "Sessões de 10-20 minutos com alternância entre mente e corpo. Pequenos desafios semanais para você evoluir.",
      emoji: "🎯"
    },
    ativo: {
      title: "Perfil Ativo — Quero evoluir e me transformar",
      description: "Sessões de 20-30 minutos com treinos consistentes. Respiração + Mindfulness + Progresso semanal.",
      emoji: "🚀"
    }
  };

  return messages[profile];
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [flowStep, setFlowStep] = useState<FlowStep>('onboarding');
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [habitCompleted, setHabitCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [planGenerationStartTime, setPlanGenerationStartTime] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [data, setData] = useState<OnboardingData>({
    name: "",
    age: "",
    intention: "",
    rhythm: "",
    movement: "",
    emotions: [],
    nutrition: "",
    time: "",
  });

  // A/B Testing
  const loadingVariant = useABTest(userId, loadingTest);
  const ctaVariant = useABTest(userId, ctaTest);
  const firstTaskVariant = useABTest(userId, firstTaskTest);

  const totalSteps = 10;
  const progress = (step / totalSteps) * 100;

  // Gera userId único na montagem
  useEffect(() => {
    const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setUserId(newUserId);
    analytics.identify(newUserId, {
      created_at: new Date().toISOString()
    });
  }, []);

  // Redireciona para dashboard quando confirmar conclusão
  useEffect(() => {
    if (flowStep === 'confirmation') {
      const timer = setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [flowStep]);

  const handleNext = () => {
    if (step < totalSteps) {
      const nextStep = step + 1;
      setStep(nextStep);
      
      // Track step completion
      const stepNames = [
        'welcome', 'name', 'age', 'intention', 'rhythm', 
        'movement', 'emotions', 'nutrition', 'time', 'summary'
      ];
      analytics.trackOnboardingStepCompleted(userId, nextStep, stepNames[nextStep] || 'unknown');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleEmotionToggle = (emotion: string) => {
    setData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true;
      case 1: return data.name.trim() !== "";
      case 2: return data.age.trim() !== "";
      case 3: return data.intention !== "";
      case 4: return data.rhythm !== "";
      case 5: return data.movement !== "";
      case 6: return data.emotions.length > 0;
      case 7: return data.nutrition !== "";
      case 8: return data.time !== "";
      default: return true;
    }
  };

  const handleCreatePlan = async () => {
    setButtonState('loading');
    setFlowStep('loading');
    setPlanGenerationStartTime(Date.now());
    
    // Classifica o perfil do usuário
    const profile = classifyUserProfile(data);
    setUserProfile(profile);
    
    // Determina volume do plano baseado no tempo
    const planVolume = getPlanVolume(data.time);
    
    // Obtém direcionamento por objetivo
    const objectiveDirection = getObjectiveDirection(data.intention);
    
    // Obtém plano mente/corpo por ritmo
    const rhythmPlan = getRhythmPlan(data.rhythm);
    
    // Track CTA click
    analytics.trackPlanGenerateClicked(userId, data);
    analytics.trackCTAClicked('create_plan', 'onboarding_summary', ctaVariant.variant);
    
    try {
      // API call com delay mínimo configurado pela variante
      const response = await api.post<Plan>('/api/plans/generate', {
        userId,
        quizAnswers: data,
        profile,
        planVolume,
        objectiveDirection,
        rhythmPlan
      }, {
        minDelay: loadingVariant.config.duration
      });

      const duration = Date.now() - planGenerationStartTime;
      
      // Adiciona informações personalizadas ao plano
      const planWithPersonalization = {
        ...response,
        profile,
        planVolume,
        objectiveDirection,
        rhythmPlan
      };
      
      setPlan(planWithPersonalization);
      setFlowStep('paywall');
      setButtonState('idle');
      
      // Track success
      analytics.trackPlanGeneratedSuccess(userId, response.planId, duration);
      analytics.track('paywall_displayed', {
        userId,
        planId: response.planId,
        profile,
        planVolume,
        duration
      });
    } catch (error) {
      const duration = Date.now() - planGenerationStartTime;
      setButtonState('error');
      setFlowStep('error');
      
      if (error instanceof Error) {
        setErrorMessage(error.message);
        analytics.trackPlanGeneratedError(userId, error.message, duration);
      } else {
        setErrorMessage('Ops, algo deu errado. Tente novamente.');
        analytics.trackPlanGeneratedError(userId, 'Unknown error', duration);
      }
      
      toast.error('Ops, tente novamente.');
    }
  };

  const handleStartFirstStep = () => {
    setFlowStep('firstHabit');
    analytics.trackCTAClicked('start_first_step', 'plan_view', ctaVariant.variant);
  };

  const handleCompleteHabit = async () => {
    if (!plan) return;

    const taskStartTime = Date.now();

    try {
      await api.post(`/api/plans/${plan.planId}/tasks/${plan.firstTask.id}/complete`);
      
      const timeToComplete = Date.now() - taskStartTime;
      
      setHabitCompleted(true);
      setShowConfetti(true);
      
      // Track first task completion
      analytics.trackFirstTaskCompleted(userId, plan.planId, plan.firstTask.id, timeToComplete);
      
      toast.success('Parabéns! Você completou seu primeiro hábito! 🎉');
      
      setTimeout(() => {
        setFlowStep('confirmation');
      }, 2000);
    } catch (error) {
      toast.error('Não foi possível marcar como concluído. Tente novamente.');
    }
  };

  const handleBackToQuiz = () => {
    setFlowStep('onboarding');
    setStep(3);
    analytics.trackCTAClicked('edit_preferences', 'plan_view', ctaVariant.variant);
  };

  const handleRetryCreatePlan = () => {
    setButtonState('idle');
    setFlowStep('onboarding');
    setStep(9);
    analytics.trackCTAClicked('retry_create_plan', 'error_screen');
  };

  // Handlers do Paywall
  const handleStartTrial = () => {
    if (plan) {
      analytics.track('subscription_button_clicked', {
        userId,
        planId: plan.planId,
        source: 'paywall_start_trial'
      });
    }
    // Abre o checkout da Keoto em nova aba
    const checkoutUrl = 'https://checkout.keoto.com/3d062008-ff48-466d-8f61-b1d3e82c76af';
    window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    
    // Mostra os detalhes do plano na aba atual
    setFlowStep('plan');
  };

  const handleViewDetails = () => {
    setFlowStep('plan');
    if (plan) {
      analytics.trackPlanViewed(userId, plan.planId);
    }
  };

  const handleStartNow = () => {
    if (plan) {
      analytics.track('subscription_button_clicked', {
        userId,
        planId: plan.planId,
        source: 'paywall_start_now'
      });
    }
    // Abre o checkout da Keoto em nova aba
    const checkoutUrl = 'https://checkout.keoto.com/3d062008-ff48-466d-8f61-b1d3e82c76af';
    window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    
    // Mostra os detalhes do plano na aba atual
    setFlowStep('plan');
  };

  // T2 - Loading Emocional (com A/B testing)
  if (flowStep === 'loading') {
    return (
      <LoadingEmotional
        variant={loadingVariant.variant}
        duration={loadingVariant.config.duration}
        messages={loadingVariant.config.messages}
      />
    );
  }

  // Paywall - Monetização
  if (flowStep === 'paywall' && plan) {
    return (
      <Paywall
        userId={userId}
        planId={plan.planId}
        onStartTrial={handleStartTrial}
        onViewDetails={handleViewDetails}
        onStartNow={handleStartNow}
      />
    );
  }

  // Error State
  if (flowStep === 'error') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-xl text-center space-y-8 animate-in fade-in duration-700">
          <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Ops, algo deu errado
            </h1>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-lg mx-auto">
              {errorMessage}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleBackToQuiz}
              variant="outline"
              size="lg"
              className="flex-1 border-purple-500/50 bg-gray-900/50 hover:bg-gray-900 text-white"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Voltar
            </Button>
            <Button
              onClick={handleRetryCreatePlan}
              size="lg"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 border-0"
            >
              Tentar novamente
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // T3 - Seu Plano Personalizado
  if (flowStep === 'plan' && plan) {
    const profileMessage = plan.profile ? getProfileMessage(plan.profile) : null;
    const volumeMessage = plan.planVolume ? getPlanVolumeMessage(plan.planVolume) : null;
    
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8 py-8 animate-in fade-in duration-700">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Este é o seu caminho para uma nova versão de você
            </h1>
            <p className="text-xl text-gray-400">
              Começamos pequeno — mas começamos certo.
            </p>
          </div>

          {/* Card: Perfil Classificado */}
          {profileMessage && (
            <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-2 border-indigo-500/50 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{profileMessage.emoji}</div>
                  <h2 className="text-2xl font-bold text-white">{profileMessage.title}</h2>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {profileMessage.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Card: Volume do Plano */}
          {volumeMessage && (
            <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500/50 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{volumeMessage.emoji}</div>
                  <h2 className="text-2xl font-bold text-white">{volumeMessage.title}</h2>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {volumeMessage.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Card: Direcionamento por Objetivo */}
          {plan.objectiveDirection && (
            <Card className="bg-gradient-to-br from-orange-900/40 to-amber-900/40 border-2 border-orange-500/50 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-orange-400" />
                  <h2 className="text-2xl font-bold text-white">Seu Direcionamento</h2>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {plan.objectiveDirection}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Card: Plano Mente & Corpo por Ritmo */}
          {plan.rhythmPlan && (
            <Card className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-2 border-emerald-500/50 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-2xl font-bold text-white">Seu Plano Mente & Corpo</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-purple-400">Mente</h3>
                    </div>
                    <p className="text-gray-300 pl-7">{plan.rhythmPlan.mind}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-green-400">Corpo</h3>
                    </div>
                    <p className="text-gray-300 pl-7">{plan.rhythmPlan.body}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card: Foco */}
          <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Foco</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p><span className="text-purple-400 font-semibold">Objetivo:</span> {plan.focus.intention}</p>
                <p><span className="text-pink-400 font-semibold">Foco emocional:</span> {plan.focus.emotions.join(", ")}</p>
                <p><span className="text-orange-400 font-semibold">Tempo disponível:</span> {plan.focus.time}</p>
              </div>
            </CardContent>
          </Card>

          {/* Card: Semana 1 - Rotina */}
          <PlanSummaryCard
            title="Semana 1 — Rotina"
            icon={<Calendar className="w-6 h-6 text-cyan-400" />}
            actions={plan.week1.map(item => ({
              id: item.taskId,
              day: item.day,
              activity: item.activity,
              time: item.time
            }))}
            gradient="from-cyan-900/40 to-blue-900/40"
            borderColor="border-cyan-500/50"
            badgeColor="bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
            onCompleteAction={(taskId) => {
              analytics.trackTaskCompleted(userId, plan.planId, taskId);
              toast.success('Tarefa concluída! 🎉');
            }}
          />

          {/* Card: Nutrição */}
          <PlanSummaryCard
            title="Nutrição"
            icon={<Utensils className="w-6 h-6 text-green-400" />}
            actions={plan.nutrition.map(item => ({
              id: item.id,
              day: item.title,
              activity: item.description,
              time: ''
            }))}
            gradient="from-green-900/40 to-emerald-900/40"
            borderColor="border-green-500/50"
            badgeColor="bg-green-500/20 text-green-300 border-green-500/50"
            onCompleteAction={(taskId) => {
              analytics.trackTaskCompleted(userId, plan.planId, taskId);
              toast.success('Tarefa concluída! 🎉');
            }}
          />

          {/* CTAs com A/B testing */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleBackToQuiz}
              variant="outline"
              size="lg"
              className="flex-1 border-purple-500/50 bg-gray-900/50 hover:bg-gray-900 text-white"
            >
              {ctaVariant.config.secondaryCTA}
            </Button>
            <Button
              onClick={handleStartFirstStep}
              size="lg"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 border-0"
            >
              {ctaVariant.config.primaryCTA}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // T4 - Primeiro Hábito (com A/B testing)
  if (flowStep === 'firstHabit' && plan) {
    const taskToShow = firstTaskVariant.config.tasks[0];
    
    return (
      <FirstTaskModal
        task={{
          ...plan.firstTask,
          ...taskToShow
        }}
        onComplete={handleCompleteHabit}
        isCompleted={habitCompleted}
        ctaVariant="default"
      />
    );
  }

  // T5 - Confirmação/Progresso - Redireciona para Dashboard
  if (flowStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-700 text-center">
          <div className="space-y-6">
            <div className="text-7xl animate-bounce">🏆</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Você iniciou sua jornada!
            </h1>
            
            {/* NOVO CONTEÚDO ADICIONADO */}
            <div className="space-y-4 pt-4">
              <p className="text-xl text-gray-300">
                Parabéns por completar seu primeiro hábito.
              </p>
              
              <div className="space-y-2">
                <p className="text-lg text-gray-400">
                  Pode parecer simples, mas não é.
                </p>
                <p className="text-lg text-gray-400">
                  Você fez algo que 90% das pessoas adiam: começar.
                </p>
              </div>
              
              <div className="pt-6 space-y-3">
                <p className="text-2xl font-bold text-white">
                  Agora uma coisa importante:
                </p>
                
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-white">
                    Você não está mais parado(a).
                  </p>
                  <p className="text-xl font-semibold text-white">
                    Você já está em movimento.
                  </p>
                </div>
                
                <p className="text-lg text-gray-300 pt-2">
                  A partir de hoje, você virou alguém que cumpre o que promete pra si mesmo.
                </p>
              </div>
            </div>
            
            <p className="text-xl text-gray-400 pt-4">
              +10 XP conquistados
            </p>
          </div>

          <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Progresso Semanal</span>
                  <span className="text-purple-400 font-semibold">1/7 dias</span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                    style={{ width: '14%' }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-purple-500/30">
                <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-300 text-lg px-4 py-2">
                  🎖️ Selo: Iniciou
                </Badge>
              </div>

              <div className="space-y-2 pt-4">
                <p className="text-2xl font-semibold text-white">
                  Continue assim!
                </p>
                <p className="text-gray-400">
                  Redirecionando para seu dashboard...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Fluxo de Onboarding (T1)
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Progress Bar */}
      {step > 0 && (
        <div className="w-full h-2 bg-gray-900">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          {/* Step 0 - Apresentação */}
          {step === 0 && (
            <div className="space-y-12 animate-in fade-in duration-700 text-center">
              <div className="space-y-8">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-full blur-2xl -z-10" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    Inner Rise
                  </h1>
                  <p className="text-2xl md:text-3xl text-gray-300 font-light">
                    Sua jornada de transformação começa aqui
                  </p>
                </div>

                {/* Imagem enviada pelo usuário - REDUZIDA para 40-50% */}
                <div className="flex justify-center py-2">
                  <img 
                    src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/a6cc624f-0fdd-455f-b86a-aa6b3905860b.png" 
                    alt="Jornada de transformação" 
                    className="w-full max-w-[200px] md:max-w-[250px] h-auto rounded-2xl shadow-2xl"
                  />
                </div>

                <div className="max-w-xl mx-auto space-y-6 pt-4">
                  <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                    Descubra o plano ideal para melhorar sua saúde física e mental com leveza — feito 100% para o seu estilo de vida. No <span className="text-purple-400 font-semibold">Inner Rise</span>, acreditamos que cada jornada é única e estamos aqui para apoiar você em cada passo.
                  </p>
                  
                  {/* Selo visual transformado */}
                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-purple-400/30 backdrop-blur-sm">
                      <Check className="w-5 h-5 text-purple-300" />
                      <span className="text-base md:text-lg text-purple-200/90 font-medium">
                        Aprovado por quem busca mudança sem pressão
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 pt-8">
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm text-gray-400">Plano personalizado</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm text-gray-400">Cuidado integral</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm text-gray-400">No seu ritmo</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 space-y-4">
                  <p className="text-lg text-gray-300">
                    Responda algumas perguntas e receba seu plano personalizado.
                  </p>
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="group text-xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 border-0"
                  >
                    Iniciar Minha Jornada
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">Leva apenas 2 minutos</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 - Nome */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2">
                  Passo 1 de 9
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Vamos começar
                </h1>
                <p className="text-xl text-gray-400">
                  Como podemos te chamar?
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Digite seu nome"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="h-16 text-lg bg-gray-900/50 border-purple-500/30 focus:border-purple-500 text-white placeholder:text-gray-500"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2 - Idade */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2">
                  Passo 2 de 9
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  Qual sua idade?
                </h1>
                <p className="text-xl text-gray-400">
                  Isso nos ajuda a personalizar sua jornada
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="Digite sua idade"
                  value={data.age}
                  onChange={(e) => setData({ ...data, age: e.target.value })}
                  className="h-16 text-lg bg-gray-900/50 border-purple-500/30 focus:border-purple-500 text-white placeholder:text-gray-500"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 3 - Intenção */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2">
                  Passo 3 de 9
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  O que te trouxe até aqui?
                </h1>
                <p className="text-lg text-gray-400 italic">
                  Não existe resposta certa. Existe a sua resposta.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Sparkles, text: "Quero mais energia no meu dia", gradient: "from-yellow-500 to-orange-500" },
                  { icon: Heart, text: "Quero me sentir melhor com meu corpo", gradient: "from-pink-500 to-rose-500" },
                  { icon: Brain, text: "Quero cuidar da minha mente", gradient: "from-purple-500 to-indigo-500" },
                  { icon: Target, text: "Quero criar hábitos que eu consiga manter", gradient: "from-blue-500 to-cyan-500" },
                  { icon: Sparkles, text: "Ainda não sei — só quero me sentir eu de novo", gradient: "from-purple-500 to-pink-500" },
                ].map((option, i) => {
                  const Icon = option.icon;
                  const isSelected = data.intention === option.text;
                  return (
                    <Card
                      key={i}
                      onClick={() => setData({ ...data, intention: option.text })}
                      className={`cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? `bg-gradient-to-r ${option.gradient} border-2 border-white scale-105`
                          : "bg-gray-900/50 border border-purple-500/30 hover:border-purple-500/60 hover:scale-102"
                      }`}
                    >
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected ? "bg-white/20" : `bg-gradient-to-br ${option.gradient}`
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-lg font-medium text-white flex-1">{option.text}</p>
                        {isSelected && <Check className="w-6 h-6 text-white" />}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 - Ritmo */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2">
                  Passo 4 de 9
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Em qual ritmo sua vida está hoje?
                </h1>
                <p className="text-lg text-gray-400 italic">
                  O seu ritmo importa. Nós seguimos ele — não o contrário.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  "Correria total",
                  "Consigo respirar, mas não sobra muito tempo",
                  "Tenho algum espaço para mim",
                  "Quero reorganizar tudo do zero",
                ].map((option, i) => {
                  const isSelected = data.rhythm === option;
                  return (
                    <Card
                      key={i}
                      onClick={() => setData({ ...data, rhythm: option })}
                      className={`cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white scale-105"
                          : "bg-gray-900/50 border border-purple-500/30 hover:border-purple-500/60 hover:scale-102"
                      }`}
                    >
                      <CardContent className="p-6 flex items-center justify-between">
                        <p className="text-lg font-medium text-white">{option}</p>
                        {isSelected && <Check className="w-6 h-6 text-white" />}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5 - Movimento */}
          {step === 5 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2">
                  Passo 5 de 9
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Como você se sente em relação a treinos físicos?
                </h1>
                <p className="text-lg text-gray-400 italic">
                  Ninguém nasce sabendo. Todo começo é um passo.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { text: "Nunca treinei e nem sei por onde começar", icon: Activity },
                  { text: "Já tentei, mas não consigo manter", icon: Activity },
                  { text: "Treino às vezes, sem rotina", icon: Activity },
                  { text: "Treino com frequência", icon: Activity },
                ].map((option, i) => {
                  const Icon = option.icon;
                  const isSelected = data.movement === option.text;
                  return (
                    <Card
                      key={i}
                      onClick={() => setData({ ...data, movement: option.text })}
                      className={`cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white scale-105"
                          : "bg-gray-900/50 border border-purple-500/30 hover:border-purple-500/60 hover:scale-102"
                      }`}
                    >
                      <CardContent className="p-6 flex items-center gap-4">
                        <Icon className="w-6 h-6 text-white" />
                        <p className="text-lg font-medium text-white flex-1">{option.text}</p>
                        {isSelected && <Check className="w-6 h-6 text-white" />}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6 - Emoção */}
          {step === 6 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2">
                  Passo 6 de 9
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Como anda sua relação com você mesmo?
                </h1>
                <p className="text-lg text-gray-400 italic">
                  Você não está sozinho. Todo mundo sente. Aqui, a gente cuida.
                </p>
                <p className="text-sm text-purple-400">
                  Escolha todas que se aplicam
                </p>
              </div>

              <div className="space-y-3">
                {[
                  "Me cobro demais",
                  "Tenho dificuldade de descansar",
                  "Quero gostar mais de mim",
                  "Me sinto perdido(a) às vezes",
                  "Estou pronto(a) para mudar",
                ].map((option, i) => {
                  const isSelected = data.emotions.includes(option);
                  return (
                    <Card
                      key={i}
                      onClick={() => handleEmotionToggle(option)}
                      className={`cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white scale-105"
                          : "bg-gray-900/50 border border-purple-500/30 hover:border-purple-500/60 hover:scale-102"
                      }`}
                    >
                      <CardContent className="p-6 flex items-center justify-between">
                        <p className="text-lg font-medium text-white">{option}</p>
                        {isSelected && <Check className="w-6 h-6 text-white" />}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 7 - Alimentação */}
          {step === 7 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2">
                  Passo 7 de 9
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Qual dessas frases mais parece com você?
                </h1>
                <p className="text-lg text-gray-400 italic">
                  Comer bem não é castigo. É cuidado.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { text: "Quero comer melhor sem virar refém da dieta", icon: Utensils },
                  { text: "Como bem, mas não sei montar um plano", icon: Utensils },
                  { text: "Sei o que fazer, mas não faço", icon: Utensils },
                  { text: "Não quero restrições, quero equilíbrio", icon: Utensils },
                ].map((option, i) => {
                  const Icon = option.icon;
                  const isSelected = data.nutrition === option.text;
                  return (
                    <Card
                      key={i}
                      onClick={() => setData({ ...data, nutrition: option.text })}
                      className={`cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white scale-105"
                          : "bg-gray-900/50 border border-purple-500/30 hover:border-purple-500/60 hover:scale-102"
                      }`}
                    >
                      <CardContent className="p-6 flex items-center gap-4">
                        <Icon className="w-6 h-6 text-white" />
                        <p className="text-lg font-medium text-white flex-1">{option.text}</p>
                        {isSelected && <Check className="w-6 h-6 text-white" />}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 8 - Tempo */}
          {step === 8 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2">
                  Passo 8 de 9
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Quanto tempo por dia você pode dedicar?
                </h1>
                <p className="text-lg text-gray-400 italic">
                  Um minuto com intenção vale mais que uma hora sem presença.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { text: "5 a 10 minutos", icon: Clock },
                  { text: "15 a 20 minutos", icon: Clock },
                  { text: "30 minutos", icon: Clock },
                  { text: "Depende do meu dia", icon: Clock },
                ].map((option, i) => {
                  const Icon = option.icon;
                  const isSelected = data.time === option.text;
                  return (
                    <Card
                      key={i}
                      onClick={() => setData({ ...data, time: option.text })}
                      className={`cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white scale-105"
                          : "bg-gray-900/50 border border-purple-500/30 hover:border-purple-500/60 hover:scale-102"
                      }`}
                    >
                      <CardContent className="p-6 flex items-center gap-4">
                        <Icon className="w-6 h-6 text-white" />
                        <p className="text-lg font-medium text-white flex-1">{option.text}</p>
                        {isSelected && <Check className="w-6 h-6 text-white" />}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 9 - Resumo */}
          {step === 9 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  {data.name}, seu plano está pronto!
                </h1>
                <p className="text-xl text-gray-400">
                  Com base nas suas respostas, criamos um caminho personalizado para você
                </p>
              </div>

              <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 backdrop-blur-sm">
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-purple-400">
                        <Target className="w-5 h-5" />
                        <p className="font-semibold">Seu objetivo</p>
                      </div>
                      <p className="text-white">{data.intention}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-pink-400">
                        <Clock className="w-5 h-5" />
                        <p className="font-semibold">Tempo disponível</p>
                      </div>
                      <p className="text-white">{data.time}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-orange-400">
                        <Activity className="w-5 h-5" />
                        <p className="font-semibold">Nível de atividade</p>
                      </div>
                      <p className="text-white">{data.movement}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Utensils className="w-5 h-5" />
                        <p className="font-semibold">Alimentação</p>
                      </div>
                      <p className="text-white">{data.nutrition}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-purple-500/30">
                    <div className="flex items-center gap-2 text-purple-400 mb-3">
                      <Heart className="w-5 h-5" />
                      <p className="font-semibold">Foco emocional</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.emotions.map((emotion, i) => (
                        <Badge key={i} className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 text-white">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center space-y-6 pt-4">
                <div className="space-y-2">
                  <p className="text-2xl md:text-3xl font-semibold text-white">
                    Você não precisa mudar tudo hoje.
                  </p>
                  <p className="text-2xl md:text-3xl font-semibold text-white">
                    Precisa apenas começar.
                  </p>
                  <p className="text-xl text-gray-400 pt-4">
                    Seu caminho começa agora — no seu ritmo.
                  </p>
                </div>

                <Button
                  onClick={handleCreatePlan}
                  disabled={buttonState === 'loading'}
                  size="lg"
                  className={`group text-xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 border-0 ${
                    buttonState === 'loading' ? "opacity-70 cursor-not-allowed scale-97" : "hover:scale-105"
                  }`}
                >
                  {buttonState === 'loading' ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-white rounded-full animate-bounce"
                              style={{
                                animationDelay: `${i * 0.15}s`,
                                animationDuration: '0.6s'
                              }}
                            />
                          ))}
                        </div>
                        <span>Criando seu plano...</span>
                      </div>
                    </>
                  ) : (
                    <>
                      Criar meu plano personalizado
                      <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step > 0 && step < 9 && (
            <div className="flex gap-4 mt-12">
              {step > 1 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-purple-500/30 bg-gray-900/50 hover:bg-gray-900 text-white"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Voltar
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                size="lg"
                className={`flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 border-0 ${
                  !canProceed() ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                Continuar
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
