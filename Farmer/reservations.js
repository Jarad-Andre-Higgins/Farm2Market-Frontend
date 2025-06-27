// Reservation Management System

// Sample data for testing
function getSampleReservations() {
    return [
        {
            id: 1,
            productName: "Fresh Organic Apples",
            quantity: 5,
            unit: "kg",
            price: 500,
            status: "Pending",
            createdAt: "2023-09-15T10:30:00",
            pickupDate: "2023-09-18T14:00:00",
            buyerName: "John Buyer",
            buyerPhone: "+237 6XX XXX XXX",
            buyerLocation: "Douala",
            notes: "Please make sure the apples are ripe."
        },
        {
            id: 2,
            productName: "Cassava",
            quantity: 2,
            unit: "sack",
            price: 3000,
            status: "Approved",
            createdAt: "2023-09-10T08:15:00",
            pickupDate: "2023-09-16T09:00:00",
            buyerName: "Marie Tamba",
            buyerPhone: "+237 6XX XXX XXX",
            buyerLocation: "Yaoundé",
            notes: ""
        },
        {
            id: 3,
            productName: "Fresh Tomatoes",
            quantity: 3,
            unit: "basket",
            price: 1500,
            status: "Completed",
            createdAt: "2023-09-05T14:45:00",
            pickupDate: "2023-09-08T16:30:00",
            buyerName: "Pierre Ndongo",
            buyerPhone: "+237 6XX XXX XXX",
            buyerLocation: "Bafoussam",
            notes: "Need them for a restaurant order"
        },
        {
            id: 4,
            productName: "Plantains",
            quantity: 4,
            unit: "bunch",
            price: 1200,
            status: "Rejected",
            createdAt: "2023-09-12T11:20:00",
            pickupDate: "2023-09-14T10:00:00",
            buyerName: "Sophie Mbarga",
            buyerPhone: "+237 6XX XXX XXX",
            buyerLocation: "Limbe",
            notes: "Prefer green plantains"
        },
        {
            id: 5,
            productName: "Fresh Organic Apples",
            quantity: 10,
            unit: "kg",
            price: 500,
            status: "Pending",
            createdAt: "2023-09-16T09:10:00",
            pickupDate: "2023-09-20T15:30:00",
            buyerName: "Robert Fono",
            buyerPhone: "+237 6XX XXX XXX",
            buyerLocation: "Kribi",
            notes: ""
        }
    ];
}

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the reservations page
    if (document.getElementById('reservationCalendar') || 
        document.getElementById('reservationsList')) {
        
        // Initialize the calendar
        initializeCalendar();
        
        // Load reservations
        loadReservations();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize real-time notifications
        initializeNotifications();
    }
});

// Calendar functionality
function initializeCalendar() {
    const calendarContainer = document.getElementById('reservationCalendar');
    if (!calendarContainer) return;
    
    const currentDate = new Date();
    renderCalendar(currentDate);
    
    // Set up month navigation
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            const currentMonth = document.getElementById('currentMonth').dataset.month;
            const date = new Date(currentMonth);
            date.setMonth(date.getMonth() - 1);
            renderCalendar(date);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            const currentMonth = document.getElementById('currentMonth').dataset.month;
            const date = new Date(currentMonth);
            date.setMonth(date.getMonth() + 1);
            renderCalendar(date);
        });
    }
}

