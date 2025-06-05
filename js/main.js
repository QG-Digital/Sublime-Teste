document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-mobile');
  const menu = document.querySelector('.menu');
  
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function() {
      menu.classList.toggle('active');
    });
  }
  
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
  animateCounters();
  
  // Track page view
  trackPageView();
});

// Counter animation
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  const speed = 200;
  
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = Math.ceil(target / speed);
    
    if (count < target) {
      counter.innerText = count + increment;
      setTimeout(() => animateCounters(), 1);
    } else {
      counter.innerText = target;
    }
  });
}

// Scroll animation
window.addEventListener('scroll', function() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  animatedElements.forEach(element => {
    const position = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (position < screenPosition) {
      element.classList.add('in-view');
    }
  });
});

// Header scroll effect
window.addEventListener('scroll', function() {
  const header = document.getElementById('header');
  
  if (window.scrollY > 50) {
    header.style.padding = '10px 0';
    header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.padding = '16px 0';
    header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
  }
});

// Get current page name
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split("/").pop();
  return page || 'index.html';
}

// Track page view
function trackPageView() {
  const currentPage = getCurrentPage();
  const userIP = '{{USER_IP}}'; // This will be replaced by real IP in telegram.js
  const userAgent = navigator.userAgent;
  const timestamp = new Date().toISOString();
  
  // Log page view data (will be sent by telegram.js)
  window.pageViewData = {
    event: 'page_view',
    page: currentPage,
    ip: userIP,
    userAgent: userAgent,
    timestamp: timestamp
  };
}

// Track outbound link clicks
document.addEventListener('click', function(e) {
  const target = e.target.closest('a');
  
  if (target && target.href && target.hostname !== window.location.hostname) {
    const linkUrl = target.href;
    const linkText = target.textContent || target.innerText;
    
    // Log outbound link data (will be sent by telegram.js)
    window.clickData = {
      event: 'outbound_link',
      link: linkUrl,
      text: linkText,
      page: getCurrentPage(),
      timestamp: new Date().toISOString()
    };
  }
});

// Handle social media clicks
document.addEventListener('click', function(e) {
  const target = e.target.closest('.social-icon');
  
  if (target) {
    const platform = target.getAttribute('data-platform');
    
    // Log social media click data (will be sent by telegram.js)
    window.socialClickData = {
      event: 'social_click',
      platform: platform,
      page: getCurrentPage(),
      timestamp: new Date().toISOString()
    };
  }
});