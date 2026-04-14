import { NextResponse } from "next/server";

import { findVisitorByPassCode, updateVisitorStatus } from "@/lib/visitor-service";
import type { SecurityAction } from "@/lib/visitor-types";

type Context = {
  params: Promise<{
    passCode: string;
  }>;
};

export async function GET(_request: Request, { params }: Context) {
  const { passCode } = await params;
  const visitor = await findVisitorByPassCode(passCode);

  if (!visitor) {
    return NextResponse.json(
      {
        success: false,
        error: "Visitor pass not found.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    data: visitor,
  });
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { passCode } = await params;
    const body = (await request.json()) as { action?: SecurityAction };

    if (!body.action) {
      throw new Error("Security action is required.");
    }

    const visitor = await updateVisitorStatus(passCode, body.action);

    return NextResponse.json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to update visitor status.",
      },
      { status: 400 },
    );
  }
}
