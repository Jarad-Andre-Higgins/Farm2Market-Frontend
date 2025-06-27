document.addEventListener('DOMContentLoaded', function() {
    loadFarmerProfile();
    console.log('Dashboard loaded successfully');

    // Set document title
    document.title = "Farmer Dashboard - Farm2Market";

    // Initialize header functionality
    setupHeader();

    // Initialize messaging system
    setupMessaging();

    // Update badges periodically
    updateNotificationBadge();
    setInterval(updateNotificationBadge, 30000); // Update every 30 seconds
    
    // Basic sidebar toggle
    const toggleSidebar = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleSidebar && sidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
    
    // Handle navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default for logout
            if (this.id === 'logoutBtn') {
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the href attribute (without the #)
            const page = this.getAttribute('href').substring(1);
            
            // Load content
            loadContent(page);

            // Update page title
            updatePageTitle();

            // On mobile, close the sidebar after clicking
            if (window.innerWidth < 768) {
                sidebar.classList.remove('show');
            }
        });
    });
    
    // Simple content loader
    function loadContent(page) {
        console.log('Loading content for page:', page);
        const contentDiv = document.getElementById('dashboardContent');

        if (!contentDiv) {
            console.error('Dashboard content div not found!');
            return;
        }

        // Show loading indicator
        contentDiv.innerHTML = '<div class="loading">Loading...</div>';

        // Map page names to actual content files
        const pageMapping = {
            'profile': 'farmerprofile',
            'farmerprofile': 'farmerprofile',
            'dashboard': 'dashboard',
            'mylisting': 'mylisting',
            'addproduct': 'addproduct',
            'addurgentsale': 'addurgentsale',
            'editlisting': 'editlisting',
            'reservations': 'reservations',
            'settings': 'settings'
        };

        const actualPage = pageMapping[page] || page;
        console.log('Mapped page name:', actualPage);

        // Check if running on file:// protocol
        if (window.location.protocol === 'file:') {
            console.warn('Running on file:// protocol - using inline content');
            loadInlineContent(actualPage, contentDiv);
            return;
        }

        console.log('Attempting to load:', `${actualPage}-content.html`);

        // Load the content via fetch (for http/https)
        fetch(`${actualPage}-content.html`)
            .then(response => {
                console.log('Fetch response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Content file not found: ${actualPage}-content.html (Status: ${response.status})`);
                }
                return response.text();
            })
            .then(html => {
                console.log('Content loaded successfully, length:', html.length);
                contentDiv.innerHTML = html;
                
                // Initialize specific functionality based on the loaded page
                if (page === 'profile') {
                    // Map profile to farmerprofile for content loading
                    initializeProfileTabs();
                } else if (page === 'farmerprofile') {
                    initializeProfileTabs();
                } else if (page === 'addproduct') {
                    loadFarmerCategories();
                    initializeCategoryRequestModal();
                    initializeImagePreview();
                    initializeProductForm();
                } else if (page === 'addurgentsale') {
                    // Initialize urgent sale functionality
                    initializeUrgentSaleForm();
                } else if (page === 'dashboard') {
                    // Load dashboard data including urgent sales
                    loadDashboardData();
                    // Setup dashboard action buttons
                    setupDashboardActionButtons();
                } else if (page === 'mylisting') {
                    // Load product listings including urgent sales
                    loadProductListings();
                }
            })
            .catch(error => {
                console.error('Error loading content:', error);
                console.error('Failed to load:', `${actualPage}-content.html`);

                // Show message that real content needs to be built
                contentDiv.innerHTML = `
                    <div class="content-placeholder">
                        <div class="placeholder-icon">
                            <i class="fas fa-tools"></i>
                        </div>
                        <h3>Building Real Dynamic System</h3>
                        <p>This page will be built with real database integration.</p>
                        <p><strong>Page:</strong> ${page}</p>
                        <p class="error-details">Static content removed - building real functionality</p>
                        <div class="placeholder-actions">
                            <button onclick="loadContent('dashboard')" class="btn-primary">
                                <i class="fas fa-home"></i> Back to Dashboard
                            </button>
                        </div>
                    </div>
                `;
            });
    }

    // Load inline content for file:// protocol with REAL dynamic templates
    function loadInlineContent(page, contentDiv) {
        console.log('Loading inline content for:', page);

        switch(page) {
            case 'dashboard':
                contentDiv.innerHTML = `
                    <div class="main-content">
                        <div class="dashboard-header">
                            <h1>Dashboard Overview</h1>
                            <p>Welcome back! Here's what's happening with your farm.</p>
                        </div>

                        <!-- Quick Stats -->
                        <div class="quick-stats">
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <i class="fas fa-box"></i>
                                </div>
                                <div class="stat-details">
                                    <div class="number">0</div>
                                    <div class="label">Active Listings</div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <i class="fas fa-calendar-check"></i>
                                </div>
                                <div class="stat-details">
                                    <div class="number">0</div>
                                    <div class="label">Pending Reservations</div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <i class="fas fa-money-bill-wave"></i>
                                </div>
                                <div class="stat-details">
                                    <div class="number">0</div>
                                    <div class="label">Monthly Revenue</div>
                                </div>
                            </div>
                        </div>

                        <!-- Recent Reservations with BUYER NAMES -->
                        <div class="dashboard-section">
                            <div class="section-header">
                                <h2><i class="fas fa-calendar-check"></i> Recent Reservations</h2>
                                <button onclick="loadContent('reservations')" class="view-all-btn">
                                    <i class="fas fa-arrow-right"></i> View All
                                </button>
                            </div>
                            <div class="recent-reservations">
                                <div class="loading">
                                    <i class="fas fa-spinner fa-spin"></i> Loading buyer reservations...
                                </div>
                            </div>
                        </div>

                        <!-- Product Listings -->
                        <div class="dashboard-section">
                            <div class="section-header">
                                <h2><i class="fas fa-seedling"></i> Your Products</h2>
                                <button onclick="loadContent('addproduct')" class="add-btn">
                                    <i class="fas fa-plus"></i> Add Product
                                </button>
                            </div>
                            <div class="product-list">
                                <div class="loading">
                                    <i class="fas fa-spinner fa-spin"></i> Loading your products...
                                </div>
                            </div>
                        </div>

                        <!-- Urgent Sales -->
                        <div class="dashboard-section">
                            <div class="section-header">
                                <h2><i class="fas fa-fire"></i> Urgent Sales</h2>
                                <button onclick="loadContent('addurgentsale')" class="add-btn">
                                    <i class="fas fa-plus"></i> Create Urgent Sale
                                </button>
                            </div>
                            <div class="urgent-sales-list">
                                <div class="loading">
                                    <i class="fas fa-spinner fa-spin"></i> Loading urgent sales...
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Load REAL dashboard data after template is loaded
                setTimeout(() => {
                    loadDashboardData();
                }, 100);
                break;

            default:
                contentDiv.innerHTML = `
                    <div class="main-content">
                        <div class="page-header">
                            <h1>${page.charAt(0).toUpperCase() + page.slice(1)}</h1>
                        </div>
                        <div class="content-placeholder">
                            <i class="fas fa-tools"></i>
                            <h3>Content Under Development</h3>
                            <p>This page is being built with real functionality.</p>
                        </div>
                    </div>
                `;
                break;
        }

        // Initialize page-specific functionality
        if (page === 'dashboard') {
            setupDashboardActionButtons();
        }
    }

    // Load default dashboard content
    const hash = window.location.hash.substring(1);
    if (hash) {
        // Find and activate the link
        const link = document.querySelector(`.nav-menu a[href="#${hash}"]`);
        if (link) {
            link.click();
        } else {
            loadContent('dashboard');
        }
    } else {
        loadContent('dashboard');
    }
});

// Function to handle category request modal
function initializeCategoryRequestModal() {
    const requestCategoryBtn = document.getElementById('requestCategoryBtn');
    const categoryRequestModal = document.getElementById('categoryRequestModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    if (requestCategoryBtn && categoryRequestModal) {
        // Open modal
        requestCategoryBtn.addEventListener('click', function() {
            categoryRequestModal.style.display = 'block';
            document.body.classList.add('modal-open');
        });
        
        // Close modal
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                categoryRequestModal.style.display = 'none';
                document.body.classList.remove('modal-open');
            });
        });
        
        // Close when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === categoryRequestModal) {
                categoryRequestModal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
        });
        
        // Handle form submission
        const categoryRequestForm = document.getElementById('categoryRequestForm');
        if (categoryRequestForm) {
            categoryRequestForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const newCategory = document.getElementById('newCategory').value;
                const categoryDescription = document.getElementById('categoryDescription').value;
                const reasonForRequest = document.getElementById('reasonForRequest').value;
                
                // Show saving indicator
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                submitBtn.disabled = true;
                
                // Simulate API call to submit category request
                setTimeout(() => {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Close modal
                    categoryRequestModal.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    
                    // Add to pending requests (in a real app, this would come from the server)
                    const pendingRequests = document.querySelector('.pending-requests');
                    const newRequest = document.createElement('div');
                    newRequest.className = 'pending-category';
                    newRequest.innerHTML = `
                        <span>${newCategory}</span>
                        <span class="status-badge pending">Pending Approval</span>
                    `;
                    pendingRequests.appendChild(newRequest);
                    
                    // Show success message
                    showNotification('Category request submitted successfully! Admin will review your request.', 'success');
                    
                    // Reset form
                    categoryRequestForm.reset();
                }, 1500);
            });
        }
    }
}

// Function to load farmer's approved categories
function loadFarmerCategories() {
    // In a real app, this would be an API call to get the farmer's approved categories
    // For now, we'll simulate it
    
    const categorySelect = document.getElementById('category');
    if (!categorySelect) return;
    
    // Clear existing options except the first one
    while (categorySelect.options.length > 1) {
        categorySelect.remove(1);
    }
    
    // Simulate loading categories from API
    const farmerCategories = [
        { id: 1, name: 'Vegetables' },
        { id: 2, name: 'Fruits' },
        { id: 3, name: 'Tubers' }
    ];
    
    // Add options to select
    farmerCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
    
    // Update approved categories display
    const approvedCategoriesDiv = document.querySelector('.approved-categories');
    if (approvedCategoriesDiv) {
        approvedCategoriesDiv.innerHTML = '';
        farmerCategories.forEach(category => {
            const categoryTag = document.createElement('div');
            categoryTag.className = 'category-tag';
            categoryTag.textContent = category.name;
            approvedCategoriesDiv.appendChild(categoryTag);
        });
    }
}

// Function to handle product image preview
function initializeImagePreview() {
    const productImageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    
    if (productImageInput && imagePreview) {
        productImageInput.addEventListener('change', function() {
            imagePreview.innerHTML = '';
            
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'preview-image';
                    imagePreview.appendChild(img);
                }
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}

// Function to update quantity fields based on selected unit
function updateQuantityFields() {
    const unitSelect = document.getElementById('unit');
    const weightBasedFields = document.getElementById('weightBasedFields');
    const countBasedFields = document.getElementById('countBasedFields');
    
    if (!unitSelect || !weightBasedFields || !countBasedFields) return;
    
    // Hide all unit-specific fields first
    weightBasedFields.style.display = 'none';
    countBasedFields.style.display = 'none';
    
    // Show relevant fields based on unit type
    const selectedUnit = unitSelect.value;
    
    if (selectedUnit === 'sack' || selectedUnit === 'basket') {
        // Volume-based units might need weight specification
        weightBasedFields.style.display = 'block';
    } else if (selectedUnit === 'bunch') {
        // Count-based units might need item count specification
        countBasedFields.style.display = 'block';
    }
}

// Initialize fields when page loads
document.addEventListener('DOMContentLoaded', function() {
    const unitSelect = document.getElementById('unit');
    if (unitSelect) {
        updateQuantityFields();
        
        // Add change event listener
        unitSelect.addEventListener('change', updateQuantityFields);
    }
    
    // Add product form submission handler
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = addProductForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            submitBtn.disabled = true;
            
            // Collect form data including structured quantity information
            const formData = new FormData(addProductForm);
            const productData = {
                name: formData.get('productName'),
                category: formData.get('category'),
                price: formData.get('price'),
                unit: formData.get('unit'),
                quantity: formData.get('quantity'),
                description: formData.get('description'),
                location: formData.get('location'),
                harvestDate: formData.get('harvestDate') || null
            };
            
            // Add unit-specific data if present
            if (formData.get('weightPerUnit')) {
                productData.weightPerUnit = formData.get('weightPerUnit');
            }
            
            if (formData.get('itemsPerUnit')) {
                productData.itemsPerUnit = formData.get('itemsPerUnit');
            }
            
            // Simulate API call to add product
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Product added successfully!', 'success');
                
                // Reset form
                addProductForm.reset();
                const imagePreview = document.getElementById('imagePreview');
                if (imagePreview) {
                    imagePreview.innerHTML = '';
                }
                
                // Redirect to listings page
                window.location.hash = '#mylisting';
            }, 1500);
        });
    }
});

// Helper function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="close-notification">&times;</button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Format currency in FCFA
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Function to initialize urgent sale form
function initializeUrgentSaleForm() {
    // Set minimum date for best before to tomorrow
    const bestBeforeInput = document.getElementById('bestBefore');
    if (bestBeforeInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        bestBeforeInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    // Initialize image preview
    const productImageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    
    if (productImageInput && imagePreview) {
        productImageInput.addEventListener('change', function() {
            imagePreview.innerHTML = '';
            
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'preview-image';
                    imagePreview.appendChild(img);
                }
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Initialize price validation
    const originalPriceInput = document.getElementById('originalPrice');
    const reducedPriceInput = document.getElementById('reducedPrice');
    
    if (originalPriceInput && reducedPriceInput) {
        function validatePrices() {
            const originalPrice = parseFloat(originalPriceInput.value);
            const reducedPrice = parseFloat(reducedPriceInput.value);
            
            if (!isNaN(originalPrice) && !isNaN(reducedPrice)) {
                if (reducedPrice >= originalPrice) {
                    reducedPriceInput.setCustomValidity('Reduced price must be lower than original price');
                } else {
                    reducedPriceInput.setCustomValidity('');
                }
            }
        }
        
        originalPriceInput.addEventListener('input', validatePrices);
        reducedPriceInput.addEventListener('input', validatePrices);
    }
    
    // Handle form submission
    const urgentSaleForm = document.getElementById('urgentSaleForm');
    
    if (urgentSaleForm) {
        urgentSaleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = urgentSaleForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            submitBtn.disabled = true;
            
            // Collect form data
            const formData = new FormData(urgentSaleForm);
            const urgentSaleData = {
                productName: formData.get('productName'),
                originalPrice: formData.get('originalPrice'),
                reducedPrice: formData.get('reducedPrice'),
                quantity: formData.get('quantity'),
                bestBefore: formData.get('bestBefore'),
                reason: formData.get('reason')
            };
            
            // Simulate API call to add urgent sale
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Urgent sale added successfully!', 'success');
                
                // Reset form
                urgentSaleForm.reset();
                const imagePreview = document.getElementById('imagePreview');
                if (imagePreview) {
                    imagePreview.innerHTML = '';
                }
                
                // Redirect to listings page
                window.location.hash = '#mylisting';
            }, 1500);
        });
    }
}

// Function to load REAL dashboard data with actual buyer names and dynamic content
async function loadDashboardData() {
    console.log('Loading REAL dashboard data...');

    // Get dashboard elements
    const quickStats = document.querySelector('.quick-stats');
    const productList = document.querySelector('.product-list');
    const urgentSalesList = document.querySelector('.urgent-sales-list');
    const recentReservations = document.querySelector('.recent-reservations');

    // Show loading indicators
    if (productList) {
        productList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading your products...</div>';
    }

    if (urgentSalesList) {
        urgentSalesList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading urgent sales...</div>';
    }

    if (recentReservations) {
        recentReservations.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading buyer reservations...</div>';
    }

    try {
        // Load REAL dashboard data from API
        await Promise.all([
            loadRealDashboardStats(),
            loadRealProductListings(),
            loadRealRecentReservations(),
            loadRealUrgentSales()
        ]);

        console.log('✅ Real dashboard data loaded successfully');
    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        showDashboardError();
    }
}

// Load REAL dashboard statistics
async function loadRealDashboardStats() {
    try {
        const response = await fetch('/api/farmer/dashboard/', {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                updateDashboardStats(data.dashboard_data);
            }
        } else {
            // Fallback for file:// protocol
            updateDashboardStats({
                active_listings: 0,
                pending_reservations: 0,
                monthly_revenue: 0,
                unread_notifications: 0,
                total_listings: 0
            });
        }
    } catch (error) {
        console.log('Using fallback stats for file:// protocol');
        updateDashboardStats({
            active_listings: 0,
            pending_reservations: 0,
            monthly_revenue: 0,
            unread_notifications: 0,
            total_listings: 0
        });
    }
}

// Load REAL product listings
async function loadRealProductListings() {
    try {
        const response = await fetch('/api/farmer/listings/', {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.listings) {
                displayRealProducts(data.listings);
                return;
            }
        }
    } catch (error) {
        console.log('API not available, showing empty state');
    }

    // Show empty state for products
    const productList = document.querySelector('.product-list');
    if (productList) {
        productList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-seedling"></i>
                <h3>No Products Yet</h3>
                <p>Start by adding your first product to the marketplace</p>
                <button onclick="loadContent('addproduct')" class="btn-primary">
                    <i class="fas fa-plus"></i> Add Product
                </button>
            </div>
        `;
    }
}

