import Link, { LinkProps } from "next/link";
import { H3 } from "~/components/typography";
import { type RouterOutputs } from "~/lib/api/types";

type Props = Pick<
  RouterOutputs["voids"]["getCurrentUserVoids"][0],
  "id" | "name" | "description" | "locationId" | "password" | "requirements"
> & {
  href: LinkProps<{}>["href"];
};

export default function PublicVoidCard(props: Props) {
  return (
    <div className="border dark:border-stone-700 rounded p-4">
      <div className="space-y-2">
        <Link href={props.href}>
          <section>
            <H3>{props.name}</H3>
            <p className="line-clamp-2">{props.description}</p>
          </section>
        </Link>
        <section className="flex items-center justify-between">
          <section className="space-x-2">
            {props.requirements.map(
              (requirement, index) =>
                index < 3 && (
                  <p
                    key={requirement.id}
                    className="line-clamp-1 bg-gray-800 rounded-full text-xs inline-flex px-4 py-2"
                  >
                    {requirement.title}
                  </p>
                )
            )}
          </section>
        </section>
      </div>
    </div>
  );
}
