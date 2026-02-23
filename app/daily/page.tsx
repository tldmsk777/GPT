"use client";

import { FormEvent, useMemo, useState } from "react";
import { readApiKey, readBirthProfile, saveBirthProfile } from "@/lib/storage";
import type { BirthInput, DailyResponse } from "@/lib/types";

const defaults: BirthInput = {
  birthDate: "",
  birthTime: "",
  unknownBirthTime: false,
  gender: "응답 안 함",
  calendarType: "양력",
  leapMonth: false,
  birthPlace: "",
  nickname: "",
};

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

const splitTime = (time?: string) => {
  if (!time || !time.includes(":")) {
    return { hour: "", minute: "" };
  }
  const [hour, minute] = time.split(":");
  return { hour, minute };
};

export default function DailyPage() {
  const [form, setForm] = useState<BirthInput>(useMemo(() => readBirthProfile() ?? defaults, []));
  const [result, setResult] = useState<DailyResponse | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const hasKey = Boolean(readApiKey());
  const timeParts = splitTime(form.birthTime);

  const updateBirthTime = (hour: string, minute: string) => {
    if (!hour || !minute) {
      setForm((prev) => ({ ...prev, birthTime: "" }));
      return;
    }
    setForm((prev) => ({ ...prev, birthTime: `${hour}:${minute}` }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasKey) return;
    setLoading(true);
    setResult(null);
    setStatus("오늘의 운세를 생성 중입니다...");
    try {
      saveBirthProfile(form);
      const res = await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: readApiKey(), ...form }),
      });
      const data = (await res.json()) as DailyResponse & { error?: string };
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
      <h1 className="text-2xl font-bold">오늘의 운세</h1>
      {!hasKey && <p className="rounded border border-amber-300 bg-amber-50 p-3 text-sm">API Key가 없어 실행할 수 없습니다. 설정 페이지에서 먼저 입력해 주세요.</p>}
      <form onSubmit={submit} className="grid gap-3 rounded border bg-white p-4 md:grid-cols-2">
        <label className="text-sm">생년월일
          <input className="mt-1 w-full rounded border px-3 py-2" type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} required />
        </label>
        <div className="text-sm">
          <p>출생시간</p>
          <div className="mt-1 flex gap-2">
            <select
              className="w-full rounded border px-3 py-2"
              value={timeParts.hour}
              disabled={form.unknownBirthTime}
              onChange={(e) => updateBirthTime(e.target.value, timeParts.minute)}
            >
              <option value="">시</option>
              {HOURS.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            <select
              className="w-full rounded border px-3 py-2"
              value={timeParts.minute}
              disabled={form.unknownBirthTime}
              onChange={(e) => updateBirthTime(timeParts.hour, e.target.value)}
            >
              <option value="">분</option>
              {MINUTES.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.unknownBirthTime} onChange={(e) => setForm({ ...form, unknownBirthTime: e.target.checked, birthTime: e.target.checked ? "" : form.birthTime })} />출생시간 모름</label>
        <label className="text-sm">성별
          <select className="mt-1 w-full rounded border px-3 py-2" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as BirthInput["gender"] })}>
            <option>남</option><option>여</option><option>기타</option><option>응답 안 함</option>
          </select>
        </label>
        <button disabled={!hasKey || loading} className="rounded bg-slate-900 px-3 py-2 text-white disabled:bg-slate-300" type="submit">오늘 운세 조회</button>
      </form>
      {status && <p className="text-sm">{status}</p>}
      {result && (
        <div className="space-y-2 rounded border bg-white p-4">
          <p className="font-semibold">{result.date} 운세 점수: {result.scores.overall}점</p>
          <p>{result.today.summary}</p>
          <pre className="overflow-auto rounded bg-slate-100 p-3 text-xs">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}
