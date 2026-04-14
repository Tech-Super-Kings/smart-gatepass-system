import { NextResponse } from "next/server";

import { decideWalkInRequest } from "@/lib/visitor-service";
import type { ApprovalAction } from "@/lib/visitor-types";

type Context = {
  params: Promise<{
    requestId: string;
  }>;
};

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { requestId } = await params;
    const body = (await request.json()) as { action?: ApprovalAction };

    if (!body.action) {
      throw new Error("Approval action is required.");
    }

    const visitor = await decideWalkInRequest(requestId, body.action);

    return NextResponse.json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to review walk-in request.",
      },
      { status: 400 },
    );
  }
}
