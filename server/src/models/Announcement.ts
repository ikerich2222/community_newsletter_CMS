import { Schema, model, Types } from "mongoose";

interface IAnnouncement {
  title: string;
  content: string;
  author: Types.ObjectId;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export default model<IAnnouncement>("Announcement", announcementSchema);
