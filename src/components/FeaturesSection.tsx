import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Zap, Shield, Headphones, Wifi, Globe, Users } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesSectionProps {
  features?: Feature[];
  title?: string;
  subtitle?: string;
}

const iconMap = {
  zap: Zap,
  shield: Shield,
  headphones: Headphones,
  wifi: Wifi,
  globe: Globe,
  users: Users,
};

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features = [
    {
      title: "Blazing Fast Speeds",
      description: "Download, stream, and game with speeds up to 1 Gbps.",
      icon: "zap",
    },
    {
      title: "Reliable Connection",
      description: "99.9% uptime guarantee with our fiber network.",
      icon: "shield",
    },
    {
      title: "24/7 Support",
      description: "Our customer support team is always available to help.",
      icon: "headphones",
    },
  ],
  title = "Why Choose Our Fiber Internet?",
  subtitle = "Experience the difference with our cutting-edge fiber network technology",
}) => {
  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent =
              iconMap[feature.icon as keyof typeof iconMap] || Zap;

            return (
              <Card key={index} className="text-center h-full bg-background">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
