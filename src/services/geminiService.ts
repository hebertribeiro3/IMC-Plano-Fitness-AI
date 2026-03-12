import { GoogleGenAI } from "@google/genai";

export async function generateFitnessPlan(
  age: number,
  weight: number,
  height: number,
  bmi: number,
  goal: string,
  days: number
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key do Gemini não encontrada. Verifique as configurações (Secrets).");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Atue como um nutricionista e personal trainer especialista.
    Tenho um cliente com as seguintes características:
    - Idade: ${age} anos
    - Peso: ${weight} kg
    - Altura: ${height} cm
    - IMC (Índice de Massa Corporal): ${bmi.toFixed(2)}
    - Objetivo: ${goal === 'lose' ? 'Perder peso (emagrecimento)' : goal === 'gain' ? 'Ganhar peso (hipertrofia)' : 'Manter peso'}
    - Disponibilidade para treinar: ${days} dias por semana

    Com base nessas informações, crie um plano personalizado e direto ao ponto contendo:
    1. **Calorias Diárias Recomendadas**: Uma estimativa de quantas calorias a pessoa precisa consumir por dia para atingir o objetivo.
    2. **Tempo de Cardio na Semana**: Recomendação de quanto tempo (em minutos/horas) de exercícios cardiovasculares por semana.
    3. **Treino na Academia**: Recomendação de divisão de treino para os ${days} dias disponíveis na semana.

    Apresente a resposta em formato Markdown, usando listas e negrito para destacar as informações principais. Seja encorajador e profissional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Você é um especialista em fitness e nutrição, focado em resultados práticos e saudáveis.",
      }
    });

    return response.text || "Não foi possível gerar o plano no momento. Tente novamente.";
  } catch (error: any) {
    console.error("Erro ao gerar plano com Gemini:", error);
    throw new Error(error.message || "Falha ao se comunicar com a inteligência artificial.");
  }
}
