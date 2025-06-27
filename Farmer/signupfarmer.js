document.addEventListener('DOMContentLoaded', function() {
  // Get form elements
  const form = document.getElementById('farmerRegistrationForm');
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const phoneNumber = document.getElementById('phoneNumber');
  const email = document.getElementById('email');
  const location = document.getElementById('location');
  const productDescription = document.getElementById('productDescription');
  const senderName = document.getElementById('senderName');
  const receiptUpload = document.getElementById('receiptUpload');
  const receiptFileName = document.getElementById('receiptFileName');
  const idType = document.getElementById('idType');
  const idUpload = document.getElementById('idUpload');
  const idFileName = document.getElementById('idFileName');
  
  // Error message elements
  const firstNameError = document.getElementById('firstNameError');
  const lastNameError = document.getElementById('lastNameError');
  const phoneNumberError = document.getElementById('phoneNumberError');
  const emailError = document.getElementById('emailError');
  const locationError = document.getElementById('locationError');
  const productDescriptionError = document.getElementById('productDescriptionError');
  const senderNameError = document.getElementById('senderNameError');
  const receiptError = document.getElementById('receiptError');
  const idTypeError = document.getElementById('idTypeError');
  const idError = document.getElementById('idError');
  
  // Show file name when files are selected
  receiptUpload.addEventListener('change', function() {
    if (this.files.length > 0) {
      receiptFileName.textContent = this.files[0].name;
      validateReceipt();
    } else {
      receiptFileName.textContent = 'No file chosen';
    }
  });
  
  idUpload.addEventListener('change', function() {
    if (this.files.length > 0) {
      idFileName.textContent = this.files[0].name;
      validateId();
    } else {
      idFileName.textContent = 'No file chosen';
    }
  });
  
  // Add input event listeners for real-time validation
  firstName.addEventListener('input', validateFirstName);
  lastName.addEventListener('input', validateLastName);
  phoneNumber.addEventListener('input', validatePhoneNumber);
  email.addEventListener('input', validateEmail);
  location.addEventListener('input', validateLocation);
  productDescription.addEventListener('input', validateProductDescription);
  senderName.addEventListener('input', validateSenderName);
  idType.addEventListener('change', validateIdType);
  
  // Form submission
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Validate all fields
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isPhoneNumberValid = validatePhoneNumber();
    const isEmailValid = validateEmail();
    const isLocationValid = validateLocation();
    const isProductDescriptionValid = validateProductDescription();
    const isSenderNameValid = validateSenderName();
    const isReceiptValid = validateReceipt();
    const isIdTypeValid = validateIdType();
    const isIdValid = validateId();
    const isTermsValid = validateTerms();
    
    // Check if all validations pass
    if (isFirstNameValid && isLastNameValid && isPhoneNumberValid && 
        isEmailValid && isLocationValid && isProductDescriptionValid && 
        isSenderNameValid && isReceiptValid && isIdTypeValid && isIdValid && 
        isTermsValid) {
      
      // Create FormData object to handle file uploads
      const formData = new FormData();
      formData.append('firstName', firstName.value.trim());
      formData.append('lastName', lastName.value.trim());
      formData.append('phoneNumber', phoneNumber.value.trim());
      formData.append('email', email.value.trim());
      formData.append('location', location.value.trim());
      formData.append('productDescription', productDescription.value.trim());
      formData.append('senderName', senderName.value.trim());
      formData.append('receiptFile', receiptUpload.files[0]);
      formData.append('idType', idType.value);
      formData.append('idFile', idUpload.files[0]);
      formData.append('userType', 'Farmer'); // Set user type to Farmer
      
      // Here you would send the formData to your backend API
      console.log('Form submitted with data:', Object.fromEntries(formData));
      
      // For now, simulate successful registration and redirect
      submitRegistration(formData);
    } else {
      // If validation fails, scroll to the first error
      const firstError = document.querySelector('.error-message:not(:empty)');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
  
  // Validation functions
  function validateFirstName() {
    const value = firstName.value.trim();
    let isValid = true;
    
    if (value === '') {
      setError(firstName, firstNameError, 'First name is required');
      isValid = false;
    } else if (value.length < 2) {
      setError(firstName, firstNameError, 'First name must be at least 2 characters');
      isValid = false;
    } else {
      setSuccess(firstName, firstNameError);
    }
    
    return isValid;
  }
  
  function validateLastName() {
    const value = lastName.value.trim();
    let isValid = true;
    
    if (value === '') {
      setError(lastName, lastNameError, 'Last name is required');
      isValid = false;
    } else if (value.length < 2) {
      setError(lastName, lastNameError, 'Last name must be at least 2 characters');
      isValid = false;
    } else {
      setSuccess(lastName, lastNameError);
    }
    
    return isValid;
  }
  
  function validatePhoneNumber() {
    const value = phoneNumber.value.trim();
    let isValid = true;
    
    // Regex for Cameroon phone numbers (6 followed by 8 digits)
    const phoneRegex = /^(237\s?)?[6-9]\d{8}$/;
    
    if (value === '') {
      setError(phoneNumber, phoneNumberError, 'Phone number is required');
      isValid = false;
    } else if (!phoneRegex.test(value)) {
      setError(phoneNumber, phoneNumberError, 'Please enter a valid Cameroon phone number');
      isValid = false;
    } else {
      setSuccess(phoneNumber, phoneNumberError);
    }
    
    return isValid;
  }
  
  function validateEmail() {
    const value = email.value.trim();
    let isValid = true;
    
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value === '') {
      setError(email, emailError, 'Email is required');
      isValid = false;
    } else if (!emailRegex.test(value)) {
      setError(email, emailError, 'Please enter a valid email address');
      isValid = false;
    } else {
      setSuccess(email, emailError);
    }
    
    return isValid;
  }
  
  function validateLocation() {
    const value = location.value.trim();
    let isValid = true;
    
    if (value === '') {
      setError(location, locationError, 'Location is required');
      isValid = false;
    } else if (value.length < 3) {
      setError(location, locationError, 'Please enter a valid location');
      isValid = false;
    } else {
      setSuccess(location, locationError);
    }
    
    return isValid;
  }
  
  function validateProductDescription() {
    const value = productDescription.value.trim();
    let isValid = true;
    
    if (value === '') {
      setError(productDescription, productDescriptionError, 'Product description is required');
      isValid = false;
    } else if (value.length < 10) {
      setError(productDescription, productDescriptionError, 'Please provide more details about your products');
      isValid = false;
    } else {
      setSuccess(productDescription, productDescriptionError);
    }
    
    return isValid;
  }
  
  function validateSenderName() {
    const value = senderName.value.trim();
    let isValid = true;
    
    if (value === '') {
      setError(senderName, senderNameError, 'Sender name is required');
      isValid = false;
    } else if (value.length < 3) {
      setError(senderName, senderNameError, 'Please enter the full sender name');
      isValid = false;
    } else {
      setSuccess(senderName, senderNameError);
    }
    
    return isValid;
  }
  
  function validateReceipt() {
    let isValid = true;
    
    if (!receiptUpload.files || receiptUpload.files.length === 0) {
      setError(receiptUpload.parentElement, receiptError, 'Payment receipt is required');
      isValid = false;
    } else {
      const file = receiptUpload.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError(receiptUpload.parentElement, receiptError, 'File size must be less than 5MB');
        isValid = false;
      } else if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError(receiptUpload.parentElement, receiptError, 'Only JPG, JPEG, or PNG files are allowed');
        isValid = false;
      } else {
        setSuccess(receiptUpload.parentElement, receiptError);
      }
    }
    
    return isValid;
  }
  
  function validateIdType() {
    const value = idType.value;
    let isValid = true;
    
    if (value === '') {
      setError(idType, idTypeError, 'Please select an ID type');
      isValid = false;
    } else {
      setSuccess(idType, idTypeError);
    }
    
    return isValid;
  }
  
  function validateId() {
    let isValid = true;
    
    if (!idUpload.files || idUpload.files.length === 0) {
      setError(idUpload.parentElement, idError, 'ID photo is required');
      isValid = false;
    } else {
      const file = idUpload.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError(idUpload.parentElement, idError, 'File size must be less than 5MB');
        isValid = false;
      } else if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError(idUpload.parentElement, idError, 'Only JPG, JPEG, or PNG files are allowed');
        isValid = false;
      } else {
        setSuccess(idUpload.parentElement, idError);
      }
    }
    
    return isValid;
  }
  
  function validateTerms() {
    const termsCheckbox = document.getElementById('termsAgreement');
    let isValid = true;
    
    if (!termsCheckbox.checked) {
      setError(termsCheckbox, termsError, 'You must agree to the Terms of Service and Privacy Policy');
      isValid = false;
    } else {
      setSuccess(termsCheckbox, termsError);
    }
    
    return isValid;
  }
  
  // Helper functions
  function setError(input, errorElement, message) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    errorElement.textContent = message;
  }
  
  function setSuccess(input, errorElement) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    errorElement.textContent = '';
  }
  
  // Submit registration to backend
  async function submitRegistration(formData) {
    try {
      // In a real implementation, you would send this to your backend
      // const response = await fetch('/api/auth/register/farmer', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // if (!response.ok) {
      //   throw new Error('Registration failed');
      // }
      
      // const data = await response.json();
      
      // Simulate successful registration
      setTimeout(() => {
        // Show success message
        form.innerHTML = `
          <div class="success-message">
            <h2>Registration Submitted Successfully!</h2>
            <p>Thank you for registering with Farm2Market.</p>
            <p>Your application is now pending admin approval. We will review your information and send your login credentials to your email once approved.</p>
            <p>This usually takes 1-2 business days.</p>
            <a href="loginfarmer.html" class="btn">Return to Login</a>
          </div>
        `;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('There was a problem submitting your registration. Please try again later.');
    }
  }
});
