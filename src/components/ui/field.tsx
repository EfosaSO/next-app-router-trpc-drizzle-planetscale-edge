import * as React from "react";
import { Label } from "@radix-ui/react-label";
import {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  RefCallBack,
  UseFormSetError,
  useController,
} from "react-hook-form";

import { P } from "../typography";
import { Input } from "./input";
import { LocationInputField } from "./location-field";
import { PlacesInputField } from "./places-autocomplete";
import { SlugInputField } from "./slug";
import { Textarea } from "./textarea";

export type FieldProps<T extends FieldValues> = Omit<
  ControllerRenderProps<T>,
  "ref"
> & {
  control: Control<T>;
  className?: string;
  baseRef?: RefCallBack;
  onError?: UseFormSetError<T>;
};

function Field<T extends FieldValues>({
  name,
  baseRef,
  onError,
  ...props
}: FieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: name as FieldPath<T>,
    control: props.control,
  });
  const parts = name?.split(".") ?? [];
  const fieldName = parts[parts.length - 1];
  switch (fieldName) {
    case "placeId":
      return (
        <Label className="space-y-2">
          <span className="text-sm capitalize">Address</span>
          <section className="space-y-2">
            <PlacesInputField
              ref={baseRef}
              control={props.control}
              name={name}
            />
            {error && <P className="text-red-500 text-xs">{error.message}</P>}
          </section>
        </Label>
      );
    case "locationId":
      return (
        <Label className="space-y-2">
          <span className="text-sm capitalize">Location</span>
          <section className="space-y-2">
            <LocationInputField
              ref={baseRef}
              control={props.control}
              name={name}
            />
            {error && <P className="text-red-500 text-xs">{error.message}</P>}
          </section>
        </Label>
      );
    case "slug":
      return (
        <Label className="space-y-2">
          <span className="text-sm capitalize">Slug</span>
          <section className="space-y-2">
            <SlugInputField
              ref={baseRef}
              control={props.control}
              name={name}
              onError={onError}
            />
            {error && <P className="text-red-500 text-xs">{error.message}</P>}
          </section>
        </Label>
      );

    case "address":
    case "postcode":
      return null;
    case "description":
      return (
        <Label className="space-y-2">
          <span className="text-sm capitalize">{fieldName}</span>
          <section className="space-y-2">
            <Textarea
              {...props}
              name={name}
              ref={baseRef as unknown as React.Ref<HTMLTextAreaElement>}
            />
            {error && <P className="text-red-500 text-xs">{error.message}</P>}
          </section>
        </Label>
      );
    case "fulfilled":
      return (
        <Label className="grid gap-2 max-w-fit">
          <span className="flex items-center gap-2">
            <span className="text-sm capitalize">{fieldName}</span>
            <Input
              {...props}
              name={name}
              ref={baseRef}
              className="w-5 h-5"
              type="checkbox"
              checked={field.value}
            />
          </span>
          {error && <P className="text-red-500 text-xs">{error.message}</P>}
        </Label>
      );
    default:
      return (
        <Label className="space-y-2">
          <span className="text-sm capitalize">{fieldName}</span>
          <section className="space-y-2">
            <Input {...props} name={name} ref={baseRef} />
            {error && <P className="text-red-500 text-xs">{error.message}</P>}
          </section>
        </Label>
      );
  }
}

export { Field };
