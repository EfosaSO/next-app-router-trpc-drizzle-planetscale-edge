"use client";

import { api } from "~/lib/api/client";

export default function HelloFromClient() {
  const { data, isLoading, error } = api.voids.hello.useQuery({
    text: "Test Client TRPC Call",
  });

  if (isLoading) return <>Loading...</>;
  if (!data)
    return (
      <>
        <span>Error</span>
        <pre>
          <code>{JSON.stringify(error, null, 2)}</code>
        </pre>
      </>
    );

  return <>{data.greeting}</>;
}
