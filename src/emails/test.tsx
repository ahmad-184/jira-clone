import { render } from "@react-email/components";

import { VerifyEmailOTP } from "@/emails/verify-email-otp";
import { emailSender } from "@/lib/send-email";

export async function test() {
  const emailTemplate = await render(<VerifyEmailOTP otp="123456" />);

  emailSender({
    email: "amiraligoodboy892@gmail.com",
    body: emailTemplate,
    subject: "Verify Email",
  });
}
