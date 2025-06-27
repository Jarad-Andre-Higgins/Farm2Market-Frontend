// Farmer Notifications System - Agriport
const API_BASE_URL = 'http://localhost:8000/api';

// Global variables
let notifications = [];
let currentFilter = 'all';
let currentPage = 1;
let totalPages = 1;
let isLoading = false;
let notificationPollingInterval = null;

// DOM elements
let elements = {};

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!window.FarmerAuth || !window.FarmerAuth.isAuthenticated()) {
        window.location.href = 'loginfarmer.html';
        return;
    }
    
    // Initialize notification system
    initializeNotificationSystem();
});

async function initializeNotificationSystem() {
    try {
        // Get DOM elements
        initializeElements();
        
        // Setup event listeners
        setupEventListeners();
        
        // Load notifications
        await loadNotifications();
        
        // Start polling for new notifications
        startNotificationPolling();
        
        // Hide loading screen and show notifications
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('notifications-container').style.display = 'block';
        
        console.log('Farmer notification system initialized successfully');
    } catch (error) {
        console.error('Failed to initialize notification system:', error);
        showError('Failed to load notifications. Please refresh the page.');
    }
}

function initializeElements() {
    elements = {
        // Header elements
        unreadCount: document.getElementById('unread-count'),
        totalCount: document.getElementById('total-count'),
        btnMarkAllRead: document.getElementById('btn-mark-all-read'),
        
        // Filter elements
        filterButtons: document.querySelectorAll('.filter-btn'),
        
        // List elements
        notificationsList: document.getElementById('notifications-list'),
        pagination: document.getElementById('pagination'),
        
        // Modal elements
        notificationModal: document.getElementById('notification-modal'),
        btnCloseModal: document.getElementById('btn-close-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalIcon: document.getElementById('modal-icon'),
        modalNotificationTitle: document.getElementById('modal-notification-title'),
        modalNotificationMessage: document.getElementById('modal-notification-message'),
        modalNotificationTime: document.getElementById('modal-notification-time'),
        modalNotificationType: document.getElementById('modal-notification-type'),
        modalActions: document.getElementById('modal-actions')
    };
}

function setupEventListeners() {
    // Mark all read button
    elements.btnMarkAllRead.addEventListener('click', markAllNotificationsRead);
    
    // Filter buttons
    elements.filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            setActiveFilter(filter);
            loadNotifications(1, filter);
        });
    });
    
    // Modal events
    elements.btnCloseModal.addEventListener('click', closeNotificationModal);
    elements.notificationModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeNotificationModal();
        }
    });
    
    // Keyboard events
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeNotificationModal();
        }
    });
}

