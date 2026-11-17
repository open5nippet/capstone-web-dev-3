import mongoose from 'mongoose';

export const CATEGORIES = ['Classroom', 'Internet/Wi-Fi', 'Hostel', 'Library', 'Transport', 'Maintenance', 'Other'];
export const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 5, maxlength: 100 },
  description: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
  category: { type: String, required: true, enum: CATEGORIES },
  location: { type: String, trim: true, maxlength: 120, default: '' },
  status: { type: String, enum: STATUSES, default: 'Pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  adminRemark: { type: String, trim: true, maxlength: 1000, default: '' }
}, { timestamps: true });
complaintSchema.index({ status: 1, category: 1 });

export default mongoose.model('Complaint', complaintSchema);
