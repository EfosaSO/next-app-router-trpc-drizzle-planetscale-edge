"use client";

import * as React from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs/app-beta/client";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface Props {
  photo: string;
}

const Menu: React.FC<Props> = (props) => {
  const { signOut } = useAuth();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="rounded-full w-10 h-10 p-0">
          <Image
            src={props.photo}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="sr-only">Dashboard</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <section className="grid bg-stone-900 rounded-md">
          <Button variant="link" href="/dashboard">
            Dashboard
          </Button>
          <Button variant="link" onClick={() => signOut()}>
            Logout
          </Button>
        </section>
      </PopoverContent>
    </Popover>
  );
};

export { Menu };
