type SUBSCRIPTION_PLANS_TYPE = {
  name: string;
  description: string;
  price: string;
  type: "FREE" | "PRO";
  cta: string;
  features: string[];
};

export const SUBSCRIPTION_PLANS: SUBSCRIPTION_PLANS_TYPE[] = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    type: "FREE",
    features: ["1 workspace", "Up to 4 projects", "Up to 5 team members"],
    cta: "Get Started",
  },
  {
    name: "Premium",
    description: "Advanced features for power users",
    price: "$99",
    type: "PRO",
    features: [
      "Unlimited workspaces",
      "Unlimited projects",
      "Unlimited team members",
    ],
    cta: "Upgrade Now",
  },
];
