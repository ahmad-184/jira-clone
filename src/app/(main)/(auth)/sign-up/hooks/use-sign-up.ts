"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterStore } from "../store/register-store";
import { useState } from "react";
import { useSignUpMutation } from "./mutations/use-sign-up-mutation";
import { useVerifyEmailOtpMutation } from "./mutations/use-verify-email-otp-mutation";
import { afterLoginUrl } from "@/app-config";
import {
  signUpSchema,
  verifyEmailOtpSchema,
} from "@/validations/auth.validation";

export const useSignUp = () => {
  const { setUserId, setStep, email } = useRegisterStore(store => store);

  const [error, setError] = useState("");

  const { mutate, isPending } = useSignUpMutation({
    onSuccess: data => {
      setUserId(data.id);
      setStep("verify");
    },
    onError: error => {
      setError(error.message);
    },
    onMutate: () => {
      setError("");
    },
  });

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: email ?? "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(values => {
    mutate({
      json: values,
    });
  });

  return {
    form,
    onSubmit,
    loading: isPending,
    error,
  };
};

export const useVerifyEmail = () => {
  const { userId, otp } = useRegisterStore(store => store);

  const [error, setError] = useState("");

  const router = useRouter();

  const form = useForm<z.infer<typeof verifyEmailOtpSchema>>({
    resolver: zodResolver(verifyEmailOtpSchema),
    defaultValues: {
      otp: otp ?? "",
      userId: userId || undefined,
    },
  });

  const { mutate, isPending } = useVerifyEmailOtpMutation({
    onSuccess: () => {
      toast.success("Email verified successfully.");
      router.replace(afterLoginUrl);
    },
    onError: error => {
      setError(error.message);
    },
    onMutate: () => {
      setError("");
    },
  });

  const onSubmit = form.handleSubmit(values => {
    mutate({ json: values });
  });

  return { form, onSubmit, loading: isPending, error };
};
