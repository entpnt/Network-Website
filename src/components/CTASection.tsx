import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  title?: string;
  text?: string;
  buttonText?: string;
  buttonLink?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title = "Ready to Experience Better Internet?",
  text = "Check if our service is available in your area and join thousands of satisfied customers.",
  buttonText = "Check Availability Now",
  buttonLink = "/contact",
}) => {
  return (
    <section className="py-16 bg-primary text-primary-foreground dark:bg-brand-primary dark:text-brand-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
          <p className="text-xl mb-8 opacity-90">{text}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="group" asChild>
              <a href="/check-availability">
                {buttonText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <a href="/check-availability">View All Plans</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
