document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated and is a farmer
    if (!Auth.isAuthenticated() || Auth.getUserType() !== 'Farmer') {
        window.location.href = 'loginfarmer.html';
        return;
    }
    
    // DOM elements
    const urgentSaleForm = document.getElementById('urgentSaleForm');
    const bestBeforeInput = document.getElementById('bestBefore');
    const originalPriceInput = document.getElementById('originalPrice');
    const reducedPriceInput = document.getElementById('reducedPrice');
    const productImageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const cancelButton = document.getElementById('cancelButton');
    const notification = document.getElementById('notification');
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationMessage = document.getElementById('notificationMessage');
    
    // Set minimum date for best before to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    bestBeforeInput.min = tomorrow.toISOString().split('T')[0];
    
    // Initialize image preview
    productImageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = `<p>Image preview will appear here</p>`;
        }
    });
    
    // Real-time price validation
    reducedPriceInput.addEventListener('input', validatePrices);
    originalPriceInput.addEventListener('input', validatePrices);
    
    function validatePrices() {
        const originalPrice = parseFloat(originalPriceInput.value.replace(/[^0-9.]/g, ''));
        const reducedPrice = parseFloat(reducedPriceInput.value.replace(/[^0-9.]/g, ''));
        
        if (!isNaN(originalPrice) && !isNaN(reducedPrice)) {
            if (reducedPrice >= originalPrice) {
                reducedPriceInput.setCustomValidity('Reduced price must be lower than original price');
                reducedPriceInput.classList.add('invalid');
            } else {
                reducedPriceInput.setCustomValidity('');
                reducedPriceInput.classList.remove('invalid');
            }
        }
    }
    
    // Cancel button handler
    cancelButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
            window.location.href = 'farmer dashboard.html';
        }
    });
    
    // Show notification function
    function showNotification(message, isSuccess = true) {
        notificationMessage.textContent = message;
        notificationIcon.className = isSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        notification.className = isSuccess ? 'notification success' : 'notification error';
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
    
    // Handle form submission
    urgentSaleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(urgentSaleForm);
        
        // Validate prices
        const originalPrice = parseFloat(formData.get('originalPrice').replace(/[^0-9.]/g, ''));
        const reducedPrice = parseFloat(formData.get('reducedPrice').replace(/[^0-9.]/g, ''));
        
        if (isNaN(originalPrice) || isNaN(reducedPrice)) {
            showNotification('Please enter valid prices', false);
            return;
        }
        
        if (reducedPrice >= originalPrice) {
            showNotification('Reduced price must be lower than original price', false);
            return;
        }
        
        // Parse quantity and unit
        const quantityInput = formData.get('quantity');
        const quantityParts = quantityInput.split(' ');
        const quantity = parseFloat(quantityParts[0]);
        const unit = quantityParts.length > 1 ? quantityParts[1] : 'kg';
        
        if (isNaN(quantity) || quantity <= 0) {
            showNotification('Please enter a valid quantity', false);
            return;
        }
        
        // Create data object for API
        const urgentSaleData = {
            product_name: formData.get('productName'),
            original_price: originalPrice,
            reduced_price: reducedPrice,
            quantity: quantity,
            quantity_unit: unit,
            best_before: formData.get('bestBefore'),
            reason: formData.get('reason')
        };
        
        // Disable form during submission
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        // Handle image upload
        const imageFile = formData.get('productImage');
        if (imageFile.size > 0) {
            const imageFormData = new FormData();
            imageFormData.append('image', imageFile);
            
            // First upload the image
            fetch('http://localhost:8000/api/upload-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: imageFormData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }
                return response.json();
            })
            .then(imageData => {
                // Add image URL to urgent sale data
                urgentSaleData.image_url = imageData.url;
                
                // Then create the urgent sale
                createUrgentSale(urgentSaleData);
            })
            .catch(error => {
                console.error('Error uploading image:', error);
                showNotification('Failed to upload image. Please try again.', false);
                submitButton.disabled = false;
                submitButton.innerHTML = 'Save Urgent Sale';
            });
        } else {
            // Create urgent sale without image
            createUrgentSale(urgentSaleData);
        }
    });
    
    // Function to create urgent sale
    function createUrgentSale(urgentSaleData) {
        fetch('http://localhost:8000/api/urgent-sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(urgentSaleData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create urgent sale');
            }
            return response.json();
        })
        .then(data => {
            showNotification('Urgent sale product saved successfully!');

            // Create notification for all buyers
            NotificationSystem.createUrgentSaleNotification(data.urgentSale);

            // Send email notifications to all buyers
            EmailService.sendUrgentSaleNotification(data.urgentSale, data.buyers);

            // Reset form and preview
            urgentSaleForm.reset();
            imagePreview.innerHTML = '<p>Image preview will appear here</p>';

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'farmer dashboard.html';
            }, 2000);
        })
        .catch(error => {
            console.error('Error creating urgent sale:', error);
            showNotification('Failed to save urgent sale. Please try again.', false);
            
            // Re-enable submit button
            const submitButton = document.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.innerHTML = 'Save Urgent Sale';
        });
    }
    
    // Check for offline status
    window.addEventListener('online', function() {
        showNotification('You are back online. All features are available.');
    });
    
    window.addEventListener('offline', function() {
        showNotification('You are offline. Some features may be limited.', false);
    });
});

