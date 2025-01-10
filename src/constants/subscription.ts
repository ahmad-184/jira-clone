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
    name: "Free Plan",
    description: "Perfect for getting started",
    price: "$0",
    type: "FREE",
    features: [
      "1 Workspace",
      "4 projects per workspace",
      "invite 5 users per workspace",
    ],
    cta: "Get Started",
  },
  {
    name: "Smart AI Plan",
    description: "Advanced features for power users",
    price: "$99",
    type: "PRO",
    features: [
      "Unlimited workspaces",
      "Unlimited projects",
      "Unlimited invite users to workspace",
    ],
    cta: "Upgrade Now",
  },
];
