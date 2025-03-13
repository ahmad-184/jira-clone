import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { afterLoginUrl } from "@/app-config";
import { useSignInMutation } from "./mutations/use-sign-in-mutation";
import { useMagicLinkMutation } from "./mutations/use-magic-link-mutation";
import {
  signInSchema,
  signInWithMagicLinkSchema,
} from "@/validations/auth.validation";

export const useSignInWithPassword = () => {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useSignInMutation({
    onSuccess() {
      router.replace(afterLoginUrl);
    },
    onError(error) {
      setError(error.message || "Something went wrong, please try again.");
    },
    onMutate() {
      setError(null);
    },
  });

  const onSubmit = form.handleSubmit(values => {
    mutate({ json: values });
  });

  return { form, onSubmit, loading: isPending, error };
};

export const useSignInWithMagicLink = () => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signInWithMagicLinkSchema>>({
    resolver: zodResolver(signInWithMagicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMagicLinkMutation({
    onSuccess() {
      toast.success("Magic link sent to your email.");
    },
    onError(error) {
      setError(error.message || "Something went wrong, please try again.");
    },
    onMutate() {
      setError(null);
    },
  });

  const onSubmit = form.handleSubmit(values => {
    mutate({ json: values });
  });

  return { form, onSubmit, loading: isPending, error };
};
