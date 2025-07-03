import React from "react";
import { useContent, replaceTemplateVariables } from "../lib/contentLoader";
import { Button } from "../components/ui/button";

const Business: React.FC = () => {
  const { content } = useContent();
  const businessContent = content.business_page;

  // Replace template variables in content
  const heroImage = replaceTemplateVariables(
    businessContent.hero_image,
    content,
  );
  const heroAltText = replaceTemplateVariables(
    businessContent.hero_alt_text,
    content,
  );
  const subContext = replaceTemplateVariables(
    businessContent.sub_context,
    content,
  );
  const whyChooseTitle = replaceTemplateVariables(
    businessContent.why_choose_title,
    content,
  );
  const blazingFastImage =
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80";
  const blazingFastAltText =
    "Colleagues collaborating using business fiber internet in Orangeburg";
  const futureReadyImage =
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80";
  const futureReadyAltText =
    "Business user with phone using social media / networking in Orangeburg";

  return (
    <div className="bg-background dark:bg-dark-bg-primary min-h-screen">
      {/* Hero Section */}
      <div className="relative py-24 px-4 bg-brand-secondary dark:bg-dark-bg-secondary">
        <div className="container mx-auto text-center text-gray-800 dark:text-dark-text-primary">
          <h1 className="text-5xl font-bold tracking-tight mb-6 dark:text-white">
            {businessContent.main_title}
          </h1>
          <p className="text-xl max-w-3xl mx-auto dark:text-white">
            {subContext}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Why Choose Orangeburg Fiber Section */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-8 text-foreground dark:text-dark-text-primary">
            {whyChooseTitle}
          </h2>
          <p className="text-lg text-muted-foreground dark:text-dark-text-secondary mb-12 max-w-4xl mx-auto">
            {businessContent.why_choose_description}
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-card dark:bg-gray-800 rounded-lg shadow-sm border border-border dark:border-gray-700">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-dark-text-primary">
                Lightning-Fast Speeds
              </h3>
              <p className="text-muted-foreground dark:text-dark-text-secondary">
                Experience blazing-fast internet speeds that keep your business
                running smoothly, even during peak hours.
              </p>
            </div>

            <div className="p-6 bg-card dark:bg-gray-800 rounded-lg shadow-sm border border-border dark:border-gray-700">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-dark-text-primary">
                99.9% Reliability
              </h3>
              <p className="text-muted-foreground dark:text-dark-text-secondary">
                Count on consistent, reliable connectivity with our robust fiber
                network and redundant infrastructure.
              </p>
            </div>

            <div className="p-6 bg-card dark:bg-gray-800 rounded-lg shadow-sm border border-border dark:border-gray-700">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3v6m0 6v6m6-12h-6m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-dark-text-primary">
                Scalable Solutions
              </h3>
              <p className="text-muted-foreground dark:text-dark-text-secondary">
                Grow your business with flexible plans that scale with your
                needs, from small offices to enterprise operations.
              </p>
            </div>
          </div>

          <Button size="lg" className="bg-primary hover:bg-primary/90">
            {businessContent.cta_button_text}
          </Button>
        </div>

        {/* Blazing Fast Solutions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-foreground dark:text-dark-text-primary">
              {businessContent.blazing_fast_title}
            </h2>
            <p className="text-lg text-muted-foreground dark:text-dark-text-secondary">
              {businessContent.blazing_fast_description}
            </p>
          </div>
          <div className="relative">
            <div
              className="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${blazingFastImage})` }}
            >
              <img
                src={blazingFastImage}
                alt={blazingFastAltText}
                className="w-full h-full object-cover rounded-lg opacity-0"
                onLoad={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.parentElement!.style.backgroundImage = "none";
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>

        {/* Future-Ready Connectivity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <div
              className="w-full h-64 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${futureReadyImage})` }}
            >
              <img
                src={futureReadyImage}
                alt={futureReadyAltText}
                className="w-full h-full object-cover rounded-lg opacity-0"
                onLoad={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.parentElement!.style.backgroundImage = "none";
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold mb-6 text-foreground dark:text-dark-text-primary">
              {businessContent.future_ready_title}
            </h2>
            <p className="text-lg text-muted-foreground dark:text-dark-text-secondary">
              {businessContent.future_ready_description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;