// Render calendar for a specific month
function renderCalendar(date) {
    const calendarContainer = document.getElementById('reservationCalendar');
    if (!calendarContainer) return;
    
    // Clear existing calendar
    calendarContainer.innerHTML = '';
    
    // Set current month display
    const monthYearDisplay = document.getElementById('currentMonth');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    if (monthYearDisplay) {
        monthYearDisplay.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        monthYearDisplay.dataset.month = date.toISOString().split('T')[0].substring(0, 7);
    }
    
    // Create weekday header
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-row header';
    
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    weekdays.forEach(day => {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-cell weekday';
        dayCell.textContent = day;
        headerRow.appendChild(dayCell);
    });
    
    calendarContainer.appendChild(headerRow);
    
    // Get first day of month and total days
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // Create calendar grid
    let currentRow = document.createElement('div');
    currentRow.className = 'calendar-row';
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-cell empty';
        currentRow.appendChild(emptyCell);
    }
    
    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        // If we've reached the end of a week, start a new row
        if ((day + firstDay.getDay() - 1) % 7 === 0 && day !== 1) {
            calendarContainer.appendChild(currentRow);
            currentRow = document.createElement('div');
            currentRow.className = 'calendar-row';
        }
        
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-cell day';
        dayCell.textContent = day;
        
        // Check if this day has reservations
        const currentDateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        dayCell.dataset.date = currentDateStr;
        
        // We'll add reservation indicators later when we load the data
        
        currentRow.appendChild(dayCell);
    }
    
    // Add empty cells for days after the end of the month
    const lastDayOfWeek = lastDay.getDay();
    if (lastDayOfWeek < 6) {
        for (let i = lastDayOfWeek + 1; i <= 6; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-cell empty';
            currentRow.appendChild(emptyCell);
        }
    }
    
    // Add the last row
    calendarContainer.appendChild(currentRow);
    
    // Now load reservation data for this month
    loadMonthReservations(date);
}

// Load reservations for the current month and update calendar
function loadMonthReservations(date) {
    // In a real implementation, this would fetch from your API
    // For now, we'll use sample data
    
    // Format: YYYY-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Use sample data directly since we're not making real API calls
    const reservations = getSampleReservations();
    
    // Group reservations by date
    const reservationsByDate = {};
    
    reservations.forEach(reservation => {
        const dateStr = reservation.pickupDate.split('T')[0]; // Get YYYY-MM-DD part
        if (!reservationsByDate[dateStr]) {
            reservationsByDate[dateStr] = [];
        }
        reservationsByDate[dateStr].push(reservation);
    });
    
    // Update calendar cells with reservation counts
    Object.keys(reservationsByDate).forEach(dateStr => {
        const cell = document.querySelector(`.calendar-cell[data-date="${dateStr}"]`);
        if (cell) {
            const reservations = reservationsByDate[dateStr];
            const indicator = document.createElement('div');
            indicator.className = 'reservation-indicator';
            
            // Color based on status
            const pendingCount = reservations.filter(r => r.status === 'Pending').length;
            const approvedCount = reservations.filter(r => r.status === 'Approved').length;
            
            if (pendingCount > 0) {
                indicator.classList.add('pending');
            } else if (approvedCount > 0) {
                indicator.classList.add('approved');
            }
            
            indicator.textContent = reservations.length;
            cell.appendChild(indicator);
            
            // Add click event to show reservations for this day
            cell.addEventListener('click', () => {
                showDayReservations(dateStr, reservations);
            });
        }
    });
}

// Show reservations for a specific day
function showDayReservations(dateStr, reservations) {
    // Filter the reservation list to show only this day's reservations
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.value = dateStr;
        filterReservations();
    }
    
    // Highlight the selected day
    document.querySelectorAll('.calendar-cell.selected').forEach(cell => {
        cell.classList.remove('selected');
    });
    
    const selectedCell = document.querySelector(`.calendar-cell[data-date="${dateStr}"]`);
    if (selectedCell) {
        selectedCell.classList.add('selected');
    }
}

// Load all reservations
function loadReservations() {
    const reservationsList = document.getElementById('reservationsList');
    if (!reservationsList) return;
    
    // Clear existing reservations
    reservationsList.innerHTML = '';
    
    // Use the API function instead of sample data
    getPendingReservations()
        .then(reservations => {
            // Update counters
            const pendingCount = document.getElementById('pendingCount');
            const approvedCount = document.getElementById('approvedCount');
            const completedCount = document.getElementById('completedCount');
            
            if (pendingCount) {
                pendingCount.textContent = reservations.filter(r => r.status === 'Pending').length;
            }
            
            if (approvedCount) {
                approvedCount.textContent = reservations.filter(r => r.status === 'Approved').length;
            }
            
            if (completedCount) {
                completedCount.textContent = reservations.filter(r => r.status === 'Completed').length;
            }
            
            // Display reservations
            const noReservations = document.getElementById('noReservations');
            
            if (reservations.length === 0) {
                if (noReservations) {
                    noReservations.style.display = 'flex';
                }
            } else {
                if (noReservations) {
                    noReservations.style.display = 'none';
                }
                
                reservations.forEach(reservation => {
                    const reservationItem = createReservationItem(reservation);
                    reservationsList.appendChild(reservationItem);
                });
            }
        })
        .catch(error => {
            console.error('Error loading reservations:', error);
            showNotification('Failed to load reservations. Please try again.', 'error');
        });
}

