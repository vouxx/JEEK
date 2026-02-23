export interface NewsItem {
  title: string;
  summary: string;
  whyItMatters: string;
  sourceUrl: string;
  sourceHint: string;
}

export interface CategoryDigest {
  category: string;
  label: string;
  items: NewsItem[];
}

export type Category =
  | "ai-ml"
  | "web-dev"
  | "cloud-infra"
  | "security"
  | "mobile"
  | "startups"
  | "open-source"
  | "science-tech";

export interface MonthSummary {
  year: number;
  month: number;
  label: string;
  digestCount: number;
  totalItems: number;
  summary?: string;
  categoryBreakdown: { category: string; label: string; count: number }[];
  dates: { dateStr: string; displayStr: string; itemCount: number }[];
}
