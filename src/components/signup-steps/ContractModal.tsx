import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Type, PenTool } from "lucide-react";

interface ContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    contractContent: React.ReactNode;
    signUpData: {
        name: string;
        address: string;
    };

    // Signature state
    signature: {
        acknowledged: boolean;
        signature: string;
        signatureType: "typed" | "drawn";
        timestamp: string;
    };
    signatureMode: "typed" | "drawn";
    setSignatureMode: (mode: "typed" | "drawn") => void;
    isDrawing: boolean;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    emailCopy: boolean;
    setEmailCopy: (copy: boolean) => void;

    // Handlers
    onSignatureChange: (signature: string) => void;
    onAcknowledgmentChange: (acknowledged: boolean) => void;
    onSignAgreement: () => void;
    clearSignature: () => void;
    setIsDrawing: (drawing: boolean) => void;
    setSignature: (signature: any) => void;

    // Drawing handlers
    startDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    draw: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    stopDrawing: () => void;

    // IDs for form elements
    checkboxId: string;
    emailCheckboxId: string;
    signatureInputId: string;
}

const ContractModal: React.FC<ContractModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    contractContent,
    signUpData,
    signature,
    signatureMode,
    setSignatureMode,
    isDrawing,
    canvasRef,
    emailCopy,
    setEmailCopy,
    onSignatureChange,
    onAcknowledgmentChange,
    onSignAgreement,
    clearSignature,
    setIsDrawing,
    setSignature,
    startDrawing,
    draw,
    stopDrawing,
    checkboxId,
    emailCheckboxId,
    signatureInputId,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold">{title}</h3>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            ✕
                        </Button>
                    </div>
                    <p className="text-muted-foreground mt-2">{description}</p>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="space-y-6">
                        {/* Contract Content */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border max-h-80 overflow-y-auto">
                            {contractContent}
                        </div>

                        {/* Acknowledgment Section */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <h4 className="font-bold mb-4">Acknowledgment</h4>
                            <p className="mb-4">
                                By checking this box, I, <strong>{signUpData.name}</strong>, the property owner
                                at <strong>{signUpData.address}</strong>, agree to the terms of this Agreement.
                            </p>
                            <p className="mb-4">
                                <strong>Date:</strong> {new Date().toLocaleDateString()}
                            </p>

                            <div className="flex items-center space-x-2 mb-4">
                                <Checkbox
                                    id={checkboxId}
                                    checked={signature.acknowledged}
                                    onCheckedChange={(checked) => {
                                        console.log('Checkbox clicked!', checkboxId, 'checked:', checked);
                                        onAcknowledgmentChange(checked as boolean);
                                    }}
                                />
                                <Label htmlFor={checkboxId} className="text-sm font-medium">
                                    I agree to the terms and conditions
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id={emailCheckboxId}
                                    checked={emailCopy}
                                    onCheckedChange={(checked) => setEmailCopy(checked as boolean)}
                                />
                                <Label htmlFor={emailCheckboxId} className="text-sm">
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
                                    variant={signatureMode === "typed" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        setSignatureMode("typed");
                                        // Clear signature when switching to typed mode
                                        onSignatureChange("");
                                    }}
                                >
                                    <Type className="h-4 w-4 mr-2" />
                                    Type Signature
                                </Button>
                                <Button
                                    variant={signatureMode === "drawn" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        setSignatureMode("drawn");
                                        // Clear signature when switching to drawn mode
                                        onSignatureChange("");
                                        // Also clear the canvas
                                        if (canvasRef.current) {
                                            const canvas = canvasRef.current;
                                            const ctx = canvas.getContext("2d");
                                            if (ctx) {
                                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                            }
                                        }
                                    }}
                                >
                                    <PenTool className="h-4 w-4 mr-2" />
                                    Draw Signature
                                </Button>
                            </div>

                            {/* Signature Input */}
                            {signatureMode === "typed" ? (
                                <div className="space-y-2">
                                    <Label htmlFor={signatureInputId}>
                                        Type your full name as your signature:
                                    </Label>
                                    <Input
                                        id={signatureInputId}
                                        value={signature.signature}
                                        onChange={(e) => onSignatureChange(e.target.value)}
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
                                    <Button variant="outline" size="sm" onClick={clearSignature}>
                                        Clear Signature
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">
                            This agreement will be timestamped and legally binding upon signature.
                        </div>
                        <div className="flex space-x-3">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                onClick={onSignAgreement}
                                disabled={!signature.acknowledged || !signature.signature}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Sign Agreement
                            </Button>
                        </div>
                    </div>
                    {/* Debug info */}
                    <div className="mt-2 text-xs text-gray-500">
                        Debug: acknowledged={signature.acknowledged.toString()}, signature={signature.signature ? 'provided' : 'missing'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractModal; 