// Create a reservation list item
function createReservationItem(reservation) {
    const item = document.createElement('div');
    item.className = `reservation-item ${reservation.status.toLowerCase()}`;
    item.dataset.id = reservation.id;
    
    // Format date for display
    const reservationDate = new Date(reservation.createdAt);
    const formattedDate = reservationDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Format pickup date
    const pickupDate = new Date(reservation.pickupDate);
    const formattedPickupDate = pickupDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    item.innerHTML = `
        <div class="reservation-details">
            <div class="buyer-info">
                <span class="buyer-name">${reservation.buyerName}</span>
                <span class="reservation-date">Reserved: ${formattedDate}</span>
            </div>
            <div class="product-info">
                <span class="product-name">${reservation.productName}</span>
                <span class="quantity">${reservation.quantity} ${reservation.unit}</span>
                <span class="price">${formatCurrency(reservation.price)}</span>
            </div>
            <div class="pickup-info">
                <span class="pickup-date">Pickup: ${formattedPickupDate}</span>
                <span class="status-badge ${reservation.status.toLowerCase()}">${reservation.status}</span>
            </div>
        </div>
        <div class="reservation-actions">
            <button class="view-details-btn" data-id="${reservation.id}">View Details</button>
        </div>
    `;
    
    // Add click event to view details
    item.querySelector('.view-details-btn').addEventListener('click', () => {
        showReservationDetails(reservation);
    });
    
    return item;
}

// Show reservation details in modal
function showReservationDetails(reservation) {
    const modal = document.getElementById('reservationDetailModal');
    const detailsContainer = document.getElementById('reservationDetails');
    
    if (!modal || !detailsContainer) return;
    
    // Format dates
    const reservationDate = new Date(reservation.createdAt);
    const formattedDate = reservationDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const pickupDate = new Date(reservation.pickupDate);
    const formattedPickupDate = pickupDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Calculate total price
    const totalPrice = reservation.price * reservation.quantity;
    
    // Populate details
    detailsContainer.innerHTML = `
        <div class="detail-section">
            <h4>Reservation Information</h4>
            <p><strong>Status:</strong> <span class="status-badge ${reservation.status.toLowerCase()}">${reservation.status}</span></p>
            <p><strong>Reserved On:</strong> ${formattedDate}</p>
            <p><strong>Pickup Date:</strong> ${formattedPickupDate}</p>
            <p><strong>Reservation ID:</strong> #${reservation.id}</p>
        </div>
        
        <div class="detail-section">
            <h4>Buyer Information</h4>
            <p><strong>Name:</strong> ${reservation.buyerName}</p>
            <p><strong>Phone:</strong> ${reservation.buyerPhone}</p>
            <p><strong>Location:</strong> ${reservation.buyerLocation}</p>
        </div>
        
        <div class="detail-section">
            <h4>Product Details</h4>
            <p><strong>Product:</strong> ${reservation.productName}</p>
            <p><strong>Quantity:</strong> ${reservation.quantity} ${reservation.unit}</p>
            <p><strong>Unit Price:</strong> ${formatCurrency(reservation.price)}</p>
            <p><strong>Total Price:</strong> ${formatCurrency(totalPrice)}</p>
        </div>
        
        <div class="detail-section">
            <h4>Additional Information</h4>
            <p><strong>Notes:</strong> ${reservation.notes || 'No additional notes'}</p>
            ${reservation.paymentReceipt ? `
                <div class="receipt-image">
                    <p><strong>Payment Receipt:</strong></p>
                    <img src="${reservation.paymentReceipt}" alt="Payment Receipt">
                </div>
            ` : ''}
        </div>
    `;
    
    // Show/hide action buttons based on status
    const pendingActions = document.getElementById('pendingActions');
    const approvedActions = document.getElementById('approvedActions');
    
    if (pendingActions) {
        pendingActions.style.display = reservation.status === 'Pending' ? 'flex' : 'none';
    }
    
    if (approvedActions) {
        approvedActions.style.display = reservation.status === 'Approved' ? 'flex' : 'none';
    }
    
    // Set up action buttons
    const approveBtn = document.querySelector('.approve-reservation');
    const rejectBtn = document.querySelector('.reject-reservation');
    const completeBtn = document.querySelector('.mark-completed');
    
    if (approveBtn) {
        approveBtn.dataset.id = reservation.id;
        approveBtn.onclick = () => approveReservation(reservation.id);
    }
    
    if (rejectBtn) {
        rejectBtn.dataset.id = reservation.id;
        rejectBtn.onclick = () => rejectReservation(reservation.id);
    }
    
    if (completeBtn) {
        completeBtn.dataset.id = reservation.id;
        completeBtn.onclick = () => completeReservation(reservation.id);
    }
    
    // Show the modal
    modal.style.display = 'block';
}

