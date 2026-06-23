// MAIN APP SHELL CONTROLLER
import { isAuthenticated, clearToken, getUserName, fetchAPI } from './api.js';
import { initAuth } from './components/auth.js';
import { renderDashboard } from './components/dashboard.js';
import { renderExpenses } from './components/expenses.js';
import { renderBudgets } from './components/budgets.js';
import { renderRecurring } from './components/recurring.js';

// Global App State
export const state = {
    currentView: 'dashboard',
    categories: [],
    notifications: [],
    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear(),
};

// Initialize Application on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    // 1. Initialize Auth forms and listener
    initAuth(onLoginSuccess);
    
    // 2. Setup standard global event listeners
    setupGlobalListeners();
    
    // 3. Render appropriate screen based on auth
    checkAuthAndRoute();
}

function onLoginSuccess() {
    checkAuthAndRoute();
}

export function checkAuthAndRoute() {
    const isAuthed = isAuthenticated();
    
    const authSec = document.getElementById('auth-section');
    const appSec = document.getElementById('app-section');
    
    if (isAuthed) {
        authSec.classList.add('hidden');
        appSec.classList.remove('hidden');
        
        // Load User Details
        const name = getUserName();
        document.getElementById('user-display-name').textContent = name;
        document.getElementById('user-avatar-initials').textContent = name.substring(0, 2).toUpperCase();
        
        // Fetch global resources and boot initial view
        bootstrapApp();
    } else {
        appSec.classList.add('hidden');
        authSec.classList.remove('hidden');
    }
    
    // Refresh Icons (Lucide)
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

async function bootstrapApp() {
    try {
        // Load Categories
        const categories = await fetchAPI('/categories');
        state.categories = categories;
        
        // Load Notifications
        await loadNotifications();
        
        // Render current active view
        navigateTo(state.currentView);
    } catch (err) {
        console.error('Bootstrapping app failed:', err);
    }
}

// ROUTER SYSTEM
export function navigateTo(viewName) {
    state.currentView = viewName;
    
    // Update Sidebar Navigation highlights
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
        if (btn.getAttribute('data-view') === viewName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Toggle active view elements
    document.querySelectorAll('.app-view').forEach(view => {
        if (view.id === `view-${viewName}`) {
            view.classList.remove('hidden');
        } else {
            view.classList.add('hidden');
        }
    });
    
    // Set Header titles
    const titleEl = document.getElementById('view-title');
    const subtitleEl = document.getElementById('view-subtitle');
    
    if (viewName === 'dashboard') {
        titleEl.textContent = 'Dashboard';
        subtitleEl.textContent = 'Welcome back to your financial control center.';
        renderDashboard();
    } else if (viewName === 'expenses') {
        titleEl.textContent = 'Expenses';
        subtitleEl.textContent = 'Comprehensively filter, audit, and log your transaction history.';
        renderExpenses();
    } else if (viewName === 'budgets') {
        titleEl.textContent = 'Budgets';
        subtitleEl.textContent = 'Establish spending limits and thresholds per category.';
        renderBudgets();
    } else if (viewName === 'recurring') {
        titleEl.textContent = 'Recurring Expenses';
        subtitleEl.textContent = 'Schedule automatically logged subscription models.';
        renderRecurring();
    }
    
    // Re-trigger icon rendering
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// NOTIFICATIONS & ALERTS
export async function loadNotifications() {
    try {
        const list = await fetchAPI('/notifications');
        state.notifications = list;
        renderNotificationsPanel();
        renderPersistentBanners();
    } catch (e) {
        console.error('Failed to load notifications', e);
    }
}

function renderNotificationsPanel() {
    const badge = document.getElementById('notif-badge');
    const container = document.getElementById('notif-list-container');
    
    const unreadCount = state.notifications.filter(n => !n.is_read).length;
    
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
    
    if (state.notifications.length === 0) {
        container.innerHTML = `<div class="empty-notifs">No notifications yet.</div>`;
        return;
    }
    
    container.innerHTML = state.notifications.map(notif => {
        let icon = 'info';
        let iconClass = 'info';
        if (notif.type === 'budget_exceeded') {
            icon = 'alert-triangle';
            iconClass = 'danger';
        } else if (notif.type === 'budget_warning') {
            icon = 'alert-circle';
            iconClass = 'warning';
        } else if (notif.type === 'recurring_due') {
            icon = 'clock';
            iconClass = 'info';
        }
        
        const isUnread = !notif.is_read ? 'unread' : '';
        const date = new Date(notif.created_at + 'Z').toLocaleString();
        
        return `
            <div class="notif-item ${isUnread}" data-notif-id="${notif.notification_id}">
                <div class="notif-item-icon ${iconClass}">
                    <i data-lucide="${icon}"></i>
                </div>
                <div class="notif-item-content">
                    <div class="notif-item-msg">${notif.message}</div>
                    <div class="notif-item-time">${date}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Bind click events on notification items to mark as read
    container.querySelectorAll('.notif-item').forEach(item => {
        item.addEventListener('click', async () => {
            const notifId = item.getAttribute('data-notif-id');
            try {
                await fetchAPI('/notifications', {
                    method: 'PUT',
                    body: JSON.stringify({ notification_id: notifId })
                });
                loadNotifications(); // Reload to refresh list
            } catch (err) {
                console.error(err);
            }
        });
    });
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Banner alerts visible inside sub-views
function renderPersistentBanners() {
    const container = document.getElementById('notification-banners');
    if (!container) return;
    
    // Filter unread budget warnings & exceed limits
    const activeBanners = state.notifications.filter(n => !n.is_read && n.type !== 'recurring_due').slice(0, 3);
    
    if (activeBanners.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = activeBanners.map(n => {
        const severity = n.type === 'budget_exceeded' ? 'danger' : 'warning';
        const icon = n.type === 'budget_exceeded' ? 'alert-triangle' : 'alert-circle';
        
        return `
            <div class="banner-alert ${severity}" data-banner-notif-id="${n.notification_id}">
                <div class="banner-alert-left">
                    <i data-lucide="${icon}"></i>
                    <span>${n.message}</span>
                </div>
                <button class="banner-alert-close"><i data-lucide="x"></i></button>
            </div>
        `;
    }).join('');
    
    container.querySelectorAll('.banner-alert-close').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const card = e.target.closest('.banner-alert');
            const notifId = card.getAttribute('data-banner-notif-id');
            try {
                await fetchAPI('/notifications', {
                    method: 'PUT',
                    body: JSON.stringify({ notification_id: notifId })
                });
                loadNotifications(); // Refresh both banners and dropdown
            } catch (err) {
                console.error(err);
            }
        });
    });
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// GLOBAL DIALOG SYSTEM
export function openModal(modalId) {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById(modalId);
    
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
}

export function closeAllModals() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('hidden');
    
    document.querySelectorAll('.modal-card').forEach(card => {
        card.classList.add('hidden');
    });
}

// EVENT LISTENERS
function setupGlobalListeners() {
    // 1. Sidebar Nav click routing
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-view');
            navigateTo(target);
        });
    });
    
    // 2. Inline Navigate buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.navigate-to-view');
        if (btn) {
            const target = btn.getAttribute('data-target-view');
            navigateTo(target);
        }
    });

    // 3. Logout action
    document.getElementById('logout-btn').addEventListener('click', async () => {
        try {
            await fetchAPI('/logout', { method: 'POST' });
        } catch (e) {
            // ignore error on logout
        }
        clearToken();
        checkAuthAndRoute();
    });
    
    // 4. Bell icon notifications panel toggle
    const bellBtn = document.getElementById('notif-bell-btn');
    const dropdown = document.getElementById('notif-dropdown');
    
    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
    });
    
    document.addEventListener('click', (e) => {
        if (!dropdown.classList.contains('hidden') && !e.target.closest('.notification-bell-wrapper')) {
            dropdown.classList.add('hidden');
        }
    });
    
    // 5. Clear all notifications
    document.getElementById('clear-notif-btn').addEventListener('click', async () => {
        for (const notif of state.notifications) {
            if (!notif.is_read) {
                try {
                    await fetchAPI('/notifications', {
                        method: 'PUT',
                        body: JSON.stringify({ notification_id: notif.notification_id })
                    });
                } catch (e) {}
            }
        }
        loadNotifications();
    });
    
    // 6. Close Modal buttons
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // 7. Global unauthorized session check listener
    window.addEventListener('auth-required', () => {
        checkAuthAndRoute();
    });
}
