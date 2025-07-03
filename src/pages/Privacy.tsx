import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../lib/contentLoader";
import { Button } from "../components/ui/button";
import { ChevronRight, Home } from "lucide-react";

const Privacy: React.FC = () => {
  const { content, loading, error } = useContent();

  useEffect(() => {
    // Load Termly script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "termly-jssdk";
    script.src = "https://app.termly.io/embed-policy.min.js";

    // Check if script is already loaded
    if (!document.getElementById("termly-jssdk")) {
      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    }

    return () => {
      // Cleanup script on component unmount
      const existingScript = document.getElementById("termly-jssdk");
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

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

  const pageData = content.pages?.privacy || {
    title: "Privacy Policy",
    description: "Learn how we protect and handle your personal information.",
    content: "Privacy policy content will be added here.",
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
            <span className="text-foreground font-medium">Privacy Policy</span>
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
            {pageData.title}
          </h1>
        </div>
      </div>

      {/* Description Section */}
      {pageData.description && (
        <div className="py-8 px-4 bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <p
              className="text-muted-foreground leading-relaxed"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              {pageData.description}
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div
              className="space-y-6"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              {/* Termly Privacy Policy Embed */}
              <div
                name="termly-embed"
                data-id="937a973a-5a04-4d00-af96-6d6cfc4e84d9"
                className="min-h-[400px]"
              ></div>
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
            Have questions about our privacy practices?
          </p>
          <Button asChild variant="outline">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
