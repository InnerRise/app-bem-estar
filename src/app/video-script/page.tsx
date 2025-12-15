import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Music, Mic, Clock, Heart, Sparkles } from "lucide-react";

export default function VideoScript() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                InnerRise
              </h1>
              <p className="text-sm text-gray-400">Roteiro de Vídeo de Lançamento</p>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <Film className="w-4 h-4 mr-2" />
              Vídeo Emocional
            </Badge>
          </div>
        </div>
      </header>

      {/* Informações Técnicas */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white">Duração</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-400">60-90s</p>
                <p className="text-sm text-gray-400 mt-1">Formato curto e impactante</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white">Música</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-blue-400">Cinemática Emocional</p>
                <p className="text-sm text-gray-400 mt-1">Piano + pads crescentes</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white">Narração</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-orange-400">Voz Acolhedora</p>
                <p className="text-sm text-gray-400 mt-1">Suave, íntima, pausada</p>
              </CardContent>
            </Card>
          </div>

          {/* Roteiro Detalhado */}
          <div className="space-y-6">
            {/* Cena 1 */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/30 backdrop-blur-sm border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      CENA 1
                    </Badge>
                    <CardTitle className="text-white text-xl">O Despertar da Consciência</CardTitle>
                  </div>
                  <span className="text-sm text-gray-400">0:00 - 0:10</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-purple-300 font-semibold mb-2">🎬 VISUAL:</p>
                  <p className="text-gray-300 leading-relaxed">
                    Close no rosto de alguém cansado. Olhar vazio, expressão de esgotamento. Luz suave e cinzenta. 
                    Câmera lenta. Foco nos olhos que transmitem exaustão emocional.
                  </p>
                </div>
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
                  <p className="text-sm text-purple-300 font-semibold mb-2">🎙️ NARRAÇÃO:</p>
                  <p className="text-white text-lg italic leading-relaxed">
                    "Quando foi a última vez que você cuidou de você... de verdade?"
                  </p>
                </div>
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/20">
                  <p className="text-sm text-blue-300 font-semibold mb-2">🎵 MÚSICA:</p>
                  <p className="text-gray-300">
                    Piano minimalista, notas longas e espaçadas. Tom melancólico, quase sussurrado. Volume baixo.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cena 2 */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-gray-900/30 backdrop-blur-sm border-gray-500/30 hover:border-gray-500/60 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                      CENA 2
                    </Badge>
                    <CardTitle className="text-white text-xl">A Luta Silenciosa</CardTitle>
                  </div>
                  <span className="text-sm text-gray-400">0:10 - 0:20</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-gray-300 font-semibold mb-2">🎬 VISUAL:</p>
                  <p className="text-gray-300 leading-relaxed">
                    Flash rápido de cenas: pessoa olhando no espelho com desânimo, sentada na cama sem energia, 
                    olhando pela janela com frustração, mãos no rosto. Cortes rápidos. Tons cinzentos e dessaturados.
                  </p>
                </div>
                <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-500/20">
                  <p className="text-sm text-gray-300 font-semibold mb-2">🎙️ NARRAÇÃO:</p>
                  <p className="text-white text-lg italic leading-relaxed">
                    "A vida corre. As obrigações crescem. E você vai se deixando para depois."
                  </p>
                </div>
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/20">
                  <p className="text-sm text-blue-300 font-semibold mb-2">🎵 MÚSICA:</p>
                  <p className="text-gray-300">
                    Piano continua, adiciona pads sutis. Tensão crescente mas contida. Batida de coração baixa ao fundo.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cena 3 */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-blue-900/30 backdrop-blur-sm border-blue-500/30 hover:border-blue-500/60 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      CENA 3
                    </Badge>
                    <CardTitle className="text-white text-xl">O Momento da Decisão</CardTitle>
                  </div>
                  <span className="text-sm text-gray-400">0:20 - 0:30</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-blue-300 font-semibold mb-2">🎬 VISUAL:</p>
                  <p className="text-gray-300 leading-relaxed">
                    A pessoa respirando fundo, olhos fechados. Abre os olhos lentamente. Olha para a própria mão, 
                    depois para o horizonte. Luz começa a clarear sutilmente. Câmera lenta. Momento de virada emocional.
                  </p>
                </div>
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/20">
                  <p className="text-sm text-blue-300 font-semibold mb-2">🎙️ NARRAÇÃO:</p>
                  <p className="text-white text-lg italic leading-relaxed">
                    "Mas existe um momento em que tudo muda: quando você decide começar."
                  </p>
                </div>
                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/20">
                  <p className="text-sm text-cyan-300 font-semibold mb-2">🎵 MÚSICA:</p>
                  <p className="text-gray-300">
                    Transição sutil. Piano ganha esperança. Pads começam a crescer. Sintetizadores quentes entram suavemente. 
                    Momento de "turning point" sonoro.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cena 4 */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/30 backdrop-blur-sm border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      CENA 4
                    </Badge>
                    <CardTitle className="text-white text-xl">A Solução Gentil</CardTitle>
                  </div>
                  <span className="text-sm text-gray-400">0:30 - 0:45</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-purple-300 font-semibold mb-2">🎬 VISUAL:</p>
                  <p className="text-gray-300 leading-relaxed">
                    Imagens do app em uso: interface limpa mostrando treinos simples (pessoa fazendo exercício leve), 
                    exercícios de respiração (animação suave de inspirar/expirar), alimentação prática (refeições coloridas e simples). 
                    Transições suaves. Cores começam a ganhar vida.
                  </p>
                </div>
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
                  <p className="text-sm text-purple-300 font-semibold mb-2">🎙️ NARRAÇÃO:</p>
                  <p className="text-white text-lg italic leading-relaxed">
                    "Nós criamos um caminho possível. Gentil. Real. Para transformar corpo, mente e rotina."
                  </p>
                </div>
                <div className="bg-pink-900/20 rounded-lg p-4 border border-pink-500/20">
                  <p className="text-sm text-pink-300 font-semibold mb-2">🎵 MÚSICA:</p>
                  <p className="text-gray-300">
                    Música ganha corpo. Batida suave entra. Sintetizadores quentes mais presentes. 
                    Sensação de movimento e esperança crescente.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cena 5 */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-orange-900/30 backdrop-blur-sm border-orange-500/30 hover:border-orange-500/60 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                      CENA 5
                    </Badge>
                    <CardTitle className="text-white text-xl">A Transformação</CardTitle>
                  </div>
                  <span className="text-sm text-gray-400">0:45 - 0:60</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-orange-300 font-semibold mb-2">🎬 VISUAL:</p>
                  <p className="text-gray-300 leading-relaxed">
                    A pessoa sorrindo genuinamente, se movendo com energia, vivendo plenamente. 
                    Cenas de atividades cotidianas com leveza: caminhando ao ar livre, preparando comida, 
                    alongando-se pela manhã. Cores vibrantes e saturadas. Luz dourada. Sensação de liberdade.
                  </p>
                </div>
                <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/20">
                  <p className="text-sm text-orange-300 font-semibold mb-2">🎙️ NARRAÇÃO:</p>
                  <p className="text-white text-lg italic leading-relaxed">
                    "Você não precisa ser perfeito. Só precisa dar o primeiro passo."
                  </p>
                </div>
                <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/20">
                  <p className="text-sm text-yellow-300 font-semibold mb-2">🎵 MÚSICA:</p>
                  <p className="text-gray-300">
                    MÚSICA SOBE! Momento de clímax emocional. Todos os elementos juntos: piano, pads, sintetizadores, 
                    batida suave. Energia ascendente mas nunca "épica demais" - mantém gentileza.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cena 6 */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-pink-900/30 backdrop-blur-sm border-pink-500/30 hover:border-pink-500/60 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                      CENA 6
                    </Badge>
                    <CardTitle className="text-white text-xl">O Convite Final</CardTitle>
                  </div>
                  <span className="text-sm text-gray-400">0:60 - 0:75</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-pink-300 font-semibold mb-2">🎬 VISUAL:</p>
                  <p className="text-gray-300 leading-relaxed">
                    Tela final limpa e elegante. Logo do InnerRise aparece suavemente com animação sutil. 
                    Fundo gradiente roxo/rosa suave. Texto: "InnerRise - Sua melhor versão não é um destino. É um despertar." 
                    Botão CTA: "Comece Hoje". Design minimalista e acolhedor.
                  </p>
                </div>
                <div className="bg-pink-900/20 rounded-lg p-4 border border-pink-500/20">
                  <p className="text-sm text-pink-300 font-semibold mb-2">🎙️ NARRAÇÃO:</p>
                  <p className="text-white text-lg italic leading-relaxed">
                    "Este é o seu despertar. Comece hoje."
                  </p>
                </div>
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
                  <p className="text-sm text-purple-300 font-semibold mb-2">🎵 MÚSICA:</p>
                  <p className="text-gray-300">
                    Música começa a decrescer suavemente. Resolve em acorde final esperançoso. 
                    Fade out gentil deixando sensação de paz e possibilidade.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Diretrizes Técnicas */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Music className="w-6 h-6 text-purple-400" />
                  <CardTitle className="text-white">Diretrizes Musicais</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <p><strong className="text-purple-300">Estilo:</strong> Cinemática suave com piano + pads</p>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <p><strong className="text-purple-300">Início:</strong> Calma, quase sussurrada, notas longas e minimalistas</p>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <p><strong className="text-purple-300">Meio:</strong> Crescimento gradual com sintetizadores quentes</p>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <p><strong className="text-purple-300">Clímax:</strong> Energia ascendente mas nunca "épica demais"</p>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <p><strong className="text-purple-300">Mood:</strong> Piano triste que vira trilha de recomeço</p>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <p><strong className="text-purple-300">Referências:</strong> "cinematic hope", "soft emotional storytelling", "gentle inspiration"</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-sm border-blue-500/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Mic className="w-6 h-6 text-blue-400" />
                  <CardTitle className="text-white">Diretrizes de Narração</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <p><strong className="text-blue-300">Timbre:</strong> Suave e quente, voz acolhedora</p>
                </div>
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <p><strong className="text-blue-300">Ritmo:</strong> Fala devagar com pausas intencionais</p>
                </div>
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <p><strong className="text-blue-300">Tom:</strong> Baixo, quase íntimo, como conversa com amigo</p>
                </div>
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <p><strong className="text-blue-300">Energia:</strong> Zero urgência, zero pressa, zero exagero motivacional</p>
                </div>
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <p><strong className="text-blue-300">Emoção:</strong> Tom de "eu entendo", não "eu mando você mudar"</p>
                </div>
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <p><strong className="text-blue-300">Opcional:</strong> Leve rouquidão para humanizar</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notas de Produção */}
          <Card className="mt-6 bg-gradient-to-br from-orange-900/40 to-yellow-900/40 backdrop-blur-sm border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-white text-xl">📝 Notas de Produção</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <div>
                <p className="font-semibold text-orange-300 mb-2">Energia Geral do Vídeo:</p>
                <p className="leading-relaxed">
                  Começa cinzenta, calma, triste → transição gradual → termina leve, iluminada, ascendente. 
                  NUNCA vira "épica demais". Mantém gentileza e acolhimento do início ao fim.
                </p>
              </div>
              <div>
                <p className="font-semibold text-orange-300 mb-2">Paleta de Cores:</p>
                <p className="leading-relaxed">
                  Cenas 1-2: Tons cinzentos, dessaturados, luz fria<br />
                  Cena 3: Transição sutil, luz começa a clarear<br />
                  Cenas 4-5: Cores ganham vida, saturação aumenta, luz dourada<br />
                  Cena 6: Gradiente roxo/rosa suave, minimalista
                </p>
              </div>
              <div>
                <p className="font-semibold text-orange-300 mb-2">Ritmo de Edição:</p>
                <p className="leading-relaxed">
                  Cenas 1-3: Câmera lenta, cortes mais longos, contemplativo<br />
                  Cena 4: Transições suaves, ritmo moderado<br />
                  Cena 5: Mais dinâmico mas nunca frenético<br />
                  Cena 6: Pausa final, respiro, convite gentil
                </p>
              </div>
              <div>
                <p className="font-semibold text-orange-300 mb-2">Objetivo Emocional:</p>
                <p className="leading-relaxed">
                  Fazer o espectador se IDENTIFICAR (cenas 1-2), sentir ESPERANÇA (cena 3), 
                  ver POSSIBILIDADE (cena 4), sentir INSPIRAÇÃO (cena 5) e tomar AÇÃO (cena 6). 
                  Tudo de forma gentil, nunca agressiva ou vendedora.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            InnerRise - Roteiro de Vídeo de Lançamento | Versão 1.0
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Documento criado para produção de vídeo emocional curto (60-90s)
          </p>
        </div>
      </footer>
    </div>
  );
}