async function loadNotifications(page = 1, filter = null) {
    if (isLoading) return;
    
    try {
        isLoading = true;
        showNotificationsLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams({
            page: page,
            per_page: 20
        });
        
        if (filter && filter !== 'all') {
            if (filter === 'unread') {
                params.append('unread_only', 'true');
            } else {
                params.append('type', filter);
            }
        }
        
        const response = await window.FarmerAuth.apiRequest(`/notifications/?${params}`, {
            method: 'GET'
        });
        
        if (response && response.ok) {
            const data = await response.json();
            if (data.success) {
                notifications = data.notifications || [];
                currentPage = page;
                currentFilter = filter || 'all';
                
                // Update UI
                updateNotificationStats(data.unread_count, data.pagination?.total_notifications || notifications.length);
                renderNotifications(notifications);
                renderPagination(data.pagination);
            } else {
                throw new Error(data.error || 'Failed to load notifications');
            }
        } else {
            throw new Error('Failed to fetch notifications');
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
        showError('Failed to load notifications: ' + error.message);
        renderEmptyNotifications();
    } finally {
        isLoading = false;
        showNotificationsLoading(false);
    }
}

function renderNotifications(notificationsList) {
    if (!notificationsList || notificationsList.length === 0) {
        renderEmptyNotifications();
        return;
    }
    
    const html = notificationsList.map(notification => {
        const isUnread = !notification.is_read;
        const icon = getNotificationIcon(notification.notification_type);
        const timeAgo = formatTimeAgo(notification.created_at);
        
        return `
            <div class="notification-item ${isUnread ? 'unread' : ''}" 
                 data-notification-id="${notification.id}"
                 onclick="openNotificationModal(${notification.id})">
                <div class="notification-icon ${notification.notification_type}">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${escapeHtml(notification.title)}</div>
                    <div class="notification-message">${escapeHtml(notification.message)}</div>
                    <div class="notification-meta">
                        <span class="notification-time">${timeAgo}</span>
                        <span class="notification-type-badge">${getNotificationTypeLabel(notification.notification_type)}</span>
                    </div>
                </div>
                <div class="notification-actions">
                    ${getNotificationActionButtons(notification)}
                </div>
            </div>
        `;
    }).join('');
    
    elements.notificationsList.innerHTML = html;
}

function renderEmptyNotifications() {
    const filterText = currentFilter === 'all' ? 'notifications' : 
                      currentFilter === 'unread' ? 'unread notifications' : 
                      `${getNotificationTypeLabel(currentFilter)} notifications`;
    
    elements.notificationsList.innerHTML = `
        <div class="notifications-empty">
            <i class="fas fa-bell-slash"></i>
            <h3>No ${filterText}</h3>
            <p>You don't have any ${filterText} at the moment. New notifications will appear here when they arrive.</p>
            <button class="btn-refresh" onclick="loadNotifications()">
                <i class="fas fa-sync-alt"></i>
                Refresh
            </button>
        </div>
    `;
}

function updateNotificationStats(unreadCount, totalCount) {
    elements.unreadCount.textContent = unreadCount || 0;
    elements.totalCount.textContent = `${totalCount || 0} total`;
    
    // Update mark all read button state
    elements.btnMarkAllRead.disabled = unreadCount === 0;
}

function setActiveFilter(filter) {
    // Update active filter button
    elements.filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    currentFilter = filter;
}

async function markAllNotificationsRead() {
    try {
        elements.btnMarkAllRead.disabled = true;
        elements.btnMarkAllRead.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Marking...';
        
        const response = await window.FarmerAuth.apiRequest('/notifications/mark-all-read/', {
            method: 'POST'
        });
        
        if (response && response.ok) {
            const data = await response.json();
            if (data.success) {
                // Reload notifications to reflect changes
                await loadNotifications(currentPage, currentFilter);
                showSuccess('All notifications marked as read');
            } else {
                throw new Error(data.error || 'Failed to mark notifications as read');
            }
        } else {
            throw new Error('Failed to mark notifications as read');
        }
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        showError('Failed to mark notifications as read: ' + error.message);
    } finally {
        elements.btnMarkAllRead.innerHTML = '<i class="fas fa-check-double"></i> Mark All Read';
    }
}

async function markNotificationRead(notificationId) {
    try {
        const response = await window.FarmerAuth.apiRequest(`/notifications/${notificationId}/read/`, {
            method: 'POST'
        });
        
        if (response && response.ok) {
            // Update local notification state
            const notification = notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.is_read = true;
            }
            
            // Update UI
            const notificationElement = document.querySelector(`[data-notification-id="${notificationId}"]`);
            if (notificationElement) {
                notificationElement.classList.remove('unread');
            }
            
            // Update stats
            const currentUnread = parseInt(elements.unreadCount.textContent) - 1;
            updateNotificationStats(Math.max(0, currentUnread), parseInt(elements.totalCount.textContent.split(' ')[0]));
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

function openNotificationModal(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;
    
    // Mark as read if unread
    if (!notification.is_read) {
        markNotificationRead(notificationId);
    }
    
    // Populate modal
    elements.modalNotificationTitle.textContent = notification.title;
    elements.modalNotificationMessage.textContent = notification.message;
    elements.modalNotificationTime.textContent = formatTimeAgo(notification.created_at);
    elements.modalNotificationType.textContent = getNotificationTypeLabel(notification.notification_type);
    
    // Update icon
    const icon = getNotificationIcon(notification.notification_type);
    elements.modalIcon.innerHTML = `<i class="fas fa-${icon}"></i>`;
    elements.modalIcon.className = `notification-icon-large ${notification.notification_type}`;
    
    // Add action buttons
    elements.modalActions.innerHTML = getNotificationModalActions(notification);
    
    // Show modal
    elements.notificationModal.style.display = 'flex';
}

function closeNotificationModal() {
    elements.notificationModal.style.display = 'none';
}

// Utility functions
function getNotificationIcon(type) {
    const icons = {
        'reservation_pending': 'clock',
        'reservation_approved': 'check-circle',
        'reservation_rejected': 'times-circle',
        'new_message': 'comments',
        'payment_received': 'money-bill-wave',
        'receipt_uploaded': 'receipt',
        'receipt_verified': 'check-double',
        'system_announcement': 'bullhorn',
        'urgent_sale': 'fire',
        'product_available': 'box-open'
    };
    return icons[type] || 'bell';
}

function getNotificationTypeLabel(type) {
    const labels = {
        'reservation_pending': 'Reservation',
        'reservation_approved': 'Reservation',
        'reservation_rejected': 'Reservation',
        'new_message': 'Message',
        'payment_received': 'Payment',
        'receipt_uploaded': 'Receipt',
        'receipt_verified': 'Receipt',
        'system_announcement': 'System',
        'urgent_sale': 'Urgent Sale',
        'product_available': 'Product'
    };
    return labels[type] || 'Notification';
}

function getNotificationActionButtons(notification) {
    const actions = [];
    
    switch (notification.notification_type) {
        case 'reservation_pending':
            actions.push(`<button class="btn-notification-action primary" onclick="viewReservation(${notification.related_id})">View Reservation</button>`);
            break;
        case 'new_message':
            actions.push(`<button class="btn-notification-action primary" onclick="openChat(${notification.related_id})">Reply</button>`);
            break;
        case 'payment_received':
            actions.push(`<button class="btn-notification-action primary" onclick="viewTransaction(${notification.related_id})">View Payment</button>`);
            break;
        case 'receipt_uploaded':
            actions.push(`<button class="btn-notification-action primary" onclick="verifyReceipt(${notification.related_id})">Verify Receipt</button>`);
            break;
    }
    
    return actions.join('');
}

function getNotificationModalActions(notification) {
    const actions = [];
    
    switch (notification.notification_type) {
        case 'reservation_pending':
            actions.push(`
                <button class="btn-modal-action" onclick="viewReservation(${notification.related_id})">
                    <i class="fas fa-eye"></i> View Reservation
                </button>
                <button class="btn-modal-action" onclick="approveReservation(${notification.related_id})">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn-modal-action secondary" onclick="rejectReservation(${notification.related_id})">
                    <i class="fas fa-times"></i> Reject
                </button>
            `);
            break;
        case 'new_message':
            actions.push(`
                <button class="btn-modal-action" onclick="openChat(${notification.related_id})">
                    <i class="fas fa-reply"></i> Reply to Message
                </button>
            `);
            break;
        case 'payment_received':
            actions.push(`
                <button class="btn-modal-action" onclick="viewTransaction(${notification.related_id})">
                    <i class="fas fa-eye"></i> View Payment Details
                </button>
            `);
            break;
        case 'receipt_uploaded':
            actions.push(`
                <button class="btn-modal-action" onclick="verifyReceipt(${notification.related_id})">
                    <i class="fas fa-check-double"></i> Verify Receipt
                </button>
            `);
            break;
        default:
            actions.push(`
                <button class="btn-modal-action secondary" onclick="closeNotificationModal()">
                    <i class="fas fa-times"></i> Close
                </button>
            `);
    }
    
    return actions.join('');
}

function formatTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotificationsLoading(show) {
    if (show) {
        elements.notificationsList.innerHTML = `
            <div class="notifications-empty">
                <i class="fas fa-spinner fa-spin"></i>
                <h3>Loading notifications...</h3>
                <p>Please wait while we fetch your latest notifications.</p>
            </div>
        `;
    }
}

function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    showToast(message, 'error');
}

function showToast(message, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Show with animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Notification polling
function startNotificationPolling() {
    // Poll for new notifications every 30 seconds
    notificationPollingInterval = setInterval(() => {
        if (currentFilter === 'all' && currentPage === 1) {
            loadNotifications(1, 'all');
        }
    }, 30000);
}

function stopNotificationPolling() {
    if (notificationPollingInterval) {
        clearInterval(notificationPollingInterval);
        notificationPollingInterval = null;
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopNotificationPolling();
});

// Pagination
function renderPagination(pagination) {
    if (!pagination || pagination.total_pages <= 1) {
        elements.pagination.style.display = 'none';
        return;
    }

    elements.pagination.style.display = 'flex';
    totalPages = pagination.total_pages;

    let paginationHTML = '';

    // Previous button
    if (pagination.has_previous) {
        paginationHTML += `
            <button class="pagination-btn" onclick="loadNotifications(${pagination.current_page - 1}, '${currentFilter}')">
                <i class="fas fa-chevron-left"></i> Previous
            </button>
        `;
    }

    // Page numbers
    const startPage = Math.max(1, pagination.current_page - 2);
    const endPage = Math.min(pagination.total_pages, pagination.current_page + 2);

    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === pagination.current_page ? 'active' : '';
        paginationHTML += `
            <button class="pagination-btn ${activeClass}" onclick="loadNotifications(${i}, '${currentFilter}')">
                ${i}
            </button>
        `;
    }

    // Next button
    if (pagination.has_next) {
        paginationHTML += `
            <button class="pagination-btn" onclick="loadNotifications(${pagination.current_page + 1}, '${currentFilter}')">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }

    elements.pagination.innerHTML = paginationHTML;
}

// Action functions for notifications
async function viewReservation(reservationId) {
    try {
        // Navigate to reservations page with specific reservation
        sessionStorage.setItem('viewReservationId', reservationId);
        window.location.href = 'reservations.html';
    } catch (error) {
        console.error('Error viewing reservation:', error);
        showError('Failed to open reservation details');
    }
}

async function approveReservation(reservationId) {
    try {
        const response = await window.FarmerAuth.apiRequest(`/farmer/reservations/${reservationId}/approve/`, {
            method: 'POST'
        });

        if (response && response.ok) {
            const data = await response.json();
            if (data.success) {
                showSuccess('Reservation approved successfully');
                closeNotificationModal();
                await loadNotifications(currentPage, currentFilter);
            } else {
                throw new Error(data.error || 'Failed to approve reservation');
            }
        } else {
            throw new Error('Failed to approve reservation');
        }
    } catch (error) {
        console.error('Error approving reservation:', error);
        showError('Failed to approve reservation: ' + error.message);
    }
}

async function rejectReservation(reservationId) {
    try {
        const reason = prompt('Please provide a reason for rejection (optional):');

        const response = await window.FarmerAuth.apiRequest(`/farmer/reservations/${reservationId}/reject/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rejection_reason: reason || 'No reason provided'
            })
        });

        if (response && response.ok) {
            const data = await response.json();
            if (data.success) {
                showSuccess('Reservation rejected');
                closeNotificationModal();
                await loadNotifications(currentPage, currentFilter);
            } else {
                throw new Error(data.error || 'Failed to reject reservation');
            }
        } else {
            throw new Error('Failed to reject reservation');
        }
    } catch (error) {
        console.error('Error rejecting reservation:', error);
        showError('Failed to reject reservation: ' + error.message);
    }
}

