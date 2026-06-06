"use client";

/**
 * FieldRenderer — renders a list of field definitions inside an existing <Form> context.
 * You control the Form wrapper, submit button, and any extra actions yourself.
 *
 * Usage:
 *   const fields: FieldDef[] = [
 *     { name: "email",    label: "Email",    type: "email",    dir: "ltr" },
 *     { name: "password", label: "Password", type: "password" },
 *     { name: "role",     label: "Role",      type: "select",   options: roleOptions },
 *   ];
 *
 *   <Form {...form}>
 *     <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
 *       <FieldRenderer form={form} fields={fields} />
 *       <div className="flex gap-2">
 *         <Button variant="outline" onClick={onCancel}>Cancel</Button>
 *         <Button type="submit" loading={isPending}>Save</Button>
 *         <Button type="button" onClick={doAnythingElse}>Action</Button>
 *       </div>
 *     </form>
 *   </Form>
 */

import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FieldCheckbox,
  FieldInput,
  FieldPassword,
  FieldSelect,
  FieldTextarea,
  type SelectOption,
} from "./form-fields";

// ─── Types ─────────────────────────────────────────────────────────────────────

type FieldType =
  | "text"
  | "email"
  | "number"
  | "password"
  | "textarea"
  | "select"
  | "checkbox";

export interface FieldDef {
  name: FieldPath<FieldValues>;
  label?: string;
  description?: string;
  type?: FieldType;
  placeholder?: string;
  /** Required for type: "select" */
  options?: SelectOption[];
  dir?: "ltr" | "rtl" | "auto";
  className?: string;
  disabled?: boolean;
  visible?: boolean;
}

interface FieldRendererProps {
  fields: FieldDef[];
  /** Wrapper className. Defaults to "flex flex-col gap-4" */
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function FieldRenderer({ fields, className }: FieldRendererProps) {
  return (
    <div className={className ?? "flex flex-col gap-4"}>
      {fields.map((field) => {
        if (typeof field?.visible === "boolean" && field?.visible === false)
          return null;

        const name = field.name;
        const common = {
          name,
          key: field.name,
          label: field.label,
          disabled: field.disabled,
          className: field.className,
          description: field.description,
        };

        switch (field.type) {
          case "password":
            return (
              <FieldPassword
                {...common}
                key={field.name}
                placeholder={field.placeholder}
              />
            );

          case "textarea":
            return (
              <FieldTextarea
                {...common}
                key={field.name}
                placeholder={field.placeholder}
              />
            );

          case "select":
            return (
              <FieldSelect
                {...common}
                key={field.name}
                options={field.options ?? []}
                placeholder={field.placeholder}
              />
            );

          case "checkbox":
            return <FieldCheckbox {...common} key={field.name} />;

          default:
            return (
              <FieldInput
                {...common}
                key={field.name}
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                dir={field.dir}
              />
            );
        }
      })}
    </div>
  );
}
