// Configuração do Telegram apenas para formulário de fornecedor
const TELEGRAM_CONFIG = {
  BOT_TOKEN: '7755882614:AAFcV81oUvSU8izAh5nstyXiZG5GDHnxbKo',
  CHAT_ID: '5581669828'
};

// Função para enviar dados do formulário para o Telegram
window.setFormSubmissionData = function(data) {
  if (data.event === 'supplier_form_submission') {
    sendFormToTelegram(data.formData);
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
