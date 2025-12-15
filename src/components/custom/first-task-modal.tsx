"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";

interface FirstTask {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xp: number;
  why?: string; // Explicação do porquê dessa tarefa
}

interface FirstTaskModalProps {
  task: FirstTask;
  onComplete: () => void;
  isCompleted?: boolean;
  ctaVariant?: 'default' | 'alt1' | 'alt2'; // A/B testing de CTAs
}

const ctaTexts = {
  default: "Marcar como concluído",
  alt1: "Completei!",
  alt2: "Feito ✓"
};

export function FirstTaskModal({ 
  task, 
  onComplete, 
  isCompleted = false,
  ctaVariant = 'default'
}: FirstTaskModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = () => {
    setShowConfetti(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-700">
        <div className="text-center space-y-6">
          <div className="text-6xl animate-bounce">{task.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Seu primeiro passo começa agora
          </h1>
          <p className="text-xl text-gray-400">
            Uma pequena ação que ativa seu cérebro para continuar.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-2 border-blue-500/50 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12 space-y-6 text-center">
            <div className="space-y-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 text-lg px-4 py-2">
                Micro-tarefa do dia
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {task.title}
              </h2>
              <p className="text-lg text-gray-300">
                {task.description}
              </p>

              {/* Explicação do "porquê" */}
              {task.why && (
                <div className="pt-4 border-t border-blue-500/30">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <p className="text-sm font-semibold text-blue-400">Por que isso importa?</p>
                  </div>
                  <p className="text-base text-gray-400 italic">
                    {task.why}
                  </p>
                </div>
              )}

              {/* XP Badge */}
              <div className="pt-2">
                <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-300">
                  +{task.xp} XP
                </Badge>
              </div>
            </div>

            {!isCompleted ? (
              <Button
                onClick={handleComplete}
                size="lg"
                className="w-full md:w-auto text-xl px-12 py-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 border-0"
              >
                <Check className="mr-2 w-6 h-6" />
                {ctaTexts[ctaVariant]}
              </Button>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-500">
                {showConfetti && (
                  <div className="text-6xl animate-bounce">
                    🎉
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                    Parabéns!
                  </p>
                  <p className="text-xl text-gray-300">
                    Você completou seu primeiro hábito!
                  </p>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-lg px-4 py-2">
                    +{task.xp} XP conquistados
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-center text-xs text-gray-600">
            CTA Variant: {ctaVariant}
          </div>
        )}
      </div>
    </div>
  );
}
