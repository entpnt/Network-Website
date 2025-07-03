import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, Check, Star } from "lucide-react";

interface Feature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  speed: string;
  popular?: boolean;
  features: Feature[];
  ctaText: string;
}

interface PlanCardsProps {
  title?: string;
  subtitle?: string;
  plans?: Plan[];
}

const defaultPlans: Plan[] = [
  {
    id: "basic",
    name: "Basic Internet",
    price: "$49.99",
    speed: "100 Mbps",
    features: [
      { text: "Unlimited data", included: true },
      { text: "No contract required", included: true },
      { text: "Free installation", included: true },
      { text: "Premium support", included: false },
    ],
    ctaText: "View Plans",
  },
  {
    id: "standard",
    name: "Standard Internet",
    price: "$69.99",
    speed: "1000 Mbps",
    popular: true,
    features: [
      { text: "Unlimited data", included: true },
      { text: "No contract required", included: true },
      { text: "Free installation", included: true },
      { text: "Super fast speeds", included: true },
      { text: "Premium support", included: true },
    ],
    ctaText: "View Plans",
  },
  {
    id: "premium",
    name: "Premium Internet",
    price: "$89.99",
    speed: "2500 Mbps",
    features: [
      { text: "Unlimited data", included: true },
      { text: "No contract required", included: true },
      { text: "Free installation", included: true },
      { text: "Ultrafast speeds", included: true },
      { text: "Premium support", included: true },
    ],
    ctaText: "View Plans",
  },
];

const PlanCards: React.FC<PlanCardsProps> = ({
  title = "Choose Your Perfect Plan",
  subtitle = "Choose any plan from any provider—no contracts, no commitments.",
  plans = defaultPlans,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="w-full py-12 bg-background dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground dark:text-dark-text-primary">
            {title}
          </h2>
          <p className="text-muted-foreground dark:text-dark-text-secondary max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan) => (
            <motion.div key={plan.id} variants={itemVariants}>
              <Card
                className={`h-full flex flex-col dark:bg-dark-bg-card dark:border-dark-border ${plan.popular ? "border-primary shadow-lg dark:shadow-dark-accent/20" : ""}`}
              >
                {plan.popular && <></>}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center mt-2">
                      <Wifi className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">{plan.speed}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span
                          className={`mr-2 mt-1 ${feature.included ? "text-primary" : "text-muted-foreground"}`}
                        >
                          {feature.included ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span className="block h-4 w-4 text-center">-</span>
                          )}
                        </span>
                        <span
                          className={
                            feature.included ? "" : "text-muted-foreground"
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <a href="/plans">View {plan.price}/month</a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PlanCards;
