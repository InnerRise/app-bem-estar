"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Sparkles, Heart, CheckCircle } from "lucide-react";

type Answer = {
  intention?: string;
  rhythm?: string;
  movement?: string;
  emotions?: string[];
  nutrition?: string;
  time?: string;
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [name, setName] = useState("");

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelectOption = (key: keyof Answer, value: string) => {
    setAnswers({ ...answers, [key]: value });
  };

  const handleMultiSelect = (value: string) => {
    const currentEmotions = answers.emotions || [];
    const newEmotions = currentEmotions.includes(value)
      ? currentEmotions.filter((e) => e !== value)
      : [...currentEmotions, value];
    setAnswers({ ...answers, emotions: newEmotions });
  };

  // Tela 1 - Nome
  const NameScreen = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <Sparkles className="w-16 h-16 mx-auto text-purple-400 animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Bem-vindo ao seu despertar
        </h1>
        <p className="text-xl text-gray-400">
          Vamos começar pelo mais importante: você.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-left text-lg text-gray-300 font-medium">
          Como você gostaria de ser chamado?
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome"
          className="w-full px-6 py-4 bg-purple-900/20 border-2 border-purple-500/30 rounded-2xl text-white text-lg placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-all"
        />
      </div>

      <Button
        onClick={handleNext}
        disabled={!name.trim()}
        size="lg"
        className="group w-full md:w-auto px-12 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );

  // Tela 2 - Intenção
  const IntentionScreen = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          O que te trouxe até aqui, {name}?
        </h2>
        <p className="text-lg text-gray-400">
          Não existe resposta certa. Existe a sua resposta.
        </p>
      </div>

      <div className="grid gap-4">
        {[
          { value: "energia", label: "Quero mais energia no meu dia", icon: "⚡" },
          { value: "corpo", label: "Quero me sentir melhor com meu corpo", icon: "💪" },
          { value: "mente", label: "Quero cuidar da minha mente", icon: "🧠" },
          { value: "habitos", label: "Quero criar hábitos que eu consiga manter", icon: "🎯" },
          { value: "eu", label: "Ainda não sei — só quero me sentir eu de novo", icon: "✨" },
        ].map((option) => (
          <Card
            key={option.value}
            onClick={() => {
              handleSelectOption("intention", option.value);
              setTimeout(handleNext, 300);
            }}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              answers.intention === option.value
                ? "bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400"
                : "bg-purple-900/20 border-purple-500/30 hover:border-purple-500/60"
            }`}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <span className="text-4xl">{option.icon}</span>
              <span className="text-lg text-white font-medium">{option.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Tela 3 - Ritmo
  const RhythmScreen = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Em qual ritmo sua vida está hoje?
        </h2>
        <p className="text-lg text-gray-400">
          O seu ritmo importa. Nós seguimos ele — não o contrário.
        </p>
      </div>

      <div className="grid gap-4">
        {[
          { value: "correria", label: "Correria total", icon: "🏃" },
          { value: "respirar", label: "Consigo respirar, mas não sobra muito tempo", icon: "😮‍💨" },
          { value: "espaco", label: "Tenho algum espaço para mim", icon: "🌱" },
          { value: "reorganizar", label: "Quero reorganizar tudo do zero", icon: "🔄" },
        ].map((option) => (
          <Card
            key={option.value}
            onClick={() => {
              handleSelectOption("rhythm", option.value);
              setTimeout(handleNext, 300);
            }}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              answers.rhythm === option.value
                ? "bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400"
                : "bg-purple-900/20 border-purple-500/30 hover:border-purple-500/60"
            }`}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <span className="text-4xl">{option.icon}</span>
              <span className="text-lg text-white font-medium">{option.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Tela 4 - Movimento
  const MovementScreen = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Como você se sente em relação a treinos físicos?
        </h2>
        <p className="text-lg text-gray-400">
          Ninguém nasce sabendo. Todo começo é um passo.
        </p>
      </div>

      <div className="grid gap-4">
        {[
          { value: "nunca", label: "Nunca treinei e nem sei por onde começar", icon: "🌟" },
          { value: "tentei", label: "Já tentei, mas não consigo manter", icon: "🔄" },
          { value: "as-vezes", label: "Treino às vezes, sem rotina", icon: "📅" },
          { value: "frequente", label: "Treino com frequência", icon: "💪" },
        ].map((option) => (
          <Card
            key={option.value}
            onClick={() => {
              handleSelectOption("movement", option.value);
              setTimeout(handleNext, 300);
            }}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              answers.movement === option.value
                ? "bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400"
                : "bg-purple-900/20 border-purple-500/30 hover:border-purple-500/60"
            }`}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <span className="text-4xl">{option.icon}</span>
              <span className="text-lg text-white font-medium">{option.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Tela 5 - Emoção (Multi-choice)
  const EmotionScreen = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Como anda sua relação com você mesmo?
        </h2>
        <p className="text-lg text-gray-400">
          Você não está sozinho. Todo mundo sente. Aqui, a gente cuida.
        </p>
        <p className="text-sm text-purple-400">
          Você pode escolher mais de uma opção
        </p>
      </div>

      <div className="grid gap-4">
        {[
          { value: "cobro", label: "Me cobro demais", icon: "😓" },
          { value: "descansar", label: "Tenho dificuldade de descansar", icon: "😴" },
          { value: "gostar", label: "Quero gostar mais de mim", icon: "💖" },
          { value: "perdido", label: "Me sinto perdido(a) às vezes", icon: "🧭" },
          { value: "pronto", label: "Estou pronto(a) para mudar", icon: "🚀" },
        ].map((option) => {
          const isSelected = answers.emotions?.includes(option.value);
          return (
            <Card
              key={option.value}
              onClick={() => handleMultiSelect(option.value)}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400"
                  : "bg-purple-900/20 border-purple-500/30 hover:border-purple-500/60"
              }`}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <span className="text-4xl">{option.icon}</span>
                <span className="text-lg text-white font-medium flex-1">{option.label}</span>
                {isSelected && <CheckCircle className="w-6 h-6 text-white" />}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button
        onClick={handleNext}
        disabled={!answers.emotions || answers.emotions.length === 0}
        size="lg"
        className="group w-full md:w-auto px-12 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50"
      >
        Continuar
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );

  // Tela 6 - Alimentação
  const NutritionScreen = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Qual dessas frases mais parece com você?
        </h2>
        <p className="text-lg text-gray-400">
          Comer bem não é castigo. É cuidado.
        </p>
      </div>

      <div className="grid gap-4">
        {[
          { value: "melhor", label: "Quero comer melhor sem virar refém da dieta", icon: "🥗" },
          { value: "plano", label: "Como bem, mas não sei montar um plano", icon: "📋" },
          { value: "nao-faco", label: "Sei o que fazer, mas não faço", icon: "🤔" },
          { value: "equilibrio", label: "Não quero restrições, quero equilíbrio", icon: "⚖️" },
        ].map((option) => (
          <Card
            key={option.value}
            onClick={() => {
              handleSelectOption("nutrition", option.value);
              setTimeout(handleNext, 300);
            }}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              answers.nutrition === option.value
                ? "bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400"
                : "bg-purple-900/20 border-purple-500/30 hover:border-purple-500/60"
            }`}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <span className="text-4xl">{option.icon}</span>
              <span className="text-lg text-white font-medium">{option.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Tela 7 - Tempo Disponível
  const TimeScreen = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Quanto tempo por dia você pode dedicar?
        </h2>
        <p className="text-lg text-gray-400">
          Um minuto com intenção vale mais que uma hora sem presença.
        </p>
      </div>

      <div className="grid gap-4">
        {[
          { value: "5-10", label: "5 a 10 minutos", icon: "⏱️" },
          { value: "15-20", label: "15 a 20 minutos", icon: "⏰" },
          { value: "30", label: "30 minutos", icon: "🕐" },
          { value: "depende", label: "Depende do meu dia", icon: "📅" },
        ].map((option) => (
          <Card
            key={option.value}
            onClick={() => {
              handleSelectOption("time", option.value);
              setTimeout(handleNext, 300);
            }}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              answers.time === option.value
                ? "bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400"
                : "bg-purple-900/20 border-purple-500/30 hover:border-purple-500/60"
            }`}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <span className="text-4xl">{option.icon}</span>
              <span className="text-lg text-white font-medium">{option.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Tela Final - Promessa Personalizada + Checkout
  const FinalScreen = () => (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
      <div className="text-center space-y-6">
        <Heart className="w-20 h-20 mx-auto text-pink-400 animate-pulse" />
        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          {name}, seu plano está pronto
        </h2>
        <p className="text-2xl text-gray-300">
          Baseado nas suas respostas, criamos algo especial para você
        </p>
      </div>

      <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 backdrop-blur-sm">
        <CardContent className="p-8 md:p-12 space-y-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Seu foco principal</h3>
                <p className="text-gray-300">
                  {answers.intention === "energia" && "Aumentar sua energia diária com práticas simples e eficazes"}
                  {answers.intention === "corpo" && "Reconectar com seu corpo através de movimento consciente"}
                  {answers.intention === "mente" && "Cuidar da sua saúde mental com exercícios de bem-estar"}
                  {answers.intention === "habitos" && "Construir hábitos sustentáveis que se encaixam na sua vida"}
                  {answers.intention === "eu" && "Reencontrar sua essência através de autoconhecimento"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Seu ritmo</h3>
                <p className="text-gray-300">
                  Treinos adaptados para {answers.time || "seu tempo disponível"}, respeitando seu momento de vida
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Suporte emocional</h3>
                <p className="text-gray-300">
                  Acompanhamento gentil para {answers.emotions?.length || 0} áreas que você quer trabalhar
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl p-8 text-center border border-purple-500/30">
            <p className="text-2xl md:text-3xl font-bold text-white mb-4 leading-relaxed">
              Você não precisa mudar tudo hoje.
            </p>
            <p className="text-xl text-gray-200 mb-2">
              Precisa apenas começar.
            </p>
            <p className="text-lg text-purple-300">
              Seu caminho começa agora — no seu ritmo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Checkout da Keoto */}
      <div className="space-y-4">
        <Button
          onClick={() => window.open("https://checkout.keoto.com/3d062008-ff48-466d-8f61-b1d3e82c76af", "_blank")}
          size="lg"
          className="group w-full px-12 py-8 text-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-2xl hover:shadow-purple-500/50"
        >
          Assinar R$19,90/mês
          <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </Button>

        <Button
          onClick={() => window.location.href = "/"}
          variant="outline"
          size="lg"
          className="w-full px-12 py-6 text-lg border-2 border-purple-500/50 text-white hover:bg-purple-900/20"
        >
          Continuar sem assinar
        </Button>
      </div>
    </div>
  );

  const screens = [
    NameScreen,
    IntentionScreen,
    RhythmScreen,
    MovementScreen,
    EmotionScreen,
    NutritionScreen,
    TimeScreen,
    FinalScreen,
  ];

  const CurrentScreen = screens[currentStep];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-purple-900/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {currentStep > 0 && (
              <Button
                onClick={handleBack}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="flex-1">
              <Progress value={progress} className="h-2" />
            </div>
            <span className="text-sm text-gray-400">
              {currentStep + 1} de {totalSteps}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <CurrentScreen />
      </div>
    </div>
  );
}
