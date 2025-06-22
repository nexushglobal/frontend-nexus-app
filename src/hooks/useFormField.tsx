"use client";

import { FormField } from "@/components/ui/form";
import {
    Control,
    FieldPath,
    FieldValues
} from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { FormFieldWrapper } from "@/components/common/form/FormFileWrapper";

interface BaseFieldConfig {
    label: string;
    icon?: LucideIcon;
    required?: boolean;
    helpText?: string;
    disabled?: boolean;
}

interface InputFieldConfig extends BaseFieldConfig {
    type: "input";
    placeholder?: string;
    inputType?: "text" | "email" | "password" | "tel" | "number";
    maxLength?: number;
    className?: string;
}

interface SelectFieldConfig extends BaseFieldConfig {
    type: "select";
    placeholder?: string;
    options: Array<{
        value: string;
        label: string;
        icon?: string | ReactNode;
    }>;
}

type FieldConfig = InputFieldConfig | SelectFieldConfig;

export function useFormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
    control: Control<TFieldValues>,
    name: TName,
    config: FieldConfig
) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormFieldWrapper
                    field={field}
                    {...config}
                />
            )}
        />
    );
}

export function createFormField<TFieldValues extends FieldValues = FieldValues>() {
    return function FormFieldCreator<TName extends FieldPath<TFieldValues>>(
        control: Control<TFieldValues>,
        name: TName,
        config: FieldConfig
    ) {
        return (
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormFieldWrapper
                        field={field}
                        {...config}
                    />
                )}
            />
        );
    };
}