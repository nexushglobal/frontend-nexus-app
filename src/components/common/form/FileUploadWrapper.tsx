"use client";

import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { LucideIcon, Upload } from "lucide-react";
import { useRef } from "react";
import {
    ControllerRenderProps,
    FieldPath,
    FieldValues
} from "react-hook-form";

interface FileUploadWrapperProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    field: ControllerRenderProps<TFieldValues, TName>;
    label: string;
    icon?: LucideIcon;
    accept?: string;
    disabled?: boolean;
    helpText?: string;
    required?: boolean;
    buttonText?: string;
    onFileChange?: (files: FileList | null) => void;
}

export function FileUploadWrapper<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    field,
    label,
    icon: Icon = Upload,
    accept,
    disabled = false,
    helpText,
    required = false,
    buttonText = "Elegir Archivo",
    onFileChange
}: FileUploadWrapperProps<TFieldValues, TName>) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        field.onChange(files);
        if (onFileChange) {
            onFileChange(files);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <FormItem>
            <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
                {!required && <span className="text-xs text-muted-foreground ml-1">(opcional)</span>}
            </FormLabel>
            <FormControl>
                <div className="space-y-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={disabled}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleButtonClick}
                        disabled={disabled}
                        className="w-full"
                    >
                        <Icon className="mr-2 h-4 w-4" />
                        {buttonText}
                    </Button>
                </div>
            </FormControl>
            {helpText && (
                <p className="text-xs text-muted-foreground">
                    {helpText}
                </p>
            )}
            <FormMessage />
        </FormItem>
    );
}