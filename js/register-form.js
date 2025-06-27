// Register Form JavaScript
class RegisterForm {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.roleInput = document.getElementById('role');
        this.submitButton = document.getElementById('submitButton');
        this.apiError = document.getElementById('apiError');
        this.apiErrorText = document.getElementById('apiErrorText');
        
        this.currentRole = this.roleInput?.value || 'farmer';
        this.isSubmitting = false;
        
        this.validationRules = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^(\+237|237)?[6-9]\d{8}$/,
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        };
        
        this.init();
    }
    
    init() {
        this.setupRoleTabs();
        this.setupFormValidation();
        this.setupFormSubmission();
        this.updateRoleDescription();
        this.updateSubmitButtonText();
    }
    
    setupRoleTabs() {
        const roleTabs = document.querySelectorAll('.register-form__role-tab');
        
        roleTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const role = tab.getAttribute('data-role');
                this.switchRole(role);
            });
        });
    }
    
    switchRole(role) {
        if (role === this.currentRole) return;
        
        this.currentRole = role;
        
        // Update role input
        if (this.roleInput) {
            this.roleInput.value = role;
        }
        
        // Update tab appearance
        const roleTabs = document.querySelectorAll('.register-form__role-tab');
        roleTabs.forEach(tab => {
            const tabRole = tab.getAttribute('data-role');
            tab.classList.toggle('register-form__role-tab--active', tabRole === role);
        });
        
        // Update description and button text
        this.updateRoleDescription();
        this.updateSubmitButtonText();
        
        // Redirect to appropriate page if needed
        if (role === 'farmer' && window.location.pathname.includes('buyer')) {
            window.location.href = '../Farmer/signupfarmer.html';
        } else if (role === 'buyer' && window.location.pathname.includes('farmer')) {
            window.location.href = '../Buyer/signupbuyer.html';
        }
    }
    
    updateRoleDescription() {
        const description = document.querySelector('.register-form__role-description');
        if (description) {
            description.textContent = this.currentRole === 'farmer' 
                ? 'Sell your fresh produce directly to buyers across Cameroon'
                : 'Buy fresh produce directly from local farmers';
        }
    }
    
    updateSubmitButtonText() {
        if (this.submitButton) {
            const roleText = this.currentRole === 'farmer' ? 'Farmer' : 'Buyer';
            this.submitButton.textContent = `Create ${roleText} Account`;
        }
    }
    
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            // Real-time validation on blur
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            // Clear errors on input
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
        
        // Password confirmation validation
        const confirmPassword = document.getElementById('confirmPassword');
        const password = document.getElementById('password');
        
        if (confirmPassword && password) {
            confirmPassword.addEventListener('input', () => {
                this.validatePasswordConfirmation();
            });
            
            password.addEventListener('input', () => {
                if (confirmPassword.value) {
                    this.validatePasswordConfirmation();
                }
            });
        }
    }
    
    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name;
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = this.getRequiredMessage(fieldName);
        }
        // Specific field validations
        else if (value) {
            switch (fieldName) {
                case 'firstName':
                case 'lastName':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = `${this.getFieldLabel(fieldName)} must be at least 2 characters`;
                    } else if (value.length > 50) {
                        isValid = false;
                        errorMessage = `${this.getFieldLabel(fieldName)} must be less than 50 characters`;
                    }
                    break;
                    
                case 'email':
                    if (!this.validationRules.email.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                    
                case 'phoneNumber':
                    if (!this.validationRules.phone.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number (e.g., +237123456789 or 123456789)';
                    }
                    break;
                    
                case 'password':
                    if (value.length < 8) {
                        isValid = false;
                        errorMessage = 'Password must be at least 8 characters';
                    } else if (!this.validationRules.password.test(value)) {
                        isValid = false;
                        errorMessage = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
                    }
                    break;
            }
        }
        
        this.setFieldError(input, isValid ? '' : errorMessage);
        return isValid;
    }
    
    validatePasswordConfirmation() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (!password || !confirmPassword) return true;
        
        const isValid = password.value === confirmPassword.value;
        const errorMessage = isValid ? '' : 'Passwords do not match';
        
        this.setFieldError(confirmPassword, errorMessage);
        return isValid;
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        // Validate password confirmation
        if (!this.validatePasswordConfirmation()) {
            isValid = false;
        }
        
        // Validate terms agreement
        const agreeToTerms = document.getElementById('agreeToTerms');
        if (agreeToTerms && !agreeToTerms.checked) {
            this.setFieldError(agreeToTerms, 'You must agree to the terms and conditions');
            isValid = false;
        }
        
        return isValid;
    }
    
    setFieldError(input, errorMessage) {
        const errorElement = document.getElementById(`${input.name}Error`);
        
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
        
        // Update input styling
        input.classList.toggle('error', !!errorMessage);
        input.classList.toggle('valid', !errorMessage && input.value.trim());
        
        // Animate error
        if (errorMessage) {
            const field = input.closest('.register-form__field');
            if (field) {
                field.classList.add('animate-error');
                setTimeout(() => field.classList.remove('animate-error'), 500);
            }
        }
    }
    
    clearFieldError(input) {
        const errorElement = document.getElementById(`${input.name}Error`);
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        input.classList.remove('error');
    }
    
    getFieldLabel(fieldName) {
        const labels = {
            firstName: 'First name',
            lastName: 'Last name',
            email: 'Email',
            phoneNumber: 'Phone number',
            password: 'Password',
            confirmPassword: 'Password confirmation'
        };
        
        return labels[fieldName] || fieldName;
    }
    
    getRequiredMessage(fieldName) {
        const label = this.getFieldLabel(fieldName);
        return `${label} is required`;
    }
    
    setupFormSubmission() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    }
    
    async handleSubmit() {
        if (this.isSubmitting) return;
        
        // Clear previous API errors
        this.hideApiError();
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        this.setSubmitting(true);
        
        try {
            const formData = this.getFormData();
            
            // Simulate API call (replace with actual API endpoint)
            await this.submitRegistration(formData);
            
            // Handle success
            this.handleSubmitSuccess();
            
        } catch (error) {
            console.error('Registration error:', error);
            this.handleSubmitError(error);
        } finally {
            this.setSubmitting(false);
        }
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
    
    async submitRegistration(data) {
        // Simulate API call - replace with actual endpoint
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/error based on email
                if (data.email === 'test@error.com') {
                    reject(new Error('Email already exists'));
                } else {
                    resolve({ success: true, message: 'Registration successful' });
                }
            }, 2000);
        });
    }
    
    handleSubmitSuccess() {
        this.submitButton.classList.add('success');
        this.submitButton.textContent = 'Account Created!';
        
        setTimeout(() => {
            // Redirect to success page or login
            const successMessage = `Registration successful! Please check your email for verification instructions.`;
            alert(successMessage);
            
            // Redirect to login page
            const loginPage = this.currentRole === 'farmer' ? 'loginfarmer.html' : 'loginbuyer.html';
            window.location.href = loginPage;
        }, 1500);
    }
    
    handleSubmitError(error) {
        const errorMessage = error.message || 'Registration failed. Please try again.';
        this.showApiError(errorMessage);
    }
    
    setSubmitting(isSubmitting) {
        this.isSubmitting = isSubmitting;
        
        if (this.submitButton) {
            this.submitButton.disabled = isSubmitting;
            this.submitButton.classList.toggle('loading', isSubmitting);
            
            if (isSubmitting) {
                this.submitButton.textContent = 'Creating Account...';
            } else {
                this.updateSubmitButtonText();
                this.submitButton.classList.remove('success');
            }
        }
        
        // Disable form during submission
        const form = document.querySelector('.register-form');
        if (form) {
            form.classList.toggle('loading', isSubmitting);
        }
    }
    
    showApiError(message) {
        if (this.apiError && this.apiErrorText) {
            this.apiErrorText.textContent = message;
            this.apiError.style.display = 'flex';
            
            // Scroll to error
            this.apiError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    hideApiError() {
        if (this.apiError) {
            this.apiError.style.display = 'none';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegisterForm();
});
