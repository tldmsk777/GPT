"use client";

import { FormEvent, useEffect, useState } from "react";
import { clearApiKey, maskApiKey, readApiKey, saveApiKey, shouldRememberApiKey } from "@/lib/storage";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [remember, setRemember] = useState(false);
  const [savedMask, setSavedMask] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = readApiKey();
    setSavedMask(maskApiKey(saved));
    setRemember(shouldRememberApiKey());
  }, []);

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setStatus("API Key를 입력해 주세요.");
      return;
    }
    saveApiKey(apiKey.trim(), remember);
    const current = remember ? apiKey.trim() : "";
    setSavedMask(maskApiKey(current));
    setStatus(remember ? "API Key가 로컬 저장되었습니다." : "저장 옵션이 꺼져 있어 메모리에만 유지됩니다.");
  };

  const onVerify = async () => {
    const key = apiKey.trim() || readApiKey();
    if (!key) {
      setStatus("검증할 API Key가 없습니다.");
      return;
    }
    setLoading(true);
    setStatus("검증 중...");
    try {
      const res = await fetch("/api/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key }),
      });
      const data = (await res.json()) as { ok: boolean; message: string };
      setStatus(data.message);
    } catch {
      setStatus("검증 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    clearApiKey();
    setApiKey("");
    setSavedMask("");
    setRemember(false);
    setStatus("API Key가 삭제되었습니다.");
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">API Key 설정</h1>
      <form onSubmit={onSave} className="space-y-3 rounded border bg-white p-4">
        <label className="block text-sm font-medium">Gemini API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="AIza..."
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          이 기기에서만 저장(로컬 저장)
        </label>
        {savedMask && <p className="text-sm text-slate-600">저장된 키: {savedMask}</p>}
        <div className="flex flex-wrap gap-2">
          <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">
            저장
          </button>
          <button className="rounded border px-3 py-2" type="button" onClick={onVerify} disabled={loading}>
            API Key 검증
          </button>
          <button className="rounded border px-3 py-2" type="button" onClick={onClear}>
            API Key 삭제/초기화
          </button>
        </div>
      </form>
      {status && <p className="rounded bg-slate-100 p-3 text-sm">{status}</p>}
    </section>
  );
}
