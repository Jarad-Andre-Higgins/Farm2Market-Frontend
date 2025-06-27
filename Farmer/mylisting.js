document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    loadFarmerCategories();
    loadFarmerProducts();
    initializeFilters();
    initializeCategoryRequestModal();
});

// Function to load farmer's approved categories
function loadFarmerCategories() {
    // In a real app, this would be an API call to get the farmer's approved categories
    // For now, we'll simulate it
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    // Clear existing options except the first one
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
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
        option.value = category.name.toLowerCase();
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
    
    return farmerCategories;
}

// Function to load farmer's products
function loadFarmerProducts() {
    // In a real app, this would be an API call to get the farmer's products
    // For now, we'll use the static HTML structure
    
    // Check if we need to show empty state
    const categoryListings = document.getElementById('categoryListings');
    const categorySections = categoryListings.querySelectorAll('.category-section');
    
    if (categorySections.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
    } else {
        document.getElementById('emptyState').style.display = 'none';
    }
}

// Function to initialize filters
function initializeFilters() {
    const searchInput = document.getElementById('searchProducts');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterCategories);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterProducts);
    }
}

// Function to filter categories
function filterCategories() {
    const categoryValue = document.getElementById('categoryFilter').value.toLowerCase();
    const categorySections = document.querySelectorAll('.category-section');
    
    let visibleSections = 0;
    
    categorySections.forEach(section => {
        const sectionCategory = section.getAttribute('data-category').toLowerCase();
        
        if (categoryValue === '' || sectionCategory === categoryValue) {
            section.style.display = 'block';
            visibleSections++;
        } else {
            section.style.display = 'none';
        }
    });
    
    // Show empty state if no sections are visible
    if (visibleSections === 0) {
        document.getElementById('emptyState').style.display = 'block';
    } else {
        document.getElementById('emptyState').style.display = 'none';
    }
}

// Function to filter products
function filterProducts() {
    const searchValue = document.getElementById('searchProducts').value.toLowerCase();
    const statusValue = document.getElementById('statusFilter').value.toLowerCase();
    
    const productCards = document.querySelectorAll('.card');
    const categorySections = document.querySelectorAll('.category-section');
    
    // Reset visibility of all category sections
    categorySections.forEach(section => {
        section.style.display = 'block';
    });
    
    let visibleProducts = 0;
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productStatus = card.querySelector('.status').classList.contains('available') ? 'available' : 'sold-out';
        
        const matchesSearch = productName.includes(searchValue);
        const matchesStatus = statusValue === '' || productStatus === statusValue;
        
        if (matchesSearch && matchesStatus) {
            card.style.display = 'block';
            visibleProducts++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Check each category section to see if it has any visible products
    categorySections.forEach(section => {
        const visibleCardsInSection = Array.from(section.querySelectorAll('.card')).filter(card => 
            card.style.display !== 'none'
        ).length;
        
        if (visibleCardsInSection === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
    
    // Show empty state if no products are visible
    const visibleSections = Array.from(categorySections).filter(section => 
        section.style.display !== 'none'
    ).length;
    
    if (visibleSections === 0) {
        document.getElementById('emptyState').style.display = 'block';
    } else {
        document.getElementById('emptyState').style.display = 'none';
    }
}

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
                    
                    // Show success message
                    showNotification('Category request submitted successfully! Admin will review your request.');
                    
                    // Reset form
                    categoryRequestForm.reset();
                }, 1500);
            });
        }
    }
}

// Function to edit a product
function editProduct(productId) {
    // In a real app, you would redirect to the edit page with the product ID
    window.location.href = 'editlisting.html?id=' + productId;
}

// Function to delete a product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        // In a real app, you would make an API call to delete the product
        // For now, we'll just remove the product from the DOM
        const productCard = document.querySelector(`.card[data-product-id="${productId}"]`);
        if (productCard) {
            // Get the parent grid
            const parentGrid = productCard.parentElement;
            
            // Remove the product
            productCard.remove();
            
            // Check if the grid is now empty
            if (parentGrid.children.length === 0) {
                // Get the parent category section
                const categorySection = parentGrid.parentElement;
                
                // Remove the category section if it's empty
                categorySection.remove();
                
                // Check if we need to show empty state
                const categorySections = document.querySelectorAll('.category-section');
                if (categorySections.length === 0) {
                    document.getElementById('emptyState').style.display = 'block';
                }
            }
            
            showNotification('Product deleted successfully!');
        }
    }
}

// Function to show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
        <button class="close-btn">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // Close button
    const closeBtn = notification.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
}