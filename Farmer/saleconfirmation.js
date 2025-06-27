// Sale Confirmation JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let allSales = [];
    let filteredSales = [];
    let currentSaleId = null;
    let confirmationAction = null;
    
    // DOM Elements
    const salesTableBody = document.getElementById('salesTableBody');
    const statusFilter = document.getElementById('statusFilter');
    const startDateFilter = document.getElementById('startDate');
    const endDateFilter = document.getElementById('endDate');
    const searchFilter = document.getElementById('searchFilter');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const paginationContainer = document.getElementById('pagination');
    const noSalesElement = document.getElementById('noSales');
    
    // Modals
    const receiptModal = document.getElementById('receiptModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationTitle = document.getElementById('confirmationTitle');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmActionBtn = document.getElementById('confirmAction');
    const cancelActionBtn = document.getElementById('cancelAction');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationIcon = document.getElementById('notificationIcon');
    
    // Initialize the page
    initializePage();
    
    // Event Listeners
    applyFiltersBtn.addEventListener('click', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);
    
    // Close modals when clicking the X button
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            receiptModal.style.display = 'none';
            confirmationModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === receiptModal) {
            receiptModal.style.display = 'none';
        }
        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
    
    // Confirmation modal buttons
    confirmActionBtn.addEventListener('click', function() {
        if (confirmationAction && currentSaleId) {
            confirmationAction(currentSaleId);
        }
        confirmationModal.style.display = 'none';
    });
    
    cancelActionBtn.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });
    
    // Initialize the page
    function initializePage() {
        // Set default date filters to last 30 days
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        startDateFilter.valueAsDate = thirtyDaysAgo;
        endDateFilter.valueAsDate = today;
        
        // Load sales data
        loadSalesData();
    }
    
    // Load sales data from API
    function loadSalesData() {
        // Show loading indicator
        salesTableBody.innerHTML = '<tr class="loading-row"><td colspan="8">Loading sales data...</td></tr>';
        
        // Use the API function to get sales data
        // This assumes there's a getSales function in the API integration file
        makeApiRequest('/farmer/sales', 'GET')
            .then(response => {
                if (response && Array.isArray(response)) {
                    allSales = response;
                    applyFilters(); // This will also render the table
                } else {
                    throw new Error('Invalid response format');
                }
            })
            .catch(error => {
                console.error('Error loading sales data:', error);
                salesTableBody.innerHTML = '<tr class="error-row"><td colspan="8">Failed to load sales data. Please try again.</td></tr>';
                showNotification('Failed to load sales data', 'error');
                
                // For development/testing, load sample data
                loadSampleData();
            });
    }
    
    // Load sample data for development/testing
    function loadSampleData() {
        allSales = [
            {
                id: '12345',
                product: 'Tomatoes',
                quantity: '10 kg',
                price: 12000,
                date: '2024-02-27',
                status: 'Pending',
                receiptUrl: 'path/to/receipt1.jpg',
                buyerId: 'buyer123',
                buyerName: 'John Doe'
            },
            {
                id: '67890',
                product: 'Pepper',
                quantity: '5 kg',
                price: 6000,
                date: '2024-02-28',
                status: 'Pending',
                receiptUrl: 'path/to/receipt2.jpg',
                buyerId: 'buyer456',
                buyerName: 'Jane Smith'
            },
            {
                id: '24680',
                product: 'Cassava',
                quantity: '20 kg',
                price: 15000,
                date: '2024-02-25',
                status: 'Confirmed',
                receiptUrl: 'path/to/receipt3.jpg',
                buyerId: 'buyer789',
                buyerName: 'Robert Johnson'
            },
            {
                id: '13579',
                product: 'Plantains',
                quantity: '15 kg',
                price: 9000,
                date: '2024-02-26',
                status: 'Rejected',
                receiptUrl: 'path/to/receipt4.jpg',
                buyerId: 'buyer101',
                buyerName: 'Mary Williams'
            }
        ];
        
        applyFilters(); // This will also render the table
    }
    
    // Apply filters to the sales data
    function applyFilters() {
        const status = statusFilter.value;
        const startDate = startDateFilter.value ? new Date(startDateFilter.value) : null;
        const endDate = endDateFilter.value ? new Date(endDateFilter.value) : null;
        const searchTerm = searchFilter.value.toLowerCase();
        
        // Filter the sales based on the selected criteria
        filteredSales = allSales.filter(sale => {
            // Status filter
            if (status !== 'all' && sale.status !== status) {
                return false;
            }
            
            // Date filter
            if (startDate && endDate) {
                const saleDate = new Date(sale.date);
                if (saleDate < startDate || saleDate > endDate) {
                    return false;
                }
            }
            
            // Search filter
            if (searchTerm) {
                const matchesProduct = sale.product.toLowerCase().includes(searchTerm);
                const matchesId = sale.id.toLowerCase().includes(searchTerm);
                if (!matchesProduct && !matchesId) {
                    return false;
                }
            }
            
            return true;
        });
        
        // Reset to first page when filters change
        currentPage = 1;
        
        // Render the table with filtered data
        renderTable();
        renderPagination();
    }
    
    // Reset all filters
    function resetFilters() {
        statusFilter.value = 'all';
        
        // Reset date filters to last 30 days
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        startDateFilter.valueAsDate = thirtyDaysAgo;
        endDateFilter.valueAsDate = today;
        
        searchFilter.value = '';
        
        applyFilters();
    }
    
    // Render the sales table
    function renderTable() {
        if (filteredSales.length === 0) {
            salesTableBody.innerHTML = '';
            noSalesElement.style.display = 'flex';
            return;
        }
        
        noSalesElement.style.display = 'none';
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredSales.length);
        const currentPageSales = filteredSales.slice(startIndex, endIndex);
        
        // Clear the table
        salesTableBody.innerHTML = '';
        
        // Add sales to the table
        currentPageSales.forEach(sale => {
            const row = document.createElement('tr');
            row.className = `status-${sale.status.toLowerCase()}`;
            
            row.innerHTML = `
                <td>${sale.id}</td>
                <td>${sale.product}</td>
                <td>${sale.quantity}</td>
                <td>${formatCurrency(sale.price)}</td>
                <td>${formatDate(sale.date)}</td>
                <td><span class="status-badge ${sale.status.toLowerCase()}">${sale.status}</span></td>
                <td><button class="view-receipt" data-id="${sale.id}">View Receipt</button></td>
                <td class="action-buttons">
                    ${sale.status === 'Pending' ? `
                        <button class="confirm" data-id="${sale.id}">Confirm</button>
                        <button class="reject" data-id="${sale.id}">Reject</button>
                    ` : ''}
                </td>
            `;
            
            salesTableBody.appendChild(row);
        });
        
        // Add event listeners to the buttons
        addButtonEventListeners();
    }
    
    // Add event listeners to the table buttons
    function addButtonEventListeners() {
        // View receipt buttons
        document.querySelectorAll('.view-receipt').forEach(button => {
            button.addEventListener('click', function() {
                const saleId = this.getAttribute('data-id');
                viewReceipt(saleId);
            });
        });
        
        // Confirm buttons
        document.querySelectorAll('.confirm').forEach(button => {
            button.addEventListener('click', function() {
                const saleId = this.getAttribute('data-id');
                showConfirmationModal(saleId, 'confirm');
            });
        });
        
        // Reject buttons
        document.querySelectorAll('.reject').forEach(button => {
            button.addEventListener('click', function() {
                const saleId = this.getAttribute('data-id');
                showConfirmationModal(saleId, 'reject');
            });
        });
    }
    
    // Render pagination controls
    function renderPagination() {
        const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `<button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                            ${currentPage === 1 ? 'disabled' : 'data-page="prev"'}>
                            &laquo; Previous
                          </button>`;
        
        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // First page
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                              data-page="${i}">${i}</button>`;
        }
        
        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
        }
        
        // Next button
        paginationHTML += `<button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                          ${currentPage === totalPages ? 'disabled' : 'data-page="next"'}>
                          Next &raquo;
                        </button>`;
        
        paginationContainer.innerHTML = paginationHTML;
        
        // Add event listeners to pagination buttons
        document.querySelectorAll('.pagination-btn:not(.disabled)').forEach(button => {
            button.addEventListener('click', function() {
                const page = this.getAttribute('data-page');
                
                if (page === 'prev') {
                    currentPage--;
                } else if (page === 'next') {
                    currentPage++;
                } else {
                    currentPage = parseInt(page);
                }
                
                renderTable();
                renderPagination();
                
                // Scroll to top of table
                document.getElementById('salesTable').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
    
    // View receipt modal
    function viewReceipt(saleId) {
        const sale = allSales.find(s => s.id === saleId);
        
        if (!sale) {
            showNotification('Sale not found', 'error');
            return;
        }
        
        // Populate receipt modal
        document.getElementById('receiptOrderId').textContent = sale.id;
        document.getElementById('receiptAmount').textContent = formatCurrency(sale.price);
        document.getElementById('receiptDate').textContent = formatDate(sale.date);
        document.getElementById('receiptTransactionId').textContent = 'MOMO' + Math.floor(Math.random() * 1000000); // Sample transaction ID
        
        // Set receipt image
        const receiptImage = document.getElementById('receiptImage');
        receiptImage.src = sale.receiptUrl || 'placeholder-receipt.jpg';
        receiptImage.onerror = function() {
            this.src = 'placeholder-receipt.jpg';
        };
        
        // Show the modal
        receiptModal.style.display = 'block';
    }
    
    // Show confirmation modal
    function showConfirmationModal(saleId, action) {
        currentSaleId = saleId;
        const sale = allSales.find(s => s.id === saleId);
        
        if (!sale) {
            showNotification('Sale not found', 'error');
            return;
        }
        
        if (action === 'confirm') {
            confirmationTitle.textContent = 'Confirm Sale';
            confirmationMessage.textContent = `Are you sure you want to confirm the sale of ${sale.quantity} of ${sale.product}? This will update your inventory and mark the sale as completed.`;
            confirmActionBtn.textContent = 'Confirm Sale';
            confirmActionBtn.className = 'confirm-btn';
            confirmationAction = confirmSale;
        } else if (action === 'reject') {
            confirmationTitle.textContent = 'Reject Sale';
            confirmationMessage.textContent = `Are you sure you want to reject the sale of ${sale.quantity} of ${sale.product}? The buyer will be notified.`;
            confirmActionBtn.textContent = 'Reject Sale';
            confirmActionBtn.className = 'reject-btn';
            confirmationAction = rejectSale;
        }
        
        confirmationModal.style.display = 'block';
    }
    
    // Confirm sale
    function confirmSale(saleId) {
        // Use the API to confirm the sale
        makeApiRequest(`/farmer/sales/${saleId}/confirm`, 'POST')
            .then(response => {
                // Update the sale in the local data
                const saleIndex = allSales.findIndex(s => s.id === saleId);
                if (saleIndex !== -1) {
                    allSales[saleIndex].status = 'Confirmed';
                    
                    // Update the UI
                    applyFilters();
                    showNotification('Sale confirmed successfully', 'success');
                }
            })
            .catch(error => {
                console.error('Error confirming sale:', error);
                showNotification('Failed to confirm sale', 'error');
                
                // For development/testing, update the UI anyway
                const saleIndex = allSales.findIndex(s => s.id === saleId);
                if (saleIndex !== -1) {
                    allSales[saleIndex].status = 'Confirmed';
                    applyFilters();
                    showNotification('Sale confirmed successfully (Demo Mode)', 'success');
                }
            });
    }
    
    // Reject sale
    function rejectSale(saleId) {
        // Use the API to reject the sale
        makeApiRequest(`/farmer/sales/${saleId}/reject`, 'POST')
            .then(response => {
                // Update the sale in the local data
                const saleIndex = allSales.findIndex(s => s.id === saleId);
                if (saleIndex !== -1) {
                    allSales[saleIndex].status = 'Rejected';
                    
                    // Update the UI
                    applyFilters();
                    showNotification('Sale rejected', 'info');
                }
            })
            .catch(error => {
                console.error('Error rejecting sale:', error);
                showNotification('Failed to reject sale', 'error');
                
                // For development/testing, update the UI anyway
                const saleIndex = allSales.findIndex(s => s.id === saleId);
                if (saleIndex !== -1) {
                    allSales[saleIndex].status = 'Rejected';
                    applyFilters();
                    showNotification('Sale rejected (Demo Mode)', 'info');
                }
            });
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        notificationMessage.textContent = message;
        
        // Set icon and class based on type
        notification.className = 'notification';
        notification.classList.add(type);
        
        if (type === 'success') {
            notificationIcon.className = 'fas fa-check-circle';
        } else if (type === 'error') {
            notificationIcon.className = 'fas fa-times-circle';
        } else if (type === 'info') {
            notificationIcon.className = 'fas fa-info-circle';
        }
        
        // Show the notification
        notification.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
    
    // Format currency
    function formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
});