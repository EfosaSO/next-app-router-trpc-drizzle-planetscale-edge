import validator from "validator";
import { z } from "zod";

export const organisationSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(3),
  slug: z.string().min(3),
});

export const createOrganisationSchema = organisationSchema.omit({
  id: true,
});

export const createLocationSchema = z.object({
  localId: z.string().cuid().nullable().optional(),
  name: z.string().min(3, "Name must contain at least 3 character(s)"),
  placeId: z.string().nullable(),
  address: z.string().nullable(),
  postcode: z.string().nullable(),
  email: z
    .string()
    .email({
      message: "Please enter a valid email address",
    })
    .nullable(),
  phone: z
    .string()
    .refine(validator.isMobilePhone, "Please enter a valid phone number")
    .nullable(),
});

export const editLocationSchema = z
  .object({
    id: z.string().cuid(),
  })
  .merge(createLocationSchema);

export const createRequirementSchema = z.object({
  localId: z.string().cuid().nullable().optional(),
  id: z.string().cuid().nullable().optional(),
  title: z.string().min(3, "Title must contain at least 3 character(s)"),
});

export const createOrganisationWithLocationSchema = z
  .object({
    locations: createLocationSchema.array().nonempty(),
  })
  .merge(createOrganisationSchema);

export const createVoidSchema = z.object({
  title: z.string().min(1),
  locationId: z.string().cuid(),
  description: z.string(),
  startDate: z.string(),
  password: z.string().nullable().optional(),
});

export const createVoidWithRequirementsSchema = z
  .object({
    requirements: createRequirementSchema.array().nonempty(),
  })
  .merge(createVoidSchema);

export const editVoidSchema = z
  .object({
    id: z.string().cuid(),
    fulfilled: z.boolean().optional(),
  })
  .merge(createVoidWithRequirementsSchema)
  .partial({
    startDate: true,
    description: true,
    locationId: true,
    title: true,
    password: true,
    requirements: true,
  });

export type EditVoidResponse = z.infer<typeof editVoidSchema>;

export type CreateVoidResponse = z.infer<typeof createVoidSchema>;

export type OrganisationLocation = z.infer<typeof createLocationSchema>;

export type EditLocationResponse = z.infer<typeof editLocationSchema>;

export type Requirement = z.infer<typeof createRequirementSchema>;

export type EditOrganisationResponse = z.infer<typeof organisationSchema>;

export type CreateOrganisationResponse = z.infer<
  typeof createOrganisationSchema
>;

export type CreateOrganisationWithLocationResponse = z.infer<
  typeof createOrganisationWithLocationSchema
>;

export type CreateVoidWithRequirementsResponse = z.infer<
  typeof createVoidWithRequirementsSchema
>;

export type FormResponse =
  | CreateOrganisationResponse
  | CreateOrganisationWithLocationResponse
  | CreateVoidResponse
  | CreateVoidWithRequirementsResponse
  | EditOrganisationResponse
  | EditVoidResponse
  | OrganisationLocation
  | EditLocationResponse;
