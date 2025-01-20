export default function Logo() {
  return (
    <div
      className="flex items-center gap-1 select-none"
      style={{
        gap: "3px",
      }}
    >
      <span className="h-8 w-10 rounded-lg icon-task flex items-center justify-center font-bold">
        Task
      </span>
      <span className="text-xl font-semibold">Hive</span>
    </div>
  );
}
