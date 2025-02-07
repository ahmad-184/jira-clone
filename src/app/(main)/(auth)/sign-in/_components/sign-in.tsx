"use client";

import { Button } from "@/components/ui/button";
import GithubIcon from "@/icons/github-icon";
import GoogleIcon from "@/icons/google-icon";
import { MailIcon } from "lucide-react";
import Link from "next/link";
import SignInWithPassword from "./sign-in-with-password";

export default function SignIn() {
  return (
    <div className="max-w-[400px] w-full flex flex-col gap-6">
      <div className="mb-6 w-full">
        <h1 className={"text-xl font-bold text-center mb-3"}>
          Sign in to your account
        </h1>
        <p className="text-sm text-center dark:text-zinc-300">
          Sign in to your account using one of the options below.
        </p>
      </div>
      <div className="flex flex-col w-full gap-3">
        <div className="flex gap-3 w-full items-center">
          <Link href="/api/login/google" className="flex-1">
            <Button variant={"secondary"} className="w-full">
              <GoogleIcon className="w-4 h-4" />
              Google
            </Button>
          </Link>
          <Link href="/api/login/github" className="flex-1">
            <Button variant={"secondary"} className="w-full">
              <GithubIcon className="w-4 h-4" />
              Github
            </Button>
          </Link>
        </div>
        <div className="w-full">
          <Link href="/sign-in/magic-link" className="flex-1">
            <Button variant={"secondary"} className="w-full items-center">
              <div>
                <MailIcon />
              </div>
              Magic Link
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center w-full text-center justify-center">
        <p className="text-xs flex-1 text-zinc-500 dark:text-zinc-400 bg-background px-3">
          OR CONTINUE WITH
        </p>
      </div>

      <div className="w-full">
        <SignInWithPassword />
      </div>
    </div>
  );
}
