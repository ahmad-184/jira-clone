"use client";

import Link from "next/link";
import { ChevronLeftIcon, TerminalIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useSignInWithMagicLink } from "../hooks/use-sign-in";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";

export default function MagicLink() {
  const { form, onSubmit, loading, error } = useSignInWithMagicLink();

  return (
    <div className="max-w-[400px] w-full flex flex-col gap-6">
      <div className="mb-4">
        <h1 className={"text-xl font-bold text-center mb-3"}>
          Sign In With Magic Link
        </h1>
        <p className="text-sm text-center dark:text-zinc-300">
          Enter your email address and we will send you a magic link to sign in.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
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
          {!!error && (
            <Alert variant="destructive">
              <TerminalIcon className="h-4 w-4" />
              <AlertTitle>
                Uh-oh, we couldn&apos;t send you magic link
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
              Send Magic Link
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
