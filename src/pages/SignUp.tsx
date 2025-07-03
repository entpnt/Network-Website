import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useContent } from "../lib/contentLoader";
import { SignUp as ClerkSignUp, useUser } from "@clerk/clerk-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { Checkbox } from "../components/ui/checkbox";
import { Calendar } from "../components/ui/calendar";
import { Textarea } from "../components/ui/textarea";
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Calendar as CalendarIcon,
  FileText,
  Settings,
  User,
  Wifi,
  Clock,
  MapPin,
  Phone,
  Mail,
  Download,
  PenTool,
  Type,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

interface SignUpData {
  // Step 1: Account creation
  email: string;
  password: string;
  accountCreated: boolean;

  // User info from availability check
  name: string;
  phone: string;
  address: string;

  // Step 2: Install choice
  installType: "contract" | "no-contract" | "";

  // Step 3: Contracts
  contractsSigned: {
    freeInstallAgreement: boolean;
    propertyAccessAgreement: boolean;
  };

  // Digital signature data
  freeInstallSignature: {
    acknowledged: boolean;
    signature: string;
    signatureType: "typed" | "drawn";
    timestamp: string;
    ipAddress?: string;
  };

  // Property Access Agreement signature data
  propertyAccessSignature: {
    acknowledged: boolean;
    signature: string;
    timestamp: string;
    ipAddress?: string;
  };

  // Step 5: Payment
  paymentCompleted: boolean;
  paymentAmount: number;

  // Step 6: Scheduling
  installDate: Date | null;
  installTimeSlot: string;

  // Additional info
  selectedPlan?: {
    name: string;
    price: string;
    speed: string;
  };
}

const STEPS = [
  { id: 1, title: "Create Login", icon: UserPlus },
  { id: 2, title: "Choose Install", icon: Settings },
  { id: 3, title: "Sign Contracts", icon: FileText },
  { id: 4, title: "Review & Confirm", icon: User },
  { id: 5, title: "Enter Payment", icon: CreditCard },
  { id: 6, title: "Schedule Install", icon: CalendarIcon },
  { id: 7, title: "Success", icon: CheckCircle },
];

