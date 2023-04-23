import { useEffect, useRef } from "react";

const useScript = ({
  id,
  url,
  callback,
}: {
  id: string;
  url: string;
  callback?: () => void;
}): void => {
  const firstMountRef = useRef(true);
  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    if (firstMountRef.current) {
      if (!document.getElementById(id)) {
        script = document.createElement("script");

        script.id = id;
        script.src = url;
        script.async = true;

        document.body.appendChild(script);

        if (typeof callback === "function") {
          callback();
        }
      }
    }

    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [url, callback, id]);
};

export default useScript;
