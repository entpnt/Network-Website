import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "../lib/contentLoader";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Search,
  Grid3X3,
  List,
  Wifi,
  Download,
  Upload,
  Eye,
  ChevronRight,
  Zap,
  Shield,
  Tv,
  Phone,
  Globe,
  X,
  ExternalLink,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";

interface ServicePlan {
  id: string;
  name: string;
  provider: string;
  category: "Internet" | "TV" | "Phone" | "Bundle";
  downloadSpeed: number;
  uploadSpeed: number;
  monthlyPrice: number;
  speedTier: "Fast" | "Super Fast" | "Ultra Fast";
  isPrivate?: boolean;
  features: string[];
  logo: string;
  description?: string;
  broadbandLabel?: BroadbandLabel;
}

interface BroadbandLabel {
  // Speeds
  typicalDownloadSpeed: number;
  typicalUploadSpeed: number;
  typicalLatency: number;
  networkPerformanceUrl: string;

  // Pricing
  monthlyPrice: number;
  isIntroductoryRate: boolean;
  introRateDuration?: number; // months
  priceAfterIntro?: number;
  contractLength?: number; // months
  earlyTerminationFee?: number;

  // Additional Fees
  providerMonthlyFees: Array<{ description: string; amount: number }>;
  oneTimeFees: Array<{ description: string; amount: number }>;
  governmentTaxes: string;

  // Data
  dataAllowance: string; // e.g., "Unlimited" or "1TB"
  overageCharges?: string;

  // Support & Legal
  customerSupportPhone: string;
  websiteUrl: string;
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
  networkManagementUrl: string;

  // Additional Info
  uniquePlanId: string;
  discountsUrl?: string;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  provider: string;
  category: "VoIP" | "Equipment" | "Support" | "Security";
}

interface SelectedAddOn extends AddOn {
  quantity: number;
}

