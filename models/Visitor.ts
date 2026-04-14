import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const visitorSchema = new Schema(
  {
    visitorName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    hostName: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    visitDate: {
      type: String,
      required: true,
    },
    visitTime: {
      type: String,
      required: true,
    },
    locationUnit: {
      type: String,
      required: true,
      trim: true,
    },
    passCode: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
      trim: true,
    },
    qrValue: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "verified", "entered", "exited"],
      default: "pending",
      index: true,
    },
    flowType: {
      type: String,
      enum: ["pre_registered", "walk_in"],
      default: "pre_registered",
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    entryTime: {
      type: Date,
      default: null,
    },
    exitTime: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
  },
);

export type VisitorDocument = InferSchemaType<typeof visitorSchema>;

const Visitor: Model<VisitorDocument> = models.Visitor || model<VisitorDocument>("Visitor", visitorSchema);

export default Visitor;
