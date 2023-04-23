import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { pluckErrorMessage } from "~/lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== env.API_SECRET) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  let { urlPath } = req.body;
  if (!urlPath) {
    urlPath = JSON.parse(req.body).urlPath;
  }

  res.setHeader("Access-Control-Allow-Origin", env.NEXT_PUBLIC_APP_URL);
  res.setHeader("Access-Control-Allow-Methods", "POST");

  try {
    await res.revalidate(urlPath);

    res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    const message = pluckErrorMessage(error);
    console.error("API REVALIDATE ERROR: pages/api/revalidate.ts", message);
    res.status(500).json({
      message: `Failed to revalidate "${urlPath}"`,
    });
  }
}
