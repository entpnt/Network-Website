import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../lib/contentLoader";
import { Button } from "../components/ui/button";
import { ChevronRight, Home } from "lucide-react";

const Terms: React.FC = () => {
  const { content, loading, error } = useContent();

  useEffect(() => {
    // Load Termly script dynamically
    const loadTermlyScript = () => {
      if (document.getElementById("termly-jssdk")) return;

      const script = document.createElement("script");
      script.id = "termly-jssdk";
      script.src = "https://app.termly.io/embed-policy.min.js";
      script.type = "text/javascript";

      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    };

    loadTermlyScript();
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

  const pageData = content.pages?.terms || {
    title: "Terms & Conditions",
    description:
      "Please read these terms and conditions carefully before using our services.",
    content: "Terms and conditions content will be added here.",
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
            <span className="text-foreground font-medium">
              Terms & Conditions
            </span>
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
              name="termly-embed"
              data-id="5f880d2d-7a56-43d4-948f-904bf9e97635"
            ></div>
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
            Questions about our terms and conditions?
          </p>
          <Button asChild variant="outline">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
