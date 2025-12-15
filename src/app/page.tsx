"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Onboarding from "@/components/custom/onboarding";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const router = useRouter();

  // Renderização condicional sem retorno antecipado
  return (
    <>
      {!showOnboarding ? (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold">InnerRise</h1>
            <div className="space-y-4">
              <Button
                onClick={() => setShowOnboarding(true)}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
              >
                Iniciar Onboarding
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                size="lg"
                variant="outline"
                className="w-full border-purple-500/50 text-white"
              >
                Ir para Dashboard
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Onboarding />
      )}
    </>
  );
}
