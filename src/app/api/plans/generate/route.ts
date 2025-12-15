import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, quizAnswers } = body;

    // Simula processamento (em produção, aqui viria a lógica de IA/personalização)
    await new Promise(resolve => setTimeout(resolve, 800));

    // Gera plano personalizado baseado nas respostas
    const plan = {
      planId: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      summary: `Plano personalizado para ${quizAnswers.name}`,
      week1: [
        {
          day: "Seg",
          activity: "Caminhada leve + 2 min de respiração",
          time: "10 min",
          taskId: "task_1"
        },
        {
          day: "Qua",
          activity: "Mobilidade e alongamento",
          time: "15 min",
          taskId: "task_2"
        },
        {
          day: "Sex",
          activity: "Movimento consciente (leve)",
          time: "10 min",
          taskId: "task_3"
        }
      ],
      nutrition: [
        {
          id: "nutrition_1",
          title: "1 refeição colorida por dia",
          description: "Inclua pelo menos 3 cores diferentes no prato"
        },
        {
          id: "nutrition_2",
          title: "Beber 1 copo d'água ao acordar",
          description: "Hidratação matinal para começar o dia"
        },
        {
          id: "nutrition_3",
          title: "Comer de forma consciente",
          description: "Sem restrições, apenas atenção plena"
        }
      ],
      firstTask: {
        id: "first_task_water",
        title: "Beba um copo de água ao acordar amanhã",
        description: "Pequenas vitórias preparam seu cérebro para continuar. Este é o primeiro passo de uma jornada incrível.",
        emoji: "💧",
        xp: 10
      },
      focus: {
        intention: quizAnswers.intention,
        emotions: quizAnswers.emotions,
        time: quizAnswers.time,
        rhythm: quizAnswers.rhythm,
        movement: quizAnswers.movement,
        nutrition: quizAnswers.nutrition
      }
    };

    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Ops, não conseguimos criar seu plano. Tente novamente.' },
      { status: 500 }
    );
  }
}
