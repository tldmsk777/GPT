import { NextRequest, NextResponse } from "next/server";
import { callGeminiJson, safeParseJson } from "@/lib/gemini";
import type { BirthInput, DailyResponse } from "@/lib/types";

const schema = `{
  "date":"YYYY-MM-DD",
  "disclaimer":"오락/참고용 고지",
  "scores":{"overall":0,"love":0,"work":0,"money":0,"health":0},
  "today":{
    "summary":"",
    "do":["","",""],
    "avoid":["","",""],
    "lucky":{"color":"","number":"","item":"","timeRange":""}
  }
}`;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BirthInput & { apiKey?: string };
    if (!body.apiKey) return NextResponse.json({ error: "API Key가 필요합니다." }, { status: 400 });
    const today = new Date().toISOString().slice(0, 10);
    const prompt = `당신은 한국어 오늘의 운세 도우미다. 반드시 JSON만 반환하고 스키마를 엄격히 지켜라.\n` +
      `의료/법률/투자 조언 금지. 오락/참고용 안내를 포함.\n` +
      `오늘 날짜: ${today}\n입력값: ${JSON.stringify(body)}\n스키마:${schema}`;

    const raw = await callGeminiJson(body.apiKey, prompt);
    const parsed = safeParseJson<DailyResponse>(raw);
    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "운세 생성 실패" }, { status: 500 });
  }
}
