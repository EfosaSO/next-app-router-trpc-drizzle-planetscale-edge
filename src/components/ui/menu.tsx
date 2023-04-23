"use client";

import * as React from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs/app-beta/client";
import { Button } from "~/components/ui/button";

import BasePopover from "./BasePopover/Popover";

interface Props {
  photo: string;
}

const Menu: React.FC<Props> = (props) => {
  const { signOut } = useAuth();
  const [openPopover, setOpenPopover] = React.useState(false);
  return (
    <>
      <BasePopover
        align="end"
        content={
          <Button
            variant="ghost"
            className="rounded-full w-10 h-10 p-0"
            onClick={() => setOpenPopover(true)}
          >
            <Image
              src={props.photo}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="sr-only">Dashboard</span>
          </Button>
        }
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <section className="grid bg-stone-900 rounded-md py-4 md:py-0 gap-y-4 md:gap-y-0">
          <Button
            variant="link"
            href="/dashboard"
            size="lg"
            onClick={() => setOpenPopover(false)}
          >
            Dashboard
          </Button>
          <Button
            variant="link"
            onClick={() => {
              setOpenPopover(false);
              signOut();
            }}
            size="lg"
          >
            Logout
          </Button>
        </section>
      </BasePopover>
    </>
  );
};

export { Menu };
