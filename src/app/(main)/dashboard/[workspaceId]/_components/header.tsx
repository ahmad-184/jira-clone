import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserButton from "@/components/user-button";
import { SearchIcon } from "lucide-react";

export default function Header() {
  return (
    <div className="flex justify-between gap-5">
      <div className="flex flex-1 gap-5 items-center">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <div className="max-w-md flex-1">
          <div className="rounded-lg px-4 flex items-center border dark:border-shark-700 gap-4">
            <SearchIcon className="w-5 h-5 text-shark-400" />
            <Input
              placeholder="Search..."
              className="h-full flex-1 !bg-transparent border-none py-3 !ring-0 !px-0"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <UserButton />
      </div>
    </div>
  );
}
