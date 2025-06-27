// Comprehensive Notification System for Agriport
// Handles real-time notifications for farmers, buyers, and admin

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.isInitialized = false;
        this.notificationPanel = null;
        this.bellIcon = null;
        this.badge = null;
        this.websocket = null;
        this.userType = Auth.getUserType(); // 'Farmer', 'Buyer', or 'Admin'
        this.userId = Auth.getUserId();
        
        this.init();
    }
    
    init() {
        this.createNotificationElements();
        this.loadNotifications();
        this.initializeWebSocket();
        this.setupEventListeners();
        this.isInitialized = true;
        
        console.log('Notification system initialized for:', this.userType);
    }
    
    createNotificationElements() {
        // Create notification panel if it doesn't exist
        if (!document.getElementById('notificationPanel')) {
            const panel = document.createElement('div');
            panel.id = 'notificationPanel';
            panel.className = 'notification-panel hidden';
            panel.innerHTML = this.getNotificationPanelHTML();
            document.body.appendChild(panel);
        }
        
        this.notificationPanel = document.getElementById('notificationPanel');
        this.bellIcon = document.querySelector('.notification-bell');
        this.badge = document.querySelector('.notification-badge');
        
        // Create notification bell if it doesn't exist
        if (!this.bellIcon) {
            this.createNotificationBell();
        }
    }
    
    createNotificationBell() {
        const header = document.querySelector('.header');
        if (header) {
            const bellContainer = document.createElement('div');
            bellContainer.className = 'notification-bell';
            bellContainer.innerHTML = `
                <i class="fas fa-bell"></i>
                <span class="notification-badge">0</span>
            `;
            header.appendChild(bellContainer);
            
            this.bellIcon = bellContainer;
            this.badge = bellContainer.querySelector('.notification-badge');
        }
    }
    
    getNotificationPanelHTML() {
        return `
            <div class="notification-header">
                <h3><i class="fas fa-bell"></i> Notifications</h3>
                <div class="notification-actions">
                    <button id="markAllRead" class="btn-link">Mark all read</button>
                    <button id="closeNotifications" class="btn-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="notification-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="reservations">Reservations</button>
                <button class="filter-btn" data-filter="sales">Sales</button>
                <button class="filter-btn" data-filter="messages">Messages</button>
                <button class="filter-btn" data-filter="admin">Admin</button>
            </div>
            <div class="notification-list" id="notificationList">
                <div class="loading">Loading notifications...</div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // Bell click to toggle panel
        if (this.bellIcon) {
            this.bellIcon.addEventListener('click', () => {
                this.toggleNotificationPanel();
            });
        }
        
        // Close panel
        document.addEventListener('click', (e) => {
            if (e.target.id === 'closeNotifications') {
                this.hideNotificationPanel();
            }
        });
        
        // Mark all as read
        document.addEventListener('click', (e) => {
            if (e.target.id === 'markAllRead') {
                this.markAllAsRead();
            }
        });
        
        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.filterNotifications(e.target.dataset.filter);
                
                // Update active filter
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!this.notificationPanel.contains(e.target) && !this.bellIcon.contains(e.target)) {
                this.hideNotificationPanel();
            }
        });
    }
    
    initializeWebSocket() {
        // Initialize WebSocket for real-time notifications
        const wsUrl = `ws://localhost:8000/ws/notifications/${this.userType.toLowerCase()}/${this.userId}/`;
        
        try {
            this.websocket = new WebSocket(wsUrl);
            
            this.websocket.onopen = () => {
                console.log('WebSocket connected for notifications');
            };
            
            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleRealTimeNotification(data);
            };
            
            this.websocket.onclose = () => {
                console.log('WebSocket disconnected, attempting to reconnect...');
                setTimeout(() => this.initializeWebSocket(), 5000);
            };
            
            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Failed to initialize WebSocket:', error);
        }
    }
    
    async loadNotifications() {
        try {
            const response = await fetch(`/api/notifications/${this.userType.toLowerCase()}`, {
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.notifications = data.notifications || [];
                this.updateNotificationDisplay();
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }
    
    handleRealTimeNotification(data) {
        // Add new notification to the beginning of the array
        this.notifications.unshift(data);
        
        // Show browser notification if permission granted
        this.showBrowserNotification(data);
        
        // Update display
        this.updateNotificationDisplay();
        
        // Show toast notification
        this.showToastNotification(data);
        
        // Send email if enabled
        if (data.sendEmail) {
            this.sendEmailNotification(data);
        }
    }
    
    showBrowserNotification(notification) {
        if (Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/assets/agriport-icon.png',
                tag: notification.id
            });
        }
    }
    
    showToastNotification(notification) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${notification.type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${notification.title}</div>
                <div class="toast-message">${notification.message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
        
        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }
    
    async sendEmailNotification(notification) {
        try {
            await fetch('/api/notifications/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({
                    to: notification.recipientEmail,
                    subject: notification.title,
                    message: notification.message,
                    type: notification.type
                })
            });
        } catch (error) {
            console.error('Error sending email notification:', error);
        }
    }
    
    updateNotificationDisplay() {
        // Update badge count
        this.unreadCount = this.notifications.filter(n => !n.read).length;
        if (this.badge) {
            this.badge.textContent = this.unreadCount;
            this.badge.style.display = this.unreadCount > 0 ? 'flex' : 'none';
        }
        
        // Update notification list
        this.renderNotificationList();
    }
    
    renderNotificationList() {
        const listContainer = document.getElementById('notificationList');
        if (!listContainer) return;
        
        if (this.notifications.length === 0) {
            listContainer.innerHTML = `
                <div class="no-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <p>No notifications yet</p>
                </div>
            `;
            return;
        }
        
        listContainer.innerHTML = this.notifications.map(notification => 
            this.getNotificationItemHTML(notification)
        ).join('');
        
        // Add click listeners for notification actions
        this.setupNotificationActions();
    }
    
    getNotificationItemHTML(notification) {
        const timeAgo = this.getTimeAgo(notification.createdAt);
        const icon = this.getNotificationIcon(notification.type);
        
        return `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon ${notification.type}">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${timeAgo}</div>
                </div>
                <div class="notification-actions">
                    ${this.getNotificationActionButtons(notification)}
                </div>
            </div>
        `;
    }
    
    getNotificationIcon(type) {
        const icons = {
            'reservation': 'calendar-check',
            'sale': 'money-bill-wave',
            'message': 'comment',
            'admin': 'shield-alt',
            'urgent_sale': 'exclamation-triangle',
            'payment': 'credit-card',
            'system': 'cog'
        };
        return icons[type] || 'bell';
    }
    
    getNotificationActionButtons(notification) {
        let buttons = '';
        
        if (notification.type === 'reservation' && this.userType === 'Farmer') {
            buttons = `
                <button class="btn-approve" data-action="approve" data-id="${notification.reservationId}">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn-reject" data-action="reject" data-id="${notification.reservationId}">
                    <i class="fas fa-times"></i> Reject
                </button>
            `;
        } else if (notification.type === 'message') {
            buttons = `
                <button class="btn-reply" data-action="reply" data-id="${notification.senderId}">
                    <i class="fas fa-reply"></i> Reply
                </button>
            `;
        }
        
        return buttons;
    }
    
    setupNotificationActions() {
        document.querySelectorAll('.notification-item').forEach(item => {
            // Mark as read when clicked
            item.addEventListener('click', () => {
                const notificationId = item.dataset.id;
                this.markAsRead(notificationId);
            });
            
            // Handle action buttons
            item.querySelectorAll('button[data-action]').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = button.dataset.action;
                    const id = button.dataset.id;
                    this.handleNotificationAction(action, id);
                });
            });
        });
    }
    
    async handleNotificationAction(action, id) {
        try {
            if (action === 'approve' || action === 'reject') {
                await this.handleReservationAction(action, id);
            } else if (action === 'reply') {
                this.openMessageReply(id);
            }
        } catch (error) {
            console.error('Error handling notification action:', error);
        }
    }
    
    async handleReservationAction(action, reservationId) {
        const response = await fetch(`/api/reservations/${reservationId}/${action}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        
        if (response.ok) {
            showNotification(`Reservation ${action}d successfully!`, 'success');
            this.loadNotifications(); // Refresh notifications
        } else {
            throw new Error(`Failed to ${action} reservation`);
        }
    }
    
    openMessageReply(senderId) {
        // Open messaging interface (to be implemented)
        console.log('Opening message reply for sender:', senderId);
    }
    
    async markAsRead(notificationId) {
        try {
            const response = await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            
            if (response.ok) {
                // Update local notification
                const notification = this.notifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.read = true;
                    this.updateNotificationDisplay();
                }
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }
    
    async markAllAsRead() {
        try {
            const response = await fetch('/api/notifications/mark-all-read', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            
            if (response.ok) {
                this.notifications.forEach(n => n.read = true);
                this.updateNotificationDisplay();
                showNotification('All notifications marked as read', 'success');
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }
    
    filterNotifications(filter) {
        const items = document.querySelectorAll('.notification-item');
        
        items.forEach(item => {
            const notification = this.notifications.find(n => n.id === item.dataset.id);
            if (!notification) return;
            
            if (filter === 'all' || notification.type === filter) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    toggleNotificationPanel() {
        if (this.notificationPanel.classList.contains('hidden')) {
            this.showNotificationPanel();
        } else {
            this.hideNotificationPanel();
        }
    }
    
    showNotificationPanel() {
        this.notificationPanel.classList.remove('hidden');
        this.loadNotifications(); // Refresh when opened
    }
    
    hideNotificationPanel() {
        this.notificationPanel.classList.add('hidden');
    }
    
    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }
    
    // Static method to create notification for urgent sales
    static async createUrgentSaleNotification(urgentSale) {
        try {
            await fetch('/api/notifications/urgent-sale', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({
                    urgentSaleId: urgentSale.id,
                    productName: urgentSale.productName,
                    farmerId: urgentSale.farmerId,
                    originalPrice: urgentSale.originalPrice,
                    reducedPrice: urgentSale.reducedPrice
                })
            });
        } catch (error) {
            console.error('Error creating urgent sale notification:', error);
        }
    }
    
    // Static method to create reservation notification
    static async createReservationNotification(reservation) {
        try {
            await fetch('/api/notifications/reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({
                    reservationId: reservation.id,
                    productName: reservation.productName,
                    buyerId: reservation.buyerId,
                    farmerId: reservation.farmerId,
                    quantity: reservation.quantity,
                    totalPrice: reservation.totalPrice
                })
            });
        } catch (error) {
            console.error('Error creating reservation notification:', error);
        }
    }
}

// Initialize notification system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Initialize notification system if user is authenticated
    if (Auth.isAuthenticated()) {
        window.notificationSystem = new NotificationSystem();
    }
});

// Export for use in other modules
window.NotificationSystem = NotificationSystem;
