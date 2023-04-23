"use client";

import { useRouter } from "next/navigation";
import { Link, Loader2 } from "lucide-react";
import { H3, P } from "~/components/typography";
import { AnchorProps, Button } from "~/components/ui/button";
import { api } from "~/lib/api/client";
import { type RouterOutputs } from "~/lib/api/types";
import { EditVoidResponse } from "~/lib/interfaces";
import { formatDate } from "~/lib/utils";

import EditVoid from "./edit-void";

type Props = Pick<
  RouterOutputs["voids"]["getCurrentUserVoids"][0],
  | "id"
  | "title"
  | "description"
  | "locationId"
  | "password"
  | "fulfilled"
  | "startDate"
> & {
  href: AnchorProps["href"];
  requirements: EditVoidResponse["requirements"];
};

export default function VoidCard(props: Props) {
  const router = useRouter();
  const { mutate: deleteVoid, isLoading: isDeleting } =
    api.voids.deleteVoid.useMutation({ onSuccess: () => router.refresh() });
  return (
    <div className="border dark:border-stone-700 rounded p-4">
      <div className="space-y-2">
        <section>
          <H3 className="flex gap-2">
            <span>{props.title}</span>
            {props.fulfilled && (
              <span>
                <span className="bg-neutral-700 py-2 px-4 rounded-full text-xs">
                  Fulfilled
                </span>
              </span>
            )}
          </H3>
          <P className="line-clamp-2">{formatDate(props.startDate!)}</P>
          <P className="line-clamp-2">{props.description}</P>
        </section>
        <section className="grid gap-2 md:flex items-center justify-between">
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
          <div className="grid grid-cols-3 md:flex gap-4">
            <Button
              href={props.href}
              target="_blank"
              rel="noopener noreferrer"
              icon={Link}
              variant="ghost"
              className="rounded-full"
              size="sm"
            >
              <span className="sr-only">Open in new tab</span>
            </Button>
            <EditVoid {...props} />
            <Button
              disabled={isDeleting}
              variant="destructive"
              onClick={() => deleteVoid({ id: props.id })}
              size="sm"
            >
              Delete
              {isDeleting && <Loader2 className="animate-spin ml-2 w-4" />}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
