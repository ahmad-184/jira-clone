import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center h-screen">
      <h1 className="text-[100px] font-bold">404</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <Link href="/">
        <Button>Go to home</Button>
      </Link>
    </div>
  );
}
