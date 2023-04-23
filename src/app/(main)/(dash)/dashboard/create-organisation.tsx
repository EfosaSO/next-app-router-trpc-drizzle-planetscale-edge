"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { zodResolver } from "@hookform/resolvers/zod";
import cuid from "cuid";
import { Loader2 } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "~/components/ui/Button";
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
  LocationAddressField,
  locationInitialState,
} from "~/components/ui/location-address-field";
import { env } from "~/env.mjs";
import { api } from "~/lib/api/client";
import {
  createOrganisationWithLocationSchema,
  type CreateOrganisationWithLocationResponse,
} from "~/lib/interfaces";

const PLACES_API_URL = `https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}&libraries=places`;

const defaultValues = {
  name: "",
  slug: "",
  locations: [],
};

export default function CreateOrganisation() {
  const [open, setOpen] = useState(false);

  const { handleSubmit, reset, control } =
    useForm<CreateOrganisationWithLocationResponse>({
      resolver: zodResolver(createOrganisationWithLocationSchema),
      defaultValues,
    });

  const {
    fields: locations,
    append,
    remove,
  } = useFieldArray<CreateOrganisationWithLocationResponse>({
    name: "locations",
    control,
  });

  const router = useRouter();

  const addLocation = () =>
    append({ ...locationInitialState, localId: cuid() });

  const removeLocation = (index: number) => remove(index);

  const { mutate: createOrganisationWithLocation, isLoading } =
    api.organisations.createOrganisationWithLocation.useMutation({
      onSuccess() {
        setOpen(false);
        reset();
        router.replace("/dashboard");
      },
    });

  const handleCreate = (data: CreateOrganisationWithLocationResponse) => {
    createOrganisationWithLocation(data);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Organisation</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={handleSubmit(handleCreate)}>
            <DialogHeader>
              <DialogTitle>Create Organisation</DialogTitle>
              <DialogDescription>
                {`Fill in the details of your organisation and click save when you're done.`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => <Field control={control} {...field} />}
                />
                <Controller
                  name="slug"
                  control={control}
                  render={({ field }) => <Field control={control} {...field} />}
                />
              </div>
              <div className="">
                <div className="space-y-2">
                  <Label>Locations (Required)</Label>
                  {locations.map(({ localId, ...location }, index) => (
                    <LocationAddressField
                      key={localId}
                      location={{
                        ...location,
                        localId,
                      }}
                      control={control}
                      isLast={locations.length === index + 1}
                      onRemove={() => removeLocation(index)}
                      onAdd={addLocation}
                      name={`locations.${index}`}
                    />
                  ))}
                </div>
                {locations.length === 0 && (
                  <Button
                    type="button"
                    onClick={addLocation}
                    variant="subtle"
                    size="sm"
                  >
                    Add location
                  </Button>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                Save organisation
                {isLoading && <Loader2 className="animate-spin ml-2 w-4" />}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Script id="voids-google-maps" async defer src={PLACES_API_URL} />
    </>
  );
}
