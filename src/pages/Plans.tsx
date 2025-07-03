import React from "react";
import { useContent, replaceTemplateVariables } from "../lib/contentLoader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Check, Star } from "lucide-react";

const Plans: React.FC = () => {
  const { content } = useContent();

  // Flatten all provider plans into a single array for the table
  const allPlans = content.providers.flatMap((provider) =>
    provider.plans.map((plan) => ({
      ...plan,
      providerName: provider.name,
      providerLogo: provider.logo,
      providerId: provider.id,
    })),
  );

  const heroAltText = replaceTemplateVariables(
    content.plans_page.hero_alt_text,
    content,
  );

  return (
    <div className="bg-background dark:bg-dark-bg-primary min-h-screen">
      {/* Hero Section */}
      <div className="relative py-24 px-4 bg-brand-secondary dark:bg-dark-bg-secondary">
        <div className="container mx-auto text-center text-gray-800 dark:text-dark-text-primary">
          <h1 className="text-5xl font-bold tracking-tight mb-6 dark:text-white">
            Plans & Services
          </h1>
          <p className="text-xl max-w-3xl mx-auto dark:text-white">
            Compare internet plans from multiple providers in your area
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Provider Plans Table */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground dark:text-dark-text-primary">
              Available Internet Plans
            </h2>
            <p className="text-muted-foreground dark:text-dark-text-secondary max-w-2xl mx-auto">
              Choose from our partner providers offering high-speed internet in{" "}
              {content.plans_page.city_name}
            </p>
          </div>

          <div className="bg-card dark:bg-dark-bg-card rounded-lg border dark:border-dark-border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-20">Provider</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead className="text-center">Speed</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead className="text-center w-32">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPlans.map((plan) => (
                  <TableRow
                    key={`${plan.providerId}-${plan.id}`}
                    className="hover:bg-muted/30"
                  >
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <img
                          src={plan.providerLogo}
                          alt={`Logo for ${plan.providerName}`}
                          className="h-12 w-12 rounded-lg object-contain"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {plan.providerName}
                          </div>
                        </div>
                        {plan.popular && (
                          <Badge
                            variant="default"
                            className="bg-primary text-primary-foreground"
                          >
                            <Star className="h-3 w-3 mr-1" /> Popular
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {plan.speed}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-bold text-lg">{plan.price}</div>
                      <div className="text-sm text-muted-foreground">
                        /month
                      </div>
                    </TableCell>
                    <TableCell>
                      <ul className="space-y-1">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <Check className="h-3 w-3 text-primary mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 3 && (
                          <li className="text-sm text-muted-foreground">
                            +{plan.features.length - 3} more
                          </li>
                        )}
                      </ul>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        className={
                          plan.popular ? "bg-primary hover:bg-primary/90" : ""
                        }
                        variant={plan.popular ? "default" : "outline"}
                        size="sm"
                        aria-label={`Sign up for ${plan.name} by ${plan.providerName}`}
                      >
                        {plan.cta_text}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* What's Included */}
          <div className="bg-card dark:bg-dark-bg-card rounded-lg border dark:border-dark-border p-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground dark:text-dark-text-primary">
              {content.ui_text.whats_included_title}
            </h3>
            <ul className="space-y-2">
              {content.additional_features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-card dark:bg-dark-bg-card rounded-lg border dark:border-dark-border p-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground dark:text-dark-text-primary">
              {content.ui_text.faq_title}
            </h3>
            <div className="space-y-4">
              {content.faq.slice(0, 3).map((faqItem, index) => (
                <div key={index}>
                  <h4 className="font-medium text-sm mb-1">
                    {faqItem.question}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {faqItem.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
