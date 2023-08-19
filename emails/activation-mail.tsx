import {Html} from "@react-email/html";
import {Text} from "@react-email/text";
import {Section} from "@react-email/section";
import {Container} from "@react-email/container";
import {Link} from '@react-email/link';

import colors from "tailwindcss/colors";

export default function ActivationMail(activationToken: string, email: string) {
    return (
        <Html>
            <Section style={main}>
                <Container style={card}>
                    <Container style={container}>
                        <Text style={heading}>Project White</Text>
                        <Text style={paragraph}>Email Verification</Text>
                        <Text style={paragraph}>Please click the link below to verify your email address.</Text>
                        <Link
                            href={`${process.env.APP_HOST}/auth/activation?token=${activationToken}&email=${email}`}>{`${process.env.APP_HOST}/auth/activation?token=${activationToken}&email=${email}`}</Link>
                    </Container>
                    <Container style={footer}>
                        <Text>&copy; Project White - 2022 - {new Date().getFullYear()}</Text>
                    </Container>
                </Container>
            </Section>
        </Html>
    );
}

// Styles for the email template
const main = {
    backgroundColor: "#fff",
    color: colors.white,
    fontFamily: "Roboto, sans-serif",
    padding: "40px 0"
};

const container = {
    padding: "20px 0 48px",
    width: "580px",
};

const card = {
    padding: "32px",
    backgroundColor: colors.slate[800],
    border: "1px solid " + colors.slate[600],
    borderRadius: "6px"
}

const heading = {
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    color: colors.white,
};

const paragraph = {
    fontSize: "18px",
    lineHeight: "1.4",
    color: colors.white,
};

const footer = {
    width: "580px",
    color: colors.slate[400],
    fontSize: "14px",
}