async function openChat(conversationId) {
    try {
        // Navigate to chat with specific conversation
        sessionStorage.setItem('openConversationId', conversationId);
        window.location.href = 'farmerchat.html';
    } catch (error) {
        console.error('Error opening chat:', error);
        showError('Failed to open chat');
    }
}

async function viewTransaction(transactionId) {
    try {
        // Navigate to transactions page with specific transaction
        sessionStorage.setItem('viewTransactionId', transactionId);
        window.location.href = 'transactions.html';
    } catch (error) {
        console.error('Error viewing transaction:', error);
        showError('Failed to open transaction details');
    }
}

async function verifyReceipt(transactionId) {
    try {
        const response = await window.FarmerAuth.apiRequest(`/farmer/transactions/${transactionId}/verify-receipt/`, {
            method: 'POST'
        });

        if (response && response.ok) {
            const data = await response.json();
            if (data.success) {
                showSuccess('Receipt verified successfully');
                closeNotificationModal();
                await loadNotifications(currentPage, currentFilter);
            } else {
                throw new Error(data.error || 'Failed to verify receipt');
            }
        } else {
            throw new Error('Failed to verify receipt');
        }
    } catch (error) {
        console.error('Error verifying receipt:', error);
        showError('Failed to verify receipt: ' + error.message);
    }
}

// Add toast styles dynamically
const toastStyles = `
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    }

    .toast.show {
        transform: translateX(0);
    }

    .toast.toast-success {
        border-left: 4px solid #27ae60;
        color: #27ae60;
    }

    .toast.toast-error {
        border-left: 4px solid #e74c3c;
        color: #e74c3c;
    }

    .toast.toast-info {
        border-left: 4px solid #3498db;
        color: #3498db;
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);

// Export functions for global access
window.openNotificationModal = openNotificationModal;
window.closeNotificationModal = closeNotificationModal;
window.markNotificationRead = markNotificationRead;
window.loadNotifications = loadNotifications;
window.viewReservation = viewReservation;
window.approveReservation = approveReservation;
window.rejectReservation = rejectReservation;
window.openChat = openChat;
window.viewTransaction = viewTransaction;
window.verifyReceipt = verifyReceipt;
