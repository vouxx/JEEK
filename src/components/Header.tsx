import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          JEEK
        </Link>
        <nav className="flex gap-4 text-sm text-neutral-500">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            최신
          </Link>
          <Link href="/archive" className="hover:text-neutral-900 transition-colors">
            아카이브
          </Link>
        </nav>
      </div>
    </header>
  );
}
