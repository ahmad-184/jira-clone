import Logo from "@/icons/logo";
import { LoaderIcon } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="w-full h-screen fixed inset-0 bg-background z-50">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex gap-2 items-center justify-center">
          <LoaderIcon className="animate-spin w-5 h-5 text-primary" />
          <Logo />
        </div>
      </div>
    </div>
  );
}
