"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
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
import { api } from "~/lib/api/client";
import { EditOrganisationResponse, organisationSchema } from "~/lib/interfaces";

export default function EditOrganisation(props: EditOrganisationResponse) {
  const { id, name } = props;
  const [open, setOpen] = useState(false);

  const { control, handleSubmit, reset, setValue, setError } =
    useForm<EditOrganisationResponse>({
      resolver: zodResolver(organisationSchema),
      defaultValues: {
        id,
        name,
      },
    });

  const router = useRouter();

  const { mutate: editOrganisation, isLoading } =
    api.organisations.editOrganisation.useMutation({
      onSuccess(_, newData) {
        setOpen(false);
        reset(newData);
        router.refresh();
      },
    });

  const handleCreate = (data: EditOrganisationResponse) => {
    editOrganisation(data);
  };
  useEffect(() => {
    Object.entries(props).map(([key, value]) =>
      setValue(key as keyof EditOrganisationResponse, value)
    );
  }, [props]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="subtle" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(handleCreate)}>
          <DialogHeader>
            <DialogTitle>Edit Organisation</DialogTitle>
            <DialogDescription>
              {`Edit your organisation and click save when you're done.`}
            </DialogDescription>
          </DialogHeader>
          <div
            className="grid gap-4 py-4 max-h-[70vh] overflow-y-scroll px-6"
            onSubmit={handleSubmit(handleCreate)}
          >
            <div className="grid gap-3">
              <Controller
                name="name"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <Field
                    control={control}
                    {...field}
                    onError={setError}
                    baseRef={ref}
                  />
                )}
              />
              <Controller
                name="slug"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <Field
                    control={control}
                    {...field}
                    onError={setError}
                    baseRef={ref}
                  />
                )}
              />
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
