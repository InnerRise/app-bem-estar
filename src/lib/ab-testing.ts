// Configuração de A/B Testing
// Define variantes e distribuição de tráfego

export type ABTestVariant = 'A' | 'B';

export interface ABTestConfig {
  name: string;
  variants: {
    A: {
      name: string;
      weight: number; // Porcentagem de tráfego (0-100)
      config: any;
    };
    B: {
      name: string;
      weight: number;
      config: any;
    };
  };
}

// Configuração do teste de loading (T2)
export const loadingTest: ABTestConfig = {
  name: 'loading_duration_test',
  variants: {
    A: {
      name: 'T2 exato com 3.2s (sem opção de pular)',
      weight: 50,
      config: {
        duration: 3200,
        showProgressBar: false,
        allowSkip: false,
        messages: [
          "Seu objetivo importa.",
          "A constância vale mais do que a intensidade.",
          "Pequenos passos mudam tudo."
        ]
      }
    },
    B: {
      name: 'T2 mais curto (1s) + progress bar',
      weight: 50,
      config: {
        duration: 1000,
        showProgressBar: true,
        allowSkip: false,
        messages: [
          "Respire. Seu plano está a caminho.",
          "Estamos preparando algo só seu."
        ]
      }
    }
  }
};

// Configuração do teste de CTAs (T3)
export const ctaTest: ABTestConfig = {
  name: 'cta_text_test',
  variants: {
    A: {
      name: 'CTA padrão',
      weight: 50,
      config: {
        primaryCTA: "Iniciar meu primeiro passo",
        secondaryCTA: "Editar preferências"
      }
    },
    B: {
      name: 'CTA alternativo',
      weight: 50,
      config: {
        primaryCTA: "Quero começar agora",
        secondaryCTA: "Ver meu plano"
      }
    }
  }
};

// Configuração do teste de primeira tarefa (T4)
export const firstTaskTest: ABTestConfig = {
  name: 'first_task_action_test',
  variants: {
    A: {
      name: 'Tarefa padrão',
      weight: 50,
      config: {
        tasks: [
          {
            id: 'drink_water',
            title: 'Beber 1 copo d\'água',
            description: 'Hidrate-se agora mesmo',
            emoji: '💧',
            xp: 10,
            why: 'A hidratação é o primeiro passo para mais energia e clareza mental.'
          }
        ]
      }
    },
    B: {
      name: 'Tarefa alternativa',
      weight: 50,
      config: {
        tasks: [
          {
            id: 'walk_5min',
            title: 'Andar 5 minutos',
            description: 'Dê uma volta rápida',
            emoji: '🚶',
            xp: 10,
            why: 'Movimento ativa seu corpo e prepara sua mente para o dia.'
          },
          {
            id: 'breathe_2min',
            title: 'Respiração 2 minutos',
            description: 'Respire fundo e devagar',
            emoji: '🧘',
            xp: 10,
            why: 'Respiração consciente reduz ansiedade e aumenta foco.'
          },
          {
            id: 'gratitude',
            title: 'Escrever 1 gratidão',
            description: 'Anote algo pelo qual você é grato',
            emoji: '✍️',
            xp: 10,
            why: 'Gratidão melhora humor e perspectiva sobre a vida.'
          }
        ]
      }
    }
  }
};

/**
 * Determina qual variante o usuário deve ver
 * Usa hash do userId para garantir consistência
 */
export function getABTestVariant(userId: string, test: ABTestConfig): ABTestVariant {
  // Em desenvolvimento, sempre retorna A para facilitar testes
  if (process.env.NODE_ENV === 'development') {
    return 'A';
  }

  // Hash simples do userId
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Converte hash para porcentagem (0-100)
  const percentage = Math.abs(hash % 100);

  // Determina variante baseado no peso
  return percentage < test.variants.A.weight ? 'A' : 'B';
}

/**
 * Pega configuração da variante para um usuário
 */
export function getVariantConfig<T = any>(userId: string, test: ABTestConfig): T {
  const variant = getABTestVariant(userId, test);
  return test.variants[variant].config as T;
}

/**
 * Salva variante no localStorage para consistência
 */
export function saveVariant(userId: string, testName: string, variant: ABTestVariant) {
  if (typeof window !== 'undefined') {
    const key = `ab_test_${testName}_${userId}`;
    localStorage.setItem(key, variant);
  }
}

/**
 * Recupera variante salva do localStorage
 */
export function getSavedVariant(userId: string, testName: string): ABTestVariant | null {
  if (typeof window !== 'undefined') {
    const key = `ab_test_${testName}_${userId}`;
    return localStorage.getItem(key) as ABTestVariant | null;
  }
  return null;
}

/**
 * Hook para facilitar uso em componentes React
 */
export function useABTest(userId: string, test: ABTestConfig) {
  // Tenta recuperar variante salva
  let variant = getSavedVariant(userId, test.name);
  
  // Se não existe, determina nova variante
  if (!variant) {
    variant = getABTestVariant(userId, test);
    saveVariant(userId, test.name, variant);
  }

  const config = test.variants[variant].config;

  return {
    variant,
    config,
    variantName: test.variants[variant].name
  };
}
