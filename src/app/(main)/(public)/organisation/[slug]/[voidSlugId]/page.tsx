import Image from "next/image";
import Link from "next/link";
import { H1, H3, H6, P } from "~/components/typography";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/api/server";

export default async function Page({
  params: { slug, voidSlugId },
}: {
  params: Record<string, string>;
}) {
  const params = voidSlugId ?? "";
  const voidSlug = params.substring(0, params.lastIndexOf("-"));
  const voidId = params.substring(params.lastIndexOf("-") + 1);
  const organisation = await api.organisations.getOrganisationBySlug.fetch({
    slug,
  });
  const foundVoid = await api.voids.getVoidById.fetch({
    id: voidId,
  });

  const email = {
    subject: `Referral for ${foundVoid.name}`,
    body: `Hi, I would like to refer someone for the "${foundVoid.name}" void. Please see the details below:`,
  };

  const emailSearchParams = new URLSearchParams();
  Object.entries(email).forEach(([key, value]) => {
    emailSearchParams.append(key, value);
  });

  return (
    <section className="space-y-4 pb-16">
      <section>
        <Link href={`/organisation/${organisation.slug}`} className="a">
          <H6>{organisation.name}</H6>
        </Link>
      </section>
      <section className="grid md:grid-cols-6 gap-8 justify-between">
        <section className="md:col-span-4 space-y-10">
          <section className="space-y-4">
            <H1 className="flex gap-2">
              <span>{foundVoid.name}</span>
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
                  className="a"
                >
                  <address>{foundVoid.location?.address}</address>
                </a>
              ) : (
                <address>{foundVoid.location?.address}</address>
              )}
            </section>
            <p className="line-clamp-2">{foundVoid.description}</p>
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
          <section className="grid gap-y-4 p-4 rounded-md bg-slate-800">
            <section className="flex gap-4">
              <section>
                <Image
                  width={100}
                  height={100}
                  className="rounded-full"
                  alt={`${foundVoid.location?.organisation.customer.user.name}`}
                  src={`${foundVoid.location?.organisation.customer.user.photo}`}
                />
              </section>
              <section className="grid gap-1">
                <P>{foundVoid.location?.organisation.customer.user.name}</P>
                {foundVoid.location?.phone && (
                  <a href={`tel:${foundVoid.location.phone}`} className="a">
                    <P>{foundVoid.location.phone}</P>
                  </a>
                )}
                {foundVoid.location?.email && (
                  <a href={`mailto:${foundVoid.location.email}`} className="a">
                    <P>{foundVoid.location.email}</P>
                  </a>
                )}
              </section>
            </section>
            <Button
              href={`mailto:${
                foundVoid.location?.email
              }?subject=${encodeURIComponent(
                email.subject
              )}&body=${encodeURIComponent(email.body)}`}
              anchor
            >
              <H3>Contact</H3>
            </Button>
          </section>
        </section>
      </section>
    </section>
  );
}
