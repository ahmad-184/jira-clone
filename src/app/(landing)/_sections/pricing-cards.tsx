import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SUBSCRIPTION_PLANS } from "@/constants/subscription";
import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default function PricingCards() {
  return (
    <div className="flex w-full items-center md:justify-center gap-10 flex-col md:flex-row">
      {SUBSCRIPTION_PLANS.map((plan, index) => (
        <Card
          key={index}
          className={cn("flex flex-col max-w-md justify-between w-full", {
            "border-primary/50": plan.type === "PRO",
          })}
        >
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="text-4xl font-bold">
              {plan.price}
              <span className="text-lg font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircleIcon className="mr-2 h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button
                className={cn("w-full", {
                  "bg-gray-800 hover:bg-gray-700 text-white":
                    plan.type === "FREE",
                  "bg-primary hover:bg-primary/90": plan.type === "PRO",
                })}
              >
                {plan.cta}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
