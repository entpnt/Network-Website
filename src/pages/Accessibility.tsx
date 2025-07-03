import React from "react";
import { Link } from "react-router-dom";
import { useContent } from "../lib/contentLoader";
import { Button } from "../components/ui/button";
import { ChevronRight, Home } from "lucide-react";

const Accessibility: React.FC = () => {
  const { content, loading, error } = useContent();

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">
            Please wait while we load the page content.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground">
            Failed to load page content: {error.message}
          </p>
        </div>
      </div>
    );
  }

  const pageData = content.pages?.accessibility || {
    title: "Accessibility Statement",
    description: "",
    content: "Accessibility information will be added here.",
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="bg-muted/20 py-4 px-4">
        <div className="container mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link
              to="/"
              className="flex items-center hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Accessibility</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="relative py-16 px-4 text-center"
        style={{ backgroundColor: "#FFebde" }}
      >
        <div className="container mx-auto relative z-10">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Accessibility Statement
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div
              className="space-y-6"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  At Orangeburg Fiber, we believe everyone in our community
                  should be able to connect—to the internet and to the
                  information they need. That's why we're committed to making
                  our website accessible and usable for all, including
                  individuals with disabilities.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We've built this site with accessibility in mind, following
                  the best practices outlined in the Web Content Accessibility
                  Guidelines (WCAG) 2.1, Level AA. Whether you're browsing with
                  a screen reader, navigating by keyboard, or using assistive
                  technology, our goal is to ensure your experience is smooth,
                  clear, and fully supported.
                </p>
              </div>

              <div className="space-y-4">
                <h2
                  className="text-2xl font-semibold text-foreground"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  How We Support Accessibility
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    Our website supports screen readers and keyboard-only
                    navigation.
                  </li>
                  <li>Images include descriptive alt text.</li>
                  <li>
                    Colors and contrast ratios are optimized for readability.
                  </li>
                  <li>
                    Pages are structured for logical navigation and clarity.
                  </li>
                  <li>
                    We're continuously testing and improving based on user
                    feedback and accessibility audits.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2
                  className="text-2xl font-semibold text-foreground"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Let Us Know How We're Doing
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you encounter any issues accessing content or have
                  suggestions for improvement, we want to hear from you.
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    📧 Email:{" "}
                    <a
                      href="mailto:help@orangeburgfiber.net"
                      className="hover:underline text-foreground"
                    >
                      help@orangeburgfiber.net
                    </a>
                  </p>
                  <p>
                    📞 Phone:{" "}
                    <a
                      href="tel:(803) 973-0430"
                      className="hover:underline text-foreground"
                    >
                      (803) 973-0430
                    </a>
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Your experience matters. We're committed to making Orangeburg
                  Fiber's site work for everyone—and we're always here to help.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="border-t py-8 px-4">
        <div className="container mx-auto text-center">
          <p
            className="text-muted-foreground mb-4"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            Need accessibility assistance?
          </p>
          <Button asChild variant="outline">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
