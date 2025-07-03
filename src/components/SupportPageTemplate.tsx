import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useContent, replaceTemplateVariables } from "../lib/contentLoader";
import { Button } from "./ui/button";
import { ChevronRight, Home } from "lucide-react";

interface SupportPageTemplateProps {
  pageKey: string;
  children?: React.ReactNode;
}

const SupportPageTemplate: React.FC<SupportPageTemplateProps> = ({
  pageKey,
  children,
}) => {
  const { content, loading, error } = useContent();
  const location = useLocation();

  console.log("SupportPageTemplate - loading:", loading);
  console.log("SupportPageTemplate - error:", error);
  console.log("SupportPageTemplate - content loaded:", !!content);

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

  // Get the page data from content
  console.log("SupportPageTemplate - pageKey:", pageKey);
  console.log(
    "SupportPageTemplate - content.support_page:",
    content.support_page,
  );
  console.log(
    "SupportPageTemplate - cta_sections:",
    content.support_page?.cta_sections,
  );

  const supportSection = content.support_page?.cta_sections?.find(
    (section) => section.id === pageKey,
  );

  console.log("SupportPageTemplate - found supportSection:", supportSection);

  if (!supportSection?.subpage) {
    console.log(
      "Available sections:",
      content.support_page?.cta_sections?.map((s) => s.id) || [],
    );
    console.log("Looking for pageKey:", pageKey);
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page not found</h1>
          <p className="text-muted-foreground">
            The requested support page could not be found.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Page key: {pageKey}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Available sections:{" "}
            {content.support_page?.cta_sections?.map((s) => s.id).join(", ") ||
              "None"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Content loading: {content ? "Yes" : "No"}
          </p>
        </div>
      </div>
    );
  }

  const { subpage } = supportSection;
  const currentPageTitle = subpage.title;

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
            <Link
              to="/support"
              className="hover:text-foreground transition-colors"
            >
              Support Center
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">
              {currentPageTitle}
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
            {subpage.title}
          </h1>
        </div>
      </div>

      {/* Description Section */}
      {subpage.description && (
        <div className="py-8 px-4 bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <p
              className="text-muted-foreground leading-relaxed"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              {subpage.description}
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            {/* Dynamic content placeholder */}
            <div
              className="space-y-6"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              {subpage.content && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {subpage.content}
                </p>
              )}

              {/* Additional content sections based on page type */}
              {pageKey === "construction" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Current Status
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      In Progress: Fiber installation is underway, and we are
                      also actively engaging with the community to ensure
                      everyone is aware of our services and can take advantage
                      of the upcoming benefits. You may receive communication
                      from us regarding service plans and installation options
                      as we get closer to completion.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      What Happens Next?
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We're installing the fiber optic cables in your area,
                      which may involve light digging or aerial line work.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Sign Up Now and Save
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Don't miss out on our free in-home installation promotion,
                      a $350 value! Sign up for service during the construction
                      phase to take advantage of this limited-time offer.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Have Questions?
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      If you have any questions about construction, our
                      promotional offer, or marketing initiatives, feel free to
                      reach out to our support team. We're here to help!
                    </p>
                  </div>
                </div>
              )}

              {pageKey === "managed-wifi" && (
                <div className="space-y-8">
                  {/* Note Section */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Please Note:</strong> Every home on the{" "}
                      {replaceTemplateVariables(
                        "{{dynamic_network_name}}",
                        content,
                      )}{" "}
                      network enjoys whole-home WiFi coverage by default.
                      Managed WiFi is an additional service that offers more
                      control, customization, and advanced features for managing
                      your home network.
                    </p>
                  </div>

                  {/* How It Works */}
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      How It Works
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      The Managed WiFi device (EntryPoint D50) is installed by
                      our team during the in-home portion of your fiber
                      installation. It delivers seamless wireless coverage and
                      easy access to network settings via the Managed WiFi app.
                      Need more coverage? Additional mesh units can be purchased
                      and installed during setup or shipped later as needed.
                    </p>
                  </div>

                  {/* Getting Started */}
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Getting Started
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Managed WiFi can only be added after selecting an internet
                      service plan.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      You'll be presented with the option to add Managed WiFi
                      during installation, but it can also be added later if you
                      decide to upgrade your service.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Download the Managed WiFi app to manage your network
                      settings
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <Button asChild variant="outline">
                        <a
                          href="#ios-app"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download for iOS
                        </a>
                      </Button>
                      <Button asChild variant="outline">
                        <a
                          href="#android-app"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download for Android
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Device Setup */}
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Device Setup
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Download the manual for the EntryPoint D50 device for
                      step-by-step guidance on setting up and managing your
                      network.
                    </p>
                    <Button asChild variant="outline">
                      <a
                        href="/D50_ManagedWifi.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        Download EntryPoint D50 Manual
                      </a>
                    </Button>
                  </div>

                  {/* Additional Features */}
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Additional Features
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Live in a large home or multi-level house? We recommend
                      mesh units for extended coverage. These can be:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Installed during initial setup</li>
                      <li>Shipped to you and added later</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      Let your installer know your home's layout so we can
                      tailor your WiFi performance accordingly.
                    </p>
                  </div>

                  {/* Support & Troubleshooting */}
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Support & Troubleshooting
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Need help managing your WiFi network or expanding your
                      coverage with mesh units? Refer to the EntryPoint D50
                      Manual for setup guidance and common troubleshooting tips.
                    </p>
                  </div>
                </div>
              )}

              {pageKey === "account" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      What You Can Do in the Subscriber Portal
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>
                        Update your contact details, such as your email or phone
                        number.
                      </li>
                      <li>
                        Change your billing information, including payment
                        methods and billing address.
                      </li>
                      <li>Review and manage your current services.</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Haven't Created an Account Yet?
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {replaceTemplateVariables(
                        "If you signed up for the free in-home installation promotion but haven't yet received an update from us, please reach out to our support team at help@{{company.domain}} to check the status of your fiber connection and for any other assistance.",
                        content,
                      )}
                    </p>
                  </div>
                </div>
              )}

              {pageKey === "billing" && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Managing Your Billing & Payments
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Customers can manage their subscriptions, billing, and
                      payments through the Orangeburg Fiber Subscriber Portal.
                      In the portal, you can easily:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Change your payment method.</li>
                      <li>
                        Subscribe or unsubscribe from services on the Services
                        page.
                      </li>
                      <li>
                        Download your monthly invoice from the Billing page.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Billing Cycle
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      All subscriptions are billed monthly, starting from the
                      day you choose the service.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Need Assistance?
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      If you have any billing-related questions or require
                      further help, please contact our support team. We're here
                      to assist with any inquiries.
                    </p>
                  </div>
                </div>
              )}

              {pageKey === "troubleshooting" && (
                <div className="space-y-8">
                  {/* Check LED Indicators */}
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      1. Check the LED Indicators
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>
                        <strong>Wi-Fi Light:</strong> Off = Wi-Fi is disabled.
                        Try restarting the device or ensure Wi-Fi is turned on.
                      </li>
                      <li>
                        <strong>Internet Light:</strong> Off = No internet
                        connection. Check your ISP line or restart the device.
                      </li>
                      <li>
                        <strong>System Light:</strong> Off = Device is still
                        booting. Wait or restart if delayed.
                      </li>
                      <li>
                        <strong>Power Light:</strong> Off = Ensure the device is
                        plugged in and turned on.
                      </li>
                    </ul>
                  </div>

                  {/* Restart the Device */}
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      2. Restart the Device
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Turn off using the power button.</li>
                      <li>Wait 30 seconds.</li>
                      <li>Turn it back on.</li>
                      <li>
                        Confirm cables are secure and the device has proper
                        ventilation.
                      </li>
                    </ul>
                  </div>

                  {/* Check Internet Connectivity */}
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      3. Check Internet Connectivity
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>
                        Ensure Ethernet from fiber termination box is in the WAN
                        port of the D50.
                      </li>
                      <li>
                        If still no connection, reset your internet via the
                        Subscriber Portal.
                      </li>
                    </ul>
                  </div>

                  {/* Reconfigure the Device */}
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      4. Reconfigure the Device
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Connect to Wi-Fi using the label credentials.</li>
                      <li>
                        Or connect via LAN and go to 172.30.55.1 in a browser.
                      </li>
                      <li>Login using the default username and password.</li>
                    </ul>
                  </div>

                  {/* Mesh Network Troubleshooting */}
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      5. Mesh Network Troubleshooting
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Blinking red mesh light = pairing failed.</li>
                      <li>Hold Pair button for 5–10 seconds to retry.</li>
                    </ul>
                  </div>

                  {/* Reset to Factory Settings */}
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      6. Reset to Factory Settings
                    </h2>
                    <p className="text-muted-foreground leading-relaxed ml-4">
                      Hold the Reset button for 10 seconds to restore factory
                      settings.
                    </p>
                  </div>

                  {/* Contact Support */}
                  <div className="space-y-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      7. Contact Support
                    </h2>
                    <p className="text-muted-foreground leading-relaxed ml-4">
                      Still having trouble? Reach out to your internet service
                      provider's support team.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Custom content from children */}
            {children}
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      {subpage.cta_buttons && subpage.cta_buttons.length > 0 && (
        <div className="bg-muted/40 py-12 px-4">
          <div className="container mx-auto text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {subpage.cta_buttons.map((button, index) => (
                <Button
                  key={index}
                  asChild
                  variant={index === 0 ? "default" : "outline"}
                  size="lg"
                >
                  {button.link.startsWith("/") &&
                  button.link.endsWith(".pdf") ? (
                    <a
                      href={button.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      {button.text}
                    </a>
                  ) : (
                    <Link to={button.link}>{button.text}</Link>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact CTA */}
      <div className="border-t py-8 px-4">
        <div className="container mx-auto text-center">
          <p
            className="text-muted-foreground mb-4"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            Need more help?
          </p>
          <Button asChild variant="outline">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupportPageTemplate;
