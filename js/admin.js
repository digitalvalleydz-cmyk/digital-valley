let currentRejectProductId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is admin
    const user = await getCurrentUser();
    
    if (!user || !user.isAdmin) {
        window.location.href = 'index.html';
        return;
    }


    // Update Admin UI
    const adminInfo = document.getElementById('admin-info');
    if (adminInfo) {
        adminInfo.innerHTML = `
            <img src="${user.avatar}" class="w-8 h-8 rounded-full border border-primary">
            <span class="text-sm font-bold dark:text-white">${user.username}</span>
        `;
    }

    // Load initial data
    loadDashboardStats();
    loadUsers();
    loadProducts();
    loadReports();
});

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
    // Show target section
    document.getElementById(`section-${sectionId}`).classList.remove('hidden');
    
    // Update sidebar links
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    document.getElementById(`link-${sectionId}`).classList.add('active');
}

async function loadDashboardStats() {
    try {
        const stats = await getAdminStats();
        document.getElementById('stat-users').innerText = stats.totalUsers;
        document.getElementById('stat-products').innerText = stats.totalProducts;
        document.getElementById('stat-orders').innerText = stats.totalOrders;
        document.getElementById('stat-reports').innerText = stats.pendingReports;
    } catch (err) {
        console.error('Stats Load Error:', err);
    }
}

async function loadUsers() {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    
    try {
        const users = await getAdminUsers();
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div class="flex items-center gap-3">
                        <img src="${user.avatar}" class="w-8 h-8 rounded-full">
                        <span class="font-medium">${user.username}</span>
                    </div>
                </td>
                <td>${user.email}</td>
                <td class="capitalize">${user.accountType}</td>
                <td>
                    <span class="status-badge ${user.isActive ? 'status-active' : 'status-rejected'}">
                        ${user.isActive ? 'Active' : 'Suspended'}
                    </span>
                </td>
                <td>
                    <div class="flex gap-2">
                        <button onclick="toggleUserStatus('${user._id}', ${!user.isActive})" 
                            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition ${user.isActive ? 'text-red-500' : 'text-green-500'}"
                            title="${user.isActive ? 'Suspend' : 'Activate'}">
                            <i class="fas ${user.isActive ? 'fa-user-slash' : 'fa-user-check'}"></i>
                        </button>
                        <button onclick="deleteUser('${user._id}')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-red-600 transition" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-red-500">Failed to load users</td></tr>';
    }
}

async function loadProducts() {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;

    try {
        const products = await getAdminProducts();
        tbody.innerHTML = products.map(product => `
            <tr>
                <td>
                    <div class="flex items-center gap-3">
                        <img src="${product.thumbnail.startsWith('http') ? product.thumbnail : 'http://localhost:5000/' + product.thumbnail.replace(/\\\\/g, '/')}" class="w-10 h-8 rounded object-cover">
                        <span class="font-medium truncate max-w-[200px]">${product.title}</span>
                    </div>
                </td>
                <td>${product.seller ? product.seller.username : 'Unknown'}</td>
                <td class="font-bold text-primary">$${product.price}</td>
                <td>
                    <span class="status-badge status-${product.status}">
                        ${product.status}
                    </span>
                </td>
                <td>
                    <div class="flex gap-2">
                        ${product.status === 'pending' ? `
                            <button onclick="handleApprove('${product._id}')" class="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition" title="Approve">
                                <i class="fas fa-check"></i>
                            </button>
                            <button onclick="openRejectModal('${product._id}')" class="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" title="Reject">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                        <button onclick="deleteProduct('${product._id}')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-red-600 transition" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-red-500">Failed to load products</td></tr>';
    }
}

async function loadReports() {
    const tbody = document.getElementById('reports-table-body');
    if (!tbody) return;

    try {
        const reports = await getReports();
        tbody.innerHTML = reports.map(report => `
            <tr>
                <td>
                    <div class="flex items-center gap-3">
                        <img src="${report.product ? (report.product.thumbnail.startsWith('http') ? report.product.thumbnail : 'http://localhost:5000/' + report.product.thumbnail.replace(/\\\\/g, '/')) : ''}" class="w-10 h-8 rounded object-cover">
                        <span class="font-medium truncate max-w-[200px]">${report.product ? report.product.title : 'Deleted Product'}</span>
                    </div>
                </td>
                <td>${report.reporter ? report.reporter.username : 'Unknown'}</td>
                <td>
                    <div class="text-xs font-bold text-red-500 uppercase">${report.reason}</div>
                    <div class="text-[10px] text-gray-500 truncate max-w-[150px]">${report.description || ''}</div>
                </td>
                <td>${new Date(report.createdAt).toLocaleDateString()}</td>
                <td>
                    <div class="flex gap-2">
                        <button onclick="deleteProduct('${report.product ? report.product._id : ''}')" class="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs" title="Delete Product">
                            Delete Prod
                        </button>
                        <button onclick="alert('Report marked as reviewed (mock)')" class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 transition text-xs" title="Dismiss">
                            Dismiss
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-red-500">Failed to load reports</td></tr>';
    }
}

// Actions
async function toggleUserStatus(id, isActive) {
    if (!confirm(`Are you sure you want to ${isActive ? 'activate' : 'suspend'} this user?`)) return;
    try {
        await updateAdminUserStatus(id, isActive);
        loadUsers();
    } catch (err) {
        alert('Failed to update user status');
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to PERMANENTLY delete this user? This cannot be undone.')) return;
    try {
        await deleteAdminUser(id);
        loadUsers();
        loadDashboardStats();
    } catch (err) {
        alert('Failed to delete user');
    }
}

async function handleApprove(id) {
    if (!confirm('Approve this product?')) return;
    try {
        await approveProduct(id);
        loadProducts();
        loadDashboardStats();
    } catch (err) {
        alert('Failed to approve product');
    }
}

function openRejectModal(id) {
    currentRejectProductId = id;
    document.getElementById('reject-modal').classList.remove('hidden');
    document.getElementById('reject-modal').classList.add('flex');
}

function closeRejectModal() {
    document.getElementById('reject-modal').classList.add('hidden');
    document.getElementById('reject-modal').classList.remove('flex');
    document.getElementById('reject-reason').value = '';
}

document.getElementById('confirm-reject-btn').addEventListener('click', async () => {
    const reason = document.getElementById('reject-reason').value;
    if (!reason) {
        alert('Please provide a reason for rejection');
        return;
    }
    try {
        await rejectProduct(currentRejectProductId, reason);
        closeRejectModal();
        loadProducts();
    } catch (err) {
        alert('Failed to reject product');
    }
});

async function deleteProduct(id) {
    if (!id) return;
    if (!confirm('Are you sure you want to PERMANENTLY delete this product?')) return;
    try {
        await deleteAdminProduct(id);
        loadProducts();
        loadDashboardStats();
        loadReports();
    } catch (err) {
        alert('Failed to delete product');
    }
}