const Marketplace: React.FC = () => {
  const { content } = useContent();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("All Providers");
  const [selectedSpeed, setSelectedSpeed] = useState("All Speeds");
  const [sortBy, setSortBy] = useState("Price: Low to High");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [privateAccessCode, setPrivateAccessCode] = useState("");
  const [showPrivatePlans, setShowPrivatePlans] = useState(false);
  const [selectedPlanForLabel, setSelectedPlanForLabel] =
    useState<ServicePlan | null>(null);
  const [showBroadbandLabel, setShowBroadbandLabel] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] =
    useState<ServicePlan | null>(null);
  const [showPlanSelectionModal, setShowPlanSelectionModal] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    zipCode: "",
    nameOnCard: "",
  });

  // Mock add-ons data
  const availableAddOns: AddOn[] = [
    {
      id: "voip-basic",
      name: "VoIP Phone Lines",
      description: "Basic phone service with unlimited local calling",
      monthlyPrice: 15.99,
      provider: "Noodle Fiber",
      category: "VoIP",
    },
    {
      id: "voip-premium",
      name: "Premium VoIP Package",
      description: "Advanced phone features with international calling",
      monthlyPrice: 29.99,
      provider: "Noodle Fiber",
      category: "VoIP",
    },
    {
      id: "wifi-extender",
      name: "WiFi Range Extender",
      description: "Extend your WiFi coverage throughout your home",
      monthlyPrice: 9.99,
      provider: "Noodle Fiber",
      category: "Equipment",
    },
    {
      id: "security-basic",
      name: "Basic Security Package",
      description: "Antivirus and firewall protection for your network",
      monthlyPrice: 12.99,
      provider: "Fiddle Faddle Fiber",
      category: "Security",
    },
    {
      id: "tech-support",
      name: "Premium Tech Support",
      description: "24/7 technical support and troubleshooting",
      monthlyPrice: 19.99,
      provider: "Fiddle Faddle Fiber",
      category: "Support",
    },
    {
      id: "mesh-router",
      name: "Mesh Router System",
      description: "Professional mesh network for optimal coverage",
      monthlyPrice: 14.99,
      provider: "Fiddunk Fiber",
      category: "Equipment",
    },
  ];

  // Mock service plans data
  const servicePlans: ServicePlan[] = [
    {
      id: "basic-internet",
      name: "Basic Internet",
      provider: "Noodle Fiber",
      category: "Internet",
      downloadSpeed: 100,
      uploadSpeed: 20,
      monthlyPrice: 49.99,
      speedTier: "Fast",
      features: ["Unlimited data", "No contract", "Free installation"],
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80",
      broadbandLabel: {
        typicalDownloadSpeed: 100,
        typicalUploadSpeed: 20,
        typicalLatency: 15,
        networkPerformanceUrl:
          "https://www.noodlefiber.com/network-performance",
        monthlyPrice: 49.99,
        isIntroductoryRate: true,
        introRateDuration: 12,
        priceAfterIntro: 59.99,
        contractLength: 0,
        earlyTerminationFee: 0,
        providerMonthlyFees: [
          { description: "Modem Rental", amount: 10.0 },
          { description: "Wi-Fi Router Rental", amount: 5.0 },
        ],
        oneTimeFees: [
          { description: "Installation Fee", amount: 99.99 },
          { description: "Activation Fee", amount: 25.0 },
        ],
        governmentTaxes: "Varies by Location",
        dataAllowance: "Unlimited",
        overageCharges: "N/A",
        customerSupportPhone: "(555) 123-4567",
        websiteUrl: "https://www.noodlefiber.com",
        termsOfServiceUrl: "https://www.noodlefiber.com/terms",
        privacyPolicyUrl: "https://www.noodlefiber.com/privacy",
        networkManagementUrl: "https://www.noodlefiber.com/network-management",
        uniquePlanId: "NF001-BASIC-100",
        discountsUrl: "https://www.noodlefiber.com/discounts",
      },
    },
    {
      id: "basic-fiber",
      name: "Basic Fiber",
      provider: "Fiddle Faddle Fiber",
      category: "Internet",
      downloadSpeed: 250,
      uploadSpeed: 50,
      monthlyPrice: 59.99,
      speedTier: "Super Fast",
      features: ["Fiber optic", "Symmetrical speeds", "24/7 support"],
      logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&q=80",
      broadbandLabel: {
        typicalDownloadSpeed: 250,
        typicalUploadSpeed: 50,
        typicalLatency: 8,
        networkPerformanceUrl: "https://www.fiddlefaddlefiber.com/performance",
        monthlyPrice: 59.99,
        isIntroductoryRate: false,
        contractLength: 24,
        earlyTerminationFee: 200,
        providerMonthlyFees: [
          { description: "Equipment Rental", amount: 12.0 },
        ],
        oneTimeFees: [
          { description: "Professional Installation", amount: 150.0 },
        ],
        governmentTaxes: "Included",
        dataAllowance: "Unlimited",
        customerSupportPhone: "(555) 987-6543",
        websiteUrl: "https://www.fiddlefaddlefiber.com",
        termsOfServiceUrl: "https://www.fiddlefaddlefiber.com/terms",
        privacyPolicyUrl: "https://www.fiddlefaddlefiber.com/privacy",
        networkManagementUrl:
          "https://www.fiddlefaddlefiber.com/network-policy",
        uniquePlanId: "FFF002-BASIC-250",
      },
    },
    {
      id: "family-plan",
      name: "Family Plan",
      provider: "Fiddunk Fiber",
      category: "Internet",
      downloadSpeed: 300,
      uploadSpeed: 50,
      monthlyPrice: 69.99,
      speedTier: "Super Fast",
      features: ["Family friendly", "Parental controls", "Multiple devices"],
      logo: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=100&q=80",
      broadbandLabel: {
        typicalDownloadSpeed: 300,
        typicalUploadSpeed: 50,
        typicalLatency: 12,
        networkPerformanceUrl: "https://www.fiddunkfiber.com/network-info",
        monthlyPrice: 69.99,
        isIntroductoryRate: true,
        introRateDuration: 6,
        priceAfterIntro: 79.99,
        contractLength: 12,
        earlyTerminationFee: 150,
        providerMonthlyFees: [
          { description: "Parental Control Service", amount: 5.0 },
          { description: "Equipment Fee", amount: 8.0 },
        ],
        oneTimeFees: [{ description: "Setup Fee", amount: 75.0 }],
        governmentTaxes: "$3.50/month",
        dataAllowance: "Unlimited",
        customerSupportPhone: "(555) 456-7890",
        websiteUrl: "https://www.fiddunkfiber.com",
        termsOfServiceUrl: "https://www.fiddunkfiber.com/terms",
        privacyPolicyUrl: "https://www.fiddunkfiber.com/privacy",
        networkManagementUrl: "https://www.fiddunkfiber.com/network-management",
        uniquePlanId: "FF003-FAMILY-300",
        discountsUrl: "https://www.fiddunkfiber.com/family-discounts",
      },
    },
    {
      id: "premium-internet",
      name: "Premium Internet",
      provider: "Noodle Fiber",
      category: "Internet",
      downloadSpeed: 500,
      uploadSpeed: 100,
      monthlyPrice: 79.99,
      speedTier: "Ultra Fast",
      features: ["Premium speeds", "Priority support", "Advanced security"],
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80",
    },
    {
      id: "gigabit-internet",
      name: "Gigabit Internet",
      provider: "Zoolink Fiber",
      category: "Internet",
      downloadSpeed: 1000,
      uploadSpeed: 200,
      monthlyPrice: 99.99,
      speedTier: "Ultra Fast",
      features: ["Gigabit speeds", "Business grade", "Static IP available"],
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&q=80",
    },
    {
      id: "business-pro",
      name: "Business Pro",
      provider: "Fiddle Faddle Fiber",
      category: "Internet",
      downloadSpeed: 750,
      uploadSpeed: 150,
      monthlyPrice: 129.99,
      speedTier: "Ultra Fast",
      features: ["Business grade", "SLA guarantee", "Dedicated support"],
      logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&q=80",
    },
  ];

  const providers = Array.from(
    new Set(servicePlans.map((plan) => plan.provider)),
  );
  const speedTiers = ["Fast", "Super Fast", "Ultra Fast"];

  const filteredPlans = useMemo(() => {
    let filtered = servicePlans.filter((plan) => {
      const matchesSearch =
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.provider.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvider =
        selectedProvider === "All Providers" ||
        plan.provider === selectedProvider;
      const matchesSpeed =
        selectedSpeed === "All Speeds" || plan.speedTier === selectedSpeed;

      return matchesSearch && matchesProvider && matchesSpeed;
    });

    // Sort plans
    switch (sortBy) {
      case "Price: Low to High":
        filtered.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
        break;
      case "Price: High to Low":
        filtered.sort((a, b) => b.monthlyPrice - a.monthlyPrice);
        break;
      case "Speed: Fastest First":
        filtered.sort((a, b) => b.downloadSpeed - a.downloadSpeed);
        break;
      default:
        break;
    }

    return filtered;
  }, [servicePlans, searchTerm, selectedProvider, selectedSpeed, sortBy]);

  const handlePrivateAccessSubmit = () => {
    // Mock validation - in real app this would validate against backend
    if (privateAccessCode.toLowerCase() === "exclusive") {
      setShowPrivatePlans(true);
    } else {
      alert("Invalid access code. Try 'exclusive' for demo.");
    }
  };

  const handleSelectPlan = (planId: string) => {
    const plan = servicePlans.find((p) => p.id === planId);
    if (plan) {
      setSelectedPlanForModal(plan);
      setSelectedAddOns([]);
      setShowPlanSelectionModal(true);
    }
  };

  const handleAddOnQuantityChange = (addOnId: string, change: number) => {
    setSelectedAddOns((prev) => {
      const existing = prev.find((item) => item.id === addOnId);
      if (existing) {
        const newQuantity = Math.max(0, existing.quantity + change);
        if (newQuantity === 0) {
          return prev.filter((item) => item.id !== addOnId);
        }
        return prev.map((item) =>
          item.id === addOnId ? { ...item, quantity: newQuantity } : item,
        );
      } else if (change > 0) {
        const addOn = availableAddOns.find((a) => a.id === addOnId);
        if (addOn) {
          return [...prev, { ...addOn, quantity: 1 }];
        }
      }
      return prev;
    });
  };

  const getAddOnQuantity = (addOnId: string) => {
    const addOn = selectedAddOns.find((item) => item.id === addOnId);
    return addOn ? addOn.quantity : 0;
  };

  const calculateTotalPrice = () => {
    if (!selectedPlanForModal) return 0;
    const planPrice = selectedPlanForModal.monthlyPrice;
    const addOnsPrice = selectedAddOns.reduce(
      (total, addOn) => total + addOn.monthlyPrice * addOn.quantity,
      0,
    );
    return planPrice + addOnsPrice;
  };

  const handleContinueToCheckout = () => {
    if (!selectedPlanForModal) return;
    setShowCheckoutModal(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForModal) return;

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate

      if (isSuccess) {
        // Store subscription data in localStorage for demo
        const subscriptionData = {
          plan: selectedPlanForModal,
          addOns: selectedAddOns,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(
          "newSubscription",
          JSON.stringify(subscriptionData),
        );

        // Close modals and navigate
        setShowCheckoutModal(false);
        setShowPlanSelectionModal(false);
        navigate("/my-services?checkout_success=true");
      } else {
        throw new Error(
          "Payment failed. Please check your payment information and try again.",
        );
      }
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again.",
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentFormChange = (field: string, value: string) => {
    setPaymentForm((prev) => ({ ...prev, [field]: value }));
  };

  const closePlanSelectionModal = () => {
    setShowPlanSelectionModal(false);
    setSelectedPlanForModal(null);
    setSelectedAddOns([]);
  };

  const closeCheckoutModal = () => {
    setShowCheckoutModal(false);
    setPaymentError(null);
    setPaymentForm({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      zipCode: "",
      nameOnCard: "",
    });
  };

  const handleViewLabel = (plan: ServicePlan) => {
    setSelectedPlanForLabel(plan);
    setShowBroadbandLabel(true);
  };

  const closeBroadbandLabel = () => {
    setShowBroadbandLabel(false);
    setSelectedPlanForLabel(null);
  };

  const getSpeedTierColor = (tier: string) => {
    switch (tier) {
      case "Fast":
        return "bg-green-500 text-white";
      case "Super Fast":
        return "bg-blue-500 text-white";
      case "Ultra Fast":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const ServiceCard = ({ plan }: { plan: ServicePlan }) => (
    <Card className="relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow font-sans">
      <CardContent className="p-6">
        {/* Top Section */}
        <div className="relative mb-6">
          {/* Speed Tier Badge - Top Right */}
          <div className="absolute top-0 right-0">
            <Badge
              className={`text-xs px-3 py-1 rounded-full font-medium ${getSpeedTierColor(plan.speedTier)}`}
            >
              {plan.speedTier}
            </Badge>
          </div>

          {/* ISP Logo and Service Info - Left Side */}
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">
              {plan.provider.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-gray-500 font-normal">
                {plan.provider}
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section - Service Details */}
        <div className="mb-6">
          {/* Speed Information - Two Columns */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Download Speed</div>
              <div className="text-lg font-bold text-gray-900">
                {plan.downloadSpeed} Mbps
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Upload Speed</div>
              <div className="text-lg font-bold text-gray-900">
                {plan.uploadSpeed} Mbps
              </div>
            </div>
          </div>

          {/* Monthly Price - Bottom Left */}
          <div>
            <div className="text-sm text-gray-500 mb-1">Monthly</div>
            <div className="text-2xl font-bold text-gray-900">
              ${plan.monthlyPrice}
            </div>
          </div>
        </div>

        {/* Bottom Section - Call to Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md px-3 py-2 font-medium"
            onClick={() => handleViewLabel(plan)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Label
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-md px-4 py-2"
            onClick={() => handleSelectPlan(plan.id)}
          >
            Subscribe
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ServiceListCard = ({ plan }: { plan: ServicePlan }) => (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow font-sans">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Left Section - Service Overview */}
          <div className="flex items-center space-x-4">
            {/* ISP Logo/Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {plan.provider.charAt(0)}
            </div>

            {/* Service Name and Provider */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3">
                <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
                {/* Speed Badge */}
                <Badge
                  className={`text-xs px-3 py-1 rounded-full font-medium ${getSpeedTierColor(plan.speedTier)}`}
                >
                  {plan.speedTier}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 font-normal mt-1">
                {plan.provider}
              </p>
            </div>
          </div>

          {/* Center Section - Service Specs */}
          <div className="flex items-center space-x-8">
            {/* Download Speed */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Down</div>
              <div className="font-bold text-lg text-gray-900">
                {plan.downloadSpeed}
              </div>
              <div className="text-sm text-gray-500">Mbps</div>
            </div>

            {/* Upload Speed */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Up</div>
              <div className="font-bold text-lg text-gray-900">
                {plan.uploadSpeed}
              </div>
              <div className="text-sm text-gray-500">Mbps</div>
            </div>

            {/* Price */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Price</div>
              <div className="font-bold text-lg text-gray-900">
                ${plan.monthlyPrice}
              </div>
              <div className="text-sm text-gray-500">/mo</div>
            </div>
          </div>

          {/* Right Section - Call to Actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md px-4 py-2 font-medium"
              onClick={() => handleViewLabel(plan)}
            >
              Label
            </Button>
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-md px-6 py-2"
              onClick={() => handleSelectPlan(plan.id)}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Marketplace</h1>
              <h2 className="text-xl font-semibold mt-2">
                Find Your Perfect Internet Plan
              </h2>
              <p className="text-muted-foreground mt-1">
                Browse and compare internet service plans from top providers.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/my-services")}>
                My Services
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Private Access Code Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Have a private access code? Enter it here to view exclusive plans:
            </p>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter access code"
                value={privateAccessCode}
                onChange={(e) => setPrivateAccessCode(e.target.value)}
                className="w-40"
              />
              <Button
                size="sm"
                onClick={handlePrivateAccessSubmit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plans or providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Providers">All Providers</SelectItem>
              {providers.map((provider) => (
                <SelectItem key={provider} value={provider}>
                  {provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSpeed} onValueChange={setSelectedSpeed}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Speeds">All Speeds</SelectItem>
              {speedTiers.map((tier) => (
                <SelectItem key={tier} value={tier}>
                  {tier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Price: Low to High">
                Price: Low to High
              </SelectItem>
              <SelectItem value="Price: High to Low">
                Price: High to Low
              </SelectItem>
              <SelectItem value="Speed: Fastest First">
                Speed: Fastest First
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle and Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Grid View
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 mr-1" />
              List View
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredPlans.length} plans
          </p>
        </div>

        {/* Service Plans Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.map((plan) => (
              <ServiceCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlans.map((plan) => (
              <ServiceListCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No plans found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {/* Plan Selection Modal */}
        <Dialog
          open={showPlanSelectionModal}
          onOpenChange={setShowPlanSelectionModal}
        >
          <DialogContent className="max-w-4xl w-full max-h-[95vh] overflow-hidden p-0 flex flex-col">
            {selectedPlanForModal && (
              <>
                {/* Fixed Header */}
                <div className="flex-shrink-0 bg-white border-b p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        Complete Your Order
                      </h2>
                      <p className="text-gray-600">
                        Review your plan selection and add any optional services
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closePlanSelectionModal}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Plan Summary & Add-ons */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Plan Summary */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                          <Wifi className="h-5 w-5 mr-2" />
                          Selected Plan
                        </h3>
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {selectedPlanForModal.provider.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">
                              {selectedPlanForModal.name}
                            </h4>
                            <p className="text-gray-600 mb-3">
                              {selectedPlanForModal.provider}
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <span className="text-sm text-gray-500">
                                  Download Speed
                                </span>
                                <p className="font-semibold">
                                  {selectedPlanForModal.downloadSpeed} Mbps
                                </p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">
                                  Upload Speed
                                </span>
                                <p className="font-semibold">
                                  {selectedPlanForModal.uploadSpeed} Mbps
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-gray-900">
                                ${selectedPlanForModal.monthlyPrice.toFixed(2)}
                                /month
                              </span>
                              {selectedPlanForModal.broadbandLabel && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleViewLabel(selectedPlanForModal)
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Label
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Available Add-ons */}
                      <div>
                        <h3 className="text-xl font-bold mb-4">
                          Available Add-ons
                        </h3>
                        <div className="space-y-4">
                          {availableAddOns
                            .filter(
                              (addOn) =>
                                addOn.provider ===
                                selectedPlanForModal.provider,
                            )
                            .map((addOn) => {
                              const quantity = getAddOnQuantity(addOn.id);
                              return (
                                <div
                                  key={addOn.id}
                                  className="border rounded-lg p-4 flex items-center justify-between"
                                >
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                      {addOn.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {addOn.description}
                                    </p>
                                    <span className="text-lg font-bold text-gray-900">
                                      ${addOn.monthlyPrice.toFixed(2)}/month
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3 ml-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleAddOnQuantityChange(addOn.id, -1)
                                      }
                                      disabled={quantity === 0}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center font-semibold">
                                      {quantity}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleAddOnQuantityChange(addOn.id, 1)
                                      }
                                      className="h-8 w-8 p-0"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        {availableAddOns.filter(
                          (addOn) =>
                            addOn.provider === selectedPlanForModal.provider,
                        ).length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <p>No add-ons available for this provider.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 rounded-lg p-6 sticky top-0">
                        <h3 className="text-xl font-bold mb-4">
                          Order Summary
                        </h3>

                        {/* Plan */}
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">
                                {selectedPlanForModal.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {selectedPlanForModal.provider}
                              </p>
                            </div>
                            <span className="font-semibold">
                              ${selectedPlanForModal.monthlyPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Add-ons */}
                        {selectedAddOns.length > 0 && (
                          <>
                            <hr className="my-4" />
                            <div className="space-y-3 mb-4">
                              <h4 className="font-medium text-gray-900">
                                Add-ons
                              </h4>
                              {selectedAddOns.map((addOn) => (
                                <div
                                  key={addOn.id}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <div>
                                    <p className="text-gray-900">
                                      {addOn.name} ×{addOn.quantity}
                                    </p>
                                  </div>
                                  <span className="font-medium">
                                    $
                                    {(
                                      addOn.monthlyPrice * addOn.quantity
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Total */}
                        <hr className="my-4" />
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-lg font-bold text-gray-900">
                            Total Monthly
                          </span>
                          <span className="text-2xl font-bold text-gray-900">
                            ${calculateTotalPrice().toFixed(2)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <Button
                            onClick={handleContinueToCheckout}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 h-auto"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Continue to Checkout
                          </Button>
                          <Button
                            variant="outline"
                            onClick={closePlanSelectionModal}
                            className="w-full"
                          >
                            Cancel
                          </Button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-4 text-xs text-gray-500">
                          <p>• No setup fees or contracts</p>
                          <p>• Cancel anytime</p>
                          <p>• 30-day money-back guarantee</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Checkout Modal */}
        <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
          <DialogContent className="max-w-2xl w-full max-h-[95vh] overflow-hidden p-0 flex flex-col">
            {selectedPlanForModal && (
              <>
                {/* Fixed Header */}
                <div className="flex-shrink-0 bg-white border-b p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        Complete Your Payment
                      </h2>
                      <p className="text-gray-600">
                        Enter your payment information to complete your
                        subscription
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeCheckoutModal}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Payment Form */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold mb-4">
                          Payment Information
                        </h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                i
                              </span>
                            </div>
                            <span className="text-sm font-medium text-blue-800">
                              Stripe Integration Placeholder
                            </span>
                          </div>
                          <p className="text-sm text-blue-700">
                            This is a demo form. In production, this will be
                            replaced with Stripe Elements for secure payment
                            processing.
                          </p>
                        </div>

                        {paymentError && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  !
                                </span>
                              </div>
                              <span className="text-sm font-medium text-red-800">
                                Payment Error
                              </span>
                            </div>
                            <p className="text-sm text-red-700 mt-1">
                              {paymentError}
                            </p>
                          </div>
                        )}

                        <form
                          onSubmit={handlePaymentSubmit}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Name on Card
                            </label>
                            <Input
                              type="text"
                              value={paymentForm.nameOnCard}
                              onChange={(e) =>
                                handlePaymentFormChange(
                                  "nameOnCard",
                                  e.target.value,
                                )
                              }
                              placeholder="John Doe"
                              required
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Card Number
                            </label>
                            <Input
                              type="text"
                              value={paymentForm.cardNumber}
                              onChange={(e) =>
                                handlePaymentFormChange(
                                  "cardNumber",
                                  e.target.value,
                                )
                              }
                              placeholder="1234 5678 9012 3456"
                              required
                              className="w-full"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry Date
                              </label>
                              <Input
                                type="text"
                                value={paymentForm.expiryDate}
                                onChange={(e) =>
                                  handlePaymentFormChange(
                                    "expiryDate",
                                    e.target.value,
                                  )
                                }
                                placeholder="MM/YY"
                                required
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVV
                              </label>
                              <Input
                                type="text"
                                value={paymentForm.cvv}
                                onChange={(e) =>
                                  handlePaymentFormChange("cvv", e.target.value)
                                }
                                placeholder="123"
                                required
                                className="w-full"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ZIP Code
                            </label>
                            <Input
                              type="text"
                              value={paymentForm.zipCode}
                              onChange={(e) =>
                                handlePaymentFormChange(
                                  "zipCode",
                                  e.target.value,
                                )
                              }
                              placeholder="12345"
                              required
                              className="w-full"
                            />
                          </div>

                          <div className="pt-4">
                            <Button
                              type="submit"
                              disabled={isProcessingPayment}
                              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 h-auto"
                            >
                              {isProcessingPayment ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Processing Payment...
                                </>
                              ) : (
                                <>
                                  Complete Payment - $
                                  {calculateTotalPrice().toFixed(2)}
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 rounded-lg p-6 sticky top-0">
                        <h3 className="text-xl font-bold mb-4">
                          Order Summary
                        </h3>

                        {/* Plan */}
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">
                                {selectedPlanForModal.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {selectedPlanForModal.provider}
                              </p>
                            </div>
                            <span className="font-semibold">
                              ${selectedPlanForModal.monthlyPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Add-ons */}
                        {selectedAddOns.length > 0 && (
                          <>
                            <hr className="my-4" />
                            <div className="space-y-3 mb-4">
                              <h4 className="font-medium text-gray-900">
                                Add-ons
                              </h4>
                              {selectedAddOns.map((addOn) => (
                                <div
                                  key={addOn.id}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <div>
                                    <p className="text-gray-900">
                                      {addOn.name} ×{addOn.quantity}
                                    </p>
                                  </div>
                                  <span className="font-medium">
                                    $
                                    {(
                                      addOn.monthlyPrice * addOn.quantity
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Total */}
                        <hr className="my-4" />
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-lg font-bold text-gray-900">
                            Total Monthly
                          </span>
                          <span className="text-2xl font-bold text-gray-900">
                            ${calculateTotalPrice().toFixed(2)}
                          </span>
                        </div>

                        {/* Security Notice */}
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>🔒 Your payment information is secure</p>
                          <p>• No setup fees or contracts</p>
                          <p>• Cancel anytime</p>
                          <p>• 30-day money-back guarantee</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Broadband Label Modal */}
        <Dialog open={showBroadbandLabel} onOpenChange={setShowBroadbandLabel}>
          <DialogContent className="max-w-2xl w-full max-h-[95vh] h-[95vh] overflow-hidden p-0 flex flex-col">
            {selectedPlanForLabel && (
              <>
                {/* Fixed Header */}
                <div className="flex-shrink-0 bg-white border-b p-6">
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <DialogTitle className="text-2xl font-bold mb-1">
                          Broadband Facts
                        </DialogTitle>
                        <p className="text-lg font-semibold text-gray-700">
                          {selectedPlanForLabel.name} by{" "}
                          {selectedPlanForLabel.provider}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Fixed Broadband Consumer Disclosure
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={closeBroadbandLabel}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </DialogHeader>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  {selectedPlanForLabel.broadbandLabel && (
                    <div className="space-y-6">
                      {/* Monthly Price Section */}
                      <div className="bg-black text-white p-4 -mx-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold">Monthly Price</h3>
                          <span className="text-2xl font-bold">
                            $
                            {selectedPlanForLabel.broadbandLabel.monthlyPrice.toFixed(
                              2,
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Pricing Details */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">
                              This monthly price is an introductory rate
                            </span>
                          </div>
                          <div className="text-right">
                            {selectedPlanForLabel.broadbandLabel
                              .isIntroductoryRate
                              ? "Yes"
                              : "No"}
                          </div>
                        </div>

                        {selectedPlanForLabel.broadbandLabel
                          .isIntroductoryRate && (
                          <>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>Time the introductory rate applies</div>
                              <div className="text-right">
                                {
                                  selectedPlanForLabel.broadbandLabel
                                    .introRateDuration
                                }{" "}
                                months
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                Monthly price after the introductory rate
                              </div>
                              <div className="text-right">
                                $
                                {selectedPlanForLabel.broadbandLabel.priceAfterIntro?.toFixed(
                                  2,
                                )}
                              </div>
                            </div>
                          </>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Length of contract</div>
                          <div className="text-right">
                            {selectedPlanForLabel.broadbandLabel.contractLength
                              ? `${selectedPlanForLabel.broadbandLabel.contractLength} months`
                              : "No contract"}
                          </div>
                        </div>

                        <div className="text-sm">
                          <div className="font-medium mb-1">
                            Link to Terms of Contract
                          </div>
                          <a
                            href={
                              selectedPlanForLabel.broadbandLabel
                                .termsOfServiceUrl
                            }
                            className="text-blue-600 hover:underline flex items-center"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {
                              selectedPlanForLabel.broadbandLabel
                                .termsOfServiceUrl
                            }
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>

                      <hr className="border-gray-300" />

                      {/* Additional Charges & Terms */}
                      <div>
                        <h3 className="text-lg font-bold mb-4">
                          Additional Charges & Terms
                        </h3>

                        {/* Provider Monthly Fees */}
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">
                            Provider Monthly Fees
                          </h4>
                          {selectedPlanForLabel.broadbandLabel.providerMonthlyFees.map(
                            (fee, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-2 gap-4 text-sm mb-1"
                              >
                                <div>{fee.description}</div>
                                <div className="text-right">
                                  ${fee.amount.toFixed(2)}
                                </div>
                              </div>
                            ),
                          )}
                        </div>

                        {/* One-Time Fees */}
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">
                            One-Time Purchase Fees
                          </h4>
                          {selectedPlanForLabel.broadbandLabel.oneTimeFees.map(
                            (fee, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-2 gap-4 text-sm mb-1"
                              >
                                <div>{fee.description}</div>
                                <div className="text-right">
                                  ${fee.amount.toFixed(2)}
                                </div>
                              </div>
                            ),
                          )}
                        </div>

                        {/* Early Termination & Government Taxes */}
                        {selectedPlanForLabel.broadbandLabel
                          .earlyTerminationFee && (
                          <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                            <div className="font-medium">
                              Early Termination Fee
                            </div>
                            <div className="text-right">
                              $
                              {selectedPlanForLabel.broadbandLabel.earlyTerminationFee.toFixed(
                                2,
                              )}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="font-medium">Government Taxes</div>
                          <div className="text-right">
                            {
                              selectedPlanForLabel.broadbandLabel
                                .governmentTaxes
                            }
                          </div>
                        </div>
                      </div>

                      <hr className="border-gray-300" />

                      {/* Discounts & Bundles */}
                      <div>
                        <h3 className="text-lg font-bold mb-3">
                          Discounts & Bundles
                        </h3>
                        <p className="text-sm text-gray-700 mb-3">
                          Visit the link below for available billing discounts
                          and pricing options for broadband service bundled with
                          other services like video, phone, and wireless
                          service, and use of your own equipment.
                        </p>
                        {selectedPlanForLabel.broadbandLabel.discountsUrl && (
                          <a
                            href={
                              selectedPlanForLabel.broadbandLabel.discountsUrl
                            }
                            className="text-blue-600 hover:underline flex items-center text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {selectedPlanForLabel.broadbandLabel.discountsUrl}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>

                      <hr className="border-gray-300" />

                      {/* Speeds Provided with Plan */}
                      <div>
                        <h3 className="text-lg font-bold mb-4">
                          Speeds Provided with Plan
                        </h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm">
                              Typical Download Speed
                            </div>
                            <div className="text-right font-bold">
                              {
                                selectedPlanForLabel.broadbandLabel
                                  .typicalDownloadSpeed
                              }{" "}
                              Mbps
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm">Typical Upload Speed</div>
                            <div className="text-right font-bold">
                              {
                                selectedPlanForLabel.broadbandLabel
                                  .typicalUploadSpeed
                              }{" "}
                              Mbps
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm">Typical Latency</div>
                            <div className="text-right font-bold">
                              {
                                selectedPlanForLabel.broadbandLabel
                                  .typicalLatency
                              }{" "}
                              ms
                            </div>
                          </div>
                        </div>
                      </div>

                      <hr className="border-gray-300" />

                      {/* Data Included */}
                      <div>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <h3 className="text-lg font-bold">
                            Data Included with Monthly Price
                          </h3>
                          <div className="text-right font-bold text-lg">
                            {selectedPlanForLabel.broadbandLabel
                              .dataAllowance === "Unlimited"
                              ? "Unlimited"
                              : selectedPlanForLabel.broadbandLabel
                                  .dataAllowance}
                          </div>
                        </div>
                        {selectedPlanForLabel.broadbandLabel.overageCharges && (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>Charges for Additional Data Usage</div>
                            <div className="text-right">
                              {
                                selectedPlanForLabel.broadbandLabel
                                  .overageCharges
                              }
                            </div>
                          </div>
                        )}
                        <div className="mt-2">
                          <a
                            href={
                              selectedPlanForLabel.broadbandLabel
                                .networkPerformanceUrl
                            }
                            className="text-blue-600 hover:underline flex items-center text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {
                              selectedPlanForLabel.broadbandLabel
                                .networkPerformanceUrl
                            }
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>

                      <hr className="border-gray-300" />

                      {/* Network Management Policy */}
                      <div>
                        <h3 className="text-lg font-bold mb-2">
                          Network Management Policy
                        </h3>
                        <a
                          href={
                            selectedPlanForLabel.broadbandLabel
                              .networkManagementUrl
                          }
                          className="text-blue-600 hover:underline flex items-center text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            selectedPlanForLabel.broadbandLabel
                              .networkManagementUrl
                          }
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>

                      {/* Privacy Policy */}
                      <div>
                        <h3 className="text-lg font-bold mb-2">
                          Privacy Policy
                        </h3>
                        <a
                          href={
                            selectedPlanForLabel.broadbandLabel.privacyPolicyUrl
                          }
                          className="text-blue-600 hover:underline flex items-center text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selectedPlanForLabel.broadbandLabel.privacyPolicyUrl}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>

                      <hr className="border-gray-300" />

                      {/* Customer Support */}
                      <div className="bg-black text-white p-4 -mx-6">
                        <h3 className="text-lg font-bold mb-3">
                          Customer Support
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>Phone:</div>
                            <div>
                              {
                                selectedPlanForLabel.broadbandLabel
                                  .customerSupportPhone
                              }
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>Website:</div>
                            <div>
                              <a
                                href={
                                  selectedPlanForLabel.broadbandLabel.websiteUrl
                                }
                                className="text-blue-300 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {selectedPlanForLabel.broadbandLabel.websiteUrl}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Information */}
                      <div className="text-xs text-gray-600 space-y-2">
                        <p>
                          Learn about the terms used on this label. Visit the
                          Federal Communications Commission's Consumer Resource
                          Center.
                        </p>
                        <p className="text-blue-600">
                          <a
                            href="https://fcc.gov/consumer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            fcc.gov/consumer
                          </a>
                        </p>
                        <p className="font-mono">
                          Unique Plan Identifier:{" "}
                          {selectedPlanForLabel.broadbandLabel.uniquePlanId}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Marketplace;
