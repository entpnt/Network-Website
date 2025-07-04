import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CreditCard, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Separator } from "../ui/separator";

interface PaymentStepProps {
    signUpData: {
        installType: "contract" | "no-contract" | "";
        paymentAmount: number;
        name: string;
        email: string;
        address: string;
        contractsSigned: {
            freeInstallAgreement: boolean;
            propertyAccessAgreement: boolean;
        };
        paymentSessionId?: string;
    };
    isProcessingPayment: boolean;
    paymentError: string;
    onStripeCheckout: () => void;
    onBack?: () => void;
    onClearSavedData?: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
    signUpData,
    isProcessingPayment,
    paymentError,
    onStripeCheckout,
    onBack,
    onClearSavedData,
}) => {
    const [showPaymentReview, setShowPaymentReview] = useState(false);

    const handleConfirmAndProceed = () => {
        setShowPaymentReview(true);
    };

    const handleCancelPayment = () => {
        setShowPaymentReview(false);
    };

    if (showPaymentReview) {
        return (
            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-2">Review & Confirm Payment</h2>
                    <p className="text-muted-foreground">
                        Please review your selections before proceeding to payment.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <CreditCard className="h-5 w-5" />
                            <span>Payment Review</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Service Type Summary */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">Service Selection</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Install Type:</span>
                                    <span className="font-medium">
                                        {signUpData.installType === "contract"
                                            ? "12-Month Contract"
                                            : "No Contract Service"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Installation:</span>
                                    <span className="font-medium">
                                        {signUpData.installType === "contract"
                                            ? "Free"
                                            : "$350"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Deposit:</span>
                                    <span className="font-medium">
                                        {signUpData.installType === "contract"
                                            ? "$55"
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contracts Status */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">Signed Contracts</h4>
                            <div className="space-y-2">
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
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
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
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                {signUpData.installType === "contract"
                                    ? "This $55 deposit will be applied towards any plan you select during installation."
                                    : "One-time installation fee for no-contract service"}
                            </p>
                        </div>

                        {/* Error Display */}
                        {paymentError && (
                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                                <div className="flex items-start space-x-2">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">!</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        {paymentError}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4">
                            <Button
                                onClick={handleCancelPayment}
                                variant="outline"
                                className="flex-1"
                                disabled={isProcessingPayment}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Review
                            </Button>
                            <Button
                                onClick={onStripeCheckout}
                                disabled={isProcessingPayment}
                                className="flex-1"
                                size="lg"
                            >
                                {isProcessingPayment ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        {signUpData.paymentSessionId ? "Verifying Payment..." : "Processing..."}
                                    </>
                                ) : (
                                    <>
                                        <ArrowRight className="h-4 w-4 mr-2" />
                                        Proceed to Payment - ${signUpData.paymentAmount}
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                                            <span className="text-white text-xs font-bold">i</span>
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

                    {/* Payment Information */}
                    <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start space-x-2">
                                <div className="flex-shrink-0 mt-0.5">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">i</span>
                                    </div>
                                </div>
                                <div className="text-sm text-blue-700 dark:text-blue-300">
                                    <p className="font-medium mb-1">Secure Payment Processing</p>
                                    <p>
                                        Your payment will be processed securely through Stripe.
                                        You'll be redirected to Stripe's secure checkout page to complete your payment.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">Payment Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Service Type:</span>
                                    <span className="font-medium">
                                        {signUpData.installType === "contract"
                                            ? "12-Month Contract"
                                            : "No Contract Service"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Installation:</span>
                                    <span className="font-medium">
                                        {signUpData.installType === "contract"
                                            ? "Free"
                                            : "$350"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Deposit:</span>
                                    <span className="font-medium">
                                        {signUpData.installType === "contract"
                                            ? "$55"
                                            : "N/A"}
                                    </span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between font-bold">
                                        <span>Total:</span>
                                        <span>${signUpData.paymentAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error Display */}
                        {paymentError && (
                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                                <div className="flex items-start space-x-2">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">!</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        {paymentError}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 space-y-3">
                        <Button
                            onClick={handleConfirmAndProceed}
                            disabled={isProcessingPayment}
                            className="w-full"
                            size="lg"
                        >
                            {isProcessingPayment ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {signUpData.paymentSessionId ? "Verifying Payment..." : "Processing..."}
                                </>
                            ) : (
                                `Review & Confirm Payment - $${signUpData.paymentAmount}`
                            )}
                        </Button>

                        {/* Debug button - remove in production */}
                        {onClearSavedData && (
                            <Button
                                onClick={onClearSavedData}
                                variant="outline"
                                size="sm"
                                className="w-full"
                            >
                                Clear Saved Data (Debug)
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentStep; 