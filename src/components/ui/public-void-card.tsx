import Link from "next/link";
import { H3, P } from "~/components/typography";
import { type RouterOutputs } from "~/lib/api/types";
import { EditVoidResponse } from "~/lib/interfaces";
import { formatDate } from "~/lib/utils";

import { AnchorProps } from "./button";

type Props = Pick<
  RouterOutputs["voids"]["getCurrentUserVoids"][0],
  "id" | "title" | "description" | "locationId" | "password" | "startDate"
> & {
  href: AnchorProps["href"];
  requirements: EditVoidResponse["requirements"];
};

export default function PublicVoidCard(props: Props) {
  return (
    <Link href={props.href}>
      <div className="border dark:border-stone-700 rounded p-4">
        <div className="space-y-2">
          <section>
            <H3>{props.title}</H3>
            <P className="line-clamp-2">{formatDate(props.startDate)}</P>
            <P className="line-clamp-2">{props.description}</P>
          </section>
          <section className="flex items-center justify-between">
            <section className="space-x-2">
              {props.requirements!.map(
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
    </Link>
  );
}