// Load REAL recent reservations with BUYER NAMES
async function loadRealRecentReservations() {
    try {
        const response = await fetch('/api/farmer/reservations/', {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.reservations) {
                displayRealReservationsWithBuyerNames(data.reservations);
                return;
            }
        }
    } catch (error) {
        console.log('API not available, showing empty reservations');
    }

    // Show empty state for reservations
    const recentReservations = document.querySelector('.recent-reservations');
    if (recentReservations) {
        recentReservations.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <h3>No Reservations Yet</h3>
                <p>Buyer reservations will appear here when customers book your products</p>
            </div>
        `;
    }
}

// Load REAL urgent sales
async function loadRealUrgentSales() {
    try {
        const response = await fetch('/api/farmer/urgent-sales/', {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.urgent_sales) {
                displayRealUrgentSales(data.urgent_sales);
                return;
            }
        }
    } catch (error) {
        console.log('API not available, showing empty urgent sales');
    }

    // Show empty state for urgent sales
    const urgentSalesList = document.querySelector('.urgent-sales-list');
    if (urgentSalesList) {
        urgentSalesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-fire"></i>
                <h3>No Urgent Sales</h3>
                <p>Create urgent sales to offer time-limited discounts</p>
                <button onclick="loadContent('addurgentsale')" class="btn-primary">
                    <i class="fas fa-plus"></i> Add Urgent Sale
                </button>
            </div>
        `;
    }
}

