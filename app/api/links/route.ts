import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { customAlphabet } from "nanoid";
import { z } from "zod";

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function generateCode() {
  return nanoid();
}

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(links);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { targetUrl, code: customCode } = body;

  // Validate URL
  try {
    new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  let code = customCode?.trim();

  if (code) {
    if (!CODE_REGEX.test(code)) {
      return NextResponse.json(
        { error: "Custom code must be 6-8 alphanumeric characters" },
        { status: 400 }
      );
    }
  } else {
    // Generate unique code
    do {
      code = generateCode();
    } while (await prisma.link.findUnique({ where: { code } }));
  }

  // Check uniqueness
  const existing = await prisma.link.findUnique({ where: { code } });
  if (existing) {
    return NextResponse.json({ error: "Code already taken" }, { status: 409 });
  }

  const link = await prisma.link.create({
    data: { code, targetUrl },
  });

  return NextResponse.json(link, { status: 201 });
}