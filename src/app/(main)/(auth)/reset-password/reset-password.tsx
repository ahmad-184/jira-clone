"use client";

import { LoaderButton } from "@/components/loader-button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useResetPassword } from "./hooks/use-reset-password";
import { PasswordInput } from "@/components/ui/password-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChevronLeftIcon, TerminalIcon } from "lucide-react";
import Link from "next/link";

export default function ResetPassword() {
  const { form, onSubmit, loading, error } = useResetPassword();

  return (
    <div className="!max-w-[380px] w-full flex flex-col gap-6">
      <div className="mb-4 w-full">
        <h1 className={"text-xl font-bold text-center mb-3"}>Reset Password</h1>
        <p className="text-sm text-center dark:text-zinc-300">
          Update your password to continue.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
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
                    placeholder="***********"
                  />
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    className="w-full"
                    placeholder="***********"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!!error && (
            <Alert variant="destructive">
              <TerminalIcon className="h-4 w-4" />
              <AlertTitle>
                Uh-oh, we couldn&apos;t update your password
              </AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-3 w-full flex flex-col gap-2">
            <LoaderButton
              isLoading={loading}
              className="w-full mb-3"
              type="submit"
            >
              Change Password
            </LoaderButton>
            <div className="text-center flex justify-center">
              <Link
                href={"/sign-in"}
                className="text-sm hover:underline flex items-center gap-0"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