// Update dashboard statistics with REAL data
function updateDashboardStats(stats) {
    const quickStats = document.querySelector('.quick-stats');
    if (quickStats) {
        const statItems = quickStats.querySelectorAll('.stat-item .number');
        if (statItems.length >= 3) {
            statItems[0].textContent = stats.active_listings || 0;
            statItems[1].textContent = stats.pending_reservations || 0;
            statItems[2].textContent = formatCurrency(stats.monthly_revenue || 0);
        }
    }
}

// Display REAL products with actual data
function displayRealProducts(products) {
    const productList = document.querySelector('.product-list');
    if (!productList) return;

    if (products.length === 0) {
        productList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-seedling"></i>
                <h3>No Products Yet</h3>
                <p>Start by adding your first product to the marketplace</p>
                <button onclick="loadContent('addproduct')" class="btn-primary">
                    <i class="fas fa-plus"></i> Add Product
                </button>
            </div>
        `;
        return;
    }

    const productsHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.listing_id}">
            <div class="product-image">
                ${product.image_url ?
                    `<img src="${product.image_url}" alt="${product.product_name}">` :
                    `<i class="fas fa-box"></i>`
                }
            </div>
            <div class="product-details">
                <div class="product-name">${escapeHtml(product.product_name)}</div>
                <div class="product-price">${formatCurrency(product.price)}</div>
                <div class="product-quantity">${product.quantity}${product.unit || 'kg'} available</div>
                <div class="product-status">
                    <span class="status-badge ${product.status.toLowerCase()}">${product.status}</span>
                </div>
                <div class="product-actions">
                    <button class="edit-btn" onclick="editProduct(${product.listing_id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="viewProductDetails(${product.listing_id})">
                        <i class="fas fa-eye"></i> Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    productList.innerHTML = productsHTML;
}

// Display REAL reservations with BUYER NAMES
function displayRealReservationsWithBuyerNames(reservations) {
    const recentReservations = document.querySelector('.recent-reservations');
    if (!recentReservations) return;

    if (reservations.length === 0) {
        recentReservations.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <h3>No Reservations Yet</h3>
                <p>Buyer reservations will appear here when customers book your products</p>
            </div>
        `;
        return;
    }

    const reservationsHTML = reservations.slice(0, 5).map(reservation => `
        <div class="reservation-card" data-reservation-id="${reservation.reservation_id}">
            <div class="reservation-header">
                <div class="buyer-info">
                    <div class="buyer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="buyer-details">
                        <div class="buyer-name">${escapeHtml(reservation.buyer_name || reservation.buyer_username || 'Unknown Buyer')}</div>
                        <div class="buyer-email">${escapeHtml(reservation.buyer_email || '')}</div>
                    </div>
                </div>
                <div class="reservation-status">
                    <span class="status-badge ${reservation.status.toLowerCase()}">${reservation.status}</span>
                </div>
            </div>
            <div class="reservation-details">
                <div class="product-info">
                    <strong>${escapeHtml(reservation.product_name)}</strong>
                </div>
                <div class="reservation-quantity">
                    Quantity: ${reservation.quantity}${reservation.unit || 'kg'}
                </div>
                <div class="reservation-total">
                    Total: ${formatCurrency(reservation.total_price)}
                </div>
                <div class="reservation-date">
                    ${formatDate(reservation.created_at)}
                </div>
            </div>
            <div class="reservation-actions">
                ${reservation.status === 'Pending' ? `
                    <button class="approve-btn" onclick="approveReservation(${reservation.reservation_id})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="reject-btn" onclick="rejectReservation(${reservation.reservation_id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                ` : `
                    <button onclick="viewReservationDetails(${reservation.reservation_id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                `}
            </div>
        </div>
    `).join('');

    recentReservations.innerHTML = `
        <div class="section-header">
            <h3>Recent Reservations</h3>
            <button onclick="loadContent('reservations')" class="view-all-btn">
                <i class="fas fa-arrow-right"></i> View All
            </button>
        </div>
        <div class="reservations-list">
            ${reservationsHTML}
        </div>
    `;
}

// Display REAL urgent sales
function displayRealUrgentSales(urgentSales) {
    const urgentSalesList = document.querySelector('.urgent-sales-list');
    if (!urgentSalesList) return;

    if (urgentSales.length === 0) {
        urgentSalesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-fire"></i>
                <h3>No Urgent Sales</h3>
                <p>Create urgent sales to offer time-limited discounts</p>
                <button onclick="loadContent('addurgentsale')" class="btn-primary">
                    <i class="fas fa-plus"></i> Add Urgent Sale
                </button>
            </div>
        `;
        return;
    }

    const urgentSalesHTML = urgentSales.map(sale => `
        <div class="urgent-sale-card" data-sale-id="${sale.urgent_sale_id}">
            <div class="urgent-badge">
                <i class="fas fa-fire"></i>
                <span>URGENT</span>
            </div>
            <div class="urgent-details">
                <div class="urgent-name">${escapeHtml(sale.product_name)}</div>
                <div class="urgent-price">
                    <span class="original-price">${formatCurrency(sale.original_price)}</span>
                    <span class="sale-price">${formatCurrency(sale.discounted_price)}</span>
                    <span class="discount">${sale.discount_percentage}% OFF</span>
                </div>
                <div class="urgent-quantity">${sale.quantity}${sale.unit || 'kg'} available</div>
                <div class="urgent-timer">
                    <i class="fas fa-clock"></i>
                    <span>${getTimeRemaining(sale.expires_at)}</span>
                </div>
                <div class="urgent-actions">
                    <button onclick="editUrgentSale(${sale.urgent_sale_id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="viewUrgentSaleDetails(${sale.urgent_sale_id})">
                        <i class="fas fa-eye"></i> Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    urgentSalesList.innerHTML = urgentSalesHTML;
}

// Show dashboard error state
function showDashboardError() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Unable to Load Dashboard</h3>
                <p>There was an error loading your dashboard data. Please try again.</p>
                <button onclick="loadDashboardData()" class="btn-primary">
                    <i class="fas fa-refresh"></i> Retry
                </button>
            </div>
        `;
    }
}

// Function to load product listings including urgent sales
function loadProductListings() {
    const regularListings = document.querySelector('.regular-listings');
    const urgentListings = document.querySelector('.urgent-listings');
    
    if (!regularListings && !urgentListings) return;
    
    // Show loading indicators
    if (regularListings) {
        regularListings.innerHTML = '<div class="loading">Loading regular products...</div>';
    }
    
    if (urgentListings) {
        urgentListings.innerHTML = '<div class="loading">Loading urgent sales...</div>';
    }
    
    // Simulate API call to get product listings
    setTimeout(() => {
        // Update regular listings
        if (regularListings) {
            regularListings.innerHTML = `
                <div class="product-card">
                    <div class="product-image">
                        <i class="fas fa-apple-alt"></i>
                    </div>
                    <div class="product-details">
                        <div class="product-name">Fresh Organic Apples</div>
                        <div class="product-price">${formatCurrency(500)}</div>
                        <div class="product-quantity">15kg available</div>
                        <div>
                            <span class="product-tag">organic</span>
                            <span class="product-tag">fresh today</span>
                        </div>
                        <div class="product-actions">
                            <button class="edit-btn">Edit</button>
                            <button>Details</button>
                            <button class="delete-btn">Delete</button>
                        </div>
                    </div>
                </div>
                
                <div class="product-card">
                    <div class="product-image">
                        <i class="fas fa-carrot"></i>
                    </div>
                    <div class="product-details">
                        <div class="product-name">Carrots</div>
                        <div class="product-price">${formatCurrency(1000)}</div>
                        <div class="product-quantity">8kg available</div>
                        <div>
                            <span class="product-tag">fresh today</span>
                        </div>
                        <div class="product-actions">
                            <button class="edit-btn">Edit</button>
                            <button>Details</button>
                            <button class="delete-btn">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Update urgent listings
        if (urgentListings) {
            urgentListings.innerHTML = `
                <div class="urgent-sale-card">
                    <div class="urgent-badge">URGENT</div>
                    <div class="product-image">
                        <i class="fas fa-lemon"></i>
                    </div>
                    <div class="product-details">
                        <div class="product-name">Ripe Lemons</div>
                        <div class="price-container">
                            <div class="original-price">${formatCurrency(800)}</div>
                            <div class="reduced-price">${formatCurrency(500)}</div>
                        </div>
                        <div class="product-quantity">10kg available</div>
                        <div class="expiry-date">Best before: Tomorrow</div>
                        <div class="product-actions">
                            <button class="edit-btn">Edit</button>
                            <button>Details</button>
                            <button class="delete-btn">Delete</button>
                        </div>
                    </div>
                </div>
                
                <div class="urgent-sale-card">
                    <div class="urgent-badge">URGENT</div>
                    <div class="product-image">
                        <i class="fas fa-pepper-hot"></i>
                    </div>
                    <div class="product-details">
                        <div class="product-name">Fresh Peppers</div>
                        <div class="price-container">
                            <div class="original-price">${formatCurrency(1200)}</div>
                            <div class="reduced-price">${formatCurrency(800)}</div>
                        </div>
                        <div class="product-quantity">5kg available</div>
                        <div class="expiry-date">Best before: 2 days</div>
                        <div class="product-actions">
                            <button class="edit-btn">Edit</button>
                            <button>Details</button>
                            <button class="delete-btn">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }, 1000);
}

// Add this function to load farmer profile data
function loadFarmerProfile() {
    // Get farmer data from localStorage (in a real app, this would come from an API)
    const farmerName = localStorage.getItem('userName') || 'John Farmer';
    const farmerId = localStorage.getItem('userId');
    
    // Update the UI with farmer data
    document.getElementById('farmerName').textContent = farmerName;
    
    // Load profile image if available
    const profileData = JSON.parse(localStorage.getItem('farmerProfileData'));
    if (profileData && profileData.profileImage) {
        document.getElementById('farmerProfileImage').src = profileData.profileImage;
    }
    
    // Set up logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        // Use the Auth module from auth.js
        if (window.Auth) {
            window.Auth.logout();
        } else {
            // Fallback if Auth module is not available
            localStorage.removeItem('authToken');
            localStorage.removeItem('userType');
            localStorage.removeItem('userName');
            localStorage.removeItem('userId');
            window.location.href = '../index.html';
        }
    });

    // Set up messaging system
    setupMessaging();

    // Set up logout functionality
    setupLogout();

    // Set up dashboard button clicks
    setupDashboardButtons();

    // Set up all navigation links
    setupAllNavigationLinks();
}

// REMOVED: Static content loader - building real dynamic system instead
// ALL STATIC CONTENT REMOVED - Building real dynamic system

// Setup logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (confirm('Are you sure you want to logout?')) {
                // Clear any stored authentication data
                if (typeof Auth !== 'undefined' && Auth.logout) {
                    Auth.logout();
                }

                // Clear local storage
                localStorage.removeItem('farmerToken');
                localStorage.removeItem('farmerData');

                // Redirect to login page
                window.location.href = 'loginfarmer.html';
            }
        });
    }
}

