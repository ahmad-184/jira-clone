import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    token: z.string().min(1),
  })
  .refine(values => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const verifyEmailOtpSchema = z.object({
  otp: z.string().min(1),
  userId: z.number(),
});

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const signInWithMagicLinkSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});
