"use client";

import { FC } from "react";
import cuid from "cuid";
import { Control, Controller } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Field } from "~/components/ui/field";
import {
  CreateOrganisationWithLocationResponse,
  OrganisationLocation,
} from "~/lib/interfaces";

export const locationInitialState: OrganisationLocation = {
  localId: cuid(),
  name: "",
  placeId: "",
  address: "",
  postcode: "",
  email: "",
  phone: "",
};

export const LocationAddressField: FC<{
  location: OrganisationLocation & {
    id: string;
  };
  control: Control<CreateOrganisationWithLocationResponse>;
  name: `locations.${number}`;
  isLast: boolean;
  onAdd: () => void;
  onRemove: () => void;
}> = ({
  location: { localId, id, ...location },
  control,
  name: initialName,
  isLast,
  onAdd,
  onRemove,
}) => {
  return (
    <section className="relative rounded-md border border-stone-300 p-2 space-y-2">
      <section className="space-y-2">
        {Object.keys(location).map((name) => (
          <section key={name}>
            <Controller
              name={`${initialName}.${
                name as keyof typeof locationInitialState
              }`}
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Field control={control} {...field} baseRef={ref} />
              )}
            />
          </section>
        ))}
      </section>
      <section className="flex space-x-4">
        <Button onClick={onRemove} variant="outline" size="sm">
          Remove location
        </Button>

        {isLast && (
          <Button type="button" onClick={onAdd} variant="subtle" size="sm">
            Add another location
          </Button>
        )}
      </section>
    </section>
  );
};