// Setup dashboard button functionality
function setupDashboardButtons() {
    // Add Product button on dashboard
    const addProductBtns = document.querySelectorAll('[href="#addproduct"], .add-product-btn');
    addProductBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            loadContent('addproduct');
        });
    });

    // Add Urgent Sale button on dashboard
    const addUrgentBtns = document.querySelectorAll('[href="#addurgentsale"], .add-urgent-btn');
    addUrgentBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            loadContent('addurgentsale');
        });
    });

    // View All Sales button
    const viewSalesBtns = document.querySelectorAll('.view-sales-btn, .sales-link');
    viewSalesBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            loadContent('saleshistory');
        });
    });

    // Profile button
    const profileBtns = document.querySelectorAll('[href="#profile"], .profile-btn');
    profileBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            loadContent('farmerprofile');
        });
    });
}

// Setup all navigation links
function setupAllNavigationLinks() {
    console.log('Setting up all navigation links...');

    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const page = href.replace('#', '');

        // Skip logout button (handled separately)
        if (page === '' || link.id === 'logoutBtn') return;

        console.log('Setting up navigation for:', page);

        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Load the content
            loadContent(page);
        });
    });

    // Also setup dashboard action buttons
    setupDashboardActionButtons();
}

// Setup dashboard action buttons specifically
function setupDashboardActionButtons() {
    // This function will be called after content is loaded
    setTimeout(() => {
        // Setup all action buttons with data-page attributes
        const actionBtns = document.querySelectorAll('.action-btn[data-page]');
        actionBtns.forEach(btn => {
            if (!btn.hasAttribute('data-setup')) {
                btn.setAttribute('data-setup', 'true');
                const page = btn.getAttribute('data-page');
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Dashboard button clicked, loading:', page);
                    loadContent(page);
                });
            }
        });

        // Also setup any remaining onclick buttons
        const onclickBtns = document.querySelectorAll('[onclick*="loadContent"]');
        onclickBtns.forEach(btn => {
            if (!btn.hasAttribute('data-setup')) {
                btn.setAttribute('data-setup', 'true');
                // Remove onclick and add proper event listener
                const onclickValue = btn.getAttribute('onclick');
                btn.removeAttribute('onclick');

                // Extract page name from onclick
                const match = onclickValue.match(/loadContent\(['"]([^'"]+)['"]\)/);
                if (match) {
                    const page = match[1];
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        console.log('Onclick button clicked, loading:', page);
                        loadContent(page);
                    });
                }
            }
        });
    }, 500);
}

