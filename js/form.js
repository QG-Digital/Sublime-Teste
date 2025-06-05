document.addEventListener('DOMContentLoaded', function() {
  // Initialize the partner form
  initPartnerForm();
  
  // Initialize modals
  initModals();
});

function initPartnerForm() {
  const form = document.getElementById('partnerForm');
  if (!form) return;
  
  const addContactBtn = document.getElementById('addContact');
  const contactInputs = document.getElementById('contactInputs');
  const contactCounter = document.querySelector('.contact-counter');
  
  let contactCount = 1;
  const maxContacts = 3;
  
  // Update contact counter
  function updateContactCounter() {
    if (contactCounter) {
      contactCounter.textContent = `${contactCount}/${maxContacts} contatos adicionados`;
    }
    
    // Disable add button if max reached
    if (addContactBtn) {
      addContactBtn.disabled = contactCount >= maxContacts;
    }
  }
  
  // Add new contact input
  function addContactInput() {
    if (contactCount >= maxContacts) return;
    
    const newInput = document.createElement('div');
    newInput.className = 'contact-input';
    newInput.innerHTML = `
      <select class="contact-type">
        <option value="phone">Telefone</option>
        <option value="email">E-mail</option>
      </select>
      <input type="text" class="contact-value" name="contact[]" required>
      <button type="button" class="remove-contact">
        <i class="fa-solid fa-minus"></i>
      </button>
    `;
    
    contactInputs.appendChild(newInput);
    contactCount++;
    updateContactCounter();
    
    // Add event listener to remove button
    const removeBtn = newInput.querySelector('.remove-contact');
    removeBtn.addEventListener('click', function() {
      contactInputs.removeChild(newInput);
      contactCount--;
      updateContactCounter();
    });
  }
  
  // Form validation
  function validateForm() {
    let isValid = true;
    
    // Validate name
    const nameInput = form.querySelector('#name');
    if (nameInput && nameInput.value.trim() === '') {
      isValid = false;
      highlightInvalidField(nameInput);
    }
    
    // Validate contacts
    const contactInputs = form.querySelectorAll('.contact-value');
    contactInputs.forEach(input => {
      if (input.value.trim() === '') {
        isValid = false;
        highlightInvalidField(input);
      }
    });
    
    // Validate observation
    const observationInput = form.querySelector('#observation');
    if (observationInput && observationInput.value.trim() === '') {
      isValid = false;
      highlightInvalidField(observationInput);
    }
    
    return isValid;
  }
  
  // Highlight invalid field
  function highlightInvalidField(field) {
    field.classList.add('invalid');
    
    field.addEventListener('input', function() {
      if (field.value.trim() !== '') {
        field.classList.remove('invalid');
      }
    });
  }
  
  // Form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      // Collect form data
      const formData = new FormData(form);
      const formDataObj = {};
      
      formData.forEach((value, key) => {
        if (key.endsWith('[]')) {
          const k = key.slice(0, -2);
          if (!formDataObj[k]) {
            formDataObj[k] = [];
          }
          formDataObj[k].push(value);
        } else {
          formDataObj[key] = value;
        }
      });
      
      // Get contact types
      const contactTypes = Array.from(form.querySelectorAll('.contact-type')).map(select => select.value);
      
      // Combine contact types with contact values
      if (formDataObj.contact && Array.isArray(formDataObj.contact)) {
        formDataObj.contacts = formDataObj.contact.map((value, index) => ({
          type: contactTypes[index] || 'phone',
          value: value
        }));
        delete formDataObj.contact;
      }
      
      // Add timestamp
      formDataObj.timestamp = new Date().toISOString();
      
      // Log form submission (will be sent by telegram.js)
      window.formSubmissionData = {
        event: 'form_submission',
        formType: 'partner',
        data: formDataObj,
        page: getCurrentPage(),
        timestamp: new Date().toISOString()
      };
      
      // Show success modal
      const successModal = document.getElementById('formSuccess');
      if (successModal) {
        successModal.style.display = 'flex';
      }
      
      // Reset form
      form.reset();
      
      // Reset contact inputs (keep only the first one)
      while (contactCount > 1) {
        contactInputs.removeChild(contactInputs.lastChild);
        contactCount--;
      }
      
      updateContactCounter();
    });
  }
  
  // Add contact button event listener
  if (addContactBtn) {
    addContactBtn.addEventListener('click', addContactInput);
  }
  
  // Initialize contact counter
  updateContactCounter();
  
  // Get current page name
  function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    return page || 'index.html';
  }
}

function initModals() {
  // Get modal elements
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-modal');
  const closeModalButtons = document.querySelectorAll('#closeModal');
  
  // Close modal when clicking on close button
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // Close modal when clicking on "Fechar" button
  closeModalButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // Close modal when clicking outside of modal content
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
      }
    });
  });
  
  // Close modal when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        modal.style.display = 'none';
      });
    }
  });
}