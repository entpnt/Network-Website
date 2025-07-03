import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "../lib/contentLoader";
import { useUserState } from "../components/Layout";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Calendar } from "../components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Clock,
  Download,
  FileText,
  MapPin,
  Mail,
  User,
  Settings,
  Wifi,
  CheckCircle,
  AlertCircle,
  Monitor,
  Plus,
  Globe,
  RotateCw,
  ExternalLink,
  ShoppingCart,
  HelpCircle,
  Zap,
  Router,
  Activity,
  Info,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";

// User states for testing different UI versions
type UserState = "visitor" | "registered-no-device" | "registered-with-device";

const MyAccount: React.FC = () => {
  const { content } = useContent();
  const { userState, setUserState } = useUserState();
  const navigate = useNavigate();
  const [servicesExpanded, setServicesExpanded] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [editFormData, setEditFormData] = useState({
    name: "",
    address: "",
    email: "",
  });

  // Mock user data based on user state
  const getUserData = () => {
    // Check for actual signup data first
    const signupData = localStorage.getItem("userSignupData");
    let baseUserData;

    if (signupData) {
      try {
        const parsed = JSON.parse(signupData);
        baseUserData = {
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone || "(555) 123-4567",
          address: parsed.address,
          accountId: "OF-2024-001234",
          installDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from signup
          installTimeSlot: "1:00 PM - 5:00 PM",
          installType: "12-Month Contract with Free Installation",
          installationStatus: "scheduled",
          paymentAmount: 55,
          contracts: [
            {
              id: "property-access",
              title: "Property Access Agreement",
              status: "Signed",
              signedDate: new Date().toISOString().split("T")[0],
              downloadUrl: "/contracts/property-access-agreement.pdf",
            },
            {
              id: "free-install",
              title: "Free Install Agreement",
              status: "Signed",
              signedDate: new Date().toISOString().split("T")[0],
              downloadUrl: "/contracts/free-install-agreement.pdf",
            },
          ],
        };
      } catch (error) {
        console.error("Error parsing signup data:", error);
        baseUserData = {
          name: "John Doe",
          email: "john.doe@email.com",
          phone: "(555) 123-4567",
          address: "123 Main Street, Orangeburg, SC 29115",
          accountId: "OF-2024-001234",
          installDate: new Date("2024-01-20"),
          installTimeSlot: "1:00 PM - 5:00 PM",
          installType: "12-Month Contract with Free Installation",
          installationStatus: "completed",
          paymentAmount: 55,
          contracts: [
            {
              id: "property-access",
              title: "Property Access Agreement",
              status: "Signed",
              signedDate: "2024-01-15",
              downloadUrl: "/contracts/property-access-agreement.pdf",
            },
            {
              id: "free-install",
              title: "Free Install Agreement",
              status: "Signed",
              signedDate: "2024-01-15",
              downloadUrl: "/contracts/free-install-agreement.pdf",
            },
          ],
        };
      }
    } else {
      baseUserData = {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "(555) 123-4567",
        address: "123 Main Street, Orangeburg, SC 29115",
        accountId: "OF-2024-001234",
        installDate: new Date("2024-01-20"),
        installTimeSlot: "1:00 PM - 5:00 PM",
        installType: "12-Month Contract with Free Installation",
        installationStatus: "completed",
        paymentAmount: 55,
        contracts: [
          {
            id: "property-access",
            title: "Property Access Agreement",
            status: "Signed",
            signedDate: "2024-01-15",
            downloadUrl: "/contracts/property-access-agreement.pdf",
          },
          {
            id: "free-install",
            title: "Free Install Agreement",
            status: "Signed",
            signedDate: "2024-01-15",
            downloadUrl: "/contracts/free-install-agreement.pdf",
          },
        ],
      };
    }

    if (userState === "registered-no-device") {
      return {
        ...baseUserData,
        installationStatus: "scheduled",
        installDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        installTimeSlot: "1:00 PM - 5:00 PM",
        devices: [],
        services: [],
      };
    } else {
      return {
        ...baseUserData,
        devices: [
          {
            id: "device-001",
            name: "Living Room Gateway",
            model: "EntryPoint D50",
            serialNumber: "EP-D50-789123",
            status: "online",
            image:
              "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&q=80",
            canRotate: true,
            lastSeen: new Date(),
          },
        ],
        services: [
          {
            id: "internet-premium",
            name: "Premium Internet",
            provider: "SpeedNet",
            speed: "1 Gbps",
            price: "$79.99/month",
            status: "active",
            description: "High-speed fiber internet with unlimited data",
            category: "Internet",
            logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80",
            tooltip:
              "SpeedNet is a high-performance internet service provider offering fiber-optic connections",
          },
          {
            id: "managed-wifi",
            name: "Managed WiFi",
            provider: "Orangeburg Fiber",
            price: "$9.99/month",
            status: "active",
            description: "Professional WiFi management and support",
            category: "WiFi",
            logo: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=100&q=80",
            tooltip:
              "Professional WiFi service with 24/7 monitoring and optimization",
          },
        ],
      };
    }
  };

  const userData = getUserData();

  const companyName = content?.company?.name || "Orangeburg Fiber";

  const handleDownloadContract = (contractId: string, title: string) => {
    // In a real implementation, this would download the actual PDF
    const contractContent = generateContractContent(contractId, title);
    const blob = new Blob([contractContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = title.replace(/\s+/g, "_") + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generateContractContent = (contractId: string, title: string) => {
    const currentDate = new Date().toLocaleDateString();
    return `${title}\n\nCustomer Information:\nName: ${userData.name}\nAddress: ${userData.address}\nDate: ${currentDate}\n\nThis is a copy of your signed ${title.toLowerCase()}.\n\nSigned on: ${userData.contracts.find((c) => c.id === contractId)?.signedDate}\nAccount ID: ${userData.accountId}\n\nFor questions about this contract, please contact ${companyName} support.`;
  };

  const handleReschedule = () => {
    setRescheduleModalOpen(true);
  };

  const handleRescheduleConfirm = () => {
    if (selectedDate && selectedTimeSlot) {
      // In a real implementation, this would update the backend
      // For demo purposes, we'll just close the modal and show a success message
      setRescheduleModalOpen(false);
      alert(
        `Installation rescheduled to ${selectedDate.toLocaleDateString()} at ${selectedTimeSlot}`,
      );
      setSelectedDate(undefined);
      setSelectedTimeSlot("");
    }
  };

  const handleRescheduleCancel = () => {
    setRescheduleModalOpen(false);
    setSelectedDate(undefined);
    setSelectedTimeSlot("");
  };

  const handleAddDevice = () => {
    // In a real implementation, this would handle device addition
    // For demo purposes, switch to device connected state
    setUserState("registered-with-device");
  };

  const handleRotateDevice = (deviceId: string) => {
    // In a real implementation, this would send a rotate command to the device
    alert(`Rotating device ${deviceId}...`);
  };

  const handleManageService = (serviceId: string) => {
    // Navigate to MyServices page
    navigate("/my-services");
  };

  const handleAddService = () => {
    // Navigate to Marketplace
    navigate("/marketplace");
  };

  const handleBrowseMoreServices = () => {
    // Navigate to Marketplace
    navigate("/marketplace");
  };

  const handleEditAccount = () => {
    setEditFormData({
      name: userData.name,
      address: userData.address,
      email: userData.email,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    // In a real implementation, this would save the changes
    alert(`Saving changes: ${JSON.stringify(editFormData)}`);
    setEditModalOpen(false);
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
  };

  const isInstallationCompleted = userData.installationStatus === "completed";
  const isInstallationScheduled = userData.installationStatus === "scheduled";
  const hasDevices = userData.devices && userData.devices.length > 0;
  const hasServices = userData.services && userData.services.length > 0;
  const hasDeviceConnected = userState === "registered-with-device";

  // Service Card Component
  const ServiceCard = ({
    service,
    onManage,
  }: {
    service: any;
    onManage: (id: string) => void;
  }) => (
    <div className="border rounded-lg p-4">
      <div className="flex items-start space-x-4 mb-3">
        {/* Service Provider Logo */}
        <div className="flex-shrink-0">
          <img
            src={service.logo}
            alt={`${service.provider} logo`}
            className="w-12 h-12 rounded-lg object-cover border"
          />
        </div>

        {/* Service Information */}
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold">{service.name}</h4>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  {service.provider} • {service.speed && `${service.speed} • `}
                  {service.price}
                </p>
                {service.tooltip && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{service.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <p className="text-sm">{service.description}</p>
              {service.category && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {service.category}
                </Badge>
              )}
            </div>
            <Badge
              variant="secondary"
              className={`${
                service.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {service.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onManage(service.id)}
        className="w-full"
      >
        <Settings className="h-4 w-4 mr-2" />
        Manage Service
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Hello, {userData.name.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">
                Manage your {companyName} service and account information.
              </p>
            </div>
            {hasDeviceConnected && (
              <Button
                onClick={() => navigate("/my-services")}
                className="bg-brand-primary text-brand-primary-foreground hover:opacity-90"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Services
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Summary Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Account Summary</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditAccount}
                  className="text-brand-primary hover:text-brand-primary/80"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Customer Name
                    </p>
                    <p className="font-semibold">{userData.name}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Service Address
                    </p>
                    <p className="font-semibold">{userData.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Account ID
                    </p>
                    <p className="font-semibold font-mono">
                      {userData.accountId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="font-semibold">{userData.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contracts Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Signed Contracts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userData.contracts.map((contract) => (
                <div key={contract.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{contract.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Signed on{" "}
                        {new Date(contract.signedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {contract.status}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDownloadContract(contract.id, contract.title)
                    }
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Scheduled Installation Section - Show for users with scheduled installations */}
          {isInstallationScheduled && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Scheduled Installation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Installation Date</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {userData.installDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Time Window</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {userData.installTimeSlot}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                      <Settings className="h-4 w-4" />
                      <span>Install Type</span>
                    </div>
                    <p className="text-sm font-medium">
                      {userData.installType}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 flex-1">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                          Installation Reminder
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Please ensure someone is home during the scheduled
                          installation time. Our technician will contact you 24
                          hours before the appointment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      onClick={handleReschedule}
                      className="w-full sm:w-auto"
                    >
                      Reschedule Installation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Device and Services Section - Show side by side for completed installations */}
          {isInstallationCompleted && (
            <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Device Section */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Router className="h-5 w-5" />
                    <span>Devices</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasDeviceConnected && hasDevices ? (
                    <div className="space-y-6">
                      {/* Device Selector - Only show if multiple devices */}
                      {userData.devices.length > 1 && (
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="device-select">Select Device:</Label>
                          <Select defaultValue={userData.devices[0].id}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {userData.devices.map((device) => (
                                <SelectItem key={device.id} value={device.id}>
                                  {device.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Device Display */}
                      {userData.devices.map((device, index) => (
                        <div
                          key={device.id}
                          className={index > 0 ? "hidden" : "block"}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Device Image */}
                            <div className="flex justify-center">
                              <div className="relative">
                                <img
                                  src={device.image}
                                  alt={device.name}
                                  className="w-48 h-48 object-cover rounded-lg border"
                                />
                                <div className="absolute -top-2 -right-2">
                                  <Badge
                                    variant={
                                      device.status === "online"
                                        ? "default"
                                        : "destructive"
                                    }
                                    className={
                                      device.status === "online"
                                        ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                                        : "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                                    }
                                  >
                                    <Activity className="h-3 w-3 mr-1" />
                                    {device.status === "online"
                                      ? "Device Connected"
                                      : "Device Offline"}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Device Info */}
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">
                                  {device.name}
                                </h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Model:
                                    </span>
                                    <span className="font-medium">
                                      {device.model}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Serial Number:
                                    </span>
                                    <span className="font-mono text-xs">
                                      {device.serialNumber}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Status:
                                    </span>
                                    <span
                                      className={`font-medium ${
                                        device.status === "online"
                                          ? "text-green-600 dark:text-green-400"
                                          : "text-red-600 dark:text-red-400"
                                      }`}
                                    >
                                      {device.status === "online"
                                        ? "Online"
                                        : "Offline"}
                                    </span>
                                  </div>
                                  {device.status === "online" && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Last Seen:
                                      </span>
                                      <span className="text-xs">
                                        {device.lastSeen.toLocaleString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Device Actions */}
                              <div className="flex space-x-2">
                                {device.canRotate && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleRotateDevice(device.id)
                                    }
                                  >
                                    <RotateCw className="h-4 w-4 mr-2" />
                                    Rotate
                                  </Button>
                                )}
                                <Button variant="outline" size="sm">
                                  <Settings className="h-4 w-4 mr-2" />
                                  Settings
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Router className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        No Devices Connected
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Connect a device to start using our services and access
                        the marketplace.
                      </p>
                      <Button
                        onClick={handleAddDevice}
                        className="bg-brand-primary text-brand-primary-foreground hover:opacity-90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Device
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Services Section */}
              <Card className="h-fit">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Services</span>
                    </CardTitle>
                    {hasDeviceConnected && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddService}
                        className="text-brand-primary hover:text-brand-primary/80"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Service
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {hasDeviceConnected && hasServices ? (
                    <TooltipProvider>
                      <div className="space-y-4">
                        {/* Service Categories */}
                        {userData.services.length > 2 && (
                          <Collapsible
                            open={servicesExpanded}
                            onOpenChange={setServicesExpanded}
                          >
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-between p-0 h-auto"
                              >
                                <span className="text-sm font-medium">
                                  All Services ({userData.services.length})
                                </span>
                                {servicesExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 mt-4">
                              {userData.services.map((service) => (
                                <ServiceCard
                                  key={service.id}
                                  service={service}
                                  onManage={handleManageService}
                                />
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        )}

                        {userData.services.length <= 2 && (
                          <div className="space-y-4">
                            {userData.services.map((service) => (
                              <ServiceCard
                                key={service.id}
                                service={service}
                                onManage={handleManageService}
                              />
                            ))}
                          </div>
                        )}

                        {/* Browse More Services CTA */}
                        <div className="mt-6 pt-4 border-t">
                          <Button
                            onClick={handleBrowseMoreServices}
                            className="w-full bg-brand-primary text-brand-primary-foreground hover:opacity-90"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Browse More Services
                          </Button>
                        </div>
                      </div>
                    </TooltipProvider>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Zap className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        No Services Available
                      </h3>
                      <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                        {hasDeviceConnected
                          ? "Browse our marketplace to find and subscribe to services."
                          : "Connect a device to access and subscribe to services."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* User State Toggle for Testing - Only show for device connected state */}
        {hasDeviceConnected && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Demo State Toggle</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Current State:{" "}
                    {userState === "registered-no-device"
                      ? "No Device Connected"
                      : "Device Connected"}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Toggle between different user states to test the UI
                    behavior.
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant={
                        userState === "registered-no-device"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setUserState("registered-no-device")}
                    >
                      No Device
                    </Button>
                    <Button
                      variant={
                        userState === "registered-with-device"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setUserState("registered-with-device")}
                    >
                      Device Connected
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reschedule Installation Modal */}
        <Dialog
          open={rescheduleModalOpen}
          onOpenChange={setRescheduleModalOpen}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Reschedule Installation</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Select New Date
                  </Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date < new Date() || date.getDay() === 0
                    } // Disable past dates and Sundays
                    className="rounded-md border"
                  />
                </div>

                {selectedDate && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Available Time Slots
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "8:00 AM - 12:00 PM",
                        "1:00 PM - 5:00 PM",
                        "9:00 AM - 1:00 PM",
                        "2:00 PM - 6:00 PM",
                      ].map((timeSlot) => (
                        <Button
                          key={timeSlot}
                          variant={
                            selectedTimeSlot === timeSlot
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setSelectedTimeSlot(timeSlot)}
                          className="text-sm"
                        >
                          {timeSlot}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleRescheduleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleRescheduleConfirm}
                disabled={!selectedDate || !selectedTimeSlot}
              >
                Confirm Reschedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Account Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Account Information</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={editFormData.address}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      address: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-muted-foreground">
                  Account ID
                </Label>
                <div className="col-span-3 text-sm font-mono text-muted-foreground">
                  {userData.accountId} (Read-only)
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyAccount;
