import { H1, H3 } from "~/components/typography";
import PublicVoidCard from "~/components/ui/public-void-card";
import { api } from "~/lib/api/server";
import { prisma } from "~/server/prisma";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const organisations = await prisma.organisation.findMany({
    select: {
      slug: true,
    },
  });

  return organisations.map((org) => ({
    slug: org.slug,
  }));
}

export default async function Page({
  params: { slug },
}: {
  params: Record<string, string>;
}) {
  const organisation = await api.organisations.getOrganisationBySlug.fetch({
    slug,
  });

  return (
    <section>
      <section className="mb-5 flex items-center justify-between">
        <section className="space-y-4">
          <H1>{organisation.name}</H1>
        </section>
      </section>
      <section className="grid gap-3">
        <section className="w-full flex justify-between md:justify-start gap-4 items-center">
          <H3>Latest voids</H3>
        </section>
        <section className="grid md:grid-cols-3 gap-4">
          {organisation.voids.map((item) => (
            <PublicVoidCard
              key={item.id}
              {...item}
              // @ts-ignore
              href={`/organisation/${organisation.slug}/${item.slug}-${item.id}`}
            />
          ))}
        </section>
      </section>
    </section>
  );
}
