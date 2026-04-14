export type VisitorStatus = "pending" | "approved" | "rejected" | "verified" | "entered" | "exited";
export type SecurityAction = "verify" | "entry" | "exit";
export type ApprovalAction = "approve" | "reject";
export type VisitorFlowType = "pre_registered" | "walk_in";

export type CreateVisitorPayload = {
  visitorName: string;
  phone: string;
  hostName: string;
  purpose: string;
  visitDate: string;
  visitTime: string;
  locationUnit: string;
};

export type VisitorRecord = CreateVisitorPayload & {
  id: string;
  passCode?: string | null;
  qrValue?: string | null;
  status: VisitorStatus;
  flowType: VisitorFlowType;
  createdAt: string;
  entryTime?: string | null;
  exitTime?: string | null;
};

export type VisitorStatusFilter = VisitorStatus | "all";

export type AdminSummary = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  verified: number;
  entered: number;
  exited: number;
};

export type AdminDashboardData = {
  summary: AdminSummary;
  visitors: VisitorRecord[];
};

export type WalkInRequestPayload = {
  visitorName: string;
  phone: string;
  purpose: string;
  hostReference: string;
};
