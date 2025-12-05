// src/pages/api/proxy.ts
import type { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return new Response("Missing URL", { status: 400 });

  try {
    const response = await fetch(url);
    if (!response.ok) return new Response("Failed to fetch PDF", { status: response.status });

    const arrayBuffer = await response.arrayBuffer();
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
}

