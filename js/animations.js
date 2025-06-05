document.addEventListener('DOMContentLoaded', function() {
  // Initialize animation observers
  initScrollAnimations();
  
  // Initialize delayed animations
  initDelayedAnimations();
  
  // Initialize counter animations
  initCounterAnimations();
});

// Initialize scroll-based animations
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up');
  
  // Create the observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If element is in view
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        // Unobserve after animation starts
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Observe all elements
  animateElements.forEach(element => {
    element.style.animationPlayState = 'paused';
    observer.observe(element);
  });
}

// Initialize animations with delays
function initDelayedAnimations() {
  const delayedElements = document.querySelectorAll('[data-delay]');
  
  delayedElements.forEach(element => {
    const delay = element.getAttribute('data-delay');
    element.style.animationDelay = `${delay}ms`;
  });
}

// Initialize counter animations
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = duration / frameDuration;
        const increment = target / totalFrames;
        
        const updateCount = () => {
          count += increment;
          if (count < target) {
            counter.textContent = Math.ceil(count);
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCount();
        observer.unobserve(counter);
      }
    });
  }, {
    threshold: 0.5
  });
  
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// Add floating animation to specific elements
function addFloatingAnimation() {
  const elements = document.querySelectorAll('.float-element');
  
  elements.forEach(element => {
    element.classList.add('float');
  });
}

// Add parallax effect to hero section
function initParallax() {
  const heroImage = document.querySelector('.hero-image');
  
  if (!heroImage) return;
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    heroImage.style.transform = `translateY(${scrollPosition * 0.1}px)`;
  });
}

// Add hover effects
function initHoverEffects() {
  const hoverElements = document.querySelectorAll('.hover-effect');
  
  hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.classList.add('active');
    });
    
    element.addEventListener('mouseleave', () => {
      element.classList.remove('active');
    });
  });
}

// Add typing animation
function initTypingAnimation() {
  const typingElements = document.querySelectorAll('.typing-text');
  
  typingElements.forEach(element => {
    const text = element.textContent;
    element.textContent = '';
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
  });
}

// Initialize reveal animations for sections
function initRevealAnimations() {
  const sections = document.querySelectorAll('section');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  sections.forEach(section => {
    section.classList.add('reveal-section');
    revealObserver.observe(section);
  });
}