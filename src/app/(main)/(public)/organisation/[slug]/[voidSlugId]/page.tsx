/* eslint-disable @typescript-eslint/restrict-template-expressions */

import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/app-beta";
import { Building, ExternalLink, Mail, Phone } from "lucide-react";
import { H1, H3, H6, P } from "~/components/typography";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/api/server";
import { formatDate } from "~/lib/utils";
import { prisma } from "~/server/prisma";

export async function generateStaticParams() {
  const voids = await prisma.void.findMany({
    select: {
      id: true,
      slug: true,
    },
  });

  return voids.map((_void) => ({
    voidSlugId: `${_void.slug}-${_void.id}`,
  }));
}

export default async function Page({
  params: { slug, voidSlugId },
}: {
  params: Record<string, string>;
}) {
  const params = voidSlugId ?? "";
  const voidId = params.substring(params.lastIndexOf("-") + 1);

  const foundVoid = await api.voids.getVoidById.fetch({
    id: voidId,
  });

  if (!foundVoid) {
    return <div>404</div>;
  }

  const user = await currentUser();
  const organisation = await api.organisations.getOrganisationBySlug.fetch({
    slug,
  });

  const isMine = user ? organisation?.customer?.user?.id === user.id : false;

  const email = {
    subject: `Referral for ${foundVoid.title}`,
    body: `Hi ${organisation.customer.user.name}, I would like to refer someone for the "${foundVoid.title}" void. Please see the details below:`,
  };

  const emailSearchParams = new URLSearchParams();
  Object.entries(email).forEach(([key, value]) => {
    emailSearchParams.append(key, value);
  });

  return (
    <section className="space-y-4 pb-16">
      <section>
        <Link href={`/organisation/${organisation.slug}`} className="a">
          <H6>
            <span className="flex gap-2 items-center">
              <Building className="w-4 h-4" />
              {organisation.name}
            </span>
          </H6>
        </Link>
      </section>
      <section className="grid md:grid-cols-6 gap-8 justify-between">
        <section className="md:col-span-4 space-y-10">
          <section className="space-y-4">
            <H1 className="flex gap-2">
              <span>{foundVoid.title}</span>
              {foundVoid.fulfilled && (
                <span>
                  <span className="bg-neutral-700 py-2 px-4 rounded-full text-base tracking-normal font-normal">
                    Fulfilled
                  </span>
                </span>
              )}
            </H1>
            <section className="flex flex-wrap gap-x-4 gap-y-1">
              {foundVoid.location?.placeId ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${foundVoid.location.placeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="a group"
                >
                  <section className="flex items-center gap-2">
                    <address>{foundVoid.location?.address}</address>
                    <ExternalLink className="w-4 h-4 group-hover:scale-110 custom-ease" />
                  </section>
                </a>
              ) : (
                <address>{foundVoid.location?.address}</address>
              )}
            </section>
            <P>
              Available: <strong>{formatDate(foundVoid.startDate!)}</strong>
            </P>
            <P>{foundVoid.description}</P>
          </section>
          <section className="grid gap-2">
            <H3>Requirements</H3>
            <section className="grid gap-2 bg-stone-800 p-4 rounded">
              <P>
                Referral must meet theses requirements to be considered for the
                void
              </P>
              <section className="space-x-2">
                {foundVoid.requirements.map((requirement) => (
                  <p
                    key={requirement.id}
                    className="line-clamp-1 bg-stone-700 rounded-full text-xs inline-flex px-4 py-2"
                  >
                    {requirement.title}
                  </p>
                ))}
              </section>
            </section>
          </section>
        </section>
        <section className="md:col-span-2 shadow-xl md:shadow-none sticky bottom-10 md:bottom-0 md:top-10">
          <section className="grid gap-y-4 p-4 md:p-6 rounded-md bg-slate-800">
            <section className="flex gap-4">
              <section>
                <Image
                  width={100}
                  height={100}
                  className="rounded-full"
                  alt={`${organisation.customer.user.name}`}
                  src={`${organisation.customer.user.photo}`}
                />
              </section>
              <section className="grid gap-1">
                <H3>{organisation.customer.user.name}</H3>
                {foundVoid.location?.phone && (
                  <a
                    href={`tel:${foundVoid.location.phone}`}
                    className="a group"
                  >
                    <P>
                      <span className="flex gap-2 items-center">
                        <Phone className="w-4 h-4 group-hover:scale-110 custom-ease" />
                        {foundVoid.location.phone}
                      </span>
                    </P>
                  </a>
                )}
                {foundVoid.location?.email && (
                  <a
                    href={`mailto:${foundVoid.location.email}`}
                    className="a group"
                  >
                    <P>
                      <span className="flex gap-2 items-center">
                        <Mail className="w-4 h-4 group-hover:scale-110 custom-ease" />
                        {foundVoid.location.email}
                      </span>
                    </P>
                  </a>
                )}
              </section>
            </section>
            <Button
              // @ts-ignore
              href={`mailto:${
                foundVoid.location?.email
              }?subject=${encodeURIComponent(
                email.subject
              )}&body=${encodeURIComponent(email.body)}`}
            >
              <H3>Contact</H3>
            </Button>
          </section>
        </section>
      </section>
    </section>
  );
}
