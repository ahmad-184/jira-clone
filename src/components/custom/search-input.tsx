"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface SearchInputProps {
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function SearchInput({
  className,
  onChange,
  value,
  defaultValue,
  placeholder,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={cn("max-w-md flex-1", className)} onClick={handleFocus}>
      <div className="rounded-lg px-4 overflow-hidden flex items-center h-full border dark:border-shark-700 gap-4">
        <SearchIcon className="w-5 h-5 text-shark-400" />
        <Input
          ref={inputRef}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder ?? "Search..."}
          className="h-full flex-1 !bg-transparent border-none py-3 !ring-0 !px-0"
        />
      </div>
    </div>
  );
}
