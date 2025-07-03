import React from "react";
import { useContent } from "../lib/contentLoader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Construction,
  Wifi,
  User,
  CreditCard,
  Wrench,
  ArrowRight,
} from "lucide-react";

const Support: React.FC = () => {
  const { content } = useContent();
  const supportPage = content.support_page;

  const getSupportPageUrl = (sectionId: string) => {
    const urlMap: { [key: string]: string } = {
      construction: "/support-center/fiber-construction-progress",
      "managed-wifi": "/support-center/managed-wifi",
      account: "/support-center/account-management",
      billing: "/support-center/billing-payments",
      troubleshooting: "/support-center/troubleshooting",
    };
    return urlMap[sectionId] || "#";
  };

  const getIcon = (iconName: string) => {
    const iconMap = {
      construction: <Construction className="h-8 w-8 text-primary" />,
      wifi: <Wifi className="h-8 w-8 text-primary" />,
      user: <User className="h-8 w-8 text-primary" />,
      "credit-card": <CreditCard className="h-8 w-8 text-primary" />,
      wrench: <Wrench className="h-8 w-8 text-primary" />,
    };
    return (
      iconMap[iconName as keyof typeof iconMap] || (
        <User className="h-8 w-8 text-primary" />
      )
    );
  };

  return (
    <div className="bg-background dark:bg-dark-bg-primary min-h-screen">
      {/* Hero Section */}
      <div className="relative py-24 px-4 bg-brand-secondary dark:bg-dark-bg-secondary">
        <div className="container mx-auto text-center text-gray-800 dark:text-dark-text-primary">
          <h1 className="text-5xl font-bold tracking-tight mb-6 dark:text-white">
            {supportPage.title}
          </h1>
          <p className="text-xl max-w-3xl mx-auto dark:text-white">
            {supportPage.subheader}
          </p>
        </div>
      </div>

      {/* CTA Sections */}
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportPage.cta_sections.map((section, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg dark:hover:shadow-dark-accent/20 transition-all duration-300 cursor-pointer h-full dark:bg-dark-bg-card dark:border-dark-border"
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      {getIcon(section.icon)}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-muted-foreground dark:text-dark-text-secondary mb-6">
                    {section.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    asChild
                  >
                    <a href={getSupportPageUrl(section.id)}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Contact Section */}
      <div className="bg-muted/40 dark:bg-dark-bg-secondary py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text-primary">
              Need Immediate Help?
            </h2>
            <p className="text-xl text-muted-foreground dark:text-dark-text-secondary max-w-2xl mx-auto">
              Our support team is ready to assist you with any questions or
              issues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center dark:bg-dark-bg-card dark:border-dark-border">
              <CardHeader>
                <CardTitle className="text-lg text-foreground dark:text-dark-text-primary">
                  Call Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-lg mb-2 text-foreground dark:text-dark-text-primary">
                  {content.company.contact.phone}
                </p>
                <p className="text-sm text-muted-foreground dark:text-dark-text-secondary">
                  Available 24/7
                </p>
              </CardContent>
            </Card>

            <Card className="text-center dark:bg-dark-bg-card dark:border-dark-border">
              <CardHeader>
                <CardTitle className="text-lg text-foreground dark:text-dark-text-primary">
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-lg mb-2 text-foreground dark:text-dark-text-primary">
                  {content.company.contact.email}
                </p>
                <p className="text-sm text-muted-foreground dark:text-dark-text-secondary">
                  Response within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card className="text-center dark:bg-dark-bg-card dark:border-dark-border">
              <CardHeader>
                <CardTitle className="text-lg text-foreground dark:text-dark-text-primary">
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-2">Start Chat</Button>
                <p className="text-sm text-muted-foreground dark:text-dark-text-secondary">
                  Mon-Fri 8AM-8PM
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
