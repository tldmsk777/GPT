"use client";

import { FormEvent, useMemo, useState } from "react";
import { readApiKey, readBirthProfile, saveBirthProfile } from "@/lib/storage";
import type { BirthInput, SajuResponse } from "@/lib/types";

const initialForm: BirthInput = {
  birthDate: "",
  birthTime: "",
  unknownBirthTime: false,
  gender: "응답 안 함",
  calendarType: "양력",
  leapMonth: false,
  birthPlace: "",
  nickname: "",
};

export default function SajuPage() {
  const cached = useMemo(() => readBirthProfile() ?? initialForm, []);
  const [form, setForm] = useState<BirthInput>(cached);
  const [result, setResult] = useState<SajuResponse | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const hasKey = Boolean(readApiKey());

  const update = <K extends keyof BirthInput>(key: K, value: BirthInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasKey) return;
    setLoading(true);
    setStatus("사주를 해석 중입니다...");
    setResult(null);
    try {
      saveBirthProfile(form);
      const res = await fetch("/api/saju", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: readApiKey(), ...form }),
      });
      const data = (await res.json()) as SajuResponse & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "요청 실패");
      setResult(data);
      setStatus("완료되었습니다.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">사주팔자(명식)</h1>
      {!hasKey && <p className="rounded border border-amber-300 bg-amber-50 p-3 text-sm">API Key가 없어 실행할 수 없습니다. 설정 페이지에서 먼저 입력해 주세요.</p>}
      <form onSubmit={submit} className="grid gap-3 rounded border bg-white p-4 md:grid-cols-2">
        <label className="text-sm">생년월일
          <input className="mt-1 w-full rounded border px-3 py-2" type="date" value={form.birthDate} onChange={(e) => update("birthDate", e.target.value)} required />
        </label>
        <label className="text-sm">출생시간
          <input className="mt-1 w-full rounded border px-3 py-2" type="time" value={form.birthTime} onChange={(e) => update("birthTime", e.target.value)} disabled={form.unknownBirthTime} />
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.unknownBirthTime} onChange={(e) => update("unknownBirthTime", e.target.checked)} />출생시간 모름</label>
        <label className="text-sm">성별
          <select className="mt-1 w-full rounded border px-3 py-2" value={form.gender} onChange={(e) => update("gender", e.target.value as BirthInput["gender"])}>
            <option>남</option><option>여</option><option>기타</option><option>응답 안 함</option>
          </select>
        </label>
        <label className="text-sm">달력
          <select className="mt-1 w-full rounded border px-3 py-2" value={form.calendarType} onChange={(e) => update("calendarType", e.target.value as BirthInput["calendarType"])}>
            <option>양력</option><option>음력</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.leapMonth} onChange={(e) => update("leapMonth", e.target.checked)} disabled={form.calendarType !== "음력"} />윤달</label>
        <label className="text-sm">출생지(선택)
          <input className="mt-1 w-full rounded border px-3 py-2" value={form.birthPlace} onChange={(e) => update("birthPlace", e.target.value)} placeholder="서울, 대한민국" />
        </label>
        <label className="text-sm">닉네임(선택)
          <input className="mt-1 w-full rounded border px-3 py-2" value={form.nickname} onChange={(e) => update("nickname", e.target.value)} />
        </label>
        <button disabled={!hasKey || loading} className="rounded bg-slate-900 px-3 py-2 text-white disabled:bg-slate-300" type="submit">사주 해석 실행</button>
      </form>
      {status && <p className="text-sm">{status}</p>}
      {result && (
        <div className="space-y-3 rounded border bg-white p-4">
          <h2 className="text-lg font-semibold">결과 요약</h2>
          <p>{result.profile.inputSummary}</p>
          <p className="text-sm text-slate-600">{result.profile.disclaimer}</p>
          <pre className="overflow-auto rounded bg-slate-100 p-3 text-xs">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}
