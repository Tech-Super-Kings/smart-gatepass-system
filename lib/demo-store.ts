import type { VisitorRecord } from "@/lib/visitor-types";

declare global {
  var smartGatepassDemoVisitors: Map<string, VisitorRecord> | undefined;
}

const demoVisitors = global.smartGatepassDemoVisitors ?? new Map<string, VisitorRecord>();

global.smartGatepassDemoVisitors = demoVisitors;

export function saveDemoVisitor(visitor: VisitorRecord) {
  demoVisitors.set(visitor.id, visitor);
  return visitor;
}

export function getDemoVisitor(passCode: string) {
  for (const visitor of demoVisitors.values()) {
    if (visitor.passCode === passCode) {
      return visitor;
    }
  }

  return null;
}

export function getDemoVisitorByQrValue(qrValue: string) {
  for (const visitor of demoVisitors.values()) {
    if (visitor.qrValue === qrValue) {
      return visitor;
    }
  }

  return null;
}

export function updateDemoVisitor(visitor: VisitorRecord) {
  demoVisitors.set(visitor.id, visitor);
  return visitor;
}

export function getAllDemoVisitors() {
  return Array.from(demoVisitors.values());
}

export function getDemoVisitorById(id: string) {
  return demoVisitors.get(id) ?? null;
}
