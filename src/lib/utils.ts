/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { clsx, type ClassValue } from "clsx";
import { equals } from "ramda";
import slugifyjs from "slugify";
import { twMerge } from "tailwind-merge";
import { env } from "~/env.mjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function slugify(string: string) {
  return slugifyjs(string, { lower: true });
}

export const isProduction = process.env.NODE_ENV === "production";

export const getChangedValues = <T extends object, K extends keyof T>(
  values: T,
  initialValues: T,
  defaultValues?: T
) => {
  const newValues: Partial<T> = { ...defaultValues };
  Object.entries(values).forEach(([key, value]) => {
    const initialValue = initialValues[key as K];
    if (!equals(initialValue, value)) {
      newValues[key as K] = value;
    }
    if (Array.isArray(initialValue)) {
      const items = initialValue as unknown[];
      // get changed values in array
      const changedValue = items.filter((item, index) => {
        const initialItem = Array.isArray(value) ? value[index] : value;
        return !equals(initialItem, item);
      });
      if (changedValue.length > 0) {
        newValues[key as K] = value;
      }
    }
  });

  return newValues;
};
