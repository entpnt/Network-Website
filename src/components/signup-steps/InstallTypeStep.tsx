import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface InstallTypeStepProps {
    companyName: string;
    installType: "contract" | "no-contract" | "";
    onInstallTypeChange: (value: string) => void;
    dynamicAmount: string;
}

const InstallTypeStep: React.FC<InstallTypeStepProps> = ({
    companyName,
    installType,
    onInstallTypeChange,
    dynamicAmount,
}) => {
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
                value={installType}
                onValueChange={onInstallTypeChange}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto [&_[data-state=checked]]:bg-orange-600 [&_[data-state=checked]]:border-orange-600 [&_[data-state=checked]]:text-white"
            >
                <div className="space-y-4">
                    <Card
                        className={`cursor-pointer transition-all hover:shadow-lg h-full ${installType === "contract"
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
                        className={`cursor-pointer transition-all hover:shadow-lg h-full ${installType === "no-contract"
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
};

export default InstallTypeStep; 