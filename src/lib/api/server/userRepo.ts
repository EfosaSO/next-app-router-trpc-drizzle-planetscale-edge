import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "~/server/prisma";

export const userWebhookSchema = z.object({
  id: z.string(),
  primary_email_address_id: z.string(),
  email_addresses: z.array(
    z.object({
      id: z.string(),
      email_address: z.string().email(),
    })
  ),
  first_name: z.string(),
  last_name: z.string().nullable(),
  profile_image_url: z.string().optional(),
});

type User = z.infer<typeof userWebhookSchema>;

export function upsert(id: string, attributes: Omit<User, "id">) {
  const email =
    attributes.email_addresses.find(
      (email) => email.id === attributes.primary_email_address_id
    )?.email_address ??
    attributes.email_addresses[0]?.email_address ??
    "";
  const create: Prisma.UserCreateInput = {
    id,
    name: `${attributes.first_name}${
      attributes.last_name ? ` ${attributes.last_name}` : ""
    }`,
    email,
    photo: attributes.profile_image_url,
    customers: {
      connectOrCreate: {
        where: { userId: id },
        create: {},
      },
    },
  };

  const { id: _, email: __, customers: ___, ...update } = create;

  return prisma.user.upsert({
    where: { id },
    update,
    create,
  });
}
