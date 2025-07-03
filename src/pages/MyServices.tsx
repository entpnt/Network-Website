import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { useToast } from "../components/ui/use-toast";
import {
  Wifi,
  Phone,
  Tv,
  Globe,
  ShoppingCart,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
} from "lucide-react";

interface ActiveService {
  id: string;
  serviceName: string;
  provider: string;
  providerLogo?: string;
  monthlyPrice: number;
  planType: "Internet" | "VoIP" | "TV" | "Bundle";
  portNumber?: string;
  status: "Active" | "Pending Activation";
  isAddOn?: boolean;
  parentServiceId?: string;
  quantity?: number;
  activatedDate: string;
  nextBillingDate: string;
  features?: string[];
}

const MyServices: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [services, setServices] = useState<ActiveService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock active services data
  const mockServices: ActiveService[] = [
    {
      id: "service-1",
      serviceName: "Premium Fiber Internet",
      provider: "Noodle Fiber",
      monthlyPrice: 79.99,
      planType: "Internet",
      portNumber: "Port 1",
      status: "Active",
      activatedDate: "2024-01-15",
      nextBillingDate: "2024-02-15",
      features: ["1 Gbps Download", "500 Mbps Upload", "Unlimited Data"],
    },
    {
      id: "addon-1",
      serviceName: "Phone Line",
      provider: "Noodle Fiber",
      monthlyPrice: 15.99,
      planType: "VoIP",
      portNumber: "Port 2",
      status: "Active",
      isAddOn: true,
      parentServiceId: "service-1",
      quantity: 2,
      activatedDate: "2024-01-15",
      nextBillingDate: "2024-02-15",
    },
    {
      id: "addon-2",
      serviceName: "Premium TV Package",
      provider: "Noodle Fiber",
      monthlyPrice: 49.99,
      planType: "TV",
      status: "Active",
      isAddOn: true,
      parentServiceId: "service-1",
      activatedDate: "2024-01-20",
      nextBillingDate: "2024-02-20",
    },
  ];

  useEffect(() => {
    // Simulate loading services
    const loadServices = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let servicesToShow = [...mockServices];

      // Check for new subscription from localStorage
      const newSubscriptionData = localStorage.getItem("newSubscription");
      if (newSubscriptionData) {
        try {
          const { plan, addOns } = JSON.parse(newSubscriptionData);

          // Add the main plan as a service
          const newMainService: ActiveService = {
            id: `service-${Date.now()}`,
            serviceName: plan.name,
            provider: plan.provider,
            monthlyPrice: plan.monthlyPrice,
            planType: "Internet",
            status: "Active",
            activatedDate: new Date().toISOString().split("T")[0],
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            features: plan.features || [],
          };

          servicesToShow.push(newMainService);

          // Add each add-on as a separate service
          addOns.forEach((addOn: any) => {
            for (let i = 0; i < addOn.quantity; i++) {
              const newAddOnService: ActiveService = {
                id: `addon-${Date.now()}-${i}`,
                serviceName: addOn.name,
                provider: addOn.provider,
                monthlyPrice: addOn.monthlyPrice,
                planType: addOn.category === "VoIP" ? "VoIP" : "Internet",
                status: "Active",
                activatedDate: new Date().toISOString().split("T")[0],
                nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
                features: [addOn.description],
              };
              servicesToShow.push(newAddOnService);
            }
          });

          // Clear the localStorage after processing
          localStorage.removeItem("newSubscription");
        } catch (error) {
          console.error("Error parsing subscription data:", error);
        }
      }

      setServices(servicesToShow);
      setIsLoading(false);
    };

    loadServices();

    // Check if redirected from checkout with success
    const urlParams = new URLSearchParams(location.search);
    const checkoutSuccess = urlParams.get("checkout_success");
    if (checkoutSuccess === "true") {
      // Get the plan name from localStorage for the toast
      const newSubscriptionData = localStorage.getItem("newSubscription");
      let planName = "your plan";
      let providerName = "";

      if (newSubscriptionData) {
        try {
          const { plan } = JSON.parse(newSubscriptionData);
          planName = plan.name;
          providerName = plan.provider;
        } catch (error) {
          console.error("Error parsing subscription data for toast:", error);
        }
      }

      toast({
        title: "Subscription Successful!",
        description: `You've successfully subscribed to ${planName}${providerName ? ` from ${providerName}` : ""}.`,
        duration: 5000,
      });
      // Clean up URL
      navigate("/my-services", { replace: true });
    }
  }, [location, navigate, toast]);

  const handleUnsubscribe = async (serviceId: string, serviceName: string) => {
    try {
      // Simulate API call to unsubscribe
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove the service immediately
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== serviceId),
      );

      toast({
        title: "Service Removed",
        description: `${serviceName} has been successfully unsubscribed and removed from your account.`,
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unsubscribe. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const getServiceIcon = (planType: string) => {
    switch (planType) {
      case "Internet":
        return <Wifi className="h-5 w-5" />;
      case "VoIP":
        return <Phone className="h-5 w-5" />;
      case "TV":
        return <Tv className="h-5 w-5" />;
      case "Bundle":
        return <Package className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );

      case "Pending Activation":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending Activation
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getProviderInitial = (provider: string) => {
    return provider.charAt(0).toUpperCase();
  };

  const formatServiceName = (service: ActiveService) => {
    if (service.quantity && service.quantity > 1) {
      return `${service.serviceName} ×${service.quantity}`;
    }
    return service.serviceName;
  };

  const groupedServices = services.reduce(
    (acc, service) => {
      if (service.isAddOn && service.parentServiceId) {
        if (!acc[service.parentServiceId]) {
          acc[service.parentServiceId] = [];
        }
        acc[service.parentServiceId].push(service);
      } else {
        if (!acc[service.id]) {
          acc[service.id] = [];
        }
      }
      return acc;
    },
    {} as Record<string, ActiveService[]>,
  );

  const mainServices = services.filter((service) => !service.isAddOn);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Services</h1>
            <p className="text-muted-foreground">
              Manage your active internet services and add-ons.
            </p>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Active Services</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              You haven't subscribed to any internet plans yet. Browse our
              marketplace to find the perfect plan for your needs.
            </p>
            <Button
              onClick={() => navigate("/marketplace")}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3 h-auto"
            >
              Browse Services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Services</h1>
            <p className="text-muted-foreground">
              Manage your active internet services and add-ons.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/marketplace")}
            className="flex items-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Browse More Services</span>
          </Button>
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {mainServices.map((service) => {
            const addOns = groupedServices[service.id] || [];

            return (
              <div key={service.id} className="space-y-2">
                {/* Main Service Row */}
                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      {/* Left Section - Service Info */}
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Provider Logo/Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {getProviderInitial(service.provider)}
                        </div>

                        {/* Service Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <div className="flex items-center space-x-2">
                              {getServiceIcon(service.planType)}
                              <h3 className="font-semibold text-gray-900 text-base">
                                {service.serviceName}
                              </h3>
                            </div>
                            {getStatusBadge(service.status)}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="font-medium">
                              {service.provider}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>{service.planType}</span>
                            {service.portNumber && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span>{service.portNumber}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Price and Actions */}
                      <div className="flex items-center space-x-6">
                        {/* Monthly Price */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ${service.monthlyPrice.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">/month</div>
                        </div>

                        {/* Unsubscribe Button */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 px-4 py-2"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Unsubscribe
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm Unsubscribe
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to unsubscribe from{" "}
                                {service.serviceName}? This action will
                                immediately remove the service from your
                                account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleUnsubscribe(
                                    service.id,
                                    service.serviceName,
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Unsubscribe
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add-ons for this service */}
                {addOns.map((addOn) => (
                  <Card
                    key={addOn.id}
                    className="bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-shadow ml-6"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        {/* Left Section - Add-on Info */}
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Indent indicator */}
                          <div className="w-6 h-6 rounded bg-gray-300 flex items-center justify-center flex-shrink-0">
                            {getServiceIcon(addOn.planType)}
                          </div>

                          {/* Add-on Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-1">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {formatServiceName(addOn)}
                              </h4>
                              {getStatusBadge(addOn.status)}
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-gray-600">
                              <span>Add-on for {service.serviceName}</span>
                              {addOn.portNumber && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span>{addOn.portNumber}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Section - Price and Actions */}
                        <div className="flex items-center space-x-6">
                          {/* Monthly Price */}
                          <div className="text-right">
                            <div className="text-base font-semibold text-gray-900">
                              ${addOn.monthlyPrice.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">/month</div>
                          </div>

                          {/* Unsubscribe Button */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 px-3 py-1 text-xs"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove Add-on
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove{" "}
                                  {formatServiceName(addOn)}? This add-on will
                                  be immediately removed from your account.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleUnsubscribe(
                                      addOn.id,
                                      formatServiceName(addOn),
                                    )
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remove Add-on
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>

        {/* Summary Card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Total Active Services:{" "}
                  {services.filter((s) => s.status === "Active").length}
                </p>
                <p className="text-sm text-gray-600">
                  Next Billing Date: {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">
                  $
                  {services
                    .filter((s) => s.status === "Active")
                    .reduce((sum, s) => sum + s.monthlyPrice, 0)
                    .toFixed(2)}
                </div>
                <div className="text-sm text-blue-700">Total Monthly</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyServices;
