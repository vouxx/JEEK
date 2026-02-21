import type { Category } from "@/types/digest";

export const CATEGORIES: Record<Category, { label: string; description: string }> = {
  "ai-ml": {
    label: "AI / ML",
    description:
      "Artificial Intelligence and Machine Learning — LLMs, computer vision, AI tools, AI research, new model releases",
  },
  "web-dev": {
    label: "Web Dev",
    description:
      "Web Development — frameworks, browsers, JavaScript/TypeScript, CSS, web standards, developer tools",
  },
  "cloud-infra": {
    label: "Cloud / Infra",
    description:
      "Cloud and Infrastructure — AWS, GCP, Azure, Kubernetes, Docker, serverless, DevOps, CI/CD, platform engineering",
  },
  security: {
    label: "Security",
    description:
      "Cybersecurity — vulnerabilities, data breaches, security tools, zero-day exploits, privacy regulations, compliance",
  },
  mobile: {
    label: "Mobile",
    description:
      "Mobile Development — iOS, Android, Flutter, React Native, app store policy changes, mobile OS updates",
  },
  startups: {
    label: "Startups",
    description:
      "Startups and Tech Industry — funding rounds, acquisitions, product launches, big tech news",
  },
  "open-source": {
    label: "Open Source",
    description:
      "Open Source — new releases, notable projects, community events, licensing changes",
  },
  "science-tech": {
    label: "Science / Tech",
    description:
      "Science and Deep Tech — semiconductors, quantum computing, space tech, biotech, robotics, energy technology",
  },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[];
