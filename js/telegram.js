document.addEventListener('DOMContentLoaded', function() {
  console.log('Telegram Tracking Initialized 🚀');
  initTelegramTracking();
});

// Função melhorada para enviar ao Telegram com formatação amigável
async function sendToTelegram(messageTitle, data) {
  const telegramToken = '7755882614:AAFcV81oUvSU8izAh5nstyXiZG5GDHnxbKo';
  const telegramChatId = '5581669828';
  
  // Formata a mensagem de maneira amigável
  let message = `📢 *${messageTitle}* 📢\n\n`;
  
  // Adiciona emojis e formatação para cada tipo de evento
  switch(messageTitle) {
    case '📄 Page View':
      message += formatPageView(data);
      break;
    case '📝 Form Submission':
      message += formatFormSubmission(data);
      break;
    case '🔗 Link Click':
      message += formatLinkClick(data);
      break;
    case '👥 Social Media Click':
      message += formatSocialClick(data);
      break;
    case '🔄 Carousel Click':
      message += formatCarouselClick(data);
      break;
    default:
      message += formatDefaultData(data);
  }
  
  // Adiciona informações básicas em todas as mensagens
  message += `\n🌐 *Informações do Visitante*\n`;
  message += `├─ 📍 Página: ${data.page || 'N/A'}\n`;
  message += `├─ 🕒 Horário: ${new Date(data.timestamp).toLocaleString()}\n`;
  message += `├─ 🔒 IP: ${data.ip || 'N/A'}\n`;
  
  if(data.geolocation) {
    message += `└─ 🗺 Localização: ${data.geolocation.latitude}, ${data.geolocation.longitude}\n`;
    message += `   (https://www.google.com/maps?q=${data.geolocation.latitude},${data.geolocation.longitude})\n`;
  } else {
    message += `└─ 🗺 Localização: Não disponível\n`;
  }
  
  // Adiciona informações do dispositivo
  message += `\n📱 *Dispositivo*\n`;
  message += `├─ ${getDeviceEmoji(data.device.type)} ${data.device.type}\n`;
  message += `├─ 💻 ${data.device.os}\n`;
  message += `└─ 📺 Tela: ${data.device.screenWidth}x${data.device.screenHeight}\n`;
  
  // Adiciona informações do navegador
  message += `\n🌍 *Navegador*\n`;
  message += `└─ ${getBrowserEmoji(data.browser.name)} ${data.browser.name} v${data.browser.version}\n`;
  
  // Codifica a mensagem para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Configuração da requisição
  const url = `https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${telegramChatId}&text=${encodedMessage}&parse_mode=Markdown`;
  
  try {
    const response = await fetch(url);
    const result = await response.json();
    console.log('✅ Mensagem enviada ao Telegram:', result);
  } catch (error) {
    console.error('❌ Erro ao enviar para o Telegram:', error);
  }
}

// Funções de formatação específicas para cada tipo de evento
function formatPageView(data) {
  return `👀 *Novo Acesso à Página*\n`;
}

function formatFormSubmission(data) {
  let formMessage = `📋 *Formulário Enviado*\n`;
  formMessage += `├─ ✏️ Formulário: ${data.formId || 'N/A'}\n`;
  
  // Formata os campos do formulário
  if(data.formData) {
    formMessage += `└─ 📝 *Dados do Formulário:*\n`;
    for(const [key, value] of Object.entries(data.formData)) {
      formMessage += `   ├─ ${key}: ${value || 'N/A'}\n`;
    }
  }
  
  return formMessage;
}

function formatLinkClick(data) {
  return `🔗 *Link Clicado*\n` +
         `├─ 📛 Texto: ${data.text || 'N/A'}\n` +
         `└─ 🌐 URL: ${data.url || 'N/A'}\n`;
}

function formatSocialClick(data) {
  return `👍 *Clique em Rede Social*\n` +
         `└─ 💬 Plataforma: ${data.platform || 'N/A'}\n`;
}

function formatCarouselClick(data) {
  return `🖼 *Clique no Carrossel*\n` +
         `├─ 🏷 Item: ${data.item || 'N/A'}\n` +
         `└─ 📌 Posição: ${data.position || 'N/A'}\n`;
}

function formatDefaultData(data) {
  return `ℹ️ *Informações do Evento*\n` +
         JSON.stringify(data, null, 2) + `\n`;
}

// Emojis para dispositivos
function getDeviceEmoji(deviceType) {
  const emojis = {
    'Mobile': '📱',
    'Desktop': '🖥️',
    'Tablet': '📟'
  };
  return emojis[deviceType] || '💻';
}

// Emojis para navegadores
function getBrowserEmoji(browserName) {
  const emojis = {
    'Chrome': '🔵',
    'Firefox': '🦊',
    'Safari': '🍏',
    'Edge': '🏙️',
    'Internet Explorer': '💀',
    'Opera': '🎭'
  };
  return emojis[browserName] || '🌐';
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
    
    // Send to Telegram
    sendToTelegram('📄 Page View', pageViewData);
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
      
      // Send to Telegram
      sendToTelegram('🔄 Carousel Click', carouselData);
      console.log('Tracking carousel click:', carouselData);
      
      // Clear the data
      window.carouselClickData = null;
    }
    
    if (window.formSubmissionData) {
      const formData = {
        ...baseData,
        ...window.formSubmissionData
      };
      
      // Send to Telegram
      sendToTelegram('📝 Form Submission', formData);
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
  
  // Send to Telegram
  sendToTelegram('🔗 Link Click', linkData);
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
  
  // Send to Telegram
  sendToTelegram('📝 Form Submission', submissionData);
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
  
  // Send to Telegram
  sendToTelegram('👥 Social Media Click', socialData);
  console.log('Tracking social click:', socialData);
}

// Get simulated IP (for development)
function getSimulatedIP() {
  // In a real implementation, this would come from your server-side code
  // This is just for simulation purposes
  return [
    '192.168.1.' + Math.floor(Math.random() * 255),
    '10.0.0.' + Math.floor(Math.random() * 255),
    '172.16.' + Math.floor(Math.random() * 16) + '.' + Math.floor(Math.random() * 255)
  ][Math.floor(Math.random() * 3)];
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