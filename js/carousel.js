document.addEventListener('DOMContentLoaded', function() {
  // Initialize the carousel
  initCarousel();
  
  // Track carousel interactions
  trackCarouselInteractions();
});

function initCarousel() {
  const carousel = document.querySelector('.carousel');
  const carouselItems = document.querySelectorAll('.carousel-item');
  const prevButton = document.querySelector('.carousel-control.prev');
  const nextButton = document.querySelector('.carousel-control.next');
  
  if (!carousel || !prevButton || !nextButton) return;
  
  let currentIndex = 0;
  let itemWidth = 0;
  let totalItems = carouselItems.length;
  let visibleItems = 1;
  
  // Determine how many items are visible based on screen size
  function updateVisibleItems() {
    if (window.innerWidth >= 992) {
      visibleItems = 5;
    } else if (window.innerWidth >= 768) {
      visibleItems = 3;
    } else {
      visibleItems = 1;
    }
    
    // Update item width based on visible items
    if (visibleItems > 1) {
      carouselItems.forEach(item => {
        item.style.minWidth = `${100 / visibleItems}%`;
      });
    } else {
      carouselItems.forEach(item => {
        item.style.minWidth = '100%';
      });
    }
    
    // Recalculate carousel position
    updateCarouselPosition();
  }
  
  // Update carousel position
  function updateCarouselPosition() {
    if (visibleItems === 1) {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    } else {
      // Grid layout doesn't need transform
      carousel.style.transform = 'none';
    }
  }
  
  // Move to the next slide
  function nextSlide() {
    if (visibleItems === 1) {
      if (currentIndex < totalItems - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateCarouselPosition();
    } else {
      // For grid layout, just update the visible items
      rotateGridItems('next');
    }
  }
  
  // Move to the previous slide
  function prevSlide() {
    if (visibleItems === 1) {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = totalItems - 1;
      }
      updateCarouselPosition();
    } else {
      // For grid layout, just update the visible items
      rotateGridItems('prev');
    }
  }
  
  // Rotate grid items
  function rotateGridItems(direction) {
    if (direction === 'next') {
      const firstItem = carouselItems[0];
      carousel.appendChild(firstItem.cloneNode(true));
      carousel.removeChild(firstItem);
    } else {
      const lastItem = carouselItems[totalItems - 1];
      carousel.insertBefore(lastItem.cloneNode(true), carousel.firstChild);
      carousel.removeChild(lastItem);
    }
    
    // Update event listeners for the new items
    attachItemClickListeners();
  }
  
  // Attach click listeners to carousel items
  function attachItemClickListeners() {
    document.querySelectorAll('.carousel-item').forEach(item => {
      item.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        if (url) {
          // Log carousel item click (will be sent by telegram.js)
          window.carouselClickData = {
            event: 'carousel_click',
            platform: this.querySelector('h3').textContent,
            url: url,
            page: getCurrentPage(),
            timestamp: new Date().toISOString()
          };
          
          // Open the URL
          window.open(url, '_blank');
        }
      });
    });
  }
  
  // Get current page name
  function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    return page || 'index.html';
  }
  
  // Add event listeners
  nextButton.addEventListener('click', nextSlide);
  prevButton.addEventListener('click', prevSlide);
  
  // Attach initial click listeners
  attachItemClickListeners();
  
  // Initialize carousel on load
  updateVisibleItems();
  
  // Update on window resize
  window.addEventListener('resize', updateVisibleItems);
  
  // Auto-rotation for carousel
  let autoRotation = setInterval(nextSlide, 5000);
  
  // Pause auto-rotation on hover
  carousel.addEventListener('mouseenter', () => {
    clearInterval(autoRotation);
  });
  
  // Resume auto-rotation when mouse leaves
  carousel.addEventListener('mouseleave', () => {
    autoRotation = setInterval(nextSlide, 5000);
  });
}

function trackCarouselInteractions() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  
  const prevButton = document.querySelector('.carousel-control.prev');
  const nextButton = document.querySelector('.carousel-control.next');
  
  if (prevButton) {
    prevButton.addEventListener('click', function() {
      // Log carousel navigation (will be sent by telegram.js)
      window.carouselNavData = {
        event: 'carousel_navigation',
        direction: 'prev',
        page: getCurrentPage(),
        timestamp: new Date().toISOString()
      };
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      // Log carousel navigation (will be sent by telegram.js)
      window.carouselNavData = {
        event: 'carousel_navigation',
        direction: 'next',
        page: getCurrentPage(),
        timestamp: new Date().toISOString()
      };
    });
  }
  
  // Get current page name
  function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    return page || 'index.html';
  }
}