"use client";

import cuid from "cuid";
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Field } from "~/components/ui/field";
import { Requirement } from "~/lib/interfaces";

type Props<T extends FieldValues> = {
  requirement: Requirement & {
    id: string;
  };
  control: Control<T>;
  name: `requirements.${number}`;
  isLast: boolean;
  onAdd: () => void;
  onRemove: () => void;
} & Pick<ControllerRenderProps<T>, "name">;

export const requirementInitialState: Requirement = {
  localId: cuid(),
  title: "",
};
export function RequirementField<T extends FieldValues>({
  requirement: { localId, id, ...requirement },
  control,
  name: initialName,
  isLast,
  onAdd,
  onRemove,
}: Props<T>) {
  return (
    <section className="relative rounded-md border border-stone-300 p-2 space-y-2">
      <section className="space-y-2">
        {Object.keys(requirement).map((name) => (
          <section key={name}>
            <Controller
              name={
                `${initialName}.${name}` as ControllerRenderProps<T>["name"]
              }
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
          Remove requirement
        </Button>

        {isLast && (
          <Button onClick={onAdd} variant="subtle" size="sm">
            Add another requirement
          </Button>
        )}
      </section>
    </section>
  );
}
