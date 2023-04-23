import { voidsRouter } from "~/server/api/routers/voids";
import { createTRPCRouter } from "~/server/api/trpc";

import connectDB from "../prisma";
import { locationsRouter } from "./routers/locations";
import { organisationsRouter } from "./routers/organisations";

// Connect to Prisma
void connectDB();

export const appRouter = createTRPCRouter({
  voids: voidsRouter,
  organisations: organisationsRouter,
  locations: locationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
