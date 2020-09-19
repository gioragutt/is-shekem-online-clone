import { Document, model, Schema } from 'mongoose';

export const reportSchema = new Schema({
  reporter: String,
  reportingIp: String,
  timestamp: Date,
  open: Boolean,
  upvotes: [String],
  downvotes: [String],
})

export interface ReportDocument extends Document {
  reporter: string;
  reportingId: string;
  timestamp: Date;
  open: boolean;
  upvotes: string[];
  downvotes: string[];
}

export const ReportModel = model<ReportDocument>('Report', reportSchema);
