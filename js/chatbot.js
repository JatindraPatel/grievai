// ====================================================
// GrievAI – Chatbot JS (chatbot.js)
// 14-intent rule-based chatbot with suggestions
// ====================================================

(function () {
  // ── Intents ──────────────────────────────────────
  const intents = [
    {
      keywords: ['hello', 'hi', 'hey', 'namaskar', 'namaste', 'helo', 'good morning', 'good evening'],
      response: "Namaskar! 🙏 I am **GrievBot**, your AI assistant for the GrievAI Grievance Portal.\n\nHow may I assist you today?",
      suggestions: ['File a complaint', 'Track complaint', 'Departments', 'Help']
    },
    {
      keywords: ['file complaint', 'lodge complaint', 'register complaint', 'new complaint', 'submit complaint', 'file grievance', 'register grievance'],
      response: "To file a complaint, **no login is required!** 📝\n\n**Steps:**\n1. Click 'Lodge Complaint' on the Home page\n2. Fill in your Name, Department, and Description\n3. Submit — you will receive a unique **Complaint ID**\n4. Use this ID to track your complaint anytime\n\nWould you like to go to the complaint form?",
      suggestions: ['Go to complaint form', 'Track complaint', 'Required documents'],
      link: { text: 'Open Complaint Form', url: 'index.html#lodge' }
    },
    {
      keywords: ['track complaint', 'check complaint', 'complaint status', 'my complaint', 'grievance status', 'track grievance', 'where is my complaint'],
      response: "You can track your complaint **without logging in!** 🔍\n\n**Steps:**\n1. Go to the Track page\n2. Enter your **Complaint ID** (e.g., GRIEVA/2024/123456)\n3. View real-time status and updates\n\nYour Complaint ID was sent via SMS/Email when you filed the complaint.",
      suggestions: ['Go to Track page', 'File new complaint', 'What is Complaint ID?'],
      link: { text: 'Track Now', url: 'track.html' }
    },
    {
      keywords: ['complaint id', 'grievance id', 'registration number', 'id number'],
      response: "Your **Complaint ID** is a unique reference number assigned when you successfully file a complaint.\n\n📋 Format: `GRIEVA/YYYY/XXXXXX`\n\nExample: `GRIEVA/2024/783421`\n\nThis ID was sent to your registered mobile/email. You can use it to track status anytime.",
      suggestions: ['Track complaint', 'File new complaint', 'Contact support']
    },
    {
      keywords: ['departments', 'department', 'ministry', 'office', 'authority'],
      response: "GrievAI covers **5 major departments:** 🏛️\n\n🏥 **Health** – Hospitals, medicines, health schemes\n🎓 **Education** – Schools, colleges, scholarships\n🚌 **Transport** – Roads, vehicles, RTOs\n👮 **Police** – Law enforcement, FIR, safety\n🏙️ **Municipal** – Water, sanitation, garbage\n\nEach department has a dedicated team to resolve your complaints.",
      suggestions: ['View all departments', 'File complaint', 'Track complaint'],
      link: { text: 'View Departments', url: 'departments.html' }
    },
    {
      keywords: ['health', 'hospital', 'medical', 'doctor', 'medicine', 'health department'],
      response: "**Ministry of Health & Family Welfare** 🏥\n\nThis department handles:\n• Hospital service complaints\n• Medicine availability issues\n• Doctor misconduct\n• Health scheme grievances\n• Ambulance service problems\n\nFile your health complaint at our portal for prompt action.",
      suggestions: ['File health complaint', 'Track complaint', 'Other departments']
    },
    {
      keywords: ['education', 'school', 'college', 'teacher', 'scholarship', 'university', 'exam'],
      response: "**Department of Education** 🎓\n\nThis department handles:\n• School/College complaints\n• Teacher misconduct\n• Scholarship issues\n• Examination grievances\n• Mid-day meal problems\n• Infrastructure issues\n\nFile your education grievance for prompt resolution.",
      suggestions: ['File education complaint', 'Track complaint', 'Other departments']
    },
    {
      keywords: ['police', 'fir', 'crime', 'law', 'theft', 'harassment', 'safety', 'security'],
      response: "**Police Department** 👮\n\nThis department handles:\n• FIR registration issues\n• Police misconduct\n• Harassment complaints\n• Cybercrime\n• Traffic violations\n• Women's safety concerns\n\n⚠️ For emergencies, dial **100** (Police) or **112** (Emergency).",
      suggestions: ['File police complaint', 'Emergency contacts', 'Track complaint']
    },
    {
      keywords: ['login', 'sign in', 'account', 'register', 'signup', 'password', 'forgot password'],
      response: "GrievAI supports **3 types of logins:** 🔐\n\n👤 **Citizen Login** – File & track your complaints\n🏛️ **Officer Login** – Manage assigned complaints\n⚙️ **Admin Login** – Full portal administration\n\n💡 **Note:** You can file and track complaints WITHOUT logging in!",
      suggestions: ['Go to Login', 'File without login', 'Track without login'],
      link: { text: 'Login Page', url: 'login.html' }
    },
    {
      keywords: ['status', 'progress', 'resolved', 'pending', 'update', 'resolution'],
      response: "Complaint statuses in GrievAI: 📊\n\n🔵 **Under Review** – Being verified\n🟡 **In Progress** – Officer working on it\n✅ **Resolved** – Issue has been fixed\n⚫ **Pending** – Awaiting department action\n❌ **Rejected** – Complaint did not qualify\n\nYou can check your exact status on the Status page.",
      suggestions: ['Check my status', 'Track complaint', 'FAQ'],
      link: { text: 'View Status Page', url: 'status.html' }
    },
    {
      keywords: ['time', 'how long', 'duration', 'days', 'resolution time', 'timeline', 'when'],
      response: "Standard resolution timelines: ⏱️\n\n• **Normal complaints** – 30 working days\n• **Urgent/Priority** – 7-15 working days\n• **Emergency** – Within 24-48 hours\n\nYou will receive SMS/Email updates at each stage. If no action in 30 days, it auto-escalates to senior officials.",
      suggestions: ['Track my complaint', 'Escalate complaint', 'Contact support']
    },
    {
      keywords: ['escalate', 'escalation', 'no action', 'no response', 'ignored', 'not resolved', 'appeal'],
      response: "If your complaint has not been resolved: ⬆️\n\n1. **Auto-escalation** after 30 days of no action\n2. You can **manually escalate** from your dashboard\n3. Contact the **Ministry Helpline**: 1800-11-7781\n4. Email: **grievances@gov.in**\n\nKeep your Complaint ID ready when contacting support.",
      suggestions: ['Contact helpline', 'Track complaint', 'File new complaint']
    },
    {
      keywords: ['help', 'guide', 'how to use', 'tutorial', 'steps', 'instruction', 'assist'],
      response: "Here's a quick guide to GrievAI: 📖\n\n1. **Lodge Complaint** – No login needed, just fill the form\n2. **Get Complaint ID** – Save it for tracking\n3. **Track Progress** – Use Complaint ID anytime\n4. **Get Resolved** – Within stipulated time\n\nFor detailed help, visit our Help page.",
      suggestions: ['Visit Help page', 'File complaint', 'Track complaint'],
      link: { text: 'Help Guide', url: 'help.html' }
    },
    {
      keywords: ['faq', 'question', 'ask', 'queries', 'common question', 'frequently'],
      response: "Check our **Frequently Asked Questions** page for answers to common queries about:\n\n• Filing complaints\n• Tracking status\n• Login issues\n• Escalation process\n• Security & privacy\n• Document requirements",
      suggestions: ['Go to FAQ', 'File complaint', 'Track complaint'],
      link: { text: 'View FAQ', url: 'faq.html' }
    },
    {
      keywords: ['contact', 'phone', 'email', 'helpline', 'number', 'call', 'reach', 'toll free'],
      response: "**Contact GrievAI Support:** 📞\n\n📞 Helpline: **1800-11-7781** (Toll Free)\n📧 Email: grievances@gov.in\n🏛️ Ministry of Personnel, PG & Pensions\n📍 North Block, New Delhi – 110001\n⏰ Working hours: Mon–Fri, 9 AM – 5:30 PM",
      suggestions: ['File complaint', 'Track complaint', 'Visit contact page'],
      link: { text: 'Contact Page', url: 'contact.html' }
    },
    {
      keywords: ['security', 'privacy', 'data', 'safe', 'secure', 'protection', 'personal data'],
      response: "Your data is **completely secure** with GrievAI: 🔒\n\n• SSL/TLS encrypted connections\n• Data stored on Government of India secure servers\n• No data shared with third parties\n• Compliant with IT Act 2000 & Data Protection norms\n• OTP-based verification for sensitive actions",
      suggestions: ['Security policy', 'File complaint', 'Privacy info'],
      link: { text: 'Security Page', url: 'security.html' }
    },
    {
      keywords: ['thank', 'thanks', 'great', 'helpful', 'good', 'nice', 'excellent', 'awesome'],
      response: "Thank you for using GrievAI! 🙏\n\nWe are committed to making government services more accessible and transparent. Your feedback helps us improve.\n\nIs there anything else I can help you with?",
      suggestions: ['File complaint', 'Track complaint', 'Contact support']
    },
    {
      keywords: ['bye', 'goodbye', 'exit', 'close', 'quit', 'see you'],
      response: "Goodbye! 🙏 Thank you for using GrievAI.\n\n**Jai Hind! 🇮🇳**\n\nFeel free to return anytime you need assistance.",
      suggestions: []
    }
  ];

  const defaultResponse = {
    response: "I'm sorry, I couldn't understand that. Could you please rephrase your question?\n\nYou can ask me about:\n• Filing a complaint\n• Tracking your complaint\n• Department information\n• Login help\n• Contact details",
    suggestions: ['File complaint', 'Track complaint', 'Departments', 'Contact']
  };

  // ── State ─────────────────────────────────────────
  let isOpen = false;
  let messageCount = 0;

  // ── Build UI ─────────────────────────────────────
  function buildChatbot() {
    const widget = document.createElement('div');
    widget.className = 'chatbot-widget';
    widget.id = 'chatbotWidget';
    widget.innerHTML = `
      <div class="chatbot-window" id="chatbotWindow">
        <div class="chatbot-head">
          <div class="bot-avatar">🤖</div>
          <div class="bot-info">
            <h4>GrievBot</h4>
            <span><span class="bot-online-dot"></span>Online – AI Assistant</span>
          </div>
          <button class="chatbot-close" id="chatbotClose" title="Close">✕</button>
        </div>
        <div class="chatbot-messages" id="chatbotMessages"></div>
        <div class="chatbot-input-area">
          <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Type your message…" maxlength="300" autocomplete="off">
          <button class="chatbot-send" id="chatbotSend" title="Send">➤</button>
        </div>
        <div class="chatbot-footer-note">Powered by GrievAI • Government of India</div>
      </div>
      <button class="chatbot-toggle" id="chatbotToggle" title="Chat with GrievBot">
        🤖
        <span class="notif-dot"></span>
        <span class="toggle-label">Ask GrievBot</span>
      </button>
    `;
    document.body.appendChild(widget);

    // Events
    document.getElementById('chatbotToggle').addEventListener('click', toggleChat);
    document.getElementById('chatbotClose').addEventListener('click', closeChat);
    document.getElementById('chatbotSend').addEventListener('click', sendMessage);
    document.getElementById('chatbotInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendMessage();
    });

    // Welcome message
    setTimeout(() => {
      addBotMessage(
        "Namaskar! 🙏 I'm **GrievBot**, your AI-powered assistant for the GrievAI Grievance Portal.\n\nI can help you with:",
        ['File a complaint', 'Track complaint', 'Departments', 'Contact', 'Help'],
        false
      );
    }, 600);
  }

  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  function openChat() {
    isOpen = true;
    document.getElementById('chatbotWindow').classList.add('open');
    document.getElementById('chatbotToggle').querySelector('.notif-dot').style.display = 'none';
    setTimeout(() => document.getElementById('chatbotInput').focus(), 300);
  }

  function closeChat() {
    isOpen = false;
    document.getElementById('chatbotWindow').classList.remove('open');
  }

  function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = '';
    showTyping();
    const delay = 600 + Math.random() * 500;
    setTimeout(() => {
      removeTyping();
      const { response, suggestions, link } = matchIntent(text);
      addBotMessage(response, suggestions, true, link);
    }, delay);
  }

  function matchIntent(text) {
    const lower = text.toLowerCase();
    for (const intent of intents) {
      if (intent.keywords.some(kw => lower.includes(kw))) {
        return intent;
      }
    }
    return defaultResponse;
  }

  function addUserMessage(text) {
    const msgs = document.getElementById('chatbotMessages');
    messageCount++;
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = 'chat-msg user';
    div.innerHTML = `
      <div class="msg-avatar">👤</div>
      <div>
        <div class="msg-bubble">${escapeHtml(text)}</div>
        <span class="msg-time">${now}</span>
      </div>`;
    msgs.appendChild(div);
    scrollToBottom();
  }

  function addBotMessage(text, suggestions = [], animate = true, link = null) {
    const msgs = document.getElementById('chatbotMessages');
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = 'chat-msg bot';

    const formattedText = formatBotText(text);
    let suggestHtml = '';
    if (suggestions && suggestions.length) {
      suggestHtml = `<div class="chat-suggestions">
        ${suggestions.map(s => `<button class="suggest-btn" onclick="window._grievBot.handleSuggestion('${escapeHtml(s)}')">${escapeHtml(s)}</button>`).join('')}
      </div>`;
    }
    let linkHtml = '';
    if (link) {
      linkHtml = `<div style="margin-top:8px;"><a href="${link.url}" class="btn btn-navy btn-sm" style="display:inline-flex;">${link.text} →</a></div>`;
    }

    div.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div>
        <div class="msg-bubble">${formattedText}${linkHtml}</div>
        ${suggestHtml}
        <span class="msg-time">${now}</span>
      </div>`;
    msgs.appendChild(div);
    scrollToBottom();
  }

  function formatBotText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background:#f0f4f8;padding:2px 6px;border-radius:3px;font-size:0.85em;">$1</code>')
      .replace(/\n/g, '<br>');
  }

  function showTyping() {
    const msgs = document.getElementById('chatbotMessages');
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.id = 'typingIndicator';
    div.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>`;
    msgs.appendChild(div);
    scrollToBottom();
  }

  function removeTyping() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  function scrollToBottom() {
    const msgs = document.getElementById('chatbotMessages');
    msgs.scrollTop = msgs.scrollHeight;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ── Public API for suggestion buttons ─────────────
  window._grievBot = {
    handleSuggestion: function (text) {
      const input = document.getElementById('chatbotInput');
      if (input) {
        input.value = text;
        // Trigger send
        const event = new Event('submit');
        const sendBtn = document.getElementById('chatbotSend');
        if (sendBtn) sendBtn.click();
      }
    }
  };

  // ── Init ─────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildChatbot);
  } else {
    buildChatbot();
  }

})();

// ── Language integration for chatbot ─────────────────
(function patchChatbotLang() {
  // Update input placeholder when language switches
  var origSetLang = window.GrievLang && window.GrievLang.setLang;
  if (!origSetLang) {
    // Wait for GrievLang to be ready
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(patchChatbotLang, 200);
    });
    return;
  }
  window.GrievLang.setLang = function(code) {
    origSetLang(code);
    var inp = document.getElementById('chatbotInput');
    if (inp) inp.placeholder = window.GrievLang.t('bot.input.ph');
    var lbl = document.querySelector('.toggle-label');
    if (lbl) lbl.textContent = window.GrievLang.t('bot.label');
  };
})();
