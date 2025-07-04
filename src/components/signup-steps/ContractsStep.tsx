import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, Clock, Download, FileText } from "lucide-react";

interface ContractsStepProps {
    companyName: string;
    installType: "contract" | "no-contract" | "";
    contractsSigned: {
        freeInstallAgreement: boolean;
        propertyAccessAgreement: boolean;
    };
    onContractSign: (contractType: "freeInstallAgreement" | "propertyAccessAgreement") => void;
    onDownloadPropertyAccessPDF: () => void;
    onDownloadFreeInstallPDF: () => void;
}

const ContractsStep: React.FC<ContractsStepProps> = ({
    companyName,
    installType,
    contractsSigned,
    onContractSign,
    onDownloadPropertyAccessPDF,
    onDownloadFreeInstallPDF,
}) => {
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
                            {contractsSigned.propertyAccessAgreement && (
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
                                onClick={onDownloadPropertyAccessPDF}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                            <Button
                                onClick={() => onContractSign("propertyAccessAgreement")}
                                disabled={contractsSigned.propertyAccessAgreement}
                            >
                                {contractsSigned.propertyAccessAgreement
                                    ? "Signed"
                                    : "Review & Sign"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Free Install Agreement - Only for contract option */}
                {installType === "contract" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <FileText className="h-5 w-5" />
                                    <span>Free Install Agreement</span>
                                </div>
                                {contractsSigned.freeInstallAgreement && (
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
                                    onClick={onDownloadFreeInstallPDF}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                                <Button
                                    onClick={() => onContractSign("freeInstallAgreement")}
                                    disabled={contractsSigned.freeInstallAgreement}
                                >
                                    {contractsSigned.freeInstallAgreement
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
                                    {contractsSigned.propertyAccessAgreement ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Clock className="h-4 w-4 text-orange-500" />
                                    )}
                                    <span className="text-sm">Property Access</span>
                                </div>
                                {installType === "contract" && (
                                    <div className="flex items-center space-x-2">
                                        {contractsSigned.freeInstallAgreement ? (
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
        </div>
    );
};

export default ContractsStep; 