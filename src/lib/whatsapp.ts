import { Budget, Customer } from "@/types";

const WHATSAPP_API_VERSION = 'v17.0';
const WHATSAPP_PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;

interface WhatsAppMessage {
  messaging_product: string;
  recipient_type: string;
  to: string;
  type: string;
  template?: {
    name: string;
    language: {
      code: string;
    };
    components: any[];
  };
  document?: {
    link: string;
    filename: string;
  };
  text?: {
    body: string;
  };
}

export const sendBudgetViaWhatsApp = async (
  budget: Budget,
  customer: Customer,
  pdfUrl: string
) => {
  if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
    throw new Error('WhatsApp credentials not configured');
  }

  const phoneNumber = customer.phone.replace(/\D/g, '');
  if (!phoneNumber.match(/^\d{10,}$/)) {
    throw new Error('Invalid phone number format');
  }

  // Primeiro, enviamos o PDF como documento
  const documentMessage: WhatsAppMessage = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "document",
    document: {
      link: pdfUrl,
      filename: `orcamento_${budget.id}.pdf`
    }
  };

  // Em seguida, enviamos uma mensagem de texto com informações adicionais
  const textMessage: WhatsAppMessage = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "text",
    text: {
      body: `Olá! Segue o orçamento #${budget.id} para sua análise.\n\nValor total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(budget.totalAmount)}\n\nPara mais informações, entre em contato conosco.`
    }
  };

  try {
    // Enviar documento
    const documentResponse = await fetch(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentMessage),
      }
    );

    if (!documentResponse.ok) {
      throw new Error('Failed to send document via WhatsApp');
    }

    // Enviar mensagem de texto
    const textResponse = await fetch(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(textMessage),
      }
    );

    if (!textResponse.ok) {
      throw new Error('Failed to send text message via WhatsApp');
    }

    return {
      success: true,
      documentResponse: await documentResponse.json(),
      textResponse: await textResponse.json(),
    };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};
