import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useResetPasswordMutation } from "./mutations/use-reset-password-mutation";
import { resetPasswordSchema } from "@/validations/auth.validation";

export const useResetPassword = () => {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: token || "",
    },
  });

  const { mutate, isPending } = useResetPasswordMutation({
    onSuccess: () => {
      router.replace("/sign-in");
    },
    onError: error => {
      setError(error.message);
    },
    onMutate: () => setError(""),
  });

  const onSubmit = form.handleSubmit(values => {
    mutate({ json: values });
  });

  return { form, onSubmit, loading: isPending, error };
};
