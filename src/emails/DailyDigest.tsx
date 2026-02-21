import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
  Hr,
} from "@react-email/components";
import type { CategoryDigest } from "@/types/digest";

interface DailyDigestProps {
  date: string;
  categories: CategoryDigest[];
  unsubscribeUrl: string;
}

export function DailyDigest({ date, categories, unsubscribeUrl }: DailyDigestProps) {
  return (
    <Html>
      <Head />
      <Preview>JEEK Daily — {date}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>JEEK</Heading>
          <Text style={dateText}>{date}</Text>
          <Hr style={hr} />

          {categories.map((cat) =>
            cat.items.length > 0 ? (
              <Section key={cat.category} style={categorySection}>
                <Heading as="h2" style={categoryTitle}>
                  {cat.label}
                </Heading>
                {cat.items.map((item, i) => (
                  <Section key={i} style={itemSection}>
                    <Link href={item.sourceUrl} style={itemTitle}>
                      {item.title}
                    </Link>
                    <Text style={itemSummary}>{item.summary}</Text>
                    <Text style={itemWhy}>{item.whyItMatters}</Text>
                  </Section>
                ))}
              </Section>
            ) : null
          )}

          <Hr style={hr} />
          <Text style={footer}>
            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              구독 해지
            </Link>
            {" · "}
            Powered by JEEK
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f6f6",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "600px",
};

const logo = {
  fontSize: "28px",
  fontWeight: "800" as const,
  color: "#000",
  margin: "0",
};

const dateText = {
  color: "#666",
  fontSize: "14px",
  margin: "4px 0 0",
};

const hr = {
  borderColor: "#eee",
  margin: "24px 0",
};

const categorySection = {
  marginBottom: "24px",
};

const categoryTitle = {
  fontSize: "16px",
  fontWeight: "700" as const,
  color: "#333",
  margin: "0 0 12px",
  padding: "4px 8px",
  backgroundColor: "#f0f0f0",
  borderRadius: "4px",
  display: "inline-block" as const,
};

const itemSection = {
  marginBottom: "16px",
  paddingLeft: "8px",
};

const itemTitle = {
  fontSize: "15px",
  fontWeight: "600" as const,
  color: "#0066cc",
  textDecoration: "none" as const,
};

const itemSummary = {
  fontSize: "14px",
  color: "#333",
  margin: "4px 0",
  lineHeight: "1.5",
};

const itemWhy = {
  fontSize: "13px",
  color: "#888",
  margin: "2px 0 0",
  fontStyle: "italic" as const,
};

const footer = {
  fontSize: "12px",
  color: "#999",
  textAlign: "center" as const,
};

const unsubscribeLink = {
  color: "#999",
};

export default DailyDigest;
