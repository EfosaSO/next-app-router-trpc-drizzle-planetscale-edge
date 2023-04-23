import { Dispatch, SetStateAction } from "react";
import useWindowSize from "~/lib/hooks/useWindowSize";

import Leaflet from "../Leaflet";
import { Dialog, DialogContent, DialogTrigger } from "../dialog";

export default function Modal({
  content,
  children,
  showModal,
  loading,
  setShowModal,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  showModal: boolean;
  loading?: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { isMobile } = useWindowSize();

  return (
    <>
      <>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>{content}</DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <>
              {isMobile ? (
                <Leaflet
                  key="mobile-modal"
                  setShow={setShowModal}
                  loading={loading}
                >
                  {children}
                </Leaflet>
              ) : (
                children
              )}
            </>
          </DialogContent>
        </Dialog>
      </>
    </>
  );
}
