// Settings Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsTabs();
    initializeSettingsForms();
    loadUserSettings();
});

// Initialize tab functionality
function initializeSettingsTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Initialize all forms
function initializeSettingsForms() {
    initializePersonalInfoForm();
    initializeLanguageForm();
    initializeNotificationForm();
    initializePrivacyForm();
    initializePasswordForm();
    initializeDeleteAccountButton();
}

// Personal Information Form
function initializePersonalInfoForm() {
    const form = document.getElementById('personalInfoForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const personalInfo = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            location: formData.get('location')
        };
        
        savePersonalInfo(personalInfo);
    });
}

// Language & Region Form
function initializeLanguageForm() {
    const form = document.getElementById('languageForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const languageSettings = {
            language: formData.get('language'),
            currency: formData.get('currency')
        };
        
        saveLanguageSettings(languageSettings);
    });
}

// Notification Settings Form
function initializeNotificationForm() {
    const form = document.getElementById('notificationForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const notificationSettings = {
            email: {
                reservations: document.getElementById('emailReservations').checked,
                sales: document.getElementById('emailSales').checked,
                messages: document.getElementById('emailMessages').checked,
                admin: document.getElementById('emailAdmin').checked
            },
            sms: {
                reservations: document.getElementById('smsReservations').checked,
                payments: document.getElementById('smsPayments').checked
            },
            dashboard: {
                all: document.getElementById('dashboardAll').checked
            }
        };
        
        saveNotificationSettings(notificationSettings);
    });
}

// Privacy Settings Form
function initializePrivacyForm() {
    const form = document.getElementById('privacyForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const privacySettings = {
            publicProfile: document.getElementById('publicProfile').checked,
            showLocation: document.getElementById('showLocation').checked,
            showContact: document.getElementById('showContact').checked
        };
        
        savePrivacySettings(privacySettings);
    });
}

// Password Change Form
function initializePasswordForm() {
    const form = document.getElementById('passwordForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');
        
        // Validate passwords
        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            showNotification('Password must be at least 8 characters long', 'error');
            return;
        }
        
        changePassword(currentPassword, newPassword);
    });
}

// Delete Account Button
function initializeDeleteAccountButton() {
    const deleteBtn = document.getElementById('deleteAccountBtn');
    if (!deleteBtn) return;
    
    deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            if (confirm('This will permanently delete all your data, products, and sales history. Type "DELETE" to confirm.')) {
                const userInput = prompt('Type "DELETE" to confirm account deletion:');
                if (userInput === 'DELETE') {
                    deleteAccount();
                }
            }
        }
    });
}

// API Functions
async function savePersonalInfo(personalInfo) {
    try {
        showNotification('Saving personal information...', 'info');
        
        const response = await fetch('/api/farmers/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(personalInfo)
        });
        
        if (response.ok) {
            showNotification('Personal information updated successfully!', 'success');
            // Update farmer name in sidebar
            document.getElementById('farmerName').textContent = `${personalInfo.firstName} ${personalInfo.lastName}`;
        } else {
            throw new Error('Failed to update personal information');
        }
    } catch (error) {
        console.error('Error saving personal info:', error);
        showNotification('Failed to update personal information', 'error');
    }
}

async function saveLanguageSettings(languageSettings) {
    try {
        showNotification('Saving language settings...', 'info');
        
        // Save to localStorage for immediate effect
        localStorage.setItem('userLanguage', languageSettings.language);
        localStorage.setItem('userCurrency', languageSettings.currency);
        
        const response = await fetch('/api/farmers/settings/language', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(languageSettings)
        });
        
        if (response.ok) {
            showNotification('Language settings updated successfully!', 'success');
        } else {
            throw new Error('Failed to update language settings');
        }
    } catch (error) {
        console.error('Error saving language settings:', error);
        showNotification('Failed to update language settings', 'error');
    }
}

