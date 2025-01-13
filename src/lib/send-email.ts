import nodemailer from "nodemailer";
import { env } from "@/env";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_SERVER_HOST,
  service: env.EMAIL_SERVER,
  port: parseInt(env.EMAIL_SERVER_PORT),
  secure: true,
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
});

export const emailSender = async ({
  email,
  body,
  subject,
}: {
  email: string | string[];
  body: string;
  subject: string;
}) => {
  try {
    const options = {
      from: env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: body,
    };

    await transporter.sendMail(options).catch((err: any) => {
      throw new Error(err);
    });

    return {
      error: false,
    };
  } catch (err: any) {
    return {
      error: true,
      message: err.message || "Email sender fucked up",
    };
  }
};
