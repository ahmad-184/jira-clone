import { getTextColor, nameToColor } from "@/util/colors";

type Props = {
  data: {
    id: string;
    name: string;
  };
};

export default function TaskTag({ data }: Props) {
  const t = { color: nameToColor(data.name), name: data.name };
  return (
    <>
      <div
        key={`${t.name}-${t.color}`}
        className={
          "px-1 rounded-[2px] select-none flex items-center justify-center text-xs font-semibold h-[18px] py-0 uppercase"
        }
        style={{
          backgroundColor: t.color,
          color: getTextColor(t.color),
        }}
      >
        {t.name}
      </div>
    </>
  );
}
