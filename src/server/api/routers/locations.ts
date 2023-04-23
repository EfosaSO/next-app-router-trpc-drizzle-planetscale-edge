import { z } from "zod";
import { editLocationSchema } from "~/lib/interfaces";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const locationsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  editLocation: protectedProcedure
    .input(editLocationSchema)
    .mutation(
      async ({ input: { id, localId, ...input }, ctx: { db, auth } }) => {
        const customer = await db.customer.findUniqueOrThrow({
          where: {
            userId: auth.userId,
          },
        });
        const organisation = await db.organisation.findUniqueOrThrow({
          where: {
            ownerId: customer.id,
          },
        });
        const result = await db.location.upsert({
          where: {
            id: id,
          },
          create: {
            ...input,
            organisationId: organisation.id,
          },
          update: input,
        });
        return result;
      }
    ),
});
