"use client";

import SignInWithPassword from "./sign-in-with-password";
import GoogleSignInButton from "./google-sign-in-button";
import GithubSignInButton from "./github-sign-in-button";
import MagicLinkSignInButton from "./magic-link-sign-in-button";

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
          <GoogleSignInButton />
          <GithubSignInButton />
        </div>
        <div className="w-full">
          <MagicLinkSignInButton />
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
