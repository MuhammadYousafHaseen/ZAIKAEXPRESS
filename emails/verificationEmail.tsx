import {
    Html,
    Head,
    Font,
    Preview,
    Row,
    Section,
    Text,
    
} from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({  username,otp }: VerificationEmailProps) {
    return(
        <Html lang="en" dir="ltr">
        <Head>
          Your Verification Email
          <Font 
            fontFamily="Inter"
            fontWeight="400"
            fontStyle="normal"
            fallbackFontFamily={["Helvetica", "Arial", "sans-serif"]}
          />
        </Head>
        <Preview>
          Your account verification code is here!
        </Preview>
        <Section style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", margin: "0 auto", maxWidth: "600px" }}>
          <Row style={{ textAlign: "center", marginBottom: "20px" }}>
            <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
              Account Verification
            </Text>
          </Row>
          <Row style={{ textAlign: "center", marginBottom: "10px" }}>
            <Text style={{ fontSize: "16px", color: "#555" }}>
              Hello, {username}
            </Text>
          </Row>
          <Row style={{ textAlign: "center", marginBottom: "20px" }}>
            <Text
              style={{
                fontSize: "20px",
                color: "#111",
                backgroundColor: "#e5e7eb",
                padding: "10px 20px",
                borderRadius: "4px",
                letterSpacing: "2px",
                display: "inline-block",
              }}
            >
              {otp}
            </Text>
          </Row>
          <Row style={{ textAlign: "center", marginBottom: "20px" }}>
            <Text style={{ fontSize: "16px", color: "#666" }}>
              Thanks for registering. Please use the above code to verify your account.
            </Text>
          </Row>
          <Row style={{ textAlign: "center" }}>
            <Text style={{ fontSize: "14px", color: "#888" }}>
              If you didn&apos;t sign up for this account, please ignore this email.
            </Text>
          </Row>
        </Section>
      </Html>
      
    );
}