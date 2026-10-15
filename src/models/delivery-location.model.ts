import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface IDeliveryLocation {
  _id: Types.ObjectId;
  assignment: Types.ObjectId;
  order: Types.ObjectId;
  rider: Types.ObjectId;
  lat: number;
  lng: number;
  accuracyMeters?: number;
  headingDegrees?: number;
  speedMetersPerSecond?: number;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const deliveryLocationSchema = new Schema<IDeliveryLocation>(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryAssignment",
      required: true,
      unique: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    rider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lat: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    lng: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    accuracyMeters: {
      type: Number,
      min: 0,
    },
    headingDegrees: {
      type: Number,
      min: 0,
      max: 360,
    },
    speedMetersPerSecond: {
      type: Number,
      min: 0,
    },
    recordedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const DeliveryLocation: Model<IDeliveryLocation> =
  mongoose.models.DeliveryLocation ||
  mongoose.model<IDeliveryLocation>(
    "DeliveryLocation",
    deliveryLocationSchema
  );

export default DeliveryLocation;