const SignUp: React.FC = () => {
  const { content } = useContent();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();

  // Get user data from location state (passed from CheckAvailability)
  const initialUserData = location.state?.userData || {
    name: "John Doe",
    phone: "(555) 123-4567",
    address: "123 Main Street, Orangeburg, SC 29115",
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: "",
    password: "",
    accountCreated: false,
    ...initialUserData,
    installType: "",
    contractsSigned: {
      freeInstallAgreement: false,
      propertyAccessAgreement: false,
    },
    freeInstallSignature: {
      acknowledged: false,
      signature: "",
      signatureType: "typed",
      timestamp: "",
      ipAddress: "",
    },
    propertyAccessSignature: {
      acknowledged: false,
      signature: "",
      timestamp: "",
      ipAddress: "",
    },
    paymentCompleted: false,
    paymentAmount: 0,
    installDate: null,
    installTimeSlot: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimeSlots] = useState([
    "8:00 AM - 12:00 PM",
    "12:00 PM - 4:00 PM",
    "4:00 PM - 8:00 PM",
  ]);

  // Digital signature states
  const [showFreeInstallContract, setShowFreeInstallContract] = useState(false);
  const [showPropertyAccessContract, setShowPropertyAccessContract] =
    useState(false);
  const [signatureMode, setSignatureMode] = useState<"typed" | "drawn">(
    "drawn",
  );
  const [propertySignatureMode, setPropertySignatureMode] = useState<
    "typed" | "drawn"
  >("drawn");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPropertyDrawing, setIsPropertyDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propertyCanvasRef = useRef<HTMLCanvasElement>(null);
  const [emailCopy, setEmailCopy] = useState(false);
  const [propertyEmailCopy, setPropertyEmailCopy] = useState(false);

  // Login step states
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const companyName = content?.company?.name || "Orangeburg Fiber";
  const dynamicAmount = "350"; // This would be dynamic based on content

  const progressPercentage = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInstallTypeChange = (value: string) => {
    setSignUpData((prev) => ({
      ...prev,
      installType: value as "contract" | "no-contract",
      paymentAmount: value === "contract" ? 55 : 350,
    }));
  };

  const handleContractSign = (
    contractType: keyof SignUpData["contractsSigned"],
  ) => {
    if (contractType === "freeInstallAgreement") {
      setShowFreeInstallContract(true);
    } else if (contractType === "propertyAccessAgreement") {
      setShowPropertyAccessContract(true);
    }
  };

  const handleFreeInstallSignature = () => {
    if (
      !signUpData.freeInstallSignature.acknowledged ||
      !signUpData.freeInstallSignature.signature
    ) {
      return;
    }

    const timestamp = new Date().toISOString();
    setSignUpData((prev) => ({
      ...prev,
      contractsSigned: {
        ...prev.contractsSigned,
        freeInstallAgreement: true,
      },
      freeInstallSignature: {
        ...prev.freeInstallSignature,
        timestamp,
      },
    }));
    setShowFreeInstallContract(false);
  };

  const handleSignatureChange = (signature: string) => {
    setSignUpData((prev) => ({
      ...prev,
      freeInstallSignature: {
        ...prev.freeInstallSignature,
        signature,
        signatureType: signatureMode,
      },
    }));
  };

  const handleAcknowledgmentChange = (acknowledged: boolean) => {
    setSignUpData((prev) => ({
      ...prev,
      freeInstallSignature: {
        ...prev.freeInstallSignature,
        acknowledged,
      },
    }));
  };

  const clearSignature = () => {
    if (signatureMode === "drawn" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    handleSignatureChange("");
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (signatureMode !== "drawn") return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || signatureMode !== "drawn") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
      // Save signature as data URL
      handleSignatureChange(canvas.toDataURL());
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const generatePDF = (content: string, filename: string) => {
    // Create a simple text file download
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.replace(/\s+/g, "_") + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadFreeInstallPDF = () => {
    const contractContent = generateFreeInstallContractContent();
    generatePDF(contractContent, "Free_Install_Agreement");
  };

  const downloadPropertyAccessPDF = () => {
    const contractContent = generatePropertyAccessContractContent();
    generatePDF(contractContent, "Property_Access_Agreement");
  };

  const generateFreeInstallContractContent = () => {
    const currentDate = new Date().toLocaleDateString();
    return `Orangeburg Fiber Network Customer Agreement

This Customer Agreement (the "Agreement") is entered into by and between Orangeburg Fiber Network ("Orangeburg"), located at [Insert Address], and the customer ("Customer"), whose information is provided below.

Customer Information:
Name: ${signUpData.name}
Address: ${signUpData.address}
Date: ${currentDate}

1. Service Commitment
The Customer agrees to maintain an active subscription to Orangeburg Fiber services for a minimum period of six (6) months from the date of installation. Installation fees are waived under this option.

2. Service Terms
2.1 The Customer may switch internet service providers or cancel services at any time. This Agreement does not impose any long-term commitment beyond the six-month service period.
2.2 Any changes to service must comply with Orangeburg's standard terms and conditions.
2.3 If the Customer cancels services before the six-month period, a $350 early termination fee will apply.

3. Installation and Equipment
3.1 Orangeburg will install the necessary equipment to provide fiber internet services at the Customer's premises. All equipment provided by Orangeburg remains the property of Orangeburg.
3.2 The Customer is responsible for maintaining the provided equipment in good working condition. Any damage to equipment beyond normal wear and tear may result in repair or replacement charges.
3.3 If the Customer terminates services, all Orangeburg equipment must be returned within 14 days. Failure to return the equipment may result in additional charges.

4. Billing and Payments
4.1 Service fees will be billed monthly. Payments are due in full on the billing date.
4.2 The monthly service fees will remain consistent during the initial six-month period.
4.3 Late payments may incur penalties as outlined in Orangeburg's standard billing terms.

5. Limitation of Liability
5.1 Orangeburg is not liable for any interruption of service, except as provided by applicable law. Customers must notify Orangeburg of any service issues to allow for resolution.
5.2 This Agreement does not limit the Customer's right to choose another internet service provider at any time.

6. Entire Agreement
This Agreement constitutes the entire agreement between Orangeburg and the Customer concerning the subject matter hereof and supersedes any prior agreements or understandings.

Acknowledgment
By checking this box, I, ${signUpData.name}, the property owner at ${signUpData.address}, agree to the terms of this Agreement.
Date: ${currentDate}

Signature: ${signUpData.freeInstallSignature.signature ? "[Signed Digitally]" : "[Not Signed]"}
Timestamp: ${signUpData.freeInstallSignature.timestamp}
`;
  };

  const generatePropertyAccessContractContent = () => {
    const currentDate = new Date().toLocaleDateString();
    return `Property Access Agreement

This contract grants Orangeburg Fiber access to your property for installing, maintaining, and operating fiber optic equipment, with a commitment to restore the property to its original condition after work is completed.

Customer Information:
Name: ${signUpData.name}
Address: ${signUpData.address}
Date: ${currentDate}

Key Terms and Conditions:

1. Grant of Access
You grant Orangeburg Fiber non-exclusive access to your property to install, maintain, and operate fiber optic cables, electronic access portals, and associated equipment ("Equipment"). Access includes necessary ingress and egress for these activities. If requested in writing, Orangeburg Fiber will remove all Equipment within 30 days. Unremoved Equipment after this period may be considered abandoned. Orangeburg Fiber will restore your property to its original condition after installation or removal, excluding normal wear and tear.

2. Maintenance and Damage Responsibility
Orangeburg Fiber will repair any damage caused during installation or maintenance and restore affected areas to a reasonable condition. The Company is responsible for locating and avoiding utility damage. If the Owner damages Company Equipment, the Company may seek reimbursement for repairs, including legal fees.

3. Assignment of Rights
Either party may transfer their rights and obligations under this Agreement to a third party, with prior written notice to the other party.

4. Legal Compliance and Immunity
Orangeburg Fiber will comply with all applicable laws and retains any governmental immunity provided under state law.

5. Binding Effect
This Agreement is binding on all successors, assigns, heirs, executors, and administrators of both parties.

6. Limitation of Liability
Orangeburg Fiber's liability is limited to actual damages directly caused by gross negligence or intentional misconduct.

7. Amendments
Any changes to this Agreement must be in writing and signed by both parties.

8. Entire Agreement
This document is the full agreement between the Owner and the Company, superseding all prior communications.

Acknowledgment
By checking this box, I, ${signUpData.name}, the property owner, agree to the terms of this Agreement.
Date: ${currentDate}

Signature: ${signUpData.propertyAccessSignature.signature ? "[Signed Digitally]" : "[Not Signed]"}
Timestamp: ${signUpData.propertyAccessSignature.timestamp}
`;
  };

  const handlePropertyAccessSignature = () => {
    if (
      !signUpData.propertyAccessSignature.acknowledged ||
      !signUpData.propertyAccessSignature.signature
    ) {
      return;
    }

    const timestamp = new Date().toISOString();
    setSignUpData((prev) => ({
      ...prev,
      contractsSigned: {
        ...prev.contractsSigned,
        propertyAccessAgreement: true,
      },
      propertyAccessSignature: {
        ...prev.propertyAccessSignature,
        timestamp,
      },
    }));
    setShowPropertyAccessContract(false);
  };

  const handlePropertySignatureChange = (signature: string) => {
    setSignUpData((prev) => ({
      ...prev,
      propertyAccessSignature: {
        ...prev.propertyAccessSignature,
        signature,
      },
    }));
  };

  const clearPropertySignature = () => {
    if (propertySignatureMode === "drawn" && propertyCanvasRef.current) {
      const canvas = propertyCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    handlePropertySignatureChange("");
  };

  const handlePaymentComplete = () => {
    setSignUpData((prev) => ({ ...prev, paymentCompleted: true }));
    handleNext();
  };

  const handleScheduleInstall = () => {
    if (selectedDate && signUpData.installTimeSlot) {
      setSignUpData((prev) => ({
        ...prev,
        installDate: selectedDate,
      }));
      handleNext();
    }
  };

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Handle email change with validation
  const handleEmailChange = (email: string) => {
    setSignUpData((prev) => ({ ...prev, email }));
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Handle password change with validation
  const handlePasswordChange = (password: string) => {
    setSignUpData((prev) => ({ ...prev, password }));
    if (password && !validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }
  };

  // Handle account creation (mock implementation)
  const handleCreateAccount = async () => {
    setIsCreatingAccount(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Mock account creation - in real app this would call your backend
      console.log("Creating account for:", signUpData.email);

      // Simulate successful account creation
      setSignUpData((prev) => ({ ...prev, accountCreated: true }));
      handleNext();
    } catch (error: any) {
      console.error("Error creating account:", error);
      setEmailError("Failed to create account. Please try again.");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  // Effect to automatically proceed when user is signed in
  useEffect(() => {
    if (isSignedIn && user && currentStep === 1) {
      // Update signUpData with user email
      setSignUpData(prev => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || "",
        accountCreated: true
      }));
      // Automatically proceed to next step
      handleNext();
    }
  }, [isSignedIn, user, currentStep]);

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return isSignedIn && user !== null;
      case 2:
        return signUpData.installType !== "";
      case 3:
        if (signUpData.installType === "contract") {
          return (
            signUpData.contractsSigned.freeInstallAgreement &&
            signUpData.contractsSigned.propertyAccessAgreement
          );
        }
        return signUpData.contractsSigned.propertyAccessAgreement;
      case 4:
        return true; // Review step
      case 5:
        return signUpData.paymentCompleted;
      case 6:
        return selectedDate !== undefined && signUpData.installTimeSlot !== "";
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Set Up Your Account</h2>
              <p className="text-muted-foreground">
                Create your account to begin your sign-up for {companyName}.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Create Login</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ClerkSignUp
                  appearance={{
                    elements: {
                      formButtonPrimary: "bg-orange-600 hover:bg-orange-700 text-white",
                      card: "shadow-none",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50",
                      formFieldInput: "border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                      formFieldLabel: "text-sm font-medium text-gray-700",
                      footerActionLink: "text-orange-600 hover:text-orange-700",
                    }
                  }}
                  redirectUrl="/signup-flow"
                  afterSignUpUrl="/signup-flow"
                />
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">
                Choose Your Install Type
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {companyName} offers two options for install and service
                commitment. Please select your choice below to proceed with your
                plan selection.
              </p>
            </div>

            <RadioGroup
              value={signUpData.installType}
              onValueChange={handleInstallTypeChange}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto [&_[data-state=checked]]:bg-orange-600 [&_[data-state=checked]]:border-orange-600 [&_[data-state=checked]]:text-white"
            >
              <div className="space-y-4">
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg h-full ${signUpData.installType === "contract"
                    ? "ring-2 ring-brand-primary"
                    : ""
                    }`}
                >
                  <CardHeader className="text-center">
                    <div className="flex items-center space-x-2 justify-center">
                      <RadioGroupItem value="contract" id="contract" />
                      <Label
                        htmlFor="contract"
                        className="text-xl font-semibold cursor-pointer"
                      >
                        12-Month Contract with Free Installation
                      </Label>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center pt-2">
                    <div className="text-3xl font-bold text-green-600">
                      Free Install $0
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground mt-2">
                      <p>✓ Commit to {companyName} for 12 months</p>
                      <p>✓ Switch providers at any time</p>
                      <p>
                        ⚠️ Early termination fee of ${dynamicAmount} if canceled
                        before 12 months
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg h-full ${signUpData.installType === "no-contract"
                    ? "ring-2 ring-brand-primary"
                    : ""
                    }`}
                >
                  <CardHeader className="text-center">
                    <div className="flex items-center space-x-2 justify-center">
                      <RadioGroupItem value="no-contract" id="no-contract" />
                      <Label
                        htmlFor="no-contract"
                        className="text-xl font-semibold cursor-pointer"
                      >
                        No Contract + $350 Install Fee
                      </Label>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center pt-2">
                    <div className="text-3xl font-bold text-orange-600">
                      One-Time Installation Fee $350
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground mt-2">
                      <p>✓ No long-term commitment</p>
                      <p>✓ Switch providers at any time</p>
                      <p>✓ Complete flexibility</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Sign Contracts</h2>
              <p className="text-muted-foreground">
                Please review and sign the required agreements to proceed.
              </p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Property Access Agreement - Required for all */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Property Access Agreement</span>
                    </div>
                    {signUpData.contractsSigned.propertyAccessAgreement && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This agreement grants {companyName} access to your property
                    for installation and maintenance of fiber equipment.
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadPropertyAccessPDF}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() =>
                        handleContractSign("propertyAccessAgreement")
                      }
                      disabled={
                        signUpData.contractsSigned.propertyAccessAgreement
                      }
                    >
                      {signUpData.contractsSigned.propertyAccessAgreement
                        ? "Signed"
                        : "Review & Sign"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Free Install Agreement - Only for contract option */}
              {signUpData.installType === "contract" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Free Install Agreement</span>
                      </div>
                      {signUpData.contractsSigned.freeInstallAgreement && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This agreement outlines the terms for your 12-month
                      service commitment with free installation.
                    </p>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadFreeInstallPDF}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={() =>
                          handleContractSign("freeInstallAgreement")
                        }
                        disabled={
                          signUpData.contractsSigned.freeInstallAgreement
                        }
                      >
                        {signUpData.contractsSigned.freeInstallAgreement
                          ? "Signed"
                          : "Review & Sign"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Progress Summary */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Contracts Status:</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {signUpData.contractsSigned.propertyAccessAgreement ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-orange-500" />
                        )}
                        <span className="text-sm">Property Access</span>
                      </div>
                      {signUpData.installType === "contract" && (
                        <div className="flex items-center space-x-2">
                          {signUpData.contractsSigned.freeInstallAgreement ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="text-sm">Free Install</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Property Access Agreement Modal */}
            {showPropertyAccessContract && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">
                        Property Access Agreement
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPropertyAccessContract(false)}
                      >
                        ✕
                      </Button>
                    </div>
                    <p className="text-muted-foreground mt-2">
                      This contract grants Orangeburg Fiber access to your
                      property for installing, maintaining, and operating fiber
                      optic equipment, with a commitment to restore the property
                      to its original condition after work is completed.
                    </p>
                  </div>

                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="space-y-6">
                      {/* Contract Content */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border max-h-80 overflow-y-auto">
                        <div className="prose prose-sm max-w-none">
                          <h4 className="text-lg font-bold mb-4">
                            Property Access Agreement
                          </h4>

                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800 mb-4">
                            <h5 className="font-semibold mb-2">
                              Customer Information:
                            </h5>
                            <p>
                              <strong>Name:</strong> {signUpData.name}
                            </p>
                            <p>
                              <strong>Address:</strong> {signUpData.address}
                            </p>
                            <p>
                              <strong>Date:</strong>{" "}
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>

                          <h5 className="font-semibold mt-6 mb-2">
                            1. Grant of Access
                          </h5>
                          <p className="mb-4">
                            You grant Orangeburg Fiber non-exclusive access to
                            your property to install, maintain, and operate
                            fiber optic cables, electronic access portals, and
                            associated equipment (&quot;Equipment&quot;). Access
                            includes necessary ingress and egress for these
                            activities. If requested in writing, Orangeburg
                            Fiber will remove all Equipment within 30 days.
                            Unremoved Equipment after this period may be
                            considered abandoned. Orangeburg Fiber will restore
                            your property to its original condition after
                            installation or removal, excluding normal wear and
                            tear.
                          </p>

                          <h5 className="font-semibold mb-2">
                            2. Maintenance and Damage Responsibility
                          </h5>
                          <p className="mb-4">
                            Orangeburg Fiber will repair any damage caused
                            during installation or maintenance and restore
                            affected areas to a reasonable condition. The
                            Company is responsible for locating and avoiding
                            utility damage. If the Owner damages Company
                            Equipment, the Company may seek reimbursement for
                            repairs, including legal fees.
                          </p>

                          <h5 className="font-semibold mb-2">
                            3. Assignment of Rights
                          </h5>
                          <p className="mb-4">
                            Either party may transfer their rights and
                            obligations under this Agreement to a third party,
                            with prior written notice to the other party.
                          </p>

                          <h5 className="font-semibold mb-2">
                            4. Legal Compliance and Immunity
                          </h5>
                          <p className="mb-4">
                            Orangeburg Fiber will comply with all applicable
                            laws and retains any governmental immunity provided
                            under state law.
                          </p>

                          <h5 className="font-semibold mb-2">
                            5. Binding Effect
                          </h5>
                          <p className="mb-4">
                            This Agreement is binding on all successors,
                            assigns, heirs, executors, and administrators of
                            both parties.
                          </p>

                          <h5 className="font-semibold mb-2">
                            6. Limitation of Liability
                          </h5>
                          <p className="mb-4">
                            Orangeburg Fiber's liability is limited to actual
                            damages directly caused by gross negligence or
                            intentional misconduct.
                          </p>

                          <h5 className="font-semibold mb-2">7. Amendments</h5>
                          <p className="mb-4">
                            Any changes to this Agreement must be in writing and
                            signed by both parties.
                          </p>

                          <h5 className="font-semibold mb-2">
                            8. Entire Agreement
                          </h5>
                          <p className="mb-4">
                            This document is the full agreement between the
                            Owner and the Company, superseding all prior
                            communications.
                          </p>
                        </div>
                      </div>

                      {/* Acknowledgment Section */}
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <h4 className="font-bold mb-4">Acknowledgment</h4>
                        <p className="mb-4">
                          By checking this box, I,{" "}
                          <strong>{signUpData.name}</strong>, the property owner
                          at <strong>{signUpData.address}</strong>, agree to the
                          terms of this Agreement.
                        </p>
                        <p className="mb-4">
                          <strong>Date:</strong>{" "}
                          {new Date().toLocaleDateString()}
                        </p>

                        <div className="flex items-center space-x-2 mb-4">
                          <Checkbox
                            id="acknowledge-property-terms"
                            checked={
                              signUpData.propertyAccessSignature.acknowledged
                            }
                            onCheckedChange={(checked) =>
                              setSignUpData((prev) => ({
                                ...prev,
                                propertyAccessSignature: {
                                  ...prev.propertyAccessSignature,
                                  acknowledged: checked as boolean,
                                },
                              }))
                            }
                          />
                          <Label
                            htmlFor="acknowledge-property-terms"
                            className="text-sm font-medium"
                          >
                            I agree to the terms and conditions
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="property-email-copy"
                            checked={propertyEmailCopy}
                            onCheckedChange={(checked) => setPropertyEmailCopy(checked as boolean)}
                          />
                          <Label
                            htmlFor="property-email-copy"
                            className="text-sm"
                          >
                            Email me a copy of the signed agreement
                          </Label>
                        </div>
                      </div>

                      {/* Signature Section */}
                      <div className="space-y-4">
                        <h4 className="font-bold">Digital Signature</h4>

                        {/* Signature Mode Toggle */}
                        <div className="flex space-x-2">
                          <Button
                            variant={
                              propertySignatureMode === "typed"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setPropertySignatureMode("typed")}
                          >
                            <Type className="h-4 w-4 mr-2" />
                            Type Signature
                          </Button>
                          <Button
                            variant={
                              propertySignatureMode === "drawn"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setPropertySignatureMode("drawn")}
                          >
                            <PenTool className="h-4 w-4 mr-2" />
                            Draw Signature
                          </Button>
                        </div>

                        {/* Signature Input */}
                        {propertySignatureMode === "typed" ? (
                          <div className="space-y-2">
                            <Label htmlFor="property-typed-signature">
                              Type your full name as your signature:
                            </Label>
                            <Input
                              id="property-typed-signature"
                              value={
                                signUpData.propertyAccessSignature.signature
                              }
                              onChange={(e) =>
                                setSignUpData((prev) => ({
                                  ...prev,
                                  propertyAccessSignature: {
                                    ...prev.propertyAccessSignature,
                                    signature: e.target.value,
                                  },
                                }))
                              }
                              placeholder="Enter your full name"
                              className="font-cursive text-lg"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label>Draw your signature below:</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
                              <canvas
                                ref={propertyCanvasRef}
                                width={400}
                                height={150}
                                className="w-full h-32 border rounded cursor-crosshair"
                                onMouseDown={(e) => {
                                  setIsPropertyDrawing(true);
                                  const canvas = propertyCanvasRef.current;
                                  if (!canvas) return;
                                  const rect = canvas.getBoundingClientRect();
                                  const x = e.clientX - rect.left;
                                  const y = e.clientY - rect.top;
                                  const ctx = canvas.getContext("2d");
                                  if (ctx) {
                                    ctx.beginPath();
                                    ctx.moveTo(x, y);
                                  }
                                }}
                                onMouseMove={(e) => {
                                  if (!isPropertyDrawing) return;
                                  const canvas = propertyCanvasRef.current;
                                  if (!canvas) return;
                                  const rect = canvas.getBoundingClientRect();
                                  const x = e.clientX - rect.left;
                                  const y = e.clientY - rect.top;
                                  const ctx = canvas.getContext("2d");
                                  if (ctx) {
                                    ctx.lineTo(x, y);
                                    ctx.stroke();
                                    setSignUpData((prev) => ({
                                      ...prev,
                                      propertyAccessSignature: {
                                        ...prev.propertyAccessSignature,
                                        signature: canvas.toDataURL(),
                                      },
                                    }));
                                  }
                                }}
                                onMouseUp={() => setIsPropertyDrawing(false)}
                                onMouseLeave={() => setIsPropertyDrawing(false)}
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearPropertySignature}
                            >
                              Clear Signature
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        This agreement will be timestamped and legally binding
                        upon signature.
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowPropertyAccessContract(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handlePropertyAccessSignature}
                          disabled={
                            !signUpData.propertyAccessSignature.acknowledged ||
                            !signUpData.propertyAccessSignature.signature
                          }
                        >
                          Sign Agreement
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Digital Signature Modal for Free Install Agreement */}
            {showFreeInstallContract && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">
                        Free Install Agreement
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFreeInstallContract(false)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="space-y-6">
                      {/* Contract Content */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border">
                        <div className="prose prose-sm max-w-none">
                          <h4 className="text-lg font-bold mb-4">
                            Orangeburg Fiber Network Customer Agreement
                          </h4>

                          <p className="mb-4">
                            This Customer Agreement (the &quot;Agreement&quot;)
                            is entered into by and between Orangeburg Fiber
                            Network (&quot;Orangeburg&quot;), located at [Insert
                            Address], and the customer (&quot;Customer&quot;),
                            whose information is provided below.
                          </p>

                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800 mb-4">
                            <h5 className="font-semibold mb-2">
                              Customer Information:
                            </h5>
                            <p>
                              <strong>Name:</strong> {signUpData.name}
                            </p>
                            <p>
                              <strong>Address:</strong> {signUpData.address}
                            </p>
                            <p>
                              <strong>Date:</strong>{" "}
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>

                          <h5 className="font-semibold mt-6 mb-2">
                            1. Service Commitment
                          </h5>
                          <p className="mb-4">
                            The Customer agrees to maintain an active
                            subscription to Orangeburg Fiber services for a
                            minimum period of six (6) months from the date of
                            installation. Installation fees are waived under
                            this option.
                          </p>

                          <h5 className="font-semibold mb-2">
                            2. Service Terms
                          </h5>
                          <p className="mb-2">
                            2.1 The Customer may switch internet service
                            providers or cancel services at any time. This
                            Agreement does not impose any long-term commitment
                            beyond the six-month service period.
                          </p>
                          <p className="mb-2">
                            2.2 Any changes to service must comply with
                            Orangeburg's standard terms and conditions.
                          </p>
                          <p className="mb-4">
                            2.3 If the Customer cancels services before the
                            six-month period, a $350 early termination fee will
                            apply.
                          </p>

                          <h5 className="font-semibold mb-2">
                            3. Installation and Equipment
                          </h5>
                          <p className="mb-2">
                            3.1 Orangeburg will install the necessary equipment
                            to provide fiber internet services at the Customer's
                            premises. All equipment provided by Orangeburg
                            remains the property of Orangeburg.
                          </p>
                          <p className="mb-2">
                            3.2 The Customer is responsible for maintaining the
                            provided equipment in good working condition. Any
                            damage to equipment beyond normal wear and tear may
                            result in repair or replacement charges.
                          </p>
                          <p className="mb-4">
                            3.3 If the Customer terminates services, all
                            Orangeburg equipment must be returned within 14
                            days. Failure to return the equipment may result in
                            additional charges.
                          </p>

                          <h5 className="font-semibold mb-2">
                            4. Billing and Payments
                          </h5>
                          <p className="mb-2">
                            4.1 Service fees will be billed monthly. Payments
                            are due in full on the billing date.
                          </p>
                          <p className="mb-2">
                            4.2 The monthly service fees will remain consistent
                            during the initial six-month period.
                          </p>
                          <p className="mb-4">
                            4.3 Late payments may incur penalties as outlined in
                            Orangeburg's standard billing terms.
                          </p>

                          <h5 className="font-semibold mb-2">
                            5. Limitation of Liability
                          </h5>
                          <p className="mb-2">
                            5.1 Orangeburg is not liable for any interruption of
                            service, except as provided by applicable law.
                            Customers must notify Orangeburg of any service
                            issues to allow for resolution.
                          </p>
                          <p className="mb-4">
                            5.2 This Agreement does not limit the Customer's
                            right to choose another internet service provider at
                            any time.
                          </p>

                          <h5 className="font-semibold mb-2">
                            6. Entire Agreement
                          </h5>
                          <p className="mb-4">
                            This Agreement constitutes the entire agreement
                            between Orangeburg and the Customer concerning the
                            subject matter hereof and supersedes any prior
                            agreements or understandings.
                          </p>
                        </div>
                      </div>

                      {/* Acknowledgment Section */}
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <h4 className="font-bold mb-4">Acknowledgment</h4>
                        <p className="mb-4">
                          By checking this box, I,{" "}
                          <strong>{signUpData.name}</strong>, the property owner
                          at <strong>{signUpData.address}</strong>, agree to the
                          terms of this Agreement.
                        </p>
                        <p className="mb-4">
                          <strong>Date:</strong>{" "}
                          {new Date().toLocaleDateString()}
                        </p>

                        <div className="flex items-center space-x-2 mb-4">
                          <Checkbox
                            id="acknowledge-terms"
                            checked={
                              signUpData.freeInstallSignature.acknowledged
                            }
                            onCheckedChange={handleAcknowledgmentChange}
                          />
                          <Label
                            htmlFor="acknowledge-terms"
                            className="text-sm font-medium"
                          >
                            I agree to the terms and conditions
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="email-copy"
                            checked={emailCopy}
                            onCheckedChange={(checked) => setEmailCopy(checked as boolean)}
                          />
                          <Label htmlFor="email-copy" className="text-sm">
                            Email me a copy of the signed agreement
                          </Label>
                        </div>
                      </div>

                      {/* Signature Section */}
                      <div className="space-y-4">
                        <h4 className="font-bold">Digital Signature</h4>

                        {/* Signature Mode Toggle */}
                        <div className="flex space-x-2">
                          <Button
                            variant={
                              signatureMode === "typed" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSignatureMode("typed")}
                          >
                            <Type className="h-4 w-4 mr-2" />
                            Type Signature
                          </Button>
                          <Button
                            variant={
                              signatureMode === "drawn" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSignatureMode("drawn")}
                          >
                            <PenTool className="h-4 w-4 mr-2" />
                            Draw Signature
                          </Button>
                        </div>

                        {/* Signature Input */}
                        {signatureMode === "typed" ? (
                          <div className="space-y-2">
                            <Label htmlFor="typed-signature">
                              Type your full name as your signature:
                            </Label>
                            <Input
                              id="typed-signature"
                              value={signUpData.freeInstallSignature.signature}
                              onChange={(e) =>
                                handleSignatureChange(e.target.value)
                              }
                              placeholder="Enter your full name"
                              className="font-cursive text-lg"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label>Draw your signature below:</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
                              <canvas
                                ref={canvasRef}
                                width={400}
                                height={150}
                                className="w-full h-32 border rounded cursor-crosshair"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearSignature}
                            >
                              Clear Signature
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        This agreement will be timestamped and legally binding
                        upon signature.
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowFreeInstallContract(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleFreeInstallSignature}
                          disabled={
                            !signUpData.freeInstallSignature.acknowledged ||
                            !signUpData.freeInstallSignature.signature
                          }
                        >
                          Sign Agreement
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">
                Review Your Info Before Submitting
              </h2>
              <p className="text-muted-foreground">
                Please review all information before proceeding to payment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{signUpData.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{signUpData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{signUpData.phone}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <span className="text-sm">{signUpData.address}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Install & Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Install Type:</span>
                    <p className="text-sm text-muted-foreground">
                      {signUpData.installType === "contract"
                        ? "12-Month Contract with Free Installation"
                        : "No Contract + $350 Install Fee"}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {signUpData.installType === "contract"
                        ? "Deposit:"
                        : "Installation Fee:"}
                    </span>
                    <span className="text-xl font-bold">
                      ${signUpData.paymentAmount}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contracts Status */}
            <Card>
              <CardHeader>
                <CardTitle>Signed Contracts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Property Access Agreement</span>
                  {signUpData.contractsSigned.propertyAccessAgreement ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Signed</span>
                    </div>
                  ) : (
                    <span className="text-sm text-red-600">Not Signed</span>
                  )}
                </div>
                {signUpData.installType === "contract" && (
                  <div className="flex items-center justify-between">
                    <span>Free Install Agreement</span>
                    {signUpData.contractsSigned.freeInstallAgreement ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Signed</span>
                      </div>
                    ) : (
                      <span className="text-sm text-red-600">Not Signed</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Enter Payment</h2>
              <p className="text-muted-foreground">
                Complete your payment to proceed with installation scheduling.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {signUpData.installType === "contract"
                        ? "Service Deposit"
                        : "Installation Fee"}
                    </span>
                    <span className="text-2xl font-bold">
                      ${signUpData.paymentAmount}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {signUpData.installType === "contract"
                      ? ""
                      : "One-time installation fee for no-contract service"}
                  </p>
                  {signUpData.installType === "contract" && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              i
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          This $55 deposit will be applied towards any plan you
                          select during installation.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="12345" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardholder">Cardholder Name</Label>
                    <Input
                      id="cardholder"
                      placeholder="John Doe"
                      defaultValue={signUpData.name}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handlePaymentComplete}
                    className="w-full"
                    size="lg"
                  >
                    Complete Payment - ${signUpData.paymentAmount}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Schedule Install</h2>
              <p className="text-muted-foreground">
                Choose your preferred installation date and time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-left">
                    <CalendarIcon className="h-5 w-5" />
                    <span>Select Date</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="w-full p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const today = new Date();
                      const tomorrow = new Date(today);
                      tomorrow.setDate(today.getDate() + 1);
                      return date < tomorrow || date.getDay() === 0; // Disable past dates and Sundays
                    }}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Select Time Slot</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={signUpData.installTimeSlot}
                    onValueChange={(value) =>
                      setSignUpData((prev) => ({
                        ...prev,
                        installTimeSlot: value,
                      }))
                    }
                  >
                    {availableTimeSlots.map((slot) => (
                      <div
                        key={slot}
                        className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <RadioGroupItem value={slot} id={slot} />
                        <Label htmlFor={slot} className="flex-1 cursor-pointer">
                          {slot}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {selectedDate && signUpData.installTimeSlot && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        Installation Scheduled
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>Date:</strong>{" "}
                        {selectedDate.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>Time:</strong> {signUpData.installTimeSlot}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-2 font-medium">
                        ⚠️ Please ensure you are home during the scheduled
                        installation time.
                      </p>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button
                      onClick={handleScheduleInstall}
                      disabled={!selectedDate || !signUpData.installTimeSlot}
                      className="w-full"
                      size="lg"
                    >
                      Confirm Installation Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-8 max-w-3xl mx-auto text-center">
            <div className="space-y-4">
              <CheckCircle className="h-24 w-24 text-green-600 mx-auto" />
              <h2 className="text-4xl font-bold text-green-600">
                Welcome to {companyName}!
              </h2>
              <p className="text-xl text-muted-foreground">
                Your fiber internet service has been successfully set up.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-left text-xl">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Service Details</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Email:</strong> {signUpData.email}
                      </p>
                      <p>
                        <strong>Amount Paid:</strong> $
                        {signUpData.paymentAmount}
                      </p>
                      <p>
                        <strong>Service Address:</strong> {signUpData.address}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Installation</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Date:</strong>{" "}
                        {signUpData.installDate?.toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Time:</strong> {signUpData.installTimeSlot}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className="text-green-600">Confirmed</span>
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">What's Next?</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      • You'll receive a confirmation email with all details
                    </p>
                    <p>
                      • Our technician will contact you 24 hours before
                      installation
                    </p>
                    <p>• Installation typically takes 2-4 hours</p>
                    <p>
                      • You can choose your internet provider after installation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                size="lg"
                className="px-8 py-3 h-auto font-bold text-lg"
              >
                Return to Home
              </Button>
              <Button
                onClick={() => navigate("/my-account")}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg px-8 py-3 h-auto"
              >
                Go to My Account
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  console.log(currentStep);

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Step {currentStep} of {STEPS.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center space-y-2"
                >
                  <div
                    className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                    ${isActive ? "bg-brand-primary border-brand-primary text-white" : ""}
                    ${isCompleted ? "bg-green-600 border-green-600 text-white" : ""}
                    ${!isActive && !isCompleted ? "border-gray-300 text-gray-400" : ""}
                  `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-xs font-medium ${isActive
                        ? "text-brand-primary"
                        : isCompleted
                          ? "text-green-600"
                          : "text-gray-400"
                        }`}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {renderStepContent()}

        {/* Navigation Buttons */}
        {currentStep < 7 && (
          <div className="flex justify-between items-center mt-12 max-w-4xl mx-auto">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep === 1 ? (
              <div className="text-center text-sm text-muted-foreground">
                {isSignedIn ? "Account created successfully! Proceeding..." : "Please complete the sign-up form above"}
              </div>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceedFromStep(currentStep)}
                className="flex items-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
