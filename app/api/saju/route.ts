import { NextRequest, NextResponse } from "next/server";
import { callGeminiJson, safeParseJson } from "@/lib/gemini";
import type { BirthInput, SajuResponse } from "@/lib/types";

const schema = `{
  "profile": {"inputSummary":"","disclaimer":""},
  "saju": {
    "fourPillars": {
      "year": {"heavenlyStem":"","earthlyBranch":"","ganji":""},
      "month": {"heavenlyStem":"","earthlyBranch":"","ganji":""},
      "day": {"heavenlyStem":"","earthlyBranch":"","ganji":""},
      "hour": {"heavenlyStem":"","earthlyBranch":"","ganji":"","unknown":false}
    },
    "fiveElements": {"wood":0,"fire":0,"earth":0,"metal":0,"water":0,"notes":""}
  },
  "reading": {
    "coreTraits":["","",""] ,"strengths":["","",""] ,"growthEdges":["","",""] ,
    "relationships":["","",""] ,"careerStudy":["","",""] ,"money":["","",""] ,"health":["","",""] ,"oneLineAdvice":""
  }
}`;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BirthInput & { apiKey?: string };
    if (!body.apiKey) return NextResponse.json({ error: "API Key가 필요합니다." }, { status: 400 });

    const prompt = `당신은 한국어 사주 해석 도우미다. 반드시 JSON만 반환하라. 마크다운 금지.\n` +
      `의료/법률/투자 조언 금지. 오락/참고용 고지를 포함.\n` +
      `입력값: ${JSON.stringify(body)}\n` +
      `다음 스키마를 정확히 따르라: ${schema}`;

    const raw = await callGeminiJson(body.apiKey, prompt);
    const parsed = safeParseJson<SajuResponse>(raw);
    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "사주 해석 실패" }, { status: 500 });
  }
}
