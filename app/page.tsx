import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6 py-8">
      <h1 className="text-3xl font-bold">사주팔자 & 오늘의 운세</h1>
      <p className="text-slate-700">
        본 서비스는 오락/참고용 해석을 제공합니다. 의료/법률/투자 등 중요한 의사결정에는 사용하지 마세요.
      </p>
      <div className="flex gap-3">
        <Link href="/settings" className="rounded bg-slate-900 px-4 py-2 text-white">
          API Key 설정하기
        </Link>
        <Link href="/saju" className="rounded border border-slate-300 px-4 py-2">
          시작하기
        </Link>
      </div>
    </div>
  );
}
