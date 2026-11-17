import { Router } from 'express';
import { createComplaint, deleteComplaint, getComplaint, listComplaints, stats, updateComplaint, updateStatus } from '../controllers/complaint.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';
const router = Router();
router.use(protect); router.get('/stats', allowRoles('admin'), stats); router.get('/', listComplaints); router.post('/', allowRoles('student'), createComplaint); router.get('/:id', getComplaint); router.patch('/:id', allowRoles('student'), updateComplaint); router.delete('/:id', allowRoles('student'), deleteComplaint); router.patch('/:id/status', allowRoles('admin'), updateStatus);
export default router;
