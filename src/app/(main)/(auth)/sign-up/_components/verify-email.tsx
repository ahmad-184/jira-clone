import { useVerifyEmail } from "../hooks/use-sign-up";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { OTP_LENGTH } from "@/app-config";
import { LoaderButton } from "@/components/loader-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function VerifyEmail() {
  const { form, onSubmit, loading, error } = useVerifyEmail();

  return (
    <div className="space-y-8 w-full">
      <div>
        <h1 className={"text-2xl font-bold text-center mb-3"}>
          Verify Your Account
        </h1>
        <p className="text-sm text-center">
          Enter the 6 digits code sent to your email to verify your account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-3">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={OTP_LENGTH} {...field}>
                    <InputOTPGroup className="w-full flex justify-center gap-3">
                      <InputOTPSlot
                        index={0}
                        className="border h-12 w-12 dark:bg-zinc-900 bg-zinc-100"
                      />
                      <InputOTPSlot
                        index={1}
                        className="border h-12 w-12 dark:bg-zinc-900 bg-zinc-100"
                      />
                      <InputOTPSlot
                        index={2}
                        className="border h-12 w-12 dark:bg-zinc-900 bg-zinc-100"
                      />
                      <InputOTPSlot
                        index={3}
                        className="border h-12 w-12 dark:bg-zinc-900 bg-zinc-100"
                      />
                      <InputOTPSlot
                        index={4}
                        className="border h-12 w-12 dark:bg-zinc-900 bg-zinc-100"
                      />
                      <InputOTPSlot
                        index={5}
                        className="border h-12 w-12 dark:bg-zinc-900 bg-zinc-100"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Uh-oh, we couldn&apos;t verify your email</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-5 w-full flex flex-col gap-2">
            <LoaderButton isLoading={loading} className="w-full" type="submit">
              Send
            </LoaderButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
