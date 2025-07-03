import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Wifi } from "lucide-react";

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  cityName?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  headline = "A Community Focused Fiber Network",
  subheadline = "The first open access broadband network in South Carolina. Offering internet choice to Orangeburg through a marketplace of Internet Service Providers.",
  image = "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80",
  ctaText = "Check Availability",
  ctaLink = "/contact",
  cityName = "Orangeburg",
}) => {
  const navigate = useNavigate();

  const handleCheckAvailability = () => {
    navigate("/check-availability");
  };

  const handleViewPlans = () => {
    navigate("/plans");
  };

  return (
    <section className="relative overflow-hidden bg-brand-secondary dark:bg-dark-bg-secondary">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/20 dark:from-brand-primary/10 dark:to-dark-accent/20" />

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary dark:text-white px-3 py-1 rounded-full text-sm font-medium">
                <Wifi className="h-4 w-4" />
                <span>OPEN ACCESS BROADBAND NETWORK IN SC</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground dark:text-white">
                {headline || "A Community Focused Fiber Network"}
              </h1>

              <p className="text-xl text-muted-foreground dark:text-white max-w-2xl">
                {subheadline ||
                  "The first open access broadband network in South Carolina. Offering internet choice to Orangeburg through a marketplace of Internet Service Providers."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <button
                onClick={handleCheckAvailability}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-brand-primary rounded-md hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors"
              >
                {ctaText}
              </button>

              <button
                onClick={handleViewPlans}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-brand-primary bg-transparent border border-brand-primary rounded-md hover:bg-brand-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors"
              >
                View Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="flex items-center justify-center h-64 lg:h-80">
              <img
                src={image}
                alt="High-speed fiber internet technology"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
