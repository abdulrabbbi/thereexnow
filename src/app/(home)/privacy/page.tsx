"use client";

import { Container, Typography } from "@mui/material";

export default function Page() {
  return (
    <Container maxWidth="md" sx={{ py: 15 }}>
      <Typography variant="h5">Privacy Policy of Therexnow:</Typography>

      <Typography variant="caption" color="grey.500">
        Privacy Policy for TherEXnow - Last updated: April 08, 2025
      </Typography>

      <Typography mt={3} variant="h6">
        Introduction
      </Typography>

      <Typography mt={2} variant="body1">
        Welcome to TherEXnow. We are committed to protecting your personal
        information and your right to privacy. This Privacy Policy explains how
        we collect, use, disclose, and safeguard your information when you use
        our website and mobile application. Information We Collect
      </Typography>

      <Typography mt={2} mb={1} variant="body1">
        We collect the following types of personal data when you use our
        platform:
      </Typography>
      {[
        "• Account Information: Name, email address, login credentials.",
        "• Subscription & Payment Info: Billing details processed securely via third-party providers (e.g., Stripe, Apple, Google).",
        "• Health & Usage Data: Information related to your physical condition, exercise preferences, progress, and interactions with our content.",
        "• Device & Log Data: IP address, browser type, device information, access times, and usage patterns.",
      ].map((item) => (
        <Typography variant="body1">{item}</Typography>
      ))}

      {/* - - - - - - - - - - - - - - - - - - - - - - - - - */}

      <Typography mt={3} variant="h6">
        How We Use Your Information
      </Typography>

      <Typography mt={2} variant="body1">
        We use your data to:
      </Typography>

      {[
        "• Provide personalized physiotherapy exercise programs.",
        "• Manage your account and subscription.",
        "• Improve our services and app performance.",
        "• Send notifications, updates, or promotional offers.",
        "• Comply with legal obligations and protect our rights.",
      ].map((item) => (
        <Typography variant="body1">{item}</Typography>
      ))}

      {/* - - - - - - - - - - - - - - - - - - - - - - - - - */}

      <Typography mt={3} variant="h6">
        How We Share Your Information
      </Typography>

      <Typography mt={2} variant="body1">
        We do not sell your personal data. We may share your information with:
      </Typography>

      {[
        "• Service Providers: Companies that host our data, conduct analytics, or provide customer support.",
        "• Payment Processors: Trusted third parties who handle transactions securely.",
        "• Legal Authorities: In response to a lawful request or if required by law.",
      ].map((item) => (
        <Typography variant="body1">{item}</Typography>
      ))}

      {/* - - - - - - - - - - - - - - - - - - - - - - - - - */}

      <Typography mt={3} variant="h6">
        Data Retention
      </Typography>

      <Typography mt={2} variant="body1">
        We retain your personal data as long as your account is active or as
        needed to provide you with services, comply with legal obligations, and
        enforce our agreements. Security We implement industry-standard security
        measures such as encryption, secure servers, and access control to
        safeguard your personal information. Your Rights. Depending on your
        location, you may have rights regarding your personal data, including:
      </Typography>

      {[
        "• Accessing, updating, or deleting your account information.",
        "• Withdrawing consent for certain data processing activities.",
        "• Contacting us for information about our data practices.",
      ].map((item) => (
        <Typography variant="body1">{item}</Typography>
      ))}

      {/* - - - - - - - - - - - - - - - - - - - - - - - - - */}

      <Typography mt={3} variant="h6">
        United States Privacy Rights
      </Typography>

      <Typography mt={2} variant="body1">
        For users in the United States, we commit to:
      </Typography>

      {[
        "• Complying with applicable federal and state laws governing data privacy.",
        "• Providing notice and choice regarding the collection and use of personal information.",
        "• For California residents, we adhere to the California Consumer Privacy Act (CCPA) where applicable, which grants rights such as the right to access, delete, or opt out of the sale of your personal information. For further details, please contact us as described below.",
      ].map((item) => (
        <Typography variant="body1">{item}</Typography>
      ))}

      {/* - - - - - - - - - - - - - - - - - - - - - - - - - */}

      <Typography mt={3} variant="h6">
        Children’s Privacy
      </Typography>

      <Typography mt={2} variant="body1">
        TherEXnow is not intended for users under the age of 13, and we do not
        knowingly collect personal information from children. Third-Party
        Services
      </Typography>

      <Typography mt={2} variant="body1">
        Our platform may integrate with external services (e.g., Facebook Login,
        Apple, Google). These third parties have their own privacy policies
        governing their use of your information. Changes to This Policy
      </Typography>

      <Typography mt={2} variant="body1">
        We may update this Privacy Policy occasionally. The “Last updated” date
        at the top of the policy will reflect when changes were last made. Your
        continued use of our services after any changes implies your acceptance
        of the updated policy. Contact Us
      </Typography>

      <Typography mt={2} variant="body1">
        For questions, concerns, or requests regarding this Privacy Policy or
        your personal data, please contact us at: Email: therexNow22@gmail.com
        Address: 4286 Diamond terrace, Weston, FL 33331
      </Typography>
    </Container>
  );
}
