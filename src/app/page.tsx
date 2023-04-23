import { H3 } from "~/components/typography";
import PublicVoidCard from "~/components/ui/public-void-card";
import { api } from "~/lib/api/server";

export default async function Page() {
  const voids = await api.voids.getVoids.fetch();

  return (
    <>
      <div className="grid gap-3">
        <section className="w-full flex justify-between md:justify-start gap-4 items-center">
          <H3>Latest voids</H3>
        </section>
        <div className="grid gap-4">
          {voids.map((voidItem) => (
            <PublicVoidCard key={voidItem.id} {...voidItem} />
          ))}
        </div>
      </div>
    </>
  );
}
