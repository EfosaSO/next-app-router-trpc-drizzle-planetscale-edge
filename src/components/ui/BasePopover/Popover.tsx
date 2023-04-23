import { Dispatch, ReactNode, SetStateAction } from "react";
import { Portal } from "ariakit";
import useWindowSize from "~/lib/hooks/useWindowSize";

import Leaflet from "../Leaflet";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

export default function BasePopover({
  children,
  content,
  align = "center",
  openPopover,
  setOpenPopover,
}: {
  children: ReactNode;
  content: ReactNode | string;
  align?: "center" | "start" | "end";
  openPopover: boolean;
  setOpenPopover: Dispatch<SetStateAction<boolean>>;
}) {
  const { isMobile } = useWindowSize();
  return (
    <>
      {isMobile && content}
      {openPopover && isMobile && (
        <Portal>
          <Leaflet setShow={setOpenPopover}>{children}</Leaflet>
        </Portal>
      )}
      {!isMobile && (
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
          <PopoverTrigger asChild>{content}</PopoverTrigger>
          <PopoverContent className="w-auto p-0">{children}</PopoverContent>
        </Popover>
      )}
    </>
  );
}
