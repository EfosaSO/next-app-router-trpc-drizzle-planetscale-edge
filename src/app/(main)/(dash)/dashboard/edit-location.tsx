"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { isValid } from "zod";
import Modal from "~/components/ui/Modal/Modal";
import { Button } from "~/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Field } from "~/components/ui/field";
import { env } from "~/env.mjs";
import { api } from "~/lib/api/client";
import {
  editLocationSchema,
  type EditLocationResponse,
} from "~/lib/interfaces";

const PLACES_API_URL = `https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}&libraries=places`;

export default function EditLocation(props: EditLocationResponse) {
  const [open, setOpen] = useState(false);

  const { handleSubmit, reset, setValue, control } =
    useForm<EditLocationResponse>({
      resolver: zodResolver(editLocationSchema),
      defaultValues: props,
    });

  const router = useRouter();

  const { mutate: editLocation, isLoading } =
    api.locations.editLocation.useMutation({
      onSuccess() {
        setOpen(false);
        reset();
        router.replace("/dashboard");
      },
    });

  const handleCreate = (data: EditLocationResponse) => {
    editLocation(data);
  };

  useEffect(() => {
    Object.entries(props).map(([key, value]) =>
      setValue(key as keyof EditLocationResponse, value)
    );
  }, [props, setValue]);

  return (
    <>
      <Modal
        showModal={open}
        setShowModal={setOpen}
        content={
          <Button variant="outline" size="sm">
            Edit
          </Button>
        }
      >
        <form onSubmit={handleSubmit(handleCreate)}>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>
              {`Edit your location and click save when you're done.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-scroll px-6">
            {Object.keys(props)
              .filter((name) => name !== "id")
              .map((name) => (
                <Controller
                  key={name}
                  name={name as keyof typeof props}
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <Field control={control} {...field} baseRef={ref} />
                  )}
                />
              ))}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!isValid}>
              Save location
              {isLoading && <Loader2 className="animate-spin ml-2 w-4" />}
            </Button>
          </DialogFooter>
        </form>
      </Modal>
      <Script id="voids-google-maps" async defer src={PLACES_API_URL} />
    </>
  );
}
