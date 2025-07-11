"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues
} from "react-hook-form";

interface BaseFieldProps {
  label: string;
  icon?: LucideIcon;
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  type: "input";
  placeholder?: string;
  inputType?: "text" | "email" | "password" | "tel" | "number";
  maxLength?: number;
  className?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  placeholder?: string;
  options: Array<{
    value: string;
    label: string;
    icon?: string | ReactNode;
  }>;
}

// Tipo genérico que extiende las props del campo con el field tipado
type FormFieldWrapperProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = (InputFieldProps | SelectFieldProps) & {
  field: ControllerRenderProps<TFieldValues, TName>;
};

export function FormFieldWrapper<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ field, ...props }: FormFieldWrapperProps<TFieldValues, TName>) {
  const { label, icon: Icon, required, helpText, disabled } = props;

  const renderInput = () => {
    if (props.type === "input") {
      const { placeholder, inputType = "text", maxLength, className } = props;

      return (
        <div className="relative">
          {Icon && <Icon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />}
          <Input
            {...field}
            type={inputType}
            placeholder={placeholder}
            className={`${Icon ? "pl-10" : ""} ${className || ""}`}
            disabled={disabled}
            maxLength={maxLength}
          />
        </div>
      );
    }

    if (props.type === "select") {
      const { placeholder, options } = props;

      return (
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          disabled={disabled}
        >
          <FormControl>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                <SelectValue placeholder={placeholder} />
              </div>
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.icon && (
                    typeof option.icon === "string" ? (
                      <span>{option.icon}</span>
                    ) : (
                      option.icon
                    )
                  )}
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return null;
  };

  return (
    <FormItem>
      <FormLabel>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
        {!required && <span className="text-xs text-muted-foreground ml-1">(opcional)</span>}
      </FormLabel>
      <FormControl>
        {renderInput()}
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