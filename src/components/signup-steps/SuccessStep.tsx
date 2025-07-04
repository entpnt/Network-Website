import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { CheckCircle } from "lucide-react";

interface SuccessStepProps {
    companyName: string;
    signUpData: {
        email: string;
        paymentAmount: number;
        address: string;
        installDate: Date | null;
        installTimeSlot: string;
    };
    onReturnHome: () => void;
    onGoToAccount: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
    companyName,
    signUpData,
    onReturnHome,
    onGoToAccount,
}) => {
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
                                    <strong>Amount Paid:</strong> ${signUpData.paymentAmount}
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
                    onClick={onReturnHome}
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 h-auto font-bold text-lg"
                >
                    Return to Home
                </Button>
                <Button
                    onClick={onGoToAccount}
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg px-8 py-3 h-auto"
                >
                    Go to My Account
                </Button>
            </div>
        </div>
    );
};

export default SuccessStep; 