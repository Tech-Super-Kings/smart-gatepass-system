import { NextResponse } from "next/server";

import { getAdminDashboardData } from "@/lib/visitor-service";

export async function GET() {
  try {
    const data = await getAdminDashboardData();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to fetch admin dashboard data.",
      },
      { status: 500 },
    );
  }
}
