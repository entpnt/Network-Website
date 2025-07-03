import React from "react";
import HeroSection from "../components/HeroSection";
import PlanCards from "../components/PlanCards";
import StreamingSection from "../components/StreamingSection";
import CTASection from "../components/CTASection";
import { useContent } from "../lib/contentLoader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Edit, Wrench, List, Wifi, Play } from "lucide-react";

const Home: React.FC = () => {
  const { content, loading, error } = useContent();

  // Get city name for dynamic content
  const getContent = (key: string, fallback: string) => {
    const keys = key.split(".");
    let value: any = content;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || fallback;
  };

  const cityName = getContent("city_name", "Orangeburg");

  // Debug logging
  console.log(
    "Home component - Loading:",
    loading,
    "Error:",
    error,
    "Content loaded:",
    !!content,
  );
  console.log("Content keys:", Object.keys(content || {}));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            Content Loading Error
          </h1>
          <p className="text-red-500 mb-4">{error.message}</p>
          <p className="text-sm text-gray-500">Using fallback content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Content Available</h1>
          <p className="text-muted-foreground">Content could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Icon mapping
  const iconMap: { [key: string]: any } = {
    edit: Edit,
    wrench: Wrench,
    list: List,
    wifi: Wifi,
  };

  // How It Works steps data from content with safety checks
  const howItWorksSteps = (content?.how_it_works?.steps || []).map((step) => ({
    icon: iconMap[step.icon] || Edit,
    title: step.title || "Step",
    description: step.description || "Description",
  }));

  // Safety check for required content sections
  if (!content?.ui_text || !content?.hero || !content?.plans) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            Content Structure Error
          </h1>
          <p className="text-red-500 mb-4">
            Required content sections are missing.
          </p>
          <p className="text-sm text-gray-500">
            Missing: {!content?.ui_text ? "ui_text " : ""}
            {!content?.hero ? "hero " : ""}
            {!content?.plans ? "plans" : ""}
          </p>
        </div>
      </div>
    );
  }

  // How It Works Mini-Section Component
  const HowItWorksSection = () => (
    <section className="py-16 bg-muted/40 dark:bg-dark-bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground dark:text-dark-text-primary">
            {content?.ui_text?.how_it_works_title || "How It Works"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorksSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card
                key={index}
                className="text-center h-full bg-background dark:bg-dark-bg-card dark:border-dark-border"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground dark:text-dark-text-secondary">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );

  // Video Section Component
  const VideoSection = () => (
    <section className="py-16 bg-background dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-primary uppercase tracking-wide">
                Learn More
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground dark:text-dark-text-primary">
                {(
                  content?.ui_text?.video_section_title ||
                  "Discover the Marketplace"
                ).replace("{{city_name}}", cityName)}
              </h2>
              <p className="text-lg text-muted-foreground dark:text-dark-text-secondary">
                {content?.ui_text?.video_section_description ||
                  "Learn more about our services"}
              </p>
            </div>

            {/* CTA Button */}
            <Button size="lg" className="group" asChild>
              <a href="/check-availability">
                {content?.ui_text?.sign_up || "Sign Up"}
              </a>
            </Button>
          </div>

          {/* Right Side - Video */}
          <div className="relative aspect-video bg-muted dark:bg-dark-accent rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Play className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground dark:text-dark-text-secondary text-lg">
                  {content?.ui_text?.video_placeholder || "Video Placeholder"}
                </p>
                <p className="text-sm text-muted-foreground dark:text-dark-text-secondary mt-2">
                  {content?.ui_text?.embed_video_here ||
                    "Embed your video content here"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="bg-background dark:bg-dark-bg-primary">
      <HeroSection
        headline={content?.hero?.headline || "Welcome"}
        subheadline={
          content?.hero?.subheadline || "High-speed internet for modern living"
        }
        image={
          content?.hero?.image ||
          "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80"
        }
        ctaText={content?.hero?.cta_text || "Get Started"}
        ctaLink={content?.hero?.cta_link || "/check-availability"}
        cityName={cityName}
      />
      <HowItWorksSection />
      <PlanCards
        title={content?.ui_text?.plan_cards_title || "Choose Your Perfect Plan"}
        subtitle={
          content?.ui_text?.plan_cards_subtitle ||
          "Select the plan that works for you"
        }
        plans={(content?.plans || []).map((plan) => ({
          id: plan.name.toLowerCase().replace(/\s+/g, "-"),
          name: plan.name || "Plan",
          price: plan.price || "$0",
          speed: plan.speed || "High Speed",
          popular: plan.popular || false,
          features: (plan.features || []).map((feature) => ({
            text: feature,
            included: true,
          })),
          ctaText: plan.cta_text || "Select Plan",
        }))}
      />
      <VideoSection />
      <StreamingSection
        title={content?.streaming?.title || "Stream Without Limits"}
        image={
          content?.streaming?.image ||
          "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80"
        }
        quotes={content?.streaming?.quotes || []}
      />
      <CTASection
        title={content?.cta_section?.title || "Ready to Get Started?"}
        text={
          content?.cta_section?.text || "Join thousands of satisfied customers."
        }
        buttonText={content?.cta_section?.button_text || "Check Availability"}
        buttonLink={content?.cta_section?.button_link || "/check-availability"}
      />
    </div>
  );
};

export default Home;
