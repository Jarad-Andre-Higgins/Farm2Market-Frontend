document.addEventListener('DOMContentLoaded', function() {
    // Initialize the profile page
    initProfileImage();
    initFarmPhotos();
    initFileUploads();
    initPaymentMethodToggle();
    initDeliveryOptionsToggle();
    calculateProfileCompletion();
    
    // Load profile data if available
    loadProfileData();
    
    // Form submission
    document.getElementById('farmerProfileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfileData();
    });
    
    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            window.location.href = 'farmer dashboard.html';
        }
    });
});

// Initialize profile image functionality
function initProfileImage() {
    const profileImage = document.querySelector('.profile-image');
    const profileImageInput = document.getElementById('profileImage');
    const profileImagePreview = document.getElementById('profileImagePreview');
    
    profileImage.addEventListener('click', function() {
        profileImageInput.click();
    });
    
    profileImageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                profileImagePreview.src = e.target.result;
            };
            
            reader.readAsDataURL(this.files[0]);
            calculateProfileCompletion();
        }
    });
}

// Initialize farm photos functionality
function initFarmPhotos() {
    const farmPhotosContainer = document.querySelector('.farm-photos-container');
    const photoUpload = document.querySelector('.farm-photo-upload');
    const photoInput = document.querySelector('.farm-photo-input');
    
    photoUpload.addEventListener('click', function() {
        photoInput.click();
    });
    
    photoInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Create new photo element
                const newPhoto = document.createElement('div');
                newPhoto.className = 'farm-photo-upload';
                newPhoto.innerHTML = `
                    <img src="${e.target.result}" alt="Farm Photo">
                    <div class="photo-actions">
                        <button type="button" class="delete-photo"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                // Add delete functionality
                const deleteBtn = newPhoto.querySelector('.delete-photo');
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this photo?')) {
                        newPhoto.remove();
                        calculateProfileCompletion();
                    }
                });
                
                // Add to container before the upload button
                farmPhotosContainer.insertBefore(newPhoto, photoUpload);
                
                // Reset input
                photoInput.value = '';
                
                // Create new upload button if less than 5 photos
                if (farmPhotosContainer.querySelectorAll('.farm-photo-upload').length < 6) {
                    calculateProfileCompletion();
                } else {
                    // Hide upload button if 5 photos are added
                    photoUpload.style.display = 'none';
                }
            };
            
            reader.readAsDataURL(this.files[0]);
        }
    });
}

// Initialize file uploads
function initFileUploads() {
    const idUploadBtn = document.getElementById('idUploadBtn');
    const idDocument = document.getElementById('idDocument');
    const idFileName = document.getElementById('idFileName');
    
    idUploadBtn.addEventListener('click', function() {
        idDocument.click();
    });
    
    idDocument.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            idFileName.textContent = this.files[0].name;
            calculateProfileCompletion();
        }
    });
}

// Initialize payment method toggle
function initPaymentMethodToggle() {
    const paymentMethod = document.getElementById('paymentMethod');
    const momoDetails = document.getElementById('momoDetails');
    const bankDetails = document.getElementById('bankDetails');
    
    paymentMethod.addEventListener('change', function() {
        if (this.value === 'momo') {
            momoDetails.style.display = 'block';
            bankDetails.style.display = 'none';
        } else if (this.value === 'bank') {
            momoDetails.style.display = 'none';
            bankDetails.style.display = 'block';
        } else {
            momoDetails.style.display = 'none';
            bankDetails.style.display = 'none';
        }
        
        calculateProfileCompletion();
    });
}

// Initialize delivery options toggle
function initDeliveryOptionsToggle() {
    const deliveryOptions = document.querySelectorAll('input[name="deliveryOptions"]');
    const localDeliveryDetails = document.getElementById('localDeliveryDetails');
    
    deliveryOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (document.querySelector('input[name="deliveryOptions"][value="local"]').checked) {
                localDeliveryDetails.style.display = 'block';
            } else {
                localDeliveryDetails.style.display = 'none';
            }
            
            calculateProfileCompletion();
        });
    });
}

// Calculate profile completion percentage
function calculateProfileCompletion() {
    const form = document.getElementById('farmerProfileForm');
    const requiredFields = form.querySelectorAll('[required]');
    const totalRequiredFields = requiredFields.length;
    let completedFields = 0;
    
    requiredFields.forEach(field => {
        if (field.value.trim() !== '') {
            completedFields++;
        }
    });
    
    // Check optional but important fields
    const optionalImportantFields = [
        document.getElementById('farmDescription'),
        document.getElementById('idDocument'),
        document.getElementById('profileImage')
    ];
    
    const totalOptionalImportantFields = optionalImportantFields.length;
    let completedOptionalFields = 0;
    
    optionalImportantFields.forEach(field => {
        if (field.type === 'file') {
            if (field.files && field.files.length > 0) {
                completedOptionalFields++;
            }
        } else if (field.value.trim() !== '') {
            completedOptionalFields++;
        }
    });
    
    // Check farm photos
    const farmPhotos = document.querySelectorAll('.farm-photo-upload img').length;
    const farmPhotosWeight = Math.min(farmPhotos, 5) / 5;
    
    // Calculate total completion percentage
    const requiredWeight = 0.6; // 60% weight for required fields
    const optionalWeight = 0.3; // 30% weight for optional important fields
    const photosWeight = 0.1; // 10% weight for farm photos
    
    const requiredCompletion = completedFields / totalRequiredFields;
    const optionalCompletion = completedOptionalFields / totalOptionalImportantFields;
    
    const totalCompletion = (requiredCompletion * requiredWeight) + 
                           (optionalCompletion * optionalWeight) + 
                           (farmPhotosWeight * photosWeight);
    
    const percentage = Math.round(totalCompletion * 100);
    
    // Update UI
    document.getElementById('profileProgress').style.width = `${percentage}%`;
    document.getElementById('completionPercentage').textContent = `${percentage}%`;
    
    // Change color based on completion
    const progressFill = document.getElementById('profileProgress');
    if (percentage < 30) {
        progressFill.style.backgroundColor = '#ef4444'; // Red
    } else if (percentage < 70) {
        progressFill.style.backgroundColor = '#f59e0b'; // Amber
    } else {
        progressFill.style.backgroundColor = '#4ade80'; // Green
    }
}

// Load profile data from localStorage or API
function loadProfileData() {
    // In a real app, this would be an API call to get the farmer's profile data
    // For now, we'll use localStorage for demonstration
    
    const profileData = JSON.parse(localStorage.getItem('farmerProfileData'));
    
    if (profileData) {
        // Fill form fields with saved data
        document.getElementById('firstName').value = profileData.firstName || '';
        document.getElementById('lastName').value = profileData.lastName || '';
        document.getElementById('phone').value = profileData.phone || '';
        document.getElementById('email').value = profileData.email || '';
        document.getElementById('location').value = profileData.location || '';
        document.getElementById('farmName').value = profileData.farmName || '';
        
        if (profileData.farmingExperience) {
            document.getElementById('farmingExperience').value = profileData.farmingExperience;
        }
        
        if (profileData.farmSize) {
            document.getElementById('farmSize').value = profileData.farmSize;
        }
        
        if (profileData.farmingPractices && profileData.farmingPractices.length > 0) {
            profileData.farmingPractices.forEach(practice => {
                const checkbox = document.querySelector(`input[name="farmingPractices"][value="${practice}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
        
        document.getElementById('farmDescription').value = profileData.farmDescription || '';
        
        if (profileData.paymentMethod) {
            document.getElementById('paymentMethod').value = profileData.paymentMethod;
            
            if (profileData.paymentMethod === 'momo') {
                document.getElementById('momoDetails').style.display = 'block';
                document.getElementById('momoProvider').value = profileData.momoProvider || '';
                document.getElementById('momoNumber').value = profileData.momoNumber || '';
                                document.getElementById('momoAccountName').value = profileData.momoAccountName || '';
                            }
                            if (profileData.paymentMethod === 'bank') {
                                document.getElementById('bankDetails').style.display = 'block';
                                document.getElementById('bankName').value = profileData.bankName || '';
                                document.getElementById('accountNumber').value = profileData.accountNumber || '';
                                document.getElementById('accountName').value = profileData.accountName || '';
                            }
                        }
                
                        // Set delivery options
                        if (profileData.deliveryOptions) {
                            const deliveryOptions = document.querySelectorAll('input[name="deliveryOptions"]');
                            deliveryOptions.forEach(option => {
                                if (profileData.deliveryOptions.includes(option.value)) {
                                    option.checked = true;
                                }
                            });
                            if (profileData.deliveryOptions.includes('local')) {
                                document.getElementById('localDeliveryDetails').style.display = 'block';
                                document.getElementById('localDeliveryArea').value = profileData.localDeliveryArea || '';
                            }
                        }
                
                        // Set profile image preview if available
                        if (profileData.profileImage) {
                            document.getElementById('profileImagePreview').src = profileData.profileImage;
                        }
                
                        // Set farm photos if available
                        if (profileData.farmPhotos && Array.isArray(profileData.farmPhotos)) {
                            const farmPhotosContainer = document.querySelector('.farm-photos-container');
                            const photoUpload = document.querySelector('.farm-photo-upload');
                            profileData.farmPhotos.forEach(photoSrc => {
                                const newPhoto = document.createElement('div');
                                newPhoto.className = 'farm-photo-upload';
                                newPhoto.innerHTML = `
                                    <img src="${photoSrc}" alt="Farm Photo">
                                    <div class="photo-actions">
                                        <button type="button" class="delete-photo"><i class="fas fa-trash"></i></button>
                                    </div>
                                `;
                                // Add delete functionality
                                const deleteBtn = newPhoto.querySelector('.delete-photo');
                                deleteBtn.addEventListener('click', function(e) {
                                    e.stopPropagation();
                                    if (confirm('Are you sure you want to delete this photo?')) {
                                        newPhoto.remove();
                                        calculateProfileCompletion();
                                    }
                                });
                                farmPhotosContainer.insertBefore(newPhoto, photoUpload);
                            });
                            // Hide upload button if 5 photos are added
                            if (farmPhotosContainer.querySelectorAll('.farm-photo-upload').length > 5) {
                                photoUpload.style.display = 'none';
                            }
                        }
                
                        // Set ID document file name if available
                        if (profileData.idDocumentName) {
                            document.getElementById('idFileName').textContent = profileData.idDocumentName;
                        }
                    }
                
                    calculateProfileCompletion();
                }