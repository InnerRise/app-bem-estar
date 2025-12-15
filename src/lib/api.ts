// API client com timeout e retry logic

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  timeout?: number;
  minDelay?: number; // Delay mínimo para UX (sensação de processamento)
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function delayMinimum(ms: number, startTime: number) {
  const elapsed = Date.now() - startTime;
  const remaining = ms - elapsed;
  if (remaining > 0) {
    await new Promise(resolve => setTimeout(resolve, remaining));
  }
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const api = {
  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const {
      method = 'GET',
      body,
      timeout = 8000, // 8s timeout padrão
      minDelay = 1200 // 1.2s delay mínimo para UX
    } = options;

    const startTime = Date.now();

    try {
      const response = await fetchWithTimeout(
        endpoint,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
        },
        timeout
      );

      // Garante delay mínimo para sensação de processamento
      await delayMinimum(minDelay, startTime);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new ApiError(response.status, error.error || 'Erro na requisição');
      }

      return await response.json();
    } catch (error) {
      // Garante delay mínimo mesmo em caso de erro
      await delayMinimum(minDelay, startTime);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'A requisição demorou muito. Tente novamente.');
      }

      throw new ApiError(500, 'Ops, algo deu errado. Tente novamente.');
    }
  },

  async get<T>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  async post<T>(endpoint: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  },

  async put<T>(endpoint: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  async delete<T>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
};