// Filter reservations based on selected filters
function filterReservations() {
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (!statusFilter || !dateFilter) return;
    
    const statusValue = statusFilter.value;
    const dateValue = dateFilter.value;
    
    // Get all reservation items
    const items = document.querySelectorAll('.reservation-item');
    let visibleCount = 0;
    
    items.forEach(item => {
        const reservation = getSampleReservations().find(r => r.id.toString() === item.dataset.id);
        if (!reservation) return;
        
        let visible = true;
        
        // Apply status filter
        if (statusValue !== 'all' && reservation.status.toLowerCase() !== statusValue) {
            visible = false;
        }
        
        // Apply date filter
        if (dateValue && reservation.pickupDate.split('T')[0] !== dateValue) {
            visible = false;
        }
        
        // Show/hide the item
        item.style.display = visible ? 'flex' : 'none';
        if (visible) visibleCount++;
    });
    
    // Show/hide empty state
    const noReservations = document.getElementById('noReservations');
    if (noReservations) {
        noReservations.style.display = visibleCount === 0 ? 'flex' : 'none';
    }
}

// Set up event listeners
function setupEventListeners() {
    // Close modal when clicking the X or outside the modal
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Filter controls
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterReservations);
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', filterReservations);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            if (statusFilter) statusFilter.value = 'all';
            if (dateFilter) dateFilter.value = '';
            filterReservations();
            
            // Clear calendar selection
            document.querySelectorAll('.calendar-cell.selected').forEach(cell => {
                cell.classList.remove('selected');
            });
        });
    }
}

// Initialize real-time notifications
function initializeNotifications() {
    // In a real implementation, this would connect to a WebSocket or use polling
    // For demo purposes, we'll simulate a new reservation coming in
    setTimeout(() => {
        // Create notification
        showNotification('New reservation received!', 'info');
        
        // Update reservation count
        const pendingCount = document.getElementById('pendingCount');
        if (pendingCount) {
            pendingCount.textContent = (parseInt(pendingCount.textContent) + 1).toString();
        }
        
        // Add notification badge
        updateNotificationBadge(1);
        
        // Reload reservations
        loadReservations();
    }, 30000); // Simulate after 30 seconds
}

