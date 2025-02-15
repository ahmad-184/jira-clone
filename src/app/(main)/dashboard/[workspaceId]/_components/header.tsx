import SearchInput from "@/components/custom/search-input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserButton from "@/components/user-button";

export default function Header() {
  return (
    <div className="flex justify-between gap-5">
      <div className="flex flex-1 gap-5 items-center">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <SearchInput />
      </div>
      <div className="flex items-center gap-3">
        <UserButton />
      </div>
    </div>
  );
}
