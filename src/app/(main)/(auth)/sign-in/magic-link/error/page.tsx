import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="py-24 mx-auto max-w-[400px] space-y-6 text-center">
      <h1 className={"text-2xl font-bold"}>Expired Token</h1>
      <p className="text-lg dark:text-zinc-300">
        Sorry, this token was either expired or already used. Please try loggin
        in again
      </p>

      <Button className="w-full">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    </div>
  );
}
