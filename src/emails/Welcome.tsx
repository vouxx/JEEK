import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Link,
  Hr,
} from "@react-email/components";

interface WelcomeProps {
  unsubscribeUrl: string;
}

export function Welcome({ unsubscribeUrl }: WelcomeProps) {
  return (
    <Html>
      <Head />
      <Preview>ZEEK에 오신 걸 환영합니다</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>ZEEK</Heading>
          <Text style={greeting}>구독해주셔서 감사합니다!</Text>
          <Text style={body}>
            매일 아침 8시, AI와 테크 분야의 주요 뉴스를 큐레이션해서 보내드립니다.
          </Text>
          <Text style={body}>
            AI/ML, Web Dev, Cloud, Security 등 8개 카테고리의 뉴스를
            한눈에 확인하실 수 있습니다.
          </Text>
          <Text style={body}>
            내일 아침 첫 다이제스트를 받아보세요!
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              구독 해지
            </Link>
            {" · "}
            Powered by ZEEK
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
  margin: "0 0 24px",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "600" as const,
  color: "#000",
  margin: "0 0 12px",
};

const body = {
  fontSize: "14px",
  color: "#333",
  lineHeight: "1.6",
  margin: "0 0 8px",
};

const hr = {
  borderColor: "#eee",
  margin: "24px 0",
};

const footer = {
  fontSize: "12px",
  color: "#999",
  textAlign: "center" as const,
};

const unsubscribeLink = {
  color: "#999",
};

export default Welcome;
