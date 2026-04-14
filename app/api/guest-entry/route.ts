import { NextResponse } from "next/server";

import { createWalkInRequest } from "@/lib/visitor-service";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const visitor = await createWalkInRequest(payload);

    return NextResponse.json(
      {
        success: true,
        data: visitor,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to submit walk-in request.",
      },
      { status: 400 },
    );
  }
}
