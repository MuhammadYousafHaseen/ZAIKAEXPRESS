import mongoose, { Schema, type Model, type Types } from "mongoose";
import {
  DELIVERY_ASSIGNMENT_STATUSES,
  type DeliveryAssignmentStatus,
} from "@/src/types/domain";

export interface IDeliveryAssignment {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  rider: Types.ObjectId;
  assignedBy: Types.ObjectId;
  status: DeliveryAssignmentStatus;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const deliveryAssignmentSchema = new Schema<IDeliveryAssignment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    rider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: DELIVERY_ASSIGNMENT_STATUSES,
      default: "assigned",
      required: true,
    },
    acceptedAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

deliveryAssignmentSchema.index({ rider: 1, status: 1 });

const DeliveryAssignment: Model<IDeliveryAssignment> =
  mongoose.models.DeliveryAssignment ||
  mongoose.model<IDeliveryAssignment>(
    "DeliveryAssignment",
    deliveryAssignmentSchema
  );

export default DeliveryAssignment;