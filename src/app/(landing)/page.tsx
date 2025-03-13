import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import PricingCards from "./_sections/pricing-cards";
import Navbar from "./_sections/navbar";

export default function Home() {
  return (
    <main className="bg-shark-900">
      <section className="relative bg-gradient-to-b dark:from-shark-800/50 dark:via-shark-800/20 dark:to-bg-shark-900">
        <div
          className="absolute inset-0
            dark:bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] dark:bg-[size:4rem_4rem] dark:[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]
            bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]
          "
        />
        <div className="relative w-full">
          <div className="px-4 py-5 w-full">
            <Navbar />

            <div className="mx-auto mt-16 max-w-3xl text-center">
              <h1 className="text-3xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Streamline Your Workflow with TaskHive
              </h1>

              <p className="mt-6 text-sm md:text-lg dark:text-shark-300 text-shark-800">
                TaskHive simplifies project management and enhances team
                collaboration. Effortlessly organize tasks, monitor progress,
                and achieve your objectives efficiently.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <Link href="/dashboard">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-shark-600 dark:hover:bg-shark-900/50 hover:bg-shark-900/70 hover:text-white"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative h-fit w-full mt-10">
              <div className="z-50">
                <div className="absolute top-0 left-0 h-[100%] z-[0] blur-3xl w-[100%] rounded-full bg-shark-700" />
                <Image
                  src="/hero-board-img.png"
                  alt="Community member"
                  className="object-cover w-full xl:max-w-[90vw] mx-auto relative"
                  width={1000}
                  height={1000}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto w-full py-12 md:py-24 lg:py-32 bg-shark-900">
        <div className="w-full px-4 md:px-6">
          <div className="flex flex-col mb-10 md:items-center justify-center space-y-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
              Choose Your Plan
            </h2>
            <p className="text-sm md:text-lg max-w-[900px] text-muted-foreground text-center">
              Select the perfect plan to boost your project management
            </p>
          </div>
          <PricingCards />
        </div>
      </section>
    </main>
  );
}
