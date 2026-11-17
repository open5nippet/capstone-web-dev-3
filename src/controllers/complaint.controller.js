import Complaint, { STATUSES } from '../models/Complaint.js';

const ownerFilter = (user) => user.role === 'admin' ? {} : { createdBy: user._id };
const canAccess = (complaint, user) => user.role === 'admin' || String(complaint.createdBy._id || complaint.createdBy) === String(user._id);
export async function createComplaint(req, res, next) {
  try {
    const { title, description, category, location } = req.body;
    const complaint = await Complaint.create({ title, description, category, location, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Complaint submitted successfully.', data: { complaint } });
  } catch (error) { next(error); }
}
export async function listComplaints(req, res, next) {
  try {
    const { status, category, search = '' } = req.query;
    const filter = { ...ownerFilter(req.user), ...(status && { status }), ...(category && { category }) };
    if (search) filter.title = { $regex: search, $options: 'i' };
    const complaints = await Complaint.find(filter).populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: { complaints } });
  } catch (error) { next(error); }
}
export async function getComplaint(req, res, next) {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('createdBy', 'name email');
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found.' });
    if (!canAccess(complaint, req.user)) return res.status(403).json({ success: false, message: 'You cannot view this complaint.' });
    res.json({ success: true, data: { complaint } });
  } catch (error) { next(error); }
}
export async function updateComplaint(req, res, next) {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found.' });
    if (String(complaint.createdBy) !== String(req.user._id) || complaint.status !== 'Pending') return res.status(403).json({ success: false, message: 'Only your pending complaints can be edited.' });
    const allowed = ['title', 'description', 'category', 'location'];
    for (const key of allowed) if (key in req.body) complaint[key] = req.body[key];
    await complaint.save(); res.json({ success: true, message: 'Complaint updated.', data: { complaint } });
  } catch (error) { next(error); }
}
export async function deleteComplaint(req, res, next) {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found.' });
    if (String(complaint.createdBy) !== String(req.user._id) || complaint.status !== 'Pending') return res.status(403).json({ success: false, message: 'Only your pending complaints can be deleted.' });
    await complaint.deleteOne(); res.json({ success: true, message: 'Complaint deleted.' });
  } catch (error) { next(error); }
}
export async function updateStatus(req, res, next) {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found.' });
    const { status, adminRemark } = req.body;
    if (!STATUSES.includes(status)) return res.status(400).json({ success: false, message: 'Invalid complaint status.' });
    complaint.status = status; if (adminRemark !== undefined) complaint.adminRemark = adminRemark;
    await complaint.save(); res.json({ success: true, message: 'Complaint status updated.', data: { complaint } });
  } catch (error) { next(error); }
}
export async function stats(req, res, next) {
  try {
    const grouped = await Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const counts = { total: 0, Pending: 0, 'In Progress': 0, Resolved: 0, Rejected: 0 };
    grouped.forEach(({ _id, count }) => { counts[_id] = count; counts.total += count; });
    res.json({ success: true, data: { counts } });
  } catch (error) { next(error); }
}
