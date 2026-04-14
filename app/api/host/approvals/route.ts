import { NextResponse } from "next/server";

import { getPendingWalkInRequests } from "@/lib/visitor-service";

export async function GET() {
  try {
    const requests = await getPendingWalkInRequests();

    return NextResponse.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to fetch host approvals.",
      },
      { status: 500 },
    );
  }
}
