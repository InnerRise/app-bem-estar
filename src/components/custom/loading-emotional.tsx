"use client";

import { useEffect, useState } from "react";

interface LoadingEmotionalProps {
  variant?: 'A' | 'B'; // A/B testing
  duration?: number; // Duração em ms (3200 para A, 1000 para B)
  messages?: string[];
  onComplete?: () => void;
}

const defaultMessages = [
  "Seu objetivo importa.",
  "A constância vale mais do que a intensidade.",
  "Pequenos passos mudam tudo."
];

const alternativeMessages = [
  "Respire. Seu plano está a caminho.",
  "Estamos preparando algo só seu.",
  "Cada passo conta."
];

export function LoadingEmotional({ 
  variant = 'A',
  duration = 3200,
  messages = defaultMessages,
  onComplete
}: LoadingEmotionalProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Rotação de mensagens
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 1200);

    // Progress bar (apenas para variante B)
    if (variant === 'B') {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + (100 / (duration / 50)); // Atualiza a cada 50ms
        });
      }, 50);

      return () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      };
    }

    return () => clearInterval(messageInterval);
  }, [variant, duration, messages.length]);

  useEffect(() => {
    // Callback quando completo
    if (onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl text-center space-y-8 animate-in fade-in duration-700">
        {/* Animação de 3 pontos pulando */}
        <div className="flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Seu plano está nascendo ✨
          </h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-lg mx-auto">
            Com base no que você nos contou, estamos criando um caminho que respeita o seu ritmo. Sem cobranças, sem pressão — só evolução real.
          </p>
        </div>

        {/* Microcopies rotativas */}
        <div className="pt-8">
          <p 
            className="text-2xl font-medium text-purple-400 animate-in fade-in duration-500" 
            key={currentMessage}
          >
            {messages[currentMessage]}
          </p>
        </div>

        {/* Progress bar (apenas variante B) */}
        {variant === 'B' && (
          <div className="pt-8 space-y-2">
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {Math.round(progress)}%
            </p>
          </div>
        )}

        {/* Timer info (apenas para debug/QA) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="pt-4 text-xs text-gray-600">
            Variante: {variant} | Duração: {duration}ms
          </div>
        )}
      </div>
    </div>
  );
}
