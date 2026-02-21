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
