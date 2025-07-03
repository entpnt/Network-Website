import React from "react";
import { useContent, replaceTemplateVariables } from "../lib/contentLoader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { CheckCircle, Wifi, Zap, Shield } from "lucide-react";

const HowItWorks: React.FC = () => {
  const { content } = useContent();

  const steps = [
    {
      icon: <CheckCircle className="h-12 w-12 text-primary" />,
      title: "Check Availability",
      description:
        "Enter your address to see if our fiber network is available in your area.",
    },
    {
      icon: <Wifi className="h-12 w-12 text-primary" />,
      title: "Choose Your Plan",
      description:
        "Select from our range of high-speed internet plans that fit your needs.",
    },
    {
      icon: <Zap className="h-12 w-12 text-primary" />,
      title: "Professional Installation",
      description:
        "Our certified technicians will install your fiber connection at no extra cost.",
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Enjoy Fast Internet",
      description:
        "Experience lightning-fast speeds with our reliable fiber network.",
    },
  ];

  return (
    <div className="bg-background dark:bg-dark-bg-primary min-h-screen">
      {/* Hero Section */}
      <div className="relative py-24 px-4 bg-brand-secondary dark:bg-dark-bg-secondary">
        <div className="container mx-auto text-center text-gray-800 dark:text-dark-text-primary">
          <h1 className="text-5xl font-bold tracking-tight mb-6 dark:text-white">
            How It Works
          </h1>
          <p className="text-xl max-w-3xl mx-auto dark:text-white">
            Getting started with {content.company.name} is simple. Follow these
            easy steps to get connected to our high-speed fiber network.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="text-center h-full">
              <CardHeader>
                <div className="flex justify-center mb-4">{step.icon}</div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground dark:text-dark-text-secondary">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Section with Image */}
        <div className="bg-muted/40 dark:bg-dark-bg-card rounded-lg p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground dark:text-dark-text-primary">
                Open Access Fiber Network
              </h2>
              <p className="text-muted-foreground dark:text-dark-text-secondary mb-4">
                Our open access fiber network brings high-speed internet
                directly to your community. By working with local partners and
                service providers, we ensure you get the best possible service
                at competitive rates.
              </p>
              <p className="text-muted-foreground">
                Whether you're working from home, running a small business, or
                just staying connected with family and friends, our fiber
                network provides the reliable, fast internet you need.
              </p>
            </div>
            <div className="order-first lg:order-last">
              <img
                src={content.how_it_works_page.content_image}
                alt={replaceTemplateVariables(
                  content.how_it_works_page.content_alt_text,
                  content,
                )}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-muted/40 dark:bg-dark-bg-card rounded-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text-primary">
              Our Fiber Technology
            </h2>
            <p className="text-muted-foreground dark:text-dark-text-secondary max-w-2xl mx-auto">
              We use the latest fiber optic technology to deliver unmatched
              speed and reliability to your home or business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-dark-text-primary">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground dark:text-dark-text-secondary">
                Speeds up to 1 Gbps for seamless streaming, gaming, and working
                from home.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-dark-text-primary">
                Ultra Reliable
              </h3>
              <p className="text-muted-foreground dark:text-dark-text-secondary">
                99.9% uptime guarantee with our robust fiber infrastructure.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-dark-text-primary">
                Future Ready
              </h3>
              <p className="text-muted-foreground dark:text-dark-text-secondary">
                Fiber technology that grows with your needs for years to come.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