// Format currency for display
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="close-notification">&times;</button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Set up close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Update notification badge
function updateNotificationBadge(count) {
    // Find notification badge in the sidebar or header
    const badge = document.querySelector('.notification-badge');
    if (!badge) {
        // Create badge if it doesn't exist
        const navItem = document.querySelector('.nav-item[data-page="reservations"]');
        if (navItem) {
            const badgeElement = document.createElement('span');
            badgeElement.className = 'notification-badge';
            badgeElement.textContent = count;
            navItem.appendChild(badgeElement);
        }
    } else {
        // Update existing badge
        const currentCount = parseInt(badge.textContent) || 0;
        badge.textContent = currentCount + count;
        
        // Show/hide badge based on count
        if (currentCount + count > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Reservation actions
function approveReservation(id) {
    // Use the API function
    approveReservation(id)
        .then(response => {
            // Close modal
            const modal = document.getElementById('reservationDetailModal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Show success message
            showNotification('Reservation approved successfully!', 'success');
            
            // Update reservation in list
            const item = document.querySelector(`.reservation-item[data-id="${id}"]`);
            if (item) {
                item.classList.remove('pending');
                item.classList.add('approved');
                const statusBadge = item.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.textContent = 'Approved';
                    statusBadge.className = 'status-badge approved';
                }
            }
            
            // Update counters
            const pendingCount = document.getElementById('pendingCount');
            const approvedCount = document.getElementById('approvedCount');
            
            if (pendingCount && approvedCount) {
                pendingCount.textContent = (parseInt(pendingCount.textContent) - 1).toString();
                approvedCount.textContent = (parseInt(approvedCount.textContent) + 1).toString();
            }
            
            // Reload reservations to ensure data is fresh
            loadReservations();
        })
        .catch(error => {
            console.error('Error approving reservation:', error);
            showNotification('Failed to approve reservation. Please try again.', 'error');
        });
}

function rejectReservation(id) {
    // Use the API function
    rejectReservation(id)
        .then(response => {
            // Close modal
            const modal = document.getElementById('reservationDetailModal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Show success message
            showNotification('Reservation rejected', 'info');
            
            // Update reservation in list
            const item = document.querySelector(`.reservation-item[data-id="${id}"]`);
            if (item) {
                item.classList.remove('pending');
                item.classList.add('rejected');
                const statusBadge = item.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.textContent = 'Rejected';
                    statusBadge.className = 'status-badge rejected';
                }
            }
            
            // Update counters
            const pendingCount = document.getElementById('pendingCount');
            if (pendingCount) {
                pendingCount.textContent = (parseInt(pendingCount.textContent) - 1).toString();
            }
            
            // Reload reservations to ensure data is fresh
            loadReservations();
        })
        .catch(error => {
            console.error('Error rejecting reservation:', error);
            showNotification('Failed to reject reservation. Please try again.', 'error');
        });
}

function completeReservation(id) {
    // In a real implementation, this would call your API
    console.log(`Completing reservation ${id}`);
    
    // Simulate API call
    setTimeout(() => {
        // Close modal
        const modal = document.getElementById('reservationDetailModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Show success message
        showNotification('Reservation marked as completed!', 'success');
        
        // Update reservation in list
        const item = document.querySelector(`.reservation-item[data-id="${id}"]`);
        if (item) {
            item.classList.remove('approved');
            item.classList.add('completed');
            const statusBadge = item.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.textContent = 'Completed';
                statusBadge.className = 'status-badge completed';
            }
        }
        
        // Update counters
        const approvedCount = document.getElementById('approvedCount');
        const completedCount = document.getElementById('completedCount');
        
        if (approvedCount && completedCount) {
            approvedCount.textContent = (parseInt(approvedCount.textContent) - 1).toString();
            completedCount.textContent = (parseInt(completedCount.textContent) + 1).toString();
        }
    }, 1000);
}

// Connect to real API endpoints
function connectToRealAPI() {
    // In a real implementation, replace the sample data functions with API calls
    
    // Example of how to fetch reservations from the API
    async function fetchReservations() {
        try {
            const response = await fetch('/api/reservations');
            if (!response.ok) {
                throw new Error('Failed to fetch reservations');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching reservations:', error);
            showNotification('Failed to load reservations. Please try again.', 'error');
            return [];
        }
    }
    
    // Example of how to update a reservation status
    async function updateReservationStatus(id, status) {
        try {
            const response = await fetch(`/api/reservations/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update reservation status');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating reservation:', error);
            showNotification('Failed to update reservation. Please try again.', 'error');
            throw error;
        }
    }
    
    // These functions would replace the sample implementations
    // For now, we'll keep using the sample data for demonstration
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getSampleReservations,
        loadReservations,
        filterReservations,
        approveReservation,
        rejectReservation,
        completeReservation
    };
}



