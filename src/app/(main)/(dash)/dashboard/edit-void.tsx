"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import cuid from "cuid";
import { Loader2 } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field } from "~/components/ui/field";
import { Label } from "~/components/ui/label";
import {
  RequirementField,
  requirementInitialState,
} from "~/components/ui/requirement-field";
import { api } from "~/lib/api/client";
import { RouterOutputs } from "~/lib/api/types";
import { EditVoidResponse, editVoidSchema } from "~/lib/interfaces";
import { getChangedValues } from "~/lib/utils";

export default function EditVoid(
  props: Pick<
    RouterOutputs["voids"]["getCurrentUserVoids"][0],
    "id" | "name" | "description" | "locationId" | "password" | "requirements"
  >
) {
  const [open, setOpen] = useState(false);

  const { handleSubmit, reset, setValue, control } = useForm<EditVoidResponse>({
    resolver: zodResolver(editVoidSchema),
    defaultValues: props,
  });

  const {
    fields: requirements,
    append,
    remove,
  } = useFieldArray<EditVoidResponse>({
    name: "requirements",
    control,
  });

  const router = useRouter();

  const addRequirement = () =>
    append({ ...requirementInitialState, localId: cuid() });

  const removeRequirement = (index: number) => remove(index);

  const onSuccess = (data: EditVoidResponse) => {
    setOpen(false);
    reset(data);
    router.refresh();
  };

  const { mutate: editVoid, isLoading } = api.voids.editVoid.useMutation({
    onSuccess,
  });

  const handleCreate = (data: EditVoidResponse) => {
    const changedValues = getChangedValues(data, props);
    if (Object.keys(changedValues).length === 0) {
      return onSuccess(data);
    }
    return editVoid({
      ...changedValues,
      id: props.id,
    });
  };

  useEffect(() => {
    Object.entries(props).map(([key, value]) =>
      setValue(key as keyof EditVoidResponse, value)
    );
  }, [props]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(handleCreate)}>
          <DialogHeader>
            <DialogTitle>Edit Void</DialogTitle>
            <section className="flex justify-between items-center">
              <DialogDescription>
                {`Edit your void and click save when you're done.`}
              </DialogDescription>
              <div className="grid gap-3 bg-slate-800 py-2 px-4 rounded-md">
                <Controller
                  name="fulfilled"
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <Field control={control} {...field} baseRef={ref} />
                  )}
                />
              </div>
            </section>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-scroll px-6">
            <div className="grid gap-3">
              <Controller
                name="name"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <Field control={control} {...field} baseRef={ref} />
                )}
              />
            </div>
            <div className="grid gap-3">
              <Controller
                name="locationId"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <Field
                    control={control}
                    {...field}
                    baseRef={ref}
                    className="min-h-[200px]"
                  />
                )}
              />
            </div>
            <div className="grid gap-3">
              <Controller
                name="description"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <Field
                    control={control}
                    {...field}
                    baseRef={ref}
                    className="min-h-[200px]"
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label>Requirements (Required)</Label>
                {requirements.map(({ localId, ...requirement }, index) => (
                  <RequirementField
                    key={requirement.id ?? localId}
                    requirement={{
                      ...requirement,
                      localId,
                    }}
                    control={control}
                    isLast={requirements.length === index + 1}
                    onRemove={() => removeRequirement(index)}
                    onAdd={addRequirement}
                    name={`requirements.${index}`}
                  />
                ))}
              </div>
              {requirements.length === 0 && (
                <Button
                  type="button"
                  onClick={addRequirement}
                  variant="subtle"
                  size="sm"
                >
                  Add requirement
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              Save changes
              {isLoading && <Loader2 className="animate-spin ml-2 w-4" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
