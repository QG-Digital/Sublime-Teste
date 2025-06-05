// Telegram tracking functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Telegram tracking
  initTelegramTracking();
});

// Simulated IP address (in a real implementation, this would be server-side)
function getSimulatedIP() {
  // This is just a placeholder. In a real scenario, the IP would be determined server-side
  return '192.168.1.' + Math.floor(Math.random() * 255);
}

// Get geolocation information
function getGeolocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const geolocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        callback(geolocation);
      },
      () => {
        // Error or permission denied
        callback(null);
      }
    );
  } else {
    callback(null);
  }
}

// Initialize Telegram tracking
function initTelegramTracking() {
  // Replace with your actual Telegram bot token and chat ID
  const telegramToken = '7755882614:AAFcV81oUvSU8izAh5nstyXiZG5GDHnxbKo';
  const telegramChatId = '5581669828';
  
  // Simulate user IP (in production this would be server-side)
  const userIP = getSimulatedIP();
  
  // Get user agent and other browser information
  const userAgent = navigator.userAgent;
  const browser = getBrowserInfo();
  const device = getDeviceInfo();
  
  // Get current page
  const currentPage = getCurrentPage();
  
  // Get current timestamp
  const timestamp = new Date().toISOString();
  
  // Base tracking data
  const baseTrackingData = {
    ip: userIP,
    userAgent: userAgent,
    browser: browser,
    device: device,
    timestamp: timestamp
  };
  
  // Track page view
  trackPageView(currentPage, baseTrackingData);
  
  // Set up event listeners for tracking other interactions
  setupInteractionTracking(baseTrackingData);
}

// Track page view
function trackPageView(page, baseData) {
  const pageViewData = {
    ...baseData,
    event: 'page_view',
    page: page
  };
  
  // Get geolocation if available
  getGeolocation((geolocation) => {
    if (geolocation) {
      pageViewData.geolocation = geolocation;
    }
    
    // Send to Telegram (commented out in this simulation)
    // sendToTelegram('📄 Page View', pageViewData);
    
    // In real implementation, this would send data to your Telegram bot
    console.log('Tracking page view:', pageViewData);
  });
}

// Set up tracking for other interactions
function setupInteractionTracking(baseData) {
  // Track link clicks
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href) {
      trackLinkClick(link, baseData);
    }
  });
  
  // Track form submissions
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.id === 'partnerForm') {
      trackFormSubmission(form, baseData);
    }
  });
  
  // Track social media clicks
  const socialIcons = document.querySelectorAll('.social-icon');
  socialIcons.forEach(icon => {
    icon.addEventListener('click', function() {
      trackSocialClick(this, baseData);
    });
  });
  
  // Check for carousel data in window object (set by carousel.js)
  setInterval(() => {
    if (window.carouselClickData) {
      const carouselData = {
        ...baseData,
        ...window.carouselClickData
      };
      
      // Send to Telegram (commented out in this simulation)
      // sendToTelegram('🔄 Carousel Click', carouselData);
      
      console.log('Tracking carousel click:', carouselData);
      
      // Clear the data
      window.carouselClickData = null;
    }
    
    if (window.formSubmissionData) {
      const formData = {
        ...baseData,
        ...window.formSubmissionData
      };
      
      // Send to Telegram (commented out in this simulation)
      // sendToTelegram('📝 Form Submission', formData);
      
      console.log('Tracking form submission:', formData);
      
      // Clear the data
      window.formSubmissionData = null;
    }
  }, 500);
}

// Track link click
function trackLinkClick(link, baseData) {
  const linkData = {
    ...baseData,
    event: 'link_click',
    url: link.href,
    text: link.textContent || link.innerText,
    page: getCurrentPage()
  };
  
  // Send to Telegram (commented out in this simulation)
  // sendToTelegram('🔗 Link Click', linkData);
  
  console.log('Tracking link click:', linkData);
}

// Track form submission
function trackFormSubmission(form, baseData) {
  // Collect form data
  const formData = new FormData(form);
  const formValues = {};
  
  formData.forEach((value, key) => {
    formValues[key] = value;
  });
  
  const submissionData = {
    ...baseData,
    event: 'form_submission',
    formId: form.id,
    formData: formValues,
    page: getCurrentPage()
  };
  
  // Send to Telegram (commented out in this simulation)
  // sendToTelegram('📝 Form Submission', submissionData);
  
  console.log('Tracking form submission:', submissionData);
}

// Track social media click
function trackSocialClick(icon, baseData) {
  const platform = icon.getAttribute('data-platform');
  
  const socialData = {
    ...baseData,
    event: 'social_click',
    platform: platform,
    page: getCurrentPage()
  };
  
  // Send to Telegram (commented out in this simulation)
  // sendToTelegram('👥 Social Media Click', socialData);
  
  console.log('Tracking social click:', socialData);
}

// Send data to Telegram (this is a simulation)
function sendToTelegram(messageTitle, data) {
  // In a real implementation, this would make an AJAX request to a server endpoint
  // that would then forward the message to Telegram
  
  // Format message
  const message = `
${messageTitle}
-----------------
Page: ${data.page}
IP: ${data.ip}
Time: ${new Date(data.timestamp).toLocaleString()}
${data.geolocation ? `Location: ${data.geolocation.latitude}, ${data.geolocation.longitude}` : ''}

${JSON.stringify(data, null, 2)}
  `;
  
  // In real implementation, this would send the message to Telegram
  console.log('Would send to Telegram:', message);
}

// Get current page name
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split("/").pop();
  return page || 'index.html';
}

// Get browser information
function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browserName;
  let browserVersion;
  
  if (ua.indexOf("Firefox") > -1) {
    browserName = "Firefox";
    browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)[1];
  } else if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edge") === -1 && ua.indexOf("Edg") === -1) {
    browserName = "Chrome";
    browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)[1];
  } else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) {
    browserName = "Safari";
    browserVersion = ua.match(/Version\/(\d+\.\d+)/)[1];
  } else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) {
    browserName = "Edge";
    if (ua.indexOf("Edge") > -1) {
      browserVersion = ua.match(/Edge\/(\d+\.\d+)/)[1];
    } else {
      browserVersion = ua.match(/Edg\/(\d+\.\d+)/)[1];
    }
  } else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) {
    browserName = "Internet Explorer";
    if (ua.indexOf("MSIE") > -1) {
      browserVersion = ua.match(/MSIE (\d+\.\d+)/)[1];
    } else {
      browserVersion = "11.0";
    }
  } else {
    browserName = "Unknown";
    browserVersion = "Unknown";
  }
  
  return {
    name: browserName,
    version: browserVersion
  };
}

// Get device information
function getDeviceInfo() {
  const ua = navigator.userAgent;
  
  // Detect mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  
  // Detect OS
  let os;
  if (/Windows/i.test(ua)) {
    os = "Windows";
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = "macOS";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  } else if (/Android/i.test(ua)) {
    os = "Android";
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = "iOS";
  } else {
    os = "Unknown";
  }
  
  return {
    type: isMobile ? "Mobile" : "Desktop",
    os: os,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height
  };
}