import { env } from "~/env.mjs";

import { postData } from "./fetcher";
import { pluckErrorMessage } from "./utils";

export async function revalidate(paths: string[]) {
  // refer to https://solutions-on-demand-isr.vercel.app/ for more info on bulk/batch revalidate
  try {
    await Promise.allSettled(
      paths.map((urlPath) =>
        postData(
          `${env.NEXT_PUBLIC_APP_URL}/api/revalidate`,
          {
            urlPath,
          },
          {
            headers: {
              "x-api-key": env.API_SECRET,
            },
          }
        )
      )
    );
  } catch (error) {
    const message = pluckErrorMessage(error);
    console.error("API REVALIDATE ERROR: lib/utils/revalidate #revalidate", {
      message,
      paths: JSON.stringify(paths),
      error,
    });
  }
}
