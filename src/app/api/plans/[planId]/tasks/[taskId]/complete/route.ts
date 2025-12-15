import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string; taskId: string }> }
) {
  try {
    const { planId, taskId } = await params;

    // Em produção, atualizar no banco de dados
    // Por enquanto, simula sucesso
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      planId,
      taskId,
      xpEarned: 10,
      message: "Tarefa concluída com sucesso!",
      badge: {
        name: "Iniciou",
        emoji: "🎖️"
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json(
      { error: 'Não foi possível completar a tarefa' },
      { status: 500 }
    );
  }
}
