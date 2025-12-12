import { Schema, model, models, type Document } from "mongoose";

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  dni: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dni: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true },
);

export const User = models.User || model<UserDocument>("User", userSchema);
