import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface SchedulingStepProps {
    selectedDate: Date | undefined;
    setSelectedDate: (date: Date | undefined) => void;
    installTimeSlot: string;
    onTimeSlotChange: (value: string) => void;
    onScheduleInstall: () => void;
    availableTimeSlots: string[];
}

const SchedulingStep: React.FC<SchedulingStepProps> = ({
    selectedDate,
    setSelectedDate,
    installTimeSlot,
    onTimeSlotChange,
    onScheduleInstall,
    availableTimeSlots,
}) => {
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
                            value={installTimeSlot}
                            onValueChange={onTimeSlotChange}
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

                        {selectedDate && installTimeSlot && (
                            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                                    Installation Scheduled
                                </h4>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    <strong>Date:</strong> {selectedDate.toLocaleDateString()}
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    <strong>Time:</strong> {installTimeSlot}
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-300 mt-2 font-medium">
                                    ⚠️ Please ensure you are home during the scheduled
                                    installation time.
                                </p>
                            </div>
                        )}

                        <div className="pt-4">
                            <Button
                                onClick={onScheduleInstall}
                                disabled={!selectedDate || !installTimeSlot}
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
};

export default SchedulingStep; 