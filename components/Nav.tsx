import Link from "next/link";

const links = [
  { href: "/", label: "홈" },
  { href: "/settings", label: "설정" },
  { href: "/saju", label: "사주팔자" },
  { href: "/daily", label: "오늘의 운세" },
];

export function Nav() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl gap-4 px-4 py-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded px-3 py-1 text-sm hover:bg-slate-100">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
