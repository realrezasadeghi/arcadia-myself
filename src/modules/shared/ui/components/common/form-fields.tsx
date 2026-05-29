"use client";

/**
 * Composed form field components.
 * Each component wraps FormField + FormItem + FormLabel + FormControl + FormMessage
 * so you don't have to repeat all that boilerplate every time.
 *
 * Usage:
 *   <FieldInput control={form.control} name="email" label="ایمیل" type="email" dir="ltr" />
 *   <FieldPassword control={form.control} name="password" label="رمز عبور" />
 *   <FieldTextarea control={form.control} name="description" label="توضیحات" />
 *   <FieldSelect control={form.control} name="role" label="نقش" options={roleOptions} />
 */

import { Eye, EyeOff } from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import type { FieldValues, Path } from "react-hook-form";
import { cn } from "../../libs/cn";
import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

// ─── Shared types ──────────────────────────────────────────────────────────────

interface BaseFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

// ─── FieldInput ────────────────────────────────────────────────────────────────

type FieldInputProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">;

export function FieldInput<T extends FieldValues>({
  name,
  label,
  description,
  className,
  disabled,
  ...inputProps
}: FieldInputProps<T>) {
  return (
    <FormField
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel data-error={fieldState.invalid}>{label}</FormLabel>
          )}
          <FormControl>
            <Input {...inputProps} {...field} value={field.value ?? ""} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ─── FieldPassword ─────────────────────────────────────────────────────────────

type FieldPasswordProps<T extends FieldValues> = BaseFieldProps<T> & {
  placeholder?: string;
};

export function FieldPassword<T extends FieldValues>({
  name,
  label,
  description,
  className,
  disabled,
  placeholder = "••••••••",
}: FieldPasswordProps<T>) {
  const [show, setShow] = useState(false);
  return (
    <FormField
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel data-error={fieldState.invalid}>{label}</FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Input
                dir="ltr"
                className="pl-10"
                placeholder={placeholder}
                type={show ? "text" : "password"}
                {...field}
                value={field.value ?? ""}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
                aria-label={show ? "مخفی کردن رمز" : "نمایش رمز"}
              >
                {show ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ─── FieldTextarea ─────────────────────────────────────────────────────────────

type FieldTextareaProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name">;

export function FieldTextarea<T extends FieldValues>({
  name,
  label,
  description,
  className,
  disabled,
  ...textareaProps
}: FieldTextareaProps<T>) {
  return (
    <FormField
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel data-error={fieldState.invalid}>{label}</FormLabel>
          )}
          <FormControl>
            <Textarea
              data-error={fieldState.invalid}
              {...textareaProps}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ─── FieldSelect ───────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

type FieldSelectProps<T extends FieldValues> = BaseFieldProps<T> & {
  options: SelectOption[];
  placeholder?: string;
  triggerClassName?: string;
};

export function FieldSelect<T extends FieldValues>({
  name,
  label,
  description,
  className,
  options,
  disabled,
  placeholder = "انتخاب کنید...",
  triggerClassName,
}: FieldSelectProps<T>) {
  return (
    <FormField
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel data-error={fieldState.invalid}>{label}</FormLabel>
          )}
          <FormControl>
            <Select
              value={field.value ?? ""}
              disabled={field?.disabled}
              onValueChange={field.onChange}
            >
              <SelectTrigger className={cn("w-full", triggerClassName)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ─── FieldCheckbox ─────────────────────────────────────────────────────────────

type FieldCheckboxProps<T extends FieldValues> = BaseFieldProps<T>;

export function FieldCheckbox<T extends FieldValues>({
  name,
  label,
  description,
  className,
  disabled,
}: FieldCheckboxProps<T>) {
  return (
    <FormField
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <FormItem className={cn("flex flex-col gap-1", className)}>
          <FormControl>
            <div className="flex items-center gap-2">
              <Checkbox
                id={name}
                name={name}
                disabled={field.disabled}
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
              {label && <Label htmlFor={name}>{label}</Label>}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