// Setup messaging functionality
function setupMessaging() {
    // Add event listener for message button
    document.addEventListener('click', function(e) {
        if (e.target.id === 'openMessaging' || e.target.closest('#openMessaging')) {
            if (window.messagingSystem) {
                window.messagingSystem.showMessaging();
            }
        }
    });

    // Update message badge count periodically
    updateMessageBadge();
    setInterval(updateMessageBadge, 30000); // Update every 30 seconds
}

// Update message badge count
async function updateMessageBadge() {
    // Skip API calls when running on file:// protocol
    if (window.location.protocol === 'file:') {
        console.log('Skipping message badge update - running on file:// protocol');
        const badge = document.querySelector('.message-badge');
        if (badge) {
            badge.textContent = '2'; // Mock data
            badge.style.display = 'flex';
        }
        return;
    }

    try {
        const response = await fetch('/api/messages/unread-count', {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const badge = document.querySelector('.message-badge');
            if (badge) {
                badge.textContent = data.count;
                badge.style.display = data.count > 0 ? 'flex' : 'none';
            }
        }
    } catch (error) {
        console.error('Error updating message badge:', error);
    }
}

// Setup header functionality
function setupHeader() {
    // Profile dropdown toggle
    const profileDropdownBtn = document.getElementById('profileDropdownBtn');
    const profileDropdown = document.querySelector('.profile-dropdown');

    if (profileDropdownBtn) {
        profileDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });

    // Header logout button
    const headerLogoutBtn = document.getElementById('headerLogoutBtn');
    if (headerLogoutBtn) {
        headerLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }

    // Notification button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            // Navigate to dedicated notifications page
            window.location.href = 'notifications.html';
        });
    }

    // Update header with user info
    updateHeaderUserInfo();

    // Update page title based on current section
    updatePageTitle();
}

