// Configuração do Telegram
const TELEGRAM_CONFIG = {
  // Bot para formulários (fornecedores)
  BOT_TOKEN: '7755882614:AAFcV81oUvSU8izAh5nstyXiZG5GDHnxbKo',
  CHAT_ID: '5581669828',
  
  // Bot opcional para tracking de páginas (descomente para usar)
  // TRACKING_BOT_TOKEN: 'SEU_SEGUNDO_TOKEN_AQUI',
  // TRACKING_CHAT_ID: 'SEU_CHAT_ID_TRACKING_AQUI'
};

// Variável global para armazenar dados pendentes
let pendingFormData = null;

document.addEventListener('DOMContentLoaded', function() {
  console.log('Telegram Integration Initialized 🚀');
  
  // Opcional: Enviar notificação de acesso à página
  // trackPageAccess();
});

// Função para definir dados do formulário (chamada pelo form-validation.js)
window.setFormSubmissionData = function(data) {
  pendingFormData = data;
  
  // Enviar imediatamente se for submissão de formulário
  if (data.event === 'supplier_form_submission') {
    sendFormToTelegram(data.formData);
  } else {
    // Para outros eventos, envia após um pequeno delay
    setTimeout(() => {
      if (pendingFormData === data) {
        sendEventToTelegram(data);
        pendingFormData = null;
      }
    }, 300);
  }
};

// Enviar dados do formulário de fornecedor para o Telegram
async function sendFormToTelegram(formData) {
  const message = formatSupplierFormMessage(formData);
  
  try {
    await sendTelegramMessage(TELEGRAM_CONFIG.BOT_TOKEN, TELEGRAM_CONFIG.CHAT_ID, message);
    console.log('✅ Formulário enviado ao Telegram com sucesso');
  } catch (error) {
    console.error('❌ Erro ao enviar formulário para o Telegram:', error);
  }
}

// Enviar eventos gerais para o Telegram (opcional)
async function sendEventToTelegram(eventData) {
  // Descomente as linhas abaixo se quiser usar um bot separado para tracking
  /*
  if (TELEGRAM_CONFIG.TRACKING_BOT_TOKEN && TELEGRAM_CONFIG.TRACKING_CHAT_ID) {
    const message = formatEventMessage(eventData);
    
    try {
      await sendTelegramMessage(TELEGRAM_CONFIG.TRACKING_BOT_TOKEN, TELEGRAM_CONFIG.TRACKING_CHAT_ID, message);
      console.log('✅ Evento enviado ao Telegram:', eventData.event);
    } catch (error) {
      console.error('❌ Erro ao enviar evento para o Telegram:', error);
    }
  }
  */
}

// Função para enviar notificação de acesso à página (opcional)
async function trackPageAccess() {
  // Descomente se quiser rastrear acessos às páginas
  /*
  if (TELEGRAM_CONFIG.TRACKING_BOT_TOKEN && TELEGRAM_CONFIG.TRACKING_CHAT_ID) {
    const currentPage = getCurrentPage();
    const accessData = {
      event: 'page_access',
      page: currentPage,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'Acesso direto'
    };
    
    const message = formatPageAccessMessage(accessData);
    
    try {
      await sendTelegramMessage(TELEGRAM_CONFIG.TRACKING_BOT_TOKEN, TELEGRAM_CONFIG.TRACKING_CHAT_ID, message);
      console.log('✅ Acesso à página rastreado');
    } catch (error) {
      console.error('❌ Erro ao rastrear acesso:', error);
    }
  }
  */
}

// Formatar mensagem do formulário de fornecedor
function formatSupplierFormMessage(formData) {
  let message = '🏢 *NOVA PROPOSTA DE FORNECEDOR* 🏢\n\n';
  
  message += `👤 *Nome:* ${formData.nome}\n`;
  message += `🏪 *Empresa:* ${formData.empresa}\n`;
  message += `📞 *Telefone:* ${formData.telefone}\n`;
  message += `📧 *E-mail:* ${formData.email}\n\n`;
  message += `📝 *Descrição da Empresa:*\n${formData.descricao}\n\n`;
  
  message += `⏰ *Data/Hora:* ${new Date().toLocaleString('pt-BR')}\n`;
  message += `🌐 *Página:* Seja um Fornecedor`;
  
  return message;
}

// Formatar mensagem de evento geral
function formatEventMessage(eventData) {
  let message = `📊 *EVENTO DO SITE* 📊\n\n`;
  
  switch(eventData.event) {
    case 'social_click':
      message += `👥 *Clique em Rede Social*\n`;
      message += `├─ 🔗 Plataforma: ${eventData.platform}\n`;
      break;
    
    case 'external_link_click':
      message += `🔗 *Clique em Link Externo*\n`;
      message += `├─ 📛 Texto: ${eventData.text}\n`;
      message += `├─ 🌐 URL: ${eventData.url}\n`;
      break;
    
    default:
      message += `ℹ️ *Evento: ${eventData.event}*\n`;
      message += `├─ 📋 Dados: ${JSON.stringify(eventData, null, 2)}\n`;
  }
  
  message += `├─ 📍 Página: ${eventData.page}\n`;
  message += `└─ 🕒 Horário: ${new Date(eventData.timestamp).toLocaleString('pt-BR')}`;
  
  return message;
}

// Formatar mensagem de acesso à página
function formatPageAccessMessage(accessData) {
  let message = `👀 *NOVO ACESSO AO SITE* 👀\n\n`;
  
  message += `📍 *Página:* ${accessData.page}\n`;
  message += `🕒 *Horário:* ${new Date(accessData.timestamp).toLocaleString('pt-BR')}\n`;
  message += `🔗 *Origem:* ${accessData.referrer}\n`;
  message += `💻 *Dispositivo:* ${getDeviceType()}\n`;
  message += `🌐 *Navegador:* ${getBrowserName()}`;
  
  return message;
}

// Enviar mensagem para o Telegram
async function sendTelegramMessage(botToken, chatId, message) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }
  
  return await response.json();
}

// Funções auxiliares
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split("/").pop();
  return page || 'index.html';
}

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'Tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

function getBrowserName() {
  const ua = navigator.userAgent;
  
  if (ua.indexOf("Firefox") > -1) return "Firefox";
  if (ua.indexOf("Chrome") > -1) return "Chrome";
  if (ua.indexOf("Safari") > -1) return "Safari";
  if (ua.indexOf("Edge") > -1) return "Edge";
  if (ua.indexOf("Opera") > -1) return "Opera";
  
  return "Desconhecido";
}