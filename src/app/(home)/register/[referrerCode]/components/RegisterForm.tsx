"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    CompleteRegistrationData,
    CredentialsStepData,
    DocumentStepData,
    PersonalInfoStepData,
} from "../schemas/register-schemas";
import { StepIndicator } from "./StepIndicator";
import { CredentialsStep } from "./steps/CredentialsStep";
import { DocumentStep } from "./steps/DocumentStep";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { SuccessPage } from "./SuccessPage";

interface RegisterFormProps {
    referrerCode: string;
    position: "LEFT" | "RIGHT";
}

type StepData = {
    document?: DocumentStepData;
    personalInfo?: PersonalInfoStepData;
    credentials?: CredentialsStepData;
};

export function RegisterForm({ referrerCode, position }: RegisterFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isCompleted, setIsCompleted] = useState(false);
    const [stepData, setStepData] = useState<StepData>({});
    const [validatedData, setValidatedData] = useState<any>(null);

    const totalSteps = 3;

    const handleDocumentNext = (data: DocumentStepData, validated?: any) => {
        setStepData((prev) => ({ ...prev, document: data }));
        setValidatedData(validated);
        setCurrentStep(2);
    };

    const handlePersonalInfoNext = (data: PersonalInfoStepData) => {
        setStepData((prev) => ({ ...prev, personalInfo: data }));
        setCurrentStep(3);
    };

    const handleCredentialsSuccess = () => {
        setIsCompleted(true);
    };

    const handleStepBack = (step: number) => {
        setCurrentStep(step);
    };

    const getRegistrationData = (): Omit<CompleteRegistrationData, "email" | "password"> => {
        return {
            documentType: stepData.document!.documentType,
            documentNumber: stepData.document!.documentNumber,
            firstName: stepData.personalInfo!.firstName,
            lastName: stepData.personalInfo!.lastName,
            phone: stepData.personalInfo!.phone,
            birthDate: stepData.personalInfo!.birthDate,
            gender: stepData.personalInfo!.gender,
            country: stepData.personalInfo!.country,
            referrerCode: referrerCode !== "new" ? referrerCode : undefined,
            position,
            roleCode: "CLI",
        };
    };

    if (isCompleted) {
        return <SuccessPage />;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card border rounded-lg p-6 shadow-sm"
            >
                {currentStep === 1 && (
                    <DocumentStep
                        onNext={handleDocumentNext}
                        defaultValues={stepData.document}
                    />
                )}

                {currentStep === 2 && (
                    <PersonalInfoStep
                        onNext={handlePersonalInfoNext}
                        onPrevious={() => handleStepBack(1)}
                        defaultValues={stepData.personalInfo}
                        validatedData={validatedData}
                    />
                )}

                {currentStep === 3 && (
                    <CredentialsStep
                        onPrevious={() => handleStepBack(2)}
                        onSuccess={handleCredentialsSuccess}
                        defaultValues={stepData.credentials}
                        registrationData={getRegistrationData()}
                    />
                )}
            </motion.div>
        </div>
    );
}