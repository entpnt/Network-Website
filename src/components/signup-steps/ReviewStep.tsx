import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { CheckCircle, Mail, MapPin, Phone, User } from "lucide-react";

interface ReviewStepProps {
    signUpData: {
        name: string;
        email: string;
        phone: string;
        address: string;
        installType: "contract" | "no-contract" | "";
        paymentAmount: number;
        contractsSigned: {
            freeInstallAgreement: boolean;
            propertyAccessAgreement: boolean;
        };
    };
}

const ReviewStep: React.FC<ReviewStepProps> = ({ signUpData }) => {
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
};

export default ReviewStep; 