import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "../lib/contentLoader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  MapPin,
  Search,
  Wifi,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import MapSection from "../components/MapSection";

// Address Lists for Service Area Checking
const IN_SERVICE_ADDRESSES = [
  "123 Main Street, Orangeburg, SC 29115",
  "456 Russell Street, Orangeburg, SC 29115",
  "789 Chestnut Street, Orangeburg, SC 29115",
  "321 Boulevard Street, Orangeburg, SC 29115",
  "555 Oak Avenue, Orangeburg, SC 29115",
  "777 Pine Street, Orangeburg, SC 29115",
  "999 Elm Drive, Orangeburg, SC 29115",
  "111 Maple Lane, Orangeburg, SC 29115",
  "222 Cedar Court, Orangeburg, SC 29115",
  "333 Birch Road, Orangeburg, SC 29115",
];

const FUTURE_SERVICE_ADDRESSES = [
  "100 Future Lane, Orangeburg, SC 29115",
  "200 Coming Soon Street, Orangeburg, SC 29115",
  "300 Phase Two Avenue, Orangeburg, SC 29115",
  "400 Planned Drive, Orangeburg, SC 29115",
  "500 Expansion Road, Orangeburg, SC 29115",
  "600 Development Circle, Orangeburg, SC 29115",
  "700 Rollout Boulevard, Orangeburg, SC 29115",
  "800 Next Phase Way, Orangeburg, SC 29115",
];

type AddressMatchResult = "in-service" | "future-service" | "no-match";

