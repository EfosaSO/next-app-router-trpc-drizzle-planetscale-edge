import { Link as LinkIcon } from "lucide-react";
import { H2, H3, H6, P } from "~/components/typography";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/api/server";

import CreateOrganisation from "./create-organisation";
import CreateVoid from "./create-void";
import EditLocation from "./edit-location";
import EditOrganisation from "./edit-organisation";
import VoidCard from "./void-card";

export default async function Page() {
  const organisation =
    await api.organisations.getCurrentUserOrganisation.fetch();
  const voids = await api.voids.getCurrentUserVoids.fetch();
  return (
    <>
      <section className="mb-5 flex items-center justify-between">
        <section className="space-y-2">
          {organisation ? (
            <section className="space-y-4">
              <section className="flex flex-col md:flex-row md:items-center gap-4">
                <H2>
                  <span className="flex items-center gap-4">
                    {organisation.name} organisation
                    <section className="">
                      <Button
                        href={`/organisation/${organisation.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={LinkIcon}
                        variant="ghost"
                        className="w-6 h-6 rounded-full p-0"
                      >
                        <span className="sr-only">Open in new tab</span>
                      </Button>
                    </section>
                  </span>
                </H2>

                <section>
                  <EditOrganisation {...organisation} />
                </section>
              </section>
              {organisation.locations.length > 0 && (
                <section className="flex gap-4 md:gap-0 justify-between items-center md:items-start md:flex-col">
                  <section>
                    <H6>Main location</H6>
                    <address>{organisation.locations[0]!.address}</address>
                    {organisation.locations[0]?.phone && (
                      <a href={`tel:${organisation.locations[0].phone}`}>
                        <P>{organisation.locations[0].phone}</P>
                      </a>
                    )}
                    {organisation.locations[0]?.email && (
                      <a href={`mailto:${organisation.locations[0].email}`}>
                        <P>{organisation.locations[0].email}</P>
                      </a>
                    )}
                  </section>
                  <section>
                    <EditLocation {...organisation.locations[0]!} />
                  </section>
                </section>
              )}
            </section>
          ) : (
            <section>
              <H2>Your organisation</H2>
            </section>
          )}
        </section>
      </section>

      {!organisation ? (
        <div className="grid gap-3 items-center justify-items-center px-6 py-16 border rounded">
          <H3>Create your organisation</H3>
          <CreateOrganisation />
        </div>
      ) : (
        <>
          {voids.length === 0 ? (
            <div className="grid gap-3 items-center justify-items-center px-6 py-16 border rounded">
              <H3>Create my first void</H3>
              <CreateVoid />
            </div>
          ) : (
            <div className="grid gap-3">
              <section className="w-full flex justify-between md:justify-start gap-4 items-center">
                <H3>Your voids</H3>
                {organisation && <CreateVoid />}
              </section>
              <div className="grid md:grid-cols-3 gap-4">
                {voids.map((item) => (
                  <VoidCard
                    key={item.id}
                    {...item}
                    href={`/organisation/${organisation.slug}/${item.slug}-${item.id}`}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
