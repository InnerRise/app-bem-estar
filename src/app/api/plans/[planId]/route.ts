import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const { planId } = await params;

    // Em produção, buscar do banco de dados
    // Por enquanto, retorna dados mockados
    const plan = {
      planId,
      summary: "Seu plano personalizado",
      week1: [
        {
          day: "Seg",
          activity: "Caminhada leve + 2 min de respiração",
          time: "10 min",
          taskId: "task_1",
          completed: false
        },
        {
          day: "Qua",
          activity: "Mobilidade e alongamento",
          time: "15 min",
          taskId: "task_2",
          completed: false
        },
        {
          day: "Sex",
          activity: "Movimento consciente (leve)",
          time: "10 min",
          taskId: "task_3",
          completed: false
        }
      ],
      nutrition: [
        {
          id: "nutrition_1",
          title: "1 refeição colorida por dia",
          completed: false
        },
        {
          id: "nutrition_2",
          title: "Beber 1 copo d'água ao acordar",
          completed: false
        },
        {
          id: "nutrition_3",
          title: "Comer de forma consciente",
          completed: false
        }
      ]
    };

    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json(
      { error: 'Plano não encontrado' },
      { status: 404 }
    );
  }
}
