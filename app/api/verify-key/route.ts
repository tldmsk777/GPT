import { NextRequest, NextResponse } from "next/server";
import { callGeminiJson } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { apiKey?: string };
    if (!body.apiKey) {
      return NextResponse.json({ ok: false, message: "API Key가 비어 있습니다." }, { status: 400 });
    }

    await callGeminiJson(
      body.apiKey,
      "{\"task\":\"healthcheck\",\"instruction\":\"Return {\\\"ok\\\":true} JSON only\"}"
    );

    return NextResponse.json({ ok: true, message: "API Key 검증 성공" });
  } catch {
    return NextResponse.json({ ok: false, message: "API Key 검증 실패 (키/권한/요금제를 확인해 주세요)." }, { status: 400 });
  }
}
