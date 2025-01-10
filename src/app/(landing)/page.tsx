import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import PricingCards from "./_sections/pricing-cards";

export default function Home() {
  return (
    <main className="bg-background">
      <section className="relative bg-gradient-to-b dark:from-zinc-800 dark:via-zinc-900 dark:to-background">
        <div
          className="absolute inset-0 
            dark:bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] dark:bg-[size:4rem_4rem] dark:[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]
            bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]
          "
        />
        <div className="relative w-full">
          <div className="px-4 py-8 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="h-8 w-10 rounded-lg dark:bg-white dark:text-black text-white bg-black flex items-center justify-center font-bold">
                  Task
                </div>
                <span className="text-xl font-semibold">Hive</span>
              </div>
              <nav className="hidden space-x-6 text-sm dark:text-zinc-200 md:block">
                <Link
                  href="#features"
                  className="hover:border-b-2 border-zinc-950"
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="hover:border-b-2 border-zinc-950"
                >
                  Pricing
                </Link>
                <Link
                  href="#about"
                  className="hover:border-b-2 border-zinc-950"
                >
                  About
                </Link>
              </nav>
              <Link href="/dashboard">
                <Button className="dark:bg-white dark:hover:bg-white dark:text-black font-semibold">
                  Login
                </Button>
              </Link>
            </div>

            <div className="mx-auto mt-16 max-w-3xl text-center">
              <h1 className="text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Empower Your Projects with TaskHive
              </h1>

              <p className="mt-6 text-lg dark:text-zinc-300 text-zinc-800">
                TaskHive is your all-in-one solution for seamless project
                management and team collaboration. Organize tasks, track
                progress, and achieve your goals with ease.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <Link href="/dashboard">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-zinc-600 dark:hover:bg-zinc-900/50 hover:bg-zinc-900/70 hover:text-white"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative h-fit w-full mt-10">
              <Image
                src="/hero-board-img.png"
                alt="Community member"
                className="object-cover w-full"
                width={1000}
                height={1000}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="w-full px-4 md:px-6">
          <div className="flex flex-col mb-10 md:items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Choose Your Plan
            </h2>
            <p className="max-w-[900px] text-muted-foreground text-center">
              Select the perfect plan to boost your project management
            </p>
          </div>
          <PricingCards />
        </div>
      </section>
    </main>
  );
}
