export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full fixed h-screen md:px-5 overflow-auto dark:bg-zinc-900 bg-zinc-100">
      <div className="px-2 w-full h-full flex gap-3">
        <div className="my-auto flex items-center flex-col flex-1">
          <div className="py-10 w-full flex justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
}
