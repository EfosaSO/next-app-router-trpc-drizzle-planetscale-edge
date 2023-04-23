import { z } from "zod";
import { AnchorProps } from "~/components/ui/button";
import {
  EditVoidResponse,
  createVoidSchema,
  createVoidWithRequirementsSchema,
  editVoidSchema,
} from "~/lib/interfaces";
import { slugify } from "~/lib/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const voidsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getVoidById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx: { db } }) => {
      const data = await db.void.findUnique({
        where: {
          id: input.id,
        },
        include: {
          location: true,
          requirements: {
            select: {
              requirement: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });
      return {
        ...data,
        requirements:
          data?.requirements.map(({ requirement }) => requirement) ?? [],
      };
    }),
  getVoids: publicProcedure.query(async ({ ctx: { db } }) => {
    const data = await db.void.findMany({
      where: {
        fulfilled: false,
      },
      include: {
        location: {
          include: {
            organisation: {
              select: {
                slug: true,
                customer: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        photo: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        requirements: {
          select: {
            requirement: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
    return data.map((_void) => ({
      ..._void,
      requirements: (_void?.requirements.map(
        ({ requirement }) => requirement
      ) ?? []) as EditVoidResponse["requirements"],
      href: `/organisation/${_void.location.organisation.slug}/${_void.slug}-${_void.id}` as AnchorProps["href"],
    }));
  }),
  getCurrentUserVoids: protectedProcedure.query(
    async ({ ctx: { auth, db } }) => {
      const customer = await db.customer.findUnique({
        where: {
          userId: auth?.userId ?? "",
        },
      });
      const data = db.void.findMany({
        where: {
          location: {
            organisation: {
              ownerId: customer?.id,
            },
          },
        },
        include: {
          requirements: {
            select: {
              requirement: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return (await data).map((void_) => ({
        ...void_,
        requirements: void_.requirements.map(({ requirement }) => requirement),
      }));
    }
  ),
  createVoid: protectedProcedure
    .input(createVoidSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      const result = await db.void.create({
        data: {
          title: input.title,
          startDate: input.startDate,
          locationId: input.locationId,
          description: input.description,
          password: input.password,
          slug: slugify(input.title),
        },
      });
      return result;
    }),
  createVoidWithRequirements: protectedProcedure
    .input(createVoidWithRequirementsSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      const requirements = await db.$transaction(
        input.requirements.map(({ id, localId, ...requirement }) =>
          db.requirement.upsert({
            where: {
              id: id ?? "",
            },
            create: requirement,
            update: requirement,
          })
        )
      );
      const result = await db.void.create({
        data: {
          title: input.title,
          locationId: input.locationId,
          description: input.description,
          startDate: input.startDate,
          password: input.password,
          slug: slugify(input.title),
          requirements: {
            create: requirements.map(({ id }) => ({
              requirement: {
                connect: {
                  id,
                },
              },
            })),
          },
        },
      });
      return result;
    }),
  deleteVoid: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const result = await db.void.delete({
        where: {
          id: input.id,
        },
      });
      return result;
    }),
  editVoid: protectedProcedure
    .input(editVoidSchema)
    .mutation(async ({ input: { requirements, ...input }, ctx: { db } }) => {
      const allRequirements = requirements ?? [];
      const update = allRequirements.filter(({ id }) => id);
      const newRequirements = allRequirements.filter(({ id }) => !id);
      if (update.length > 0) {
        await db.requirementsOnVoids.deleteMany({
          where: {
            voidId: input.id,
          },
        });
      }
      await db.$transaction([
        ...(update.length > 0
          ? [
              ...update.map(({ id, title }) =>
                db.requirement.update({
                  where: {
                    id: id!,
                  },
                  data: {
                    title,
                    voids: {
                      create: {
                        void: {
                          connect: {
                            id: input.id,
                          },
                        },
                      },
                    },
                  },
                })
              ),
            ]
          : []),
        ...newRequirements.map((requirement) =>
          db.requirementsOnVoids.create({
            data: {
              void: {
                connect: {
                  id: input.id,
                },
              },
              requirement: {
                create: {
                  title: requirement.title,
                },
              },
            },
          })
        ),
      ]);

      const validations = editVoidSchema.safeParse(input);
      const values = validations.success ? validations.data : {};

      const result = await db.void.update({
        where: {
          id: input.id,
        },
        data: {
          ...values,
          ...(input.locationId && {
            location: {
              connect: {
                id: input.locationId,
              },
            },
          }),
        },
      });
      return result;
    }),
});
