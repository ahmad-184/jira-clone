import Link from "next/link";
import { TerminalIcon } from "lucide-react";

import { LoaderButton } from "@/components/loader-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSignInWithPassword } from "../hooks/use-sign-in";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PasswordInput } from "@/components/ui/password-input";

export default function SignInWithPassword() {
  const { form, onSubmit, loading, error } = useSignInWithPassword();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  placeholder="example@gmail.com"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  className="w-full"
                  placeholder="********"
                />
              </FormControl>
              <Link
                href={"/sign-in/forgot-password"}
                className="text-xs hover:underline flex items-center gap-0"
              >
                Forgot your password?
              </Link>
              <FormMessage />
            </FormItem>
          )}
        />

        {!!error && (
          <Alert variant="destructive">
            <TerminalIcon className="h-4 w-4" />
            <AlertTitle>Uh-oh, we couldn&apos;t log you in</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-4 w-full flex flex-col gap-2">
          <LoaderButton
            isLoading={loading}
            className="w-full mb-3"
            type="submit"
          >
            Sign in
          </LoaderButton>
          <div className="text-center flex flex-col items-center gap-2">
            <Link
              href={"/sign-up"}
              className="text-sm hover:underline flex items-center gap-0"
            >
              Don&apos;t have an account?{" "}
              <span className="font-medium">Sign up</span>
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
