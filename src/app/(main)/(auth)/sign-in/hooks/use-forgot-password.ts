import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "./mutations/use-forgot-password-mutation";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const useForgotPassword = () => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useForgotPasswordMutation({
    onSuccess: () => {
      toast.success("Reset password link sent to your email");
    },
    onError(error) {
      setError(error.message || "Something went wrong, please try again.");
    },
    onMutate: () => setError(""),
  });

  const onSubmit = form.handleSubmit(values => {
    mutate({ json: values });
  });

  return { form, error, onSubmit, loading: isPending };
};
