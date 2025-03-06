import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, XCircleIcon } from "lucide-react";
import { getTextColor, nameToColor } from "@/util/colors";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

type Option = { value: string; label: string };

type Props = {
  options: Option[];
  onChangeValues: (values: string[]) => void;
  values?: string[];
  placeholder?: string;
  allowCreate?: boolean;
  onCreate?: (option: string) => void;
  defaultValues?: string[];
};

export default function MultiSelect({
  options,
  onChangeValues,
  values = [],
  placeholder = "Select tags",
  allowCreate = false,
  onCreate,
  defaultValues,
}: Props) {
  const [valuesState, setValuesState] = useState<string[]>(defaultValues || []);

  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const selectElemRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const elemWidth = useMemo(() => {
    if (!selectElemRef.current) return 0;
    const w = selectElemRef.current.offsetWidth;
    return w || 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectElemRef, open]);

  const searchResults = useMemo(() => {
    const f = options.filter(option =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()),
    );
    return f;
  }, [options, searchValue]);

  const matchedOption = useMemo(() => {
    return options.find(
      option => option.label.toLowerCase() === searchValue.toLowerCase(),
    );
  }, [options, searchValue]);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node) &&
      selectElemRef.current &&
      !selectElemRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
      selectElemRef.current.blur();
    }
  };

  const handleSelect = (option: string) => {
    if (valuesState.includes(option)) return;
    const newOptions = [...valuesState, option];
    setValuesState(newOptions);
    onChangeValues(newOptions);
  };

  const handleUnselect = (option: string) => {
    const newOptions = valuesState.filter(s => s !== option);
    setValuesState(newOptions);
    onChangeValues(newOptions);
  };

  const handleCreateOption = (option: string) => {
    if (matchedOption) return handleSelect(matchedOption.value);
    if (!matchedOption && allowCreate && !!searchValue.length) {
      onCreate?.(option);
      setSearchValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Enter") {
        handleCreateOption(searchValue);
      }
      if (e.key === "Escape") return input.blur();
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && valuesState.length > 0) {
          const lastSelectOption = valuesState[valuesState.length - 1];
          if (lastSelectOption) {
            handleUnselect(lastSelectOption);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    setValuesState(values);
  }, [values]);

  useEffect(() => {
    if (values.length) return;
    if (defaultValues?.length) setValuesState(defaultValues);
  }, [defaultValues, values]);

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <div
          ref={selectElemRef}
          onClick={() => {
            inputRef.current?.focus();
            setOpen(true);
          }}
          className="flex-1 rounded-sm border dark:!bg-shark-900/60 bg-shark-50 min-h-11 h-fit flex items-center gap-2 flex-wrap py-2 px-3"
        >
          {valuesState.map(value => (
            <MultiSelectBadge
              key={value}
              options={options}
              value={value}
              handleUnselect={handleUnselect}
            />
          ))}
          <input
            ref={inputRef}
            placeholder={placeholder}
            className={cn(
              "flex-1 h-6 !p-0 bg-transparent text-sm rounded-none border-none ring-0 focus-visible:outline-none focus-visible:ring-0",
              {
                "placeholder:text-primary": !valuesState.length,
                "placeholder:text-muted-foreground": !!valuesState.length,
              },
            )}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
              handleKeyDown(e);
            }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        ref={popoverRef}
        onOpenAutoFocus={e => e.preventDefault()}
        className="w-auto pointer-events-auto p-1"
        style={{ width: elemWidth }}
      >
        <Command className="w-full">
          <CommandList>
            <CommandGroup>
              {searchResults.map(option => {
                const isSelelcted = valuesState.find(e => e === option.value);

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      if (isSelelcted) return handleUnselect(option.value);
                      handleSelect(option.value);
                    }}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        !!isSelelcted ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {!matchedOption && allowCreate ? (
              <CommandEmpty className="!py-3">
                Create &quot;{searchValue}&quot;
              </CommandEmpty>
            ) : (
              <CommandEmpty className="!py-3">No result found.</CommandEmpty>
            )}
          </CommandList>
          {searchResults.length !== 0 &&
            !!searchValue.length &&
            !matchedOption &&
            allowCreate && (
              <>
                <Separator className="my-1" />
                <div className="w-full py-1 text-sm px-1">
                  Create &quot;{searchValue}&quot;
                </div>
              </>
            )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const MultiSelectBadge = ({
  options,
  value,
  handleUnselect,
}: {
  options: Option[];
  value: string;
  handleUnselect: (value: string) => void;
}) => {
  const option = options.find(e => e.value === value);
  if (!option) return <Badge>No Item</Badge>;

  const bg = nameToColor(option.label.toUpperCase());
  const text = getTextColor(bg);

  return (
    <Badge
      key={option.value}
      style={{ backgroundColor: bg, color: text }}
      className="px-1 gap-1"
      onClick={e => {
        e.stopPropagation();
      }}
    >
      {option.label.toUpperCase()}
      <div
        className="cursor-pointer"
        onClick={() => handleUnselect(option.value)}
      >
        <XCircleIcon strokeWidth={1.5} className="size-4" />
      </div>
    </Badge>
  );
};
