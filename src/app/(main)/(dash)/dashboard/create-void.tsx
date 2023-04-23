"use client";

import { useState } from "react";
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
import {
  CreateVoidWithRequirementsResponse,
  FormResponse,
  createVoidWithRequirementsSchema,
} from "~/lib/interfaces";

const defaultValues = {
  name: "",
  description: "",
  locationId: "",
  requirements: [],
  password: "",
};

export default function CreateVoid() {
  const [open, setOpen] = useState(false);

  const { handleSubmit, reset, control } =
    useForm<CreateVoidWithRequirementsResponse>({
      resolver: zodResolver(createVoidWithRequirementsSchema),
      defaultValues,
    });

  const {
    fields: requirements,
    append,
    remove,
  } = useFieldArray<CreateVoidWithRequirementsResponse>({
    name: "requirements",
    control,
  });

  const router = useRouter();

  const addRequirement = () =>
    append({ ...requirementInitialState, localId: cuid() });

  const removeRequirement = (index: number) => remove(index);

  const { mutate: createVoidWithRequirements, isLoading } =
    api.voids.createVoidWithRequirements.useMutation({
      onSuccess() {
        setOpen(false);
        reset();
        router.refresh();
      },
    });

  const handleCreate = (data: FormResponse) => {
    createVoidWithRequirements(data as CreateVoidWithRequirementsResponse);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Void</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(handleCreate)}>
          <DialogHeader>
            <DialogTitle>Create Void</DialogTitle>
            <DialogDescription>
              {`Fill in the details of your void and click save when you're done.`}
            </DialogDescription>
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
                    key={localId}
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
              Save note
              {isLoading && <Loader2 className="animate-spin ml-2 w-4" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
