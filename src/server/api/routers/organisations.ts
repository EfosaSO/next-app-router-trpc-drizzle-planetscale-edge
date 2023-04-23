import type { Requirement, Void } from "@prisma/client";
import { z } from "zod";
import {
  createOrganisationSchema,
  createOrganisationWithLocationSchema,
  organisationSchema,
} from "~/lib/interfaces";
import { slugify } from "~/lib/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const organisationsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  checkOrganisationSlug: publicProcedure
    .input(z.object({ slug: z.string().optional() }))
    .query(async ({ input, ctx: { db } }) => {
      try {
        await db.organisation.findUniqueOrThrow({
          where: {
            slug: input.slug,
          },
        });

        return {
          available: false,
        };
      } catch (error) {
        return {
          available: true,
        };
      }
    }),
  getOrganisationBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().optional(),
      })
    )
    .query(async ({ input, ctx: { db } }) => {
      const { locations, ...data } = await db.organisation.findUniqueOrThrow({
        where: {
          slug: input.slug,
        },
        include: {
          customer: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  photo: true,
                },
              },
            },
          },
          locations: {
            include: {
              voids: {
                where: {
                  fulfilled: false,
                },
                include: {
                  requirements: {
                    select: {
                      requirement: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return {
        ...data,
        voids: locations.reduce((acc, location) => {
          return acc.concat(
            location.voids.map(({ requirements, ...void_ }) => ({
              ...void_,
              requirements: requirements.map(({ requirement }) => requirement),
            }))
          );
        }, [] as (Void & { requirements: Requirement[] })[]),
      };
    }),
  getCurrentUserOrganisation: protectedProcedure.query(
    async ({ ctx: { auth, db } }) => {
      const customer = await db.customer.findUnique({
        where: {
          userId: auth?.userId ?? "",
        },
      });
      const data = db.organisation.findUnique({
        where: {
          ownerId: customer?.id,
        },
        include: {
          locations: {
            select: {
              id: true,
              name: true,
              email: true,
              placeId: true,
              address: true,
              postcode: true,
              phone: true,
            },
          },
        },
      });
      return data;
    }
  ),
  getCurrentUserOrganisationVoidRequirements: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx: { auth, db }, input }) => {
      const customer = await db.customer.findUnique({
        where: {
          userId: auth?.userId ?? "",
        },
      });
      const data = db.requirementsOnVoids.findMany({
        where: {
          ...(input.query && {
            requirement: {
              title: {
                contains: input.query,
              },
            },
          }),
          void: {
            location: {
              organisation: {
                ownerId: customer?.id,
              },
            },
          },
        },
      });
      return data;
    }),
  getCurrentUserOrganisationLocations: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx: { auth, db }, input }) => {
      const customer = await db.customer.findUnique({
        where: {
          userId: auth?.userId ?? "",
        },
      });
      const data = db.location.findMany({
        where: {
          ...(input.query && {
            address: {
              contains: input.query,
            },
          }),
          organisation: {
            ownerId: customer?.id,
          },
        },
      });
      return data;
    }),
  createOrganisation: protectedProcedure
    .input(createOrganisationSchema)
    .mutation(async ({ input, ctx: { auth, db } }) => {
      const result = await db.organisation.create({
        data: {
          name: input.name,
          slug: slugify(input.name),
          customer: {
            connect: {
              userId: auth?.userId ?? "",
            },
          },
        },
      });
      return result;
    }),
  createOrganisationWithLocation: protectedProcedure
    .input(createOrganisationWithLocationSchema)
    .mutation(async ({ input, ctx: { auth, db } }) => {
      const result = await db.organisation.create({
        data: {
          name: input.name,
          slug: slugify(input.name),
          customer: {
            connect: {
              userId: auth?.userId ?? "",
            },
          },
          locations: {
            createMany: {
              data: input.locations.map(({ localId, ...location }) => location),
              skipDuplicates: true,
            },
          },
        },
      });
      return result;
    }),
  deleteOrganisation: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const result = await db.organisation.delete({
        where: {
          id: input.id,
        },
      });
      return result;
    }),
  editOrganisation: protectedProcedure
    .input(organisationSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      const result = await db.organisation.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          slug: slugify(input.name),
        },
      });
      return result;
    }),
});
