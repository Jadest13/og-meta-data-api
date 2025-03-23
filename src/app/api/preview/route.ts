// app/api/preview/routes.ts

import { NextRequest, NextResponse } from "next/server";
import urlMetadata from "url-metadata";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url") || "";

    const result: urlMetadata.Result = await urlMetadata(url, {
      cache: "force-cache",
      requestHeaders: {
        "User-Agent": "Googlebot",
      },
    });

    const ogData = {
      ogTitle: result["og:title"] || result["title"],
      ogUrl: result["og:url"],
      ogImage: result["og:image"] || result["image"],
      ogDescription: result["og:description"] || result["description"],
      result: result,
    };

    return await NextResponse.json(ogData, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
