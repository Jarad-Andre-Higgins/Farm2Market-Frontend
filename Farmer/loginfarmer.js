document.addEventListener('DOMContentLoaded', function() {
  // Get form elements
  const form = document.getElementById('farmerLoginForm');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const togglePassword = document.querySelector('.toggle-password');
  const rememberMe = document.getElementById('rememberMe');
  
  // Error message elements
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  
  // Check if there are saved credentials
  const savedEmail = localStorage.getItem('farmerEmail');
  if (savedEmail) {
    email.value = savedEmail;
    rememberMe.checked = true;
  }
  
  // Toggle password visibility
  togglePassword.addEventListener('click', function() {
    if (password.type === 'password') {
      password.type = 'text';
      togglePassword.textContent = '👁️‍🗨️';
    } else {
      password.type = 'password';
      togglePassword.textContent = '👁️';
    }
  });
  
  // Add input event listeners for real-time validation
  email.addEventListener('input', validateEmail);
  password.addEventListener('input', validatePassword);
  
  // Form submission
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Validate all fields
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    // Check if all validations pass
    if (isEmailValid && isPasswordValid) {
      // Save email if remember me is checked
      if (rememberMe.checked) {
        localStorage.setItem('farmerEmail', email.value.trim());
      } else {
        localStorage.removeItem('farmerEmail');
      }
      
      // Create login data
      const loginData = {
        email: email.value.trim(),
        password: password.value,
        userType: 'Farmer'
      };
      
      // Here you would send this data to your backend API
      console.log('Login attempt with:', loginData);
      
      // For now, simulate successful login and redirect
      loginUser(loginData);
    }
  });
  
  // Validation functions
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
  
  function validatePassword() {
    const value = password.value;
    let isValid = true;
    
    if (value === '') {
      setError(password, passwordError, 'Password is required');
      isValid = false;
    } else if (value.length < 6) {
      setError(password, passwordError, 'Password must be at least 6 characters');
      isValid = false;
    } else {
      setSuccess(password, passwordError);
    }
    
    return isValid;
  }
  
  // Helper functions
  function setError(input, errorElement, message) {
    input.classList.add('invalid');
    errorElement.textContent = message;
  }
  
  function setSuccess(input, errorElement) {
    input.classList.remove('invalid');
    errorElement.textContent = '';
  }
  
  // Login user
  async function loginUser(loginData) {
    try {
      // For demo purposes, check specific credentials
      if (loginData.email === "farmer@agriport.com" && loginData.password === "farmer123") {
        // Store auth data in localStorage
        localStorage.setItem('authToken', 'fake-jwt-token-for-farmer-demo');
        localStorage.setItem('userType', 'Farmer');
        localStorage.setItem('userName', 'John Farmer');
        
        // Alert before redirect for debugging
        alert('Login successful! Redirecting to dashboard...');
        
        // Try redirect with absolute path
        window.location.href = window.location.origin + 
          window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + 
          '/farmer dashboard.html';
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid email or password. Please try again.');
    }
  }
});





