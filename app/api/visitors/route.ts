import { NextResponse } from "next/server";

import { createVisitor } from "@/lib/visitor-service";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const visitor = await createVisitor(payload);

    return NextResponse.json(
      {
        success: true,
        data: visitor,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create visitor pass right now.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 },
    );
  }
}
