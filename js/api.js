const API_URL = 'https://digital-valley-dz.up.railway.app/api';

// Helper: JWT token management
function saveToken(token) {
    localStorage.setItem('dv_token', token);
}

function getToken() {
    return localStorage.getItem('dv_token');
}

function removeToken() {
    localStorage.removeItem('dv_token');
}

function isLoggedIn() {
    return !!getToken();
}

// Global Headers Helper
function getHeaders(isMultipart = false) {
    const headers = {};
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// --- Auth Functions ---

async function register(userData) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        return data;
    } catch (err) {
        console.error('Register Error:', err.message);
        throw err;
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        saveToken(data.token);
        return data;
    } catch (err) {
        console.error('Login Error:', err.message);
        throw err;
    }
}

async function logout() {
    removeToken();
    window.location.href = 'login.html';
}

async function getCurrentUser() {
    try {
        if (!isLoggedIn()) return null;
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: getHeaders()
        });
        if (!response.ok) {
            removeToken();
            return null;
        }
        return await response.json();
    } catch (err) {
        return null;
    }
}

// --- Product Functions ---

async function getProducts(filters = {}) {
    try {
        const params = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/products?${params}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (err) {
        console.error('Get Products Error:', err.message);
        throw err;
    }
}

async function getProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        return await response.json();
    } catch (err) {
        console.error('Get Product Error:', err.message);
        throw err;
    }
}

async function createProduct(formData) {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create product');
        return data;
    } catch (err) {
        console.error('Create Product Error:', err.message);
        throw err;
    }
}

// --- Order Functions ---

async function createOrder(orderData) {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(orderData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Order failed');
        return data;
    } catch (err) {
        console.error('Create Order Error:', err.message);
        throw err;
    }
}

async function getOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        return await response.json();
    } catch (err) {
        console.error('Get Orders Error:', err.message);
        throw err;
    }
}

// --- User Functions ---

async function getDashboardStats() {
    try {
        const response = await fetch(`${API_URL}/users/dashboard`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        return await response.json();
    } catch (err) {
        console.error('Dashboard Stats Error:', err.message);
        throw err;
    }
}

async function updateProfile(data) {
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Profile update failed');
        return await response.json();
    } catch (err) {
        console.error('Update Profile Error:', err.message);
        throw err;
    }
}

// --- Report Functions ---

async function submitReport(reportData) {
    try {
        const response = await fetch(`${API_URL}/reports`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(reportData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Report submission failed');
        return data;
    } catch (err) {
        console.error('Submit Report Error:', err.message);
        throw err;
    }
}

async function getReports() {
    try {
        const response = await fetch(`${API_URL}/reports`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch reports');
        return await response.json();
    } catch (err) {
        console.error('Get Reports Error:', err.message);
        throw err;
    }
}

// --- Admin Functions ---

async function getAdminStats() {
    try {
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch admin stats');
        return await response.json();
    } catch (err) {
        console.error('Admin Stats Error:', err.message);
        throw err;
    }
}

async function getAdminUsers() {
    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch admin users');
        return await response.json();
    } catch (err) {
        console.error('Admin Users Error:', err.message);
        throw err;
    }
}

async function updateAdminUserStatus(id, isActive) {
    try {
        const response = await fetch(`${API_URL}/admin/users/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ isActive })
        });
        if (!response.ok) throw new Error('Failed to update user status');
        return await response.json();
    } catch (err) {
        console.error('Update User Status Error:', err.message);
        throw err;
    }
}

async function deleteAdminUser(id) {
    try {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete user');
        return await response.json();
    } catch (err) {
        console.error('Delete User Error:', err.message);
        throw err;
    }
}

async function getAdminPendingProducts() {
    try {
        const response = await fetch(`${API_URL}/admin/products/pending`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch pending products');
        return await response.json();
    } catch (err) {
        console.error('Admin Pending Products Error:', err.message);
        throw err;
    }
}

async function getAdminProducts() {
    try {
        const response = await fetch(`${API_URL}/admin/products`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch all products');
        return await response.json();
    } catch (err) {
        console.error('Admin All Products Error:', err.message);
        throw err;
    }
}

async function approveProduct(id) {
    try {
        const response = await fetch(`${API_URL}/admin/products/${id}/approve`, {
            method: 'PUT',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to approve product');
        return await response.json();
    } catch (err) {
        console.error('Approve Product Error:', err.message);
        throw err;
    }
}

async function rejectProduct(id, reason) {
    try {
        const response = await fetch(`${API_URL}/admin/products/${id}/reject`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ reason })
        });
        if (!response.ok) throw new Error('Failed to reject product');
        return await response.json();
    } catch (err) {
        console.error('Reject Product Error:', err.message);
        throw err;
    }
}

async function deleteAdminProduct(id) {
    try {
        const response = await fetch(`${API_URL}/admin/products/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return await response.json();
    } catch (err) {
        console.error('Delete Product Error:', err.message);
        throw err;
    }
}

// Global UI Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Check if token is in URL (from Google OAuth)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        saveToken(token);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const user = await getCurrentUser();
    updateNavbarUI(user);
});

function updateNavbarUI(user) {
    const authLinks = document.querySelector('.auth-links') || document.querySelector('nav .flex.items-center.gap-4');
    if (!authLinks) return;

    if (user) {
        authLinks.innerHTML = `
            <div class="flex items-center gap-4">
                <a href="dashboard.html" class="flex items-center gap-2 hover:text-primary transition">
                    <img src="${user.avatar}" alt="${user.username}" class="w-8 h-8 rounded-full object-cover border border-primary">
                    <span class="hidden sm:inline font-medium">${user.username}</span>
                </a>
                <button onclick="logout()" class="text-sm font-medium hover:text-primary transition" data-i18n="btn_logout">Logout</button>
            </div>
        `;
    }
}
