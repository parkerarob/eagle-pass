import React from "react";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

interface FieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & {
    "data-cy"?: string;
  };
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement> & {
    "data-cy"?: string;
  };
  registerOptions?: RegisterOptions;
}

export function FormField({
  name,
  label,
  type = "text",
  placeholder,
  options,
  inputProps,
  selectProps,
  registerOptions,
}: FieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      {options ? (
        <Select id={name} {...register(name, registerOptions)} {...selectProps}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name, registerOptions)}
          {...inputProps}
        />
      )}
      {errors[name] && (
        <p className="text-sm text-red-600" role="alert">
          {(errors as Record<string, { message?: string }>)[name]?.message}
        </p>
      )}
    </div>
  );
}