// Update header user information
function updateHeaderUserInfo() {
    const farmerName = Auth.getUserName() || 'John Farmer';
    const profileImage = Auth.getUserAvatar() || '../assets/default-profile.jpg';

    // Update header profile
    const headerFarmerName = document.getElementById('headerFarmerName');
    const headerProfileImage = document.getElementById('headerProfileImage');

    if (headerFarmerName) {
        headerFarmerName.textContent = farmerName;
    }

    if (headerProfileImage) {
        headerProfileImage.src = profileImage;
        headerProfileImage.alt = farmerName;
    }

    // Update sidebar profile as well
    const sidebarFarmerName = document.getElementById('farmerName');
    const sidebarProfileImage = document.getElementById('farmerProfileImage');

    if (sidebarFarmerName) {
        sidebarFarmerName.textContent = farmerName;
    }

    if (sidebarProfileImage) {
        sidebarProfileImage.src = profileImage;
        sidebarProfileImage.alt = farmerName;
    }
}

// Update page title based on current section
function updatePageTitle() {
    const currentPage = getCurrentPage();
    const pageTitle = document.getElementById('pageTitle');
    const lastUpdated = document.getElementById('lastUpdated');

    if (pageTitle) {
        const titles = {
            'dashboard': 'Dashboard',
            'mylisting': 'My Listings',
            'addproduct': 'Add New Product',
            'addurgentsale': 'Add Urgent Sale',
            'editlisting': 'Edit Listings',
            'reservations': 'Reservations',
            'saleshistory': 'Sales History',
            'profile': 'My Profile',
            'settings': 'Settings'
        };

        pageTitle.textContent = titles[currentPage] || 'Dashboard';
    }

    if (lastUpdated) {
        lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    }
}

