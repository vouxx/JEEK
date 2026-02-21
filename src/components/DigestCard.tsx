import { ExternalLink, Search } from "lucide-react";

interface DigestCardProps {
  title: string;
  summary: string;
  whyItMatters: string;
  sourceUrl: string;
}

export function DigestCard({ title, summary, whyItMatters, sourceUrl }: DigestCardProps) {
  const isGoogleFallback = sourceUrl.includes("news.google.com/search");

  return (
    <article className="group py-3">
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-2 text-[15px] font-semibold text-neutral-900 hover:text-blue-600 transition-colors"
      >
        <span>{title}</span>
        {isGoogleFallback ? (
          <Search className="mt-1 h-3.5 w-3.5 shrink-0 text-neutral-300 group-hover:text-blue-400" />
        ) : (
          <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-neutral-300 group-hover:text-blue-400" />
        )}
      </a>
      <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{summary}</p>
      <p className="mt-0.5 text-xs text-neutral-400 italic">{whyItMatters}</p>
    </article>
  );
}