async function saveNotificationSettings(notificationSettings) {
    try {
        showNotification('Saving notification settings...', 'info');
        
        const response = await fetch('/api/farmers/settings/notifications', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(notificationSettings)
        });
        
        if (response.ok) {
            showNotification('Notification settings updated successfully!', 'success');
        } else {
            throw new Error('Failed to update notification settings');
        }
    } catch (error) {
        console.error('Error saving notification settings:', error);
        showNotification('Failed to update notification settings', 'error');
    }
}

async function savePrivacySettings(privacySettings) {
    try {
        showNotification('Saving privacy settings...', 'info');
        
        const response = await fetch('/api/farmers/settings/privacy', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(privacySettings)
        });
        
        if (response.ok) {
            showNotification('Privacy settings updated successfully!', 'success');
        } else {
            throw new Error('Failed to update privacy settings');
        }
    } catch (error) {
        console.error('Error saving privacy settings:', error);
        showNotification('Failed to update privacy settings', 'error');
    }
}

async function changePassword(currentPassword, newPassword) {
    try {
        showNotification('Changing password...', 'info');
        
        const response = await fetch('/api/farmers/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });
        
        if (response.ok) {
            showNotification('Password changed successfully!', 'success');
            document.getElementById('passwordForm').reset();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to change password');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showNotification(error.message || 'Failed to change password', 'error');
    }
}

async function deleteAccount() {
    try {
        showNotification('Deleting account...', 'info');
        
        const response = await fetch('/api/farmers/delete-account', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        
        if (response.ok) {
            showNotification('Account deleted successfully', 'success');
            // Clear local storage and redirect to login
            localStorage.clear();
            setTimeout(() => {
                window.location.href = 'loginfarmer.html';
            }, 2000);
        } else {
            throw new Error('Failed to delete account');
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        showNotification('Failed to delete account', 'error');
    }
}

// Load user settings from API
async function loadUserSettings() {
    try {
        const response = await fetch('/api/farmers/settings', {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        
        if (response.ok) {
            const settings = await response.json();
            populateSettingsForm(settings);
        }
    } catch (error) {
        console.error('Error loading user settings:', error);
    }
}

// Populate form fields with user data
function populateSettingsForm(settings) {
    // Personal Information
    if (settings.personalInfo) {
        document.getElementById('firstName').value = settings.personalInfo.firstName || '';
        document.getElementById('lastName').value = settings.personalInfo.lastName || '';
        document.getElementById('email').value = settings.personalInfo.email || '';
        document.getElementById('phone').value = settings.personalInfo.phone || '';
        document.getElementById('location').value = settings.personalInfo.location || '';
    }
    
    // Language Settings
    if (settings.language) {
        document.getElementById('language').value = settings.language.language || 'en';
        document.getElementById('currency').value = settings.language.currency || 'XAF';
    }
    
    // Notification Settings
    if (settings.notifications) {
        document.getElementById('emailReservations').checked = settings.notifications.email?.reservations ?? true;
        document.getElementById('emailSales').checked = settings.notifications.email?.sales ?? true;
        document.getElementById('emailMessages').checked = settings.notifications.email?.messages ?? true;
        document.getElementById('emailAdmin').checked = settings.notifications.email?.admin ?? true;
        document.getElementById('smsReservations').checked = settings.notifications.sms?.reservations ?? true;
        document.getElementById('smsPayments').checked = settings.notifications.sms?.payments ?? false;
        document.getElementById('dashboardAll').checked = settings.notifications.dashboard?.all ?? true;
    }
    
    // Privacy Settings
    if (settings.privacy) {
        document.getElementById('publicProfile').checked = settings.privacy.publicProfile ?? true;
        document.getElementById('showLocation').checked = settings.privacy.showLocation ?? true;
        document.getElementById('showContact').checked = settings.privacy.showContact ?? false;
    }
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    const container = document.getElementById('notificationContainer');
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}