// Get current page from URL hash or active nav item
function getCurrentPage() {
    const hash = window.location.hash.substring(1);
    if (hash) return hash;

    const activeNav = document.querySelector('.nav-menu a.active');
    if (activeNav) {
        return activeNav.getAttribute('href').substring(1);
    }

    return 'dashboard';
}

// Update notification badge
async function updateNotificationBadge() {
    // Skip API calls when running on file:// protocol
    if (window.location.protocol === 'file:') {
        console.log('Skipping notification badge update - running on file:// protocol');
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = '3'; // Mock data
            badge.style.display = 'flex';
        }
        return;
    }

    try {
        const response = await fetch('/api/notifications/', {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const unreadCount = data.notifications ? data.notifications.filter(n => n.status === 'Unread').length : 0;

            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.textContent = unreadCount;
                badge.style.display = unreadCount > 0 ? 'flex' : 'none';
            }
        }
    } catch (error) {
        console.error('Error updating notification badge:', error);
    }
}

// Utility functions for dynamic dashboard
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getTimeRemaining(expiresAt) {
    if (!expiresAt) return 'No expiry';

    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return 'Less than 1 hour left';
}

// Action functions for dashboard interactions
async function approveReservation(reservationId) {
    try {
        const response = await fetch(`/api/farmer/reservations/${reservationId}/approve/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            showNotification('Reservation approved successfully!', 'success');
            loadDashboardData(); // Reload dashboard
        } else {
            showNotification('Failed to approve reservation', 'error');
        }
    } catch (error) {
        console.error('Error approving reservation:', error);
        showNotification('Error approving reservation', 'error');
    }
}

async function rejectReservation(reservationId) {
    try {
        const reason = prompt('Please provide a reason for rejection (optional):');

        const response = await fetch(`/api/farmer/reservations/${reservationId}/reject/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rejection_reason: reason || 'No reason provided'
            })
        });

        if (response.ok) {
            showNotification('Reservation rejected', 'success');
            loadDashboardData(); // Reload dashboard
        } else {
            showNotification('Failed to reject reservation', 'error');
        }
    } catch (error) {
        console.error('Error rejecting reservation:', error);
        showNotification('Error rejecting reservation', 'error');
    }
}

function viewReservationDetails(reservationId) {
    // Navigate to reservations page with specific reservation
    sessionStorage.setItem('viewReservationId', reservationId);
    loadContent('reservations');
}

function editProduct(productId) {
    // Navigate to edit product page
    sessionStorage.setItem('editProductId', productId);
    loadContent('editlisting');
}

function viewProductDetails(productId) {
    // Navigate to product details
    sessionStorage.setItem('viewProductId', productId);
    loadContent('mylisting');
}

function editUrgentSale(saleId) {
    // Navigate to edit urgent sale
    sessionStorage.setItem('editUrgentSaleId', saleId);
    loadContent('addurgentsale');
}

function viewUrgentSaleDetails(saleId) {
    // Navigate to urgent sale details
    sessionStorage.setItem('viewUrgentSaleId', saleId);
    loadContent('addurgentsale');
}

// Export functions for global access
window.loadDashboardData = loadDashboardData;
window.approveReservation = approveReservation;
window.rejectReservation = rejectReservation;
window.viewReservationDetails = viewReservationDetails;
window.editProduct = editProduct;
window.viewProductDetails = viewProductDetails;
window.editUrgentSale = editUrgentSale;
window.viewUrgentSaleDetails = viewUrgentSaleDetails;
