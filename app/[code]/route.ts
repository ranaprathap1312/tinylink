// app/[code]/route.ts   ← THIS IS THE REDIRECT FILE

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return new Response("Not Found", { status: 404 });
  }

  // THIS IS THE MOST IMPORTANT PART — INCREASE CLICK COUNT
  await prisma.link.update({
    where: { code },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  // Redirect to original URL
  return NextResponse.redirect(link.targetUrl);
}