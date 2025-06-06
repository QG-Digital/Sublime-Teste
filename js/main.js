document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-mobile');
  const menu = document.querySelector('.menu');
  
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function() {
      menu.classList.toggle('active');
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (menu && menu.classList.contains('active') && 
        !menu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      menu.classList.remove('active');
    }
  });
  
  // FAQ accordion functionality
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle the clicked item
      item.classList.toggle('active');
    });
  });
  
  // Animate stats counter
  if (typeof animateCounters === 'function') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      observer.observe(statsSection);
    }
  } else {
    animateCounters();
  }
  
  // Header scroll effect
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
      header.style.padding = '8px 0';
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    } else {
      header.style.padding = '16px 0';
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }
    
    lastScrollY = currentScrollY;
  });
});

// Counter animation
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  });
}

// Smooth scroll for anchor links
document.addEventListener('click', function(e) {
  const target = e.target.closest('a[href^="#"]');
  if (target) {
    e.preventDefault();
    const targetId = target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

// Get current page name for tracking
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split("/").pop();
  return page || 'index.html';
}

// Track social media clicks
document.addEventListener('click', function(e) {
  const target = e.target.closest('.social-icon');
  
  if (target) {
    const platform = target.getAttribute('data-platform');
    
    // Set data for telegram tracking
    if (window.setFormSubmissionData) {
      window.setFormSubmissionData({
        event: 'social_click',
        platform: platform,
        page: getCurrentPage(),
        timestamp: new Date().toISOString()
      });
    }
  }
});

// Track external link clicks
document.addEventListener('click', function(e) {
  const target = e.target.closest('a[href^="http"]');
  
  if (target && target.hostname !== window.location.hostname) {
    const linkUrl = target.href;
    const linkText = target.textContent || target.innerText;
    
    // Set data for telegram tracking
    if (window.setFormSubmissionData) {
      window.setFormSubmissionData({
        event: 'external_link_click',
        url: linkUrl,
        text: linkText.trim(),
        page: getCurrentPage(),
        timestamp: new Date().toISOString()
      });
    }
  }
});