export function notFound(req, res) { res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` }); }
export function errorHandler(error, _req, res, _next) {
  if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid resource ID.' });
  if (error.code === 11000) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: Object.values(error.errors).map((item) => item.message).join(' ') });
  console.error(error.message);
  res.status(error.status || 500).json({ success: false, message: error.message || 'Internal server error.' });
}
