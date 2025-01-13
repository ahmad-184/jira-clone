import * as React from "react";

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { env } from "@/env";
import { applicationName } from "@/app-config";

export const BASE_URL = env.HOST_NAME;

export function VerifyEmailOTP({ otp }: { otp: string }) {
  return (
    <Html>
      <Head />
      <Preview>Verify your Email</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="bg-white my-auto mx-auto font-sans">
            <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
              <Section className="mt-[32px]">
                <Img
                  src={`${BASE_URL}/logo.png`}
                  width="160"
                  height="48"
                  alt="Slide"
                  className="my-0 mx-auto"
                />
              </Section>

              <Section className="text-center mt-[32px] mb-[32px]">
                <Text className="text-black font-medium text-[14px] leading-[24px] mb-8">
                  This is your verification code
                </Text>

                <Text className="text-black font-bold text-[19px] leading-[24px]">
                  {otp}
                </Text>
                <Text className="text-[#666666] text-[14px] leading-[24px]">
                  This code will expire in 10 minutes
                </Text>
              </Section>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

              <Text className="text-[#666666] text-[12px] leading-[24px] flex items-center justify-center">
                © 2025 {applicationName}. All rights reserved.
              </Text>
            </Container>
          </Body>
        </React.Fragment>
      </Tailwind>
    </Html>
  );
}
