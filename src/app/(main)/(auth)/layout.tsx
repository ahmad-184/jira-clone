import Logo from "@/icons/logo";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen px-5">
      <div className="px-2 w-full h-full flex gap-3 py-5">
        <div className="my-auto flex items-center py-10 flex-col flex-1">
          <Link href={"/"}>
            <Logo />
          </Link>
          <div className="py-10 w-full flex justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
}
