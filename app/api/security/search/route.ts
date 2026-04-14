import { NextResponse } from "next/server";

import { findVisitorForSecurityCheck, findVisitorByQrValue } from "@/lib/visitor-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const passCode = searchParams.get("passCode")?.trim() ?? "";
  const qrValue = searchParams.get("qrValue")?.trim() ?? "";

  try {
    if (!passCode && !qrValue) {
      throw new Error("Enter a pass code or QR value to search.");
    }

    if (!passCode && qrValue) {
      const visitor = await findVisitorByQrValue(qrValue);

      if (!visitor) {
        throw new Error("No visitor record found for this QR value.");
      }

      return NextResponse.json({
        success: true,
        data: visitor,
      });
    }

    const visitor = await findVisitorForSecurityCheck(passCode, qrValue || undefined);

    return NextResponse.json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to fetch visitor details.",
      },
      { status: 400 },
    );
  }
}
