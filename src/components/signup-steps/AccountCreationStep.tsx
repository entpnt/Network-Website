import React from "react";
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { UserPlus } from "lucide-react";

interface AccountCreationStepProps {
    companyName: string;
}

const AccountCreationStep: React.FC<AccountCreationStepProps> = ({ companyName }) => {
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
};

export default AccountCreationStep; 