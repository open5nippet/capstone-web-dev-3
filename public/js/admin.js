import { request, requireRole, logout } from './api.js';

const session = requireRole('admin');

if (session) {
    document.querySelector('#admin-name').textContent = session.user.name;
    document.querySelector('#logout').onclick = logout;

    let selectedComplaint = null;

    const message = document.querySelector('#message');
    const complaintsRoot = document.querySelector('#complaints');

    function showMessage(text, type = 'error') {
        message.textContent = text;
        message.className = `notice ${type}`;
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>'"]/g, (character) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;',
        }[character]));
    }

    function getStatusBadge(status) {
        const safeStatus = escapeHtml(status);
        const statusClass = String(status).toLowerCase().replace(' ', '-');
        return `<span class="badge ${statusClass}">${safeStatus}</span>`;
    }

    async function loadStats() {
        const { data } = await request('/complaints/stats');

        for (const [key, value] of Object.entries(data.counts)) {
            const statElement = document.querySelector(`[data-stat="${key}"]`);
            if (statElement) {
                statElement.textContent = value;
            }
        }
    }

    async function loadComplaints() {
        try {
            const query = new URLSearchParams();
            const status = document.querySelector('#status-filter').value;
            const category = document.querySelector('#category-filter').value;

            if (status) {
                query.set('status', status);
            }
            if (category) {
                query.set('category', category);
            }

            const { data } = await request(`/complaints?${query}`);

            complaintsRoot.innerHTML = data.complaints.length
                ? data.complaints.map((complaint) => {
                    const location = complaint.location
                        ? ` · ${escapeHtml(complaint.location)}`
                        : '';

                    return `
                        <article class="card complaint">
                            <div>${getStatusBadge(complaint.status)}</div>
                            <h3>${escapeHtml(complaint.title)}</h3>
                            <p>${escapeHtml(complaint.description)}</p>
                            <div class="meta">
                                ${escapeHtml(complaint.category)}
                                ${location}
                                · Student: ${escapeHtml(complaint.createdBy.name)}
                            </div>
                            <div class="actions">
                                <button data-view="${escapeHtml(complaint._id)}">Manage</button>
                            </div>
                        </article>
                    `;
                }).join('')
                : '<p class="muted">No complaints match the selected filters.</p>';

            document.querySelectorAll('[data-view]').forEach((button) => {
                button.onclick = () => openComplaint(
                    data.complaints.find(
                        (complaint) => complaint._id === button.dataset.view
                    )
                );
            });
        } catch (error) {
            showMessage(error.message);
        }
    }

    function openComplaint(complaint) {
        selectedComplaint = complaint;

        document.querySelector('#detail').classList.remove('hidden');
        document.querySelector('#detail-title').textContent = complaint.title;
        document.querySelector('#detail-status').value = complaint.status;
        document.querySelector('#detail-remark').value = complaint.adminRemark || '';
    }

    document.querySelector('#filters').onchange = loadComplaints;

    document.querySelector('#status-form').onsubmit = async (event) => {
        event.preventDefault();

        if (!selectedComplaint) {
            return;
        }

        try {
            await request(`/complaints/${selectedComplaint._id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status: document.querySelector('#detail-status').value,
                    adminRemark: document.querySelector('#detail-remark').value,
                }),
            });

            showMessage('Complaint updated.', 'success');
            document.querySelector('#detail').classList.add('hidden');
            loadComplaints();
            loadStats();
        } catch (error) {
            showMessage(error.message);
        }
    };

    loadComplaints();
    loadStats();
}
