// Sistema de Analytics para tracking de eventos
// Integra com Google Analytics, Mixpanel, Amplitude, etc.

type AnalyticsEvent = 
  | 'plan_generate_clicked'
  | 'plan_generated_success'
  | 'plan_generated_error'
  | 'first_task_completed'
  | 'plan_viewed'
  | 'task_completed'
  | 'onboarding_step_completed'
  | 'cta_clicked';

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

class Analytics {
  private isEnabled: boolean;

  constructor() {
    // Desabilita analytics em desenvolvimento
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  /**
   * Rastreia evento customizado
   */
  track(event: AnalyticsEvent, properties?: EventProperties) {
    if (!this.isEnabled) {
      console.log('[Analytics - Dev]', event, properties);
      return;
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, properties);
    }

    // Mixpanel
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.track(event, properties);
    }

    // Amplitude
    if (typeof window !== 'undefined' && (window as any).amplitude) {
      (window as any).amplitude.track(event, properties);
    }

    // Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', event, properties);
    }
  }

  /**
   * Rastreia clique no CTA de geração de plano
   */
  trackPlanGenerateClicked(userId: string, quizAnswers: any) {
    this.track('plan_generate_clicked', {
      user_id: userId,
      intention: quizAnswers.intention,
      time_available: quizAnswers.time,
      timestamp: Date.now()
    });
  }

  /**
   * Rastreia sucesso na geração do plano
   */
  trackPlanGeneratedSuccess(userId: string, planId: string, duration: number) {
    this.track('plan_generated_success', {
      user_id: userId,
      plan_id: planId,
      generation_duration_ms: duration,
      timestamp: Date.now()
    });
  }

  /**
   * Rastreia erro na geração do plano
   */
  trackPlanGeneratedError(userId: string, errorMessage: string, duration: number) {
    this.track('plan_generated_error', {
      user_id: userId,
      error_message: errorMessage,
      generation_duration_ms: duration,
      timestamp: Date.now()
    });
  }

  /**
   * Rastreia conclusão da primeira tarefa
   */
  trackFirstTaskCompleted(userId: string, planId: string, taskId: string, timeToComplete: number) {
    this.track('first_task_completed', {
      user_id: userId,
      plan_id: planId,
      task_id: taskId,
      time_to_complete_ms: timeToComplete,
      timestamp: Date.now()
    });
  }

  /**
   * Rastreia visualização do plano
   */
  trackPlanViewed(userId: string, planId: string) {
    this.track('plan_viewed', {
      user_id: userId,
      plan_id: planId,
      timestamp: Date.now()
    });
  }

  /**
   * Rastreia conclusão de tarefa
   */
  trackTaskCompleted(userId: string, planId: string, taskId: string) {
    this.track('task_completed', {
      user_id: userId,
      plan_id: planId,
      task_id: taskId,
      timestamp: Date.now()
    });
  }

  /**
   * Rastreia conclusão de step do onboarding
   */
  trackOnboardingStepCompleted(userId: string, step: number, stepName: string) {
    this.track('onboarding_step_completed', {
      user_id: userId,
      step_number: step,
      step_name: stepName,
      timestamp: Date.now()
    });
  }

  /**
   * Rastreia clique em CTA
   */
  trackCTAClicked(ctaName: string, location: string, variant?: string) {
    this.track('cta_clicked', {
      cta_name: ctaName,
      location: location,
      variant: variant,
      timestamp: Date.now()
    });
  }

  /**
   * Identifica usuário (para ferramentas que suportam)
   */
  identify(userId: string, traits?: EventProperties) {
    if (!this.isEnabled) {
      console.log('[Analytics - Dev] Identify:', userId, traits);
      return;
    }

    // Mixpanel
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.identify(userId);
      if (traits) {
        (window as any).mixpanel.people.set(traits);
      }
    }

    // Amplitude
    if (typeof window !== 'undefined' && (window as any).amplitude) {
      (window as any).amplitude.setUserId(userId);
      if (traits) {
        (window as any).amplitude.setUserProperties(traits);
      }
    }
  }

  /**
   * Rastreia tempo na página (útil para métricas de engajamento)
   */
  trackTimeOnPage(pageName: string, duration: number) {
    this.track('time_on_page', {
      page_name: pageName,
      duration_seconds: Math.round(duration / 1000),
      timestamp: Date.now()
    });
  }
}

// Singleton instance
export const analytics = new Analytics();

// Hook para facilitar uso em componentes React
export function useAnalytics() {
  return analytics;
}
