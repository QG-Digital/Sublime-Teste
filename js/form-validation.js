document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('supplierForm');
  const modal = document.getElementById('successModal');
  const closeModalBtn = document.querySelector('.close-modal');
  const closeSuccessBtn = document.getElementById('closeSuccessModal');
  
  if (!form) return;
  
  // Phone format validation
  function validatePhone(phone) {
    // Remove all non-digits
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check for valid formats: (43) 9634-9824 or (43) 9 9634-9824
    const format1 = /^\(\d{2}\)\s\d{4}-\d{4}$/; // (43) 9634-9824
    const format2 = /^\(\d{2}\)\s\d\s\d{4}-\d{4}$/; // (43) 9 9634-9824
    
    return format1.test(phone) || format2.test(phone);
  }
  
  // Email validation
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Format phone input as user types
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
      
      if (value.length >= 2) {
        if (value.length <= 10) {
          // Format as (XX) XXXX-XXXX
          value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
          // Format as (XX) X XXXX-XXXX for 11 digits
          value = value.replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2 $3-$4');
        }
      }
      
      e.target.value = value;
    });
  }
  
  // Real-time validation
  function validateField(field, validationFn, errorMessage) {
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (!value || !validationFn(value)) {
      formGroup.classList.add('error');
      errorElement.textContent = errorMessage;
      return false;
    } else {
      formGroup.classList.remove('error');
      errorElement.textContent = '';
      return true;
    }
  }
  
  // Add real-time validation listeners
  const nameInput = document.getElementById('name');
  const companyInput = document.getElementById('company');
  const emailInput = document.getElementById('email');
  const descriptionInput = document.getElementById('description');
  
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      validateField(nameInput, (value) => value.length >= 2, 'Nome deve ter pelo menos 2 caracteres');
    });
  }
  
  if (companyInput) {
    companyInput.addEventListener('blur', () => {
      validateField(companyInput, (value) => value.length >= 2, 'Nome da empresa deve ter pelo menos 2 caracteres');
    });
  }
  
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      validateField(phoneInput, validatePhone, 'Formato válido: (43) 9634-9824 ou (43) 9 9634-9824');
    });
  }
  
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      validateField(emailInput, validateEmail, 'Digite um e-mail válido');
    });
  }
  
  if (descriptionInput) {
    descriptionInput.addEventListener('blur', () => {
      validateField(descriptionInput, (value) => value.length >= 20, 'Descrição deve ter pelo menos 20 caracteres');
    });
  }
  
  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    
    if (nameInput) {
      isValid &= validateField(nameInput, (value) => value.length >= 2, 'Nome deve ter pelo menos 2 caracteres');
    }
    
    if (companyInput) {
      isValid &= validateField(companyInput, (value) => value.length >= 2, 'Nome da empresa deve ter pelo menos 2 caracteres');
    }
    
    if (phoneInput) {
      isValid &= validateField(phoneInput, validatePhone, 'Formato válido: (43) 9634-9824 ou (43) 9 9634-9824');
    }
    
    if (emailInput) {
      isValid &= validateField(emailInput, validateEmail, 'Digite um e-mail válido');
    }
    
    if (descriptionInput) {
      isValid &= validateField(descriptionInput, (value) => value.length >= 20, 'Descrição deve ter pelo menos 20 caracteres');
    }
    
    if (isValid) {
      // Prepare form data for Telegram
      const formData = {
        nome: nameInput.value.trim(),
        empresa: companyInput.value.trim(),
        telefone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        descricao: descriptionInput.value.trim()
      };
      
      // Send to Telegram via the global function
      if (window.setFormSubmissionData) {
        window.setFormSubmissionData({
          event: 'supplier_form_submission',
          formData: formData,
          page: getCurrentPage(),
          timestamp: new Date().toISOString()
        });
      }
      
      // Show success modal
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Reset form
        form.reset();
        
        // Remove any error states
        document.querySelectorAll('.form-group.error').forEach(group => {
          group.classList.remove('error');
        });
      }
    }
  });
  
  // Modal close handlers
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', closeModal);
  }
  
  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
  
  function closeModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
  
  // Escape key to close modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeModal();
    }
  });
});

function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split("/").pop();
  return page || 'index.html';
}