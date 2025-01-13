"use client";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderButton } from "@/components/loader-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import { useSignUp } from "../hooks/use-sign-up";

export default function SignUp() {
  const { form, onSubmit, loading, error } = useSignUp();

  return (
    <div className="space-y-8 w-full">
      <div>
        <h1 className={"text-2xl font-bold text-center mb-3"}>
          Sign Up Account
        </h1>
        <p className="text-sm text-center dark:text-zinc-300">
          Enter your email and password to create account
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-3"
        >
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
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>Must be atleast 8 charactres.</FormDescription>
              </FormItem>
            )}
          />

          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>
                Uh-oh, we couldn&apos;t create your account
              </AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-4 w-full flex flex-col gap-2">
            <LoaderButton
              isLoading={loading}
              className="w-full mb-3"
              type="submit"
            >
              Register
            </LoaderButton>
            <Link
              href={"/sign-in"}
              className="text-sm hover:underline text-center"
            >
              Already have an account?{" "}
              <span className="font-medium">Sign in</span>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