const CheckAvailability: React.FC = () => {
  const { content } = useContent();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [showFutureServiceModal, setShowFutureServiceModal] = useState(false);
  const [showNoServiceModal, setShowNoServiceModal] = useState(false);
  const [isSubmittingNotification, setIsSubmittingNotification] =
    useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Function to check address against both lists
  const checkAddressAvailability = (
    inputAddress: string,
  ): AddressMatchResult => {
    const normalizedInput = inputAddress.toLowerCase().trim();

    // Check for exact or partial matches in in-service addresses
    const inServiceMatch = IN_SERVICE_ADDRESSES.some((addr) => {
      const normalizedAddr = addr.toLowerCase();
      return (
        normalizedAddr.includes(normalizedInput) ||
        normalizedInput.includes(normalizedAddr) ||
        // Check for street number and street name matches
        normalizedInput.split(",")[0] === normalizedAddr.split(",")[0]
      );
    });

    if (inServiceMatch) {
      return "in-service";
    }

    // Check for matches in future service addresses
    const futureServiceMatch = FUTURE_SERVICE_ADDRESSES.some((addr) => {
      const normalizedAddr = addr.toLowerCase();
      return (
        normalizedAddr.includes(normalizedInput) ||
        normalizedInput.includes(normalizedAddr) ||
        normalizedInput.split(",")[0] === normalizedAddr.split(",")[0]
      );
    });

    if (futureServiceMatch) {
      return "future-service";
    }

    return "no-match";
  };

  // Function to generate address suggestions for autocomplete
  const generateAddressSuggestions = (input: string) => {
    if (input.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const allAddresses = [...IN_SERVICE_ADDRESSES, ...FUTURE_SERVICE_ADDRESSES];
    const suggestions = allAddresses
      .filter((addr) => addr.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);

    setAddressSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    generateAddressSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setAddress(suggestion);
    setShowSuggestions(false);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);

    if (!address.trim() || !name.trim() || !phone.trim() || !email.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    const matchResult = checkAddressAvailability(address);

    switch (matchResult) {
      case "in-service":
        // Redirect to sign-up page immediately
        navigate("/signup-flow", {
          state: {
            userData: {
              name,
              email,
              phone,
              address,
            },
          },
        });
        break;

      case "future-service":
        // Show future service modal
        setShowFutureServiceModal(true);
        break;

      case "no-match":
        // Show no service modal
        setShowNoServiceModal(true);
        break;
    }
  };

  const handleNotificationSignup = async (
    modalType: "future" | "no-service",
  ) => {
    if (!notificationEmail.trim()) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsSubmittingNotification(true);

    try {
      // Simulate API call to save email for notifications
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real implementation, this would call your backend API
      console.log(
        `Email notification signup: ${notificationEmail} for ${modalType} service`,
      );

      alert(
        "Thank you! We'll notify you when service becomes available in your area.",
      );

      // Close modals and reset form
      setShowFutureServiceModal(false);
      setShowNoServiceModal(false);
      setNotificationEmail("");
    } catch (error) {
      alert(
        "There was an error signing up for notifications. Please try again.",
      );
    } finally {
      setIsSubmittingNotification(false);
    }
  };

  return (
    <div className="bg-background dark:bg-dark-bg-primary min-h-screen">
      {/* Hero Section */}
      <div className="relative py-24 px-4 bg-brand-secondary dark:bg-dark-bg-secondary">
        <div className="container mx-auto text-center text-gray-800 dark:text-dark-text-primary">
          <h1 className="text-5xl font-bold tracking-tight mb-6 dark:text-white">
            {content.check_availability_page.title}
          </h1>
          <div className="text-xl max-w-3xl mx-auto dark:text-white whitespace-pre-line">
            {content.check_availability_page.description}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Address Search Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="shadow-lg dark:bg-dark-bg-card dark:border-dark-border">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-foreground dark:text-dark-text-primary">
                Check Service Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground dark:text-dark-text-primary">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground dark:text-dark-text-primary">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground dark:text-dark-text-primary">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground dark:text-dark-text-primary">
                    Service Address *
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        placeholder="123 Main Street, City, State ZIP"
                        value={address}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        onFocus={() => generateAddressSuggestions(address)}
                        onBlur={() =>
                          setTimeout(() => setShowSuggestions(false), 200)
                        }
                        required
                        autoComplete="off"
                      />
                      {/* Address Suggestions Dropdown */}
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {addressSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>{suggestion}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button type="submit" size="lg" className="px-8">
                      <Search className="h-5 w-5 mr-2" />
                      Check Availability
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text-primary">
              Service Coverage Map
            </h2>
            <p className="text-lg text-muted-foreground dark:text-dark-text-secondary max-w-3xl mx-auto">
              Explore our fiber network coverage in{" "}
              {content.plans_page.city_name}. Green areas show current
              availability, while yellow areas indicate upcoming service.
            </p>
          </div>
          <MapSection address={address} />
        </div>

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="dark:bg-dark-bg-card dark:border-dark-border">
              <CardHeader>
                <CardTitle className="text-foreground dark:text-dark-text-primary">
                  Service Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-foreground dark:text-dark-text-primary">
                      Available Now
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-foreground dark:text-dark-text-primary">
                      Coming Soon
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <span className="text-foreground dark:text-dark-text-primary">
                      Future Expansion
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-dark-bg-card dark:border-dark-border">
              <CardHeader>
                <CardTitle className="text-foreground dark:text-dark-text-primary">
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground dark:text-dark-text-secondary mb-4">
                  Can't find your address or have questions about service
                  availability?
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Call:</strong> {content.company.contact.phone}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {content.company.contact.email}
                  </p>
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Future Service Modal */}
      <Dialog
        open={showFutureServiceModal}
        onOpenChange={setShowFutureServiceModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-3 mb-4">
              <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <DialogTitle className="text-xl">
                Coming Soon to Your Area!
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              We're not in your area yet, but we're coming soon! Your location
              is part of our Phase 2 rollout. Enter your email below to get
              notified when service becomes available.
            </p>
            <div className="space-y-2">
              <Label htmlFor="future-email">Email Address</Label>
              <Input
                id="future-email"
                type="email"
                placeholder="your@email.com"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowFutureServiceModal(false);
                setNotificationEmail("");
              }}
              className="w-full sm:w-auto"
            >
              Maybe Later
            </Button>
            <Button
              onClick={() => handleNotificationSignup("future")}
              disabled={isSubmittingNotification}
              className="w-full sm:w-auto"
            >
              {isSubmittingNotification ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing Up...
                </>
              ) : (
                "Notify Me"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* No Service Modal */}
      <Dialog open={showNoServiceModal} onOpenChange={setShowNoServiceModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-3 mb-4">
              <div className="rounded-full p-2 bg-red-100 dark:bg-red-900">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle className="text-xl">Not in Service Area</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Unfortunately, your address is currently outside of our service
              area.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your email to be notified if coverage becomes available in
              your area.
            </p>
            <div className="space-y-2">
              <Label htmlFor="no-service-email">Email Address</Label>
              <Input
                id="no-service-email"
                type="email"
                placeholder="your@email.com"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowNoServiceModal(false);
                setNotificationEmail("");
              }}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button
              onClick={() => handleNotificationSignup("no-service")}
              disabled={isSubmittingNotification}
              className="w-full sm:w-auto"
            >
              {isSubmittingNotification ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing Up...
                </>
              ) : (
                "Notify Me"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckAvailability;
