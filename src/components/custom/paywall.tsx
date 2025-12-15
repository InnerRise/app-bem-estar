"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, ArrowRight, Eye, X } from "lucide-react";
import { analytics } from "@/lib/analytics";

interface PaywallProps {
  userId: string;
  planId: string;
  onStartTrial: () => void;
  onViewDetails: () => void;
  onUserDataSaved?: (data: { name: string; email: string }) => void;
}

export function Paywall({
  userId,
  planId,
  onStartTrial,
  onViewDetails,
  onUserDataSaved
}: PaywallProps) {
  const [showAccountModal, setShowAccountModal] = useState(true); // Modal aparece PRIMEIRO
  const [accountSaved, setAccountSaved] = useState(false); // Controla se já salvou os dados
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [buttonCompleted, setButtonCompleted] = useState(false); // Estado para mudar cor do botão após conclusão

  const handleStartTrial = () => {
    analytics.trackCTAClicked('start_trial', 'paywall', 'trial_7_days');
    analytics.track('paywall_trial_started', {
      userId,
      planId,
      price: 19.90,
      trial_days: 7
    });
    onStartTrial();
  };

  const handleViewDetails = () => {
    analytics.trackCTAClicked('view_details', 'paywall', 'secondary');
    analytics.track('paywall_details_viewed', {
      userId,
      planId
    });
    onViewDetails();
  };

  const handleStartNow = () => {
    analytics.trackCTAClicked('start_now', 'paywall', 'primary');
    analytics.track('paywall_subscription_started', {
      userId,
      planId,
      price: 19.90
    });
    // Abre o checkout da Keoto em nova aba
    window.open('https://checkout.keoto.com/3d062008-ff48-466d-8f61-b1d3e82c76af', '_blank');
  };

  const handleSaveAccount = () => {
    if (name.trim() && email.trim()) {
      // Salva os dados do usuário no localStorage
      const userData = { name: name.trim(), email: email.trim() };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Notifica o componente pai (se callback fornecido)
      if (onUserDataSaved) {
        onUserDataSaved(userData);
      }
      
      analytics.track('account_created_before_subscription', {
        userId,
        planId,
        name: userData.name,
        email: userData.email
      });
      
      setAccountSaved(true); // Marca que salvou os dados
      setButtonCompleted(true); // Muda a cor do botão para indicar conclusão
      
      // Fecha o modal após um pequeno delay para mostrar a mudança de cor
      setTimeout(() => {
        setShowAccountModal(false);
      }, 1000);
    }
  };

  const canProceed = name.trim() !== "" && email.trim() !== "";

  const benefits = [
    "Treinos personalizados no seu ritmo",
    "Planos alimentares simples",
    "Exercícios mentais e respiratórios",
    "Acompanhamento semanal",
    "Sem propaganda e sem distrações"
  ];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl space-y-8 animate-in fade-in duration-700">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Seu plano personalizado está pronto 🚀
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Criado com base nas suas respostas, para transformar sua rotina com leveza.
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 backdrop-blur-sm">
          <CardContent className="p-8 md:p-10 space-y-8">
            {/* Benefícios */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">
                Benefícios incluídos:
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 bg-black/30 rounded-lg border border-purple-500/30 transition-all duration-300 hover:border-purple-500/60 hover:scale-102"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-lg text-white">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-purple-500/30" />

            {/* Oferta */}
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-300 text-lg px-6 py-2">
                  🎁 Oferta Especial
                </Badge>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Comece agora com <span className="text-purple-400 font-bold text-xl">7 dias grátis</span>.
                </p>
                <p className="text-base text-gray-400">
                  Após o período de testes, a assinatura será renovada automaticamente por{" "}
                  <span className="text-white font-semibold">R$ 19,90/mês</span>.
                </p>
              </div>

              {/* CTAs - Só aparecem depois de salvar a conta */}
              {accountSaved ? (
                <div className="space-y-4 pt-4">
                  {/* Botão Protagonista: Assinar R$ 19,90/mês */}
                  <Button
                    onClick={handleStartNow}
                    size="lg"
                    className="w-full text-2xl py-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 border-0 font-bold"
                  >
                    Assinar R$ 19,90/mês
                    <ArrowRight className="ml-3 w-7 h-7" />
                  </Button>

                  {/* Botão Secundário: 7 dias grátis (menor) */}
                  <Button
                    onClick={handleStartTrial}
                    size="lg"
                    className="w-full text-lg py-6 bg-gray-900/50 hover:bg-gray-800 border-2 border-purple-500/50 hover:border-purple-500 text-white transition-all duration-300"
                  >
                    Começar meus 7 dias grátis
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <Button
                    onClick={handleViewDetails}
                    variant="outline"
                    size="lg"
                    className="w-full text-base py-5 border-purple-500/30 bg-transparent hover:bg-gray-900/30 text-gray-300 hover:text-white"
                  >
                    <Eye className="mr-2 w-5 h-5" />
                    Ver detalhes do plano
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-lg">
                    Complete seu cadastro para liberar os planos
                  </p>
                </div>
              )}

              {/* Info adicional */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  Cancele a qualquer momento. Sem taxas ocultas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Criação de Conta - Aparece PRIMEIRO */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50 shadow-2xl animate-in zoom-in duration-300">
            <CardContent className="p-8 space-y-6">
              {/* Header do Modal */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Antes de liberar seu plano, crie uma conta grátis para salvar seu progresso.
                </h2>
              </div>

              {/* Formulário */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-gray-400 font-medium">
                    Nome
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 text-base bg-gray-900/50 border-purple-500/30 focus:border-purple-500 text-white placeholder:text-gray-500"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-400 font-medium">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base bg-gray-900/50 border-purple-500/30 focus:border-purple-500 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Botão de Ação */}
              <Button
                onClick={handleSaveAccount}
                disabled={!canProceed}
                size="lg"
                className={`w-full text-lg py-6 shadow-2xl transition-all duration-300 border-0 font-bold ${
                  buttonCompleted
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                } ${
                  !canProceed ? "opacity-50 cursor-not-allowed" : buttonCompleted ? "" : "hover:scale-105"
                }`}
              >
                {buttonCompleted ? "Concluído! ✅" : "Salvar meu plano e continuar"}
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>

              {/* Info adicional */}
              <p className="text-xs text-center text-gray-500">
                Seus dados estão seguros e não serão compartilhados.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}