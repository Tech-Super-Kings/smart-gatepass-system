function toIsoString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  }

  return new Date().toISOString();
}
import "server-only";

import crypto from "crypto";

import {
  getAllDemoVisitors,
  getDemoVisitor,
  getDemoVisitorById,
  getDemoVisitorByQrValue,
  saveDemoVisitor,
  updateDemoVisitor,
} from "@/lib/demo-store";
import { dbConnect } from "@/lib/mongodb";
import type {
  AdminDashboardData,
  ApprovalAction,
  CreateVisitorPayload,
  SecurityAction,
  VisitorRecord,
  VisitorStatus,
  WalkInRequestPayload,
} from "@/lib/visitor-types";
import Visitor from "@/models/Visitor";

function cleanPayload(payload: CreateVisitorPayload): CreateVisitorPayload {
  return {
    visitorName: payload.visitorName.trim(),
    phone: payload.phone.trim(),
    hostName: payload.hostName.trim(),
    purpose: payload.purpose.trim(),
    visitDate: payload.visitDate,
    visitTime: payload.visitTime,
    locationUnit: payload.locationUnit.trim(),
  };
}

function validatePayload(payload: CreateVisitorPayload) {
  const cleaned = cleanPayload(payload);

  if (!cleaned.visitorName) throw new Error("Visitor name is required.");
  if (cleaned.phone.replace(/\D/g, "").length < 10) throw new Error("A valid phone number is required.");
  if (!cleaned.hostName) throw new Error("Host name is required.");
  if (!cleaned.purpose) throw new Error("Purpose is required.");
  if (!cleaned.visitDate) throw new Error("Visit date is required.");
  if (!cleaned.visitTime) throw new Error("Visit time is required.");
  if (!cleaned.locationUnit) throw new Error("Location or unit is required.");

  return cleaned;
}

function validateWalkInPayload(payload: WalkInRequestPayload) {
  const visitorName = payload.visitorName.trim();
  const phone = payload.phone.trim();
  const purpose = payload.purpose.trim();
  const hostReference = payload.hostReference.trim();

  if (!visitorName) throw new Error("Visitor name is required.");
  if (phone.replace(/\D/g, "").length < 10) throw new Error("A valid phone number is required.");
  if (!purpose) throw new Error("Purpose is required.");
  if (!hostReference) throw new Error("Host name or flat / unit is required.");

  return {
    visitorName,
    phone,
    purpose,
    hostReference,
  };
}

function generatePassCode() {
  const token = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `VP-${token}`;
}

function generateQrValue(passCode: string) {
  return `smartgatepass:${passCode}:${crypto.randomUUID()}`;
}

function normalizeVisitorRecord(record: Partial<VisitorRecord> & Record<string, unknown>): VisitorRecord {
  const mongoId = "_id" in record && typeof record._id === "object" && record._id !== null && "toString" in record._id
    ? (record._id as { toString(): string }).toString()
    : undefined;

  return {
    id: String(record.id ?? mongoId ?? record.passCode ?? crypto.randomUUID()),
    visitorName: String(record.visitorName ?? ""),
    phone: String(record.phone ?? ""),
    hostName: String(record.hostName ?? ""),
    purpose: String(record.purpose ?? ""),
    visitDate: String(record.visitDate ?? ""),
    visitTime: String(record.visitTime ?? ""),
    locationUnit: String(record.locationUnit ?? ""),
    passCode: typeof record.passCode === "string" ? record.passCode : null,
    qrValue: typeof record.qrValue === "string" ? record.qrValue : null,
    status: (record.status as VisitorStatus) ?? "pending",
    flowType: (record.flowType as VisitorRecord["flowType"]) ?? "pre_registered",
    createdAt: toIsoString(record.createdAt),
    entryTime: record.entryTime ? toIsoString(record.entryTime) : null,
    exitTime: record.exitTime ? toIsoString(record.exitTime) : null,
  };
}

async function doesPassCodeExist(passCode: string) {
  const demoVisitor = getDemoVisitor(passCode);

  if (demoVisitor) {
    return true;
  }

  const connection = await dbConnect();

  if (!connection) {
    return false;
  }

  try {
    const visitor = await Visitor.findOne({ passCode }).select("_id").lean();
    return Boolean(visitor);
  } catch {
    return false;
  }
}

async function generateUniquePassCode() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const passCode = generatePassCode();

    if (!(await doesPassCodeExist(passCode))) {
      return passCode;
    }
  }

  throw new Error("Unable to generate a unique pass code. Please try again.");
}

export async function createVisitor(payload: CreateVisitorPayload) {
  const cleaned = validatePayload(payload);
  const passCode = await generateUniquePassCode();
  const qrValue = generateQrValue(passCode);
  const visitorRecord: VisitorRecord = {
    id: crypto.randomUUID(),
    ...cleaned,
    passCode,
    qrValue,
    status: "pending",
    flowType: "pre_registered",
    createdAt: new Date().toISOString(),
    entryTime: null,
    exitTime: null,
  };

  const connection = await dbConnect();

  if (!connection) {
    return saveDemoVisitor(visitorRecord);
  }

  try {
    const doc = await Visitor.create(visitorRecord);
    return normalizeVisitorRecord(doc.toObject());
  } catch (error) {
    console.warn("Falling back to demo visitor store after database write failed.", error);
    return saveDemoVisitor(visitorRecord);
  }
}

export async function createWalkInRequest(payload: WalkInRequestPayload) {
  const cleaned = validateWalkInPayload(payload);
  const now = new Date();
  const requestRecord: VisitorRecord = {
    id: crypto.randomUUID(),
    visitorName: cleaned.visitorName,
    phone: cleaned.phone,
    hostName: cleaned.hostReference,
    purpose: cleaned.purpose,
    visitDate: now.toISOString().slice(0, 10),
    visitTime: now.toTimeString().slice(0, 5),
    locationUnit: cleaned.hostReference,
    passCode: "",
    qrValue: "",
    status: "pending",
    flowType: "walk_in",
    createdAt: now.toISOString(),
    entryTime: null,
    exitTime: null,
  };

  const connection = await dbConnect();

  if (!connection) {
    return saveDemoVisitor(requestRecord);
  }

  try {
    const doc = await Visitor.create({
      ...requestRecord,
      passCode: undefined,
      qrValue: undefined,
    });
    return normalizeVisitorRecord(doc.toObject());
  } catch (error) {
    console.warn("Falling back to demo visitor store after walk-in request write failed.", error);
    return saveDemoVisitor(requestRecord);
  }
}

export async function getPendingWalkInRequests() {
  const connection = await dbConnect();

  if (!connection) {
    return getAllDemoVisitors()
      .filter((visitor) => visitor.flowType === "walk_in" && visitor.status === "pending")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  try {
    const docs = await Visitor.find({ flowType: "walk_in", status: "pending" }).sort({ createdAt: -1 }).lean();
    return docs.map((doc) => normalizeVisitorRecord(doc));
  } catch (error) {
    console.warn("Database walk-in fetch failed, using demo fallback store instead.", error);
    return getAllDemoVisitors()
      .filter((visitor) => visitor.flowType === "walk_in" && visitor.status === "pending")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export async function decideWalkInRequest(requestId: string, action: ApprovalAction) {
  const connection = await dbConnect();
  const existing = connection
    ? await (async () => {
        try {
          const doc = await Visitor.findById(requestId).lean();
          return doc ? normalizeVisitorRecord(doc) : null;
        } catch {
          return null;
        }
      })()
    : getDemoVisitorById(requestId);

  if (!existing || existing.flowType !== "walk_in") {
    throw new Error("Walk-in visitor request not found.");
  }

  if (existing.status !== "pending") {
    throw new Error("This request has already been reviewed.");
  }

  const updates: Partial<VisitorRecord> =
    action === "approve"
      ? {
          status: "approved",
          passCode: await generateUniquePassCode(),
          qrValue: "",
        }
      : {
          status: "rejected",
        };

  if (action === "approve" && updates.passCode) {
    updates.qrValue = generateQrValue(updates.passCode);
  }

  if (!connection) {
    return updateDemoVisitor({
      ...existing,
      ...updates,
    });
  }

  try {
    const updated = await Visitor.findByIdAndUpdate(
      requestId,
      {
        $set: updates,
      },
      { new: true, lean: true },
    );

    if (!updated) {
      throw new Error("Walk-in visitor request not found.");
    }

    return normalizeVisitorRecord(updated);
  } catch (error) {
    console.warn("Database walk-in approval update failed, using demo fallback store instead.", error);
    return updateDemoVisitor({
      ...existing,
      ...updates,
    });
  }
}

export async function findVisitorByPassCode(passCode: string) {
  const normalizedCode = passCode.trim().toUpperCase();
  const connection = await dbConnect();

  if (!connection) {
    return getDemoVisitor(normalizedCode);
  }

  try {
    const visitor = await Visitor.findOne({ passCode: normalizedCode }).lean();

    if (visitor) {
      return normalizeVisitorRecord(visitor);
    }
  } catch (error) {
    console.warn("Database read failed, checking demo fallback store instead.", error);
  }

  return getDemoVisitor(normalizedCode);
}

export async function findVisitorByQrValue(qrValue: string) {
  const normalizedQr = qrValue.trim();
  const connection = await dbConnect();

  if (!connection) {
    return getDemoVisitorByQrValue(normalizedQr);
  }

  try {
    const visitor = await Visitor.findOne({ qrValue: normalizedQr }).lean();

    if (visitor) {
      return normalizeVisitorRecord(visitor);
    }
  } catch (error) {
    console.warn("Database QR lookup failed, checking demo fallback store instead.", error);
  }

  return getDemoVisitorByQrValue(normalizedQr);
}

export async function findVisitorForSecurityCheck(passCode: string, qrValue?: string) {
  const visitor = await findVisitorByPassCode(passCode);

  if (!visitor) {
    throw new Error("Visitor pass not found.");
  }

  if (qrValue?.trim() && visitor.qrValue !== qrValue.trim()) {
    throw new Error("QR value does not match this pass code.");
  }

  return visitor;
}

function getNextStatus(currentStatus: VisitorStatus, action: SecurityAction): VisitorStatus {
  if (currentStatus === "rejected") {
    throw new Error("Rejected visitors cannot proceed through security actions.");
  }

  if (action === "verify") {
    if (currentStatus === "entered" || currentStatus === "exited" || currentStatus === "verified") {
      return currentStatus;
    }

    if (currentStatus === "approved" || currentStatus === "pending") {
      return "verified";
    }
  }

  if (action === "entry") {
    if (currentStatus === "exited") {
      throw new Error("Exited visitors cannot be marked as entered again.");
    }

    if (currentStatus === "approved" || currentStatus === "pending" || currentStatus === "verified") {
      return "entered";
    }
  }

  if (action === "exit") {
    if (currentStatus !== "entered") {
      throw new Error("Only entered visitors can be marked as exited.");
    }

    return "exited";
  }

  throw new Error("Unsupported security action.");
}

export async function updateVisitorStatus(passCode: string, action: SecurityAction) {
  const normalizedCode = passCode.trim().toUpperCase();
  const now = new Date().toISOString();
  const existing = await findVisitorByPassCode(normalizedCode);

  if (!existing) {
    throw new Error("Visitor pass not found.");
  }

  const nextStatus = getNextStatus(existing.status, action);
  const updates: Partial<VisitorRecord> = {
    status: nextStatus,
  };

  if (action === "entry" && !existing.entryTime) {
    updates.entryTime = now;
  }

  if (action === "exit") {
    updates.exitTime = now;
  }

  const connection = await dbConnect();

  if (!connection) {
    return updateDemoVisitor({
      ...existing,
      ...updates,
    });
  }

  try {
    const updated = await Visitor.findOneAndUpdate(
      { passCode: normalizedCode },
      {
        $set: updates,
      },
      { new: true, lean: true },
    );

    if (!updated) {
      throw new Error("Visitor pass not found.");
    }

    return normalizeVisitorRecord(updated);
  } catch (error) {
    console.warn("Database update failed, updating demo fallback store instead.", error);
    return updateDemoVisitor({
      ...existing,
      ...updates,
    });
  }
}

function buildAdminSummary(visitors: VisitorRecord[]): AdminDashboardData["summary"] {
  return visitors.reduce(
    (summary, visitor) => {
      summary.total += 1;
      summary[visitor.status] += 1;
      return summary;
    },
    {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      verified: 0,
      entered: 0,
      exited: 0,
    },
  );
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const connection = await dbConnect();

  if (!connection) {
    const visitors = getAllDemoVisitors().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return {
      summary: buildAdminSummary(visitors),
      visitors,
    };
  }

  try {
    const docs = await Visitor.find({}).sort({ createdAt: -1 }).lean();
    const visitors = docs.map((doc) => normalizeVisitorRecord(doc));

    return {
      summary: buildAdminSummary(visitors),
      visitors,
    };
  } catch (error) {
    console.warn("Database admin fetch failed, using demo fallback store instead.", error);
    const visitors = getAllDemoVisitors().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return {
      summary: buildAdminSummary(visitors),
      visitors,
    };
  }
}
