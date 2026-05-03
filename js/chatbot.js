// ====================================================
// GrievAI – Premium AI Chatbot v3.0
// NLP intent engine + multi-language + voice input
// ====================================================

(function () {
  'use strict';

  // ── Session memory ────────────────────────────────
  var SESSION = {
    lang:     'en',
    history:  [],
    context:  null,   // last intent
    name:     null    // if user gave their name
  };

  // ── Intent definitions ────────────────────────────
  var INTENTS = [
    {
      id: 'greeting',
      patterns: ['hello','hi','hey','namaskar','namaste','good morning','good evening','helo','salam','नमस्ते','नमस्कार'],
      handler: function(){ return I18N[SESSION.lang].greeting; },
      suggestions: function(){ return [I18N[SESSION.lang].s_file, I18N[SESSION.lang].s_track, I18N[SESSION.lang].s_help, I18N[SESSION.lang].s_dept]; }
    },
    {
      id: 'file_complaint',
      patterns: ['file complaint','lodge complaint','register complaint','new complaint','submit complaint','file grievance','shikayat darj','शिकायत दर्ज','complaint karna','file a','lodge a','register a'],
      handler: function(){ return I18N[SESSION.lang].file_complaint; },
      suggestions: function(){ return [I18N[SESSION.lang].s_go_form, I18N[SESSION.lang].s_track, I18N[SESSION.lang].s_docs]; },
      action: { label: '📝 Open Complaint Form', url: 'index.html#lodge' }
    },
    {
      id: 'track_complaint',
      patterns: ['track complaint','check complaint','complaint status','my complaint','grievance status','track grievance','where is my','shikayat track','शिकायत ट्रैक','track karna'],
      handler: function(){ return I18N[SESSION.lang].track_complaint; },
      suggestions: function(){ return [I18N[SESSION.lang].s_go_track, I18N[SESSION.lang].s_file, I18N[SESSION.lang].s_id]; },
      action: { label: '🔍 Track Now', url: 'track.html' }
    },
    {
      id: 'complaint_id',
      patterns: ['complaint id','grievance id','registration number','id number','reference number','kya hai id','id kya','grieva'],
      handler: function(){ return I18N[SESSION.lang].complaint_id; },
      suggestions: function(){ return [I18N[SESSION.lang].s_track, I18N[SESSION.lang].s_file, I18N[SESSION.lang].s_support]; }
    },
    {
      id: 'departments',
      patterns: ['department','departments','ministry','office','authority','vibhag','विभाग','which department','kaunsa vibhag'],
      handler: function(){ return I18N[SESSION.lang].departments; },
      suggestions: function(){ return [I18N[SESSION.lang].s_view_dept, I18N[SESSION.lang].s_file, I18N[SESSION.lang].s_track]; },
      action: { label: '🏛️ View Departments', url: 'departments.html' }
    },
    {
      id: 'health',
      patterns: ['health','hospital','medical','doctor','medicine','swasthya','स्वास्थ्य','health department','dawai','ambulance'],
      handler: function(){ return I18N[SESSION.lang].health; },
      suggestions: function(){ return [I18N[SESSION.lang].s_file, I18N[SESSION.lang].s_track, I18N[SESSION.lang].s_dept]; }
    },
    {
      id: 'education',
      patterns: ['education','school','college','teacher','scholarship','university','exam','shiksha','शिक्षा','midday meal','result'],
      handler: function(){ return I18N[SESSION.lang].education; },
      suggestions: function(){ return [I18N[SESSION.lang].s_file, I18N[SESSION.lang].s_track, I18N[SESSION.lang].s_dept]; }
    },
    {
      id: 'police',
      patterns: ['police','fir','crime','law','theft','robbery','harassment','safety','thana','पुलिस','cybercrime','assault'],
      handler: function(){ return I18N[SESSION.lang].police; },
      suggestions: function(){ return [I18N[SESSION.lang].s_file, I18N[SESSION.lang].s_emergency, I18N[SESSION.lang].s_track]; }
    },
    {
      id: 'water',
      patterns: ['water','leakage','leak','pipe','drainage','sewage','pani','पानी','jal','water supply','tap','borewell','water board'],
      handler: function(){ return I18N[SESSION.lang].water; },
      suggestions: function(){ return [I18N[SESSION.lang].s_file, I18N[SESSION.lang].s_track, I18N[SESSION.lang].s_dept]; }
    },
    {
      id: 'electricity',
      patterns: ['electricity','power cut','bijli','बिजली','current','light','transformer','voltage','meter','electric bill'],
      handler: function(){ return I18N[SESSION.lang].electricity; },
      suggestions: function(){ return [I18N[SESSION.lang].s_file, I18N[SESSION.lang].s_track, I18N[SESSION.lang].s_dept]; }
    },
    {
      id: 'login',
      patterns: ['login','sign in','account','register','signup','password','forgot password','officer login','admin login'],
      handler: function(){ return I18N[SESSION.lang].login; },
      suggestions: function(){ return [I18N[SESSION.lang].s_go_login, I18N[SESSION.lang].s_file, I18N[SESSION.lang].s_track]; },
      action: { label: '🔐 Login Page', url: 'login.html' }
    },
    {
      id: 'status',
      patterns: ['status','progress','resolved','pending','in progress','update','resolution','solved','complete'],
      handler: function(){ return I18N[SESSION.lang].status; },
      suggestions: function(){ return [I18N[SESSION.lang].s_check_status, I18N[SESSION.lang].s_track, I18N[SESSION.lang].s_file]; },
      action: { label: '📊 Status Page', url: 'status.html' }
    },
    {
      id: 'timeline',
      patterns: ['how long','time','duration','days','when will','resolution time','kitne din','कितने दिन','timeline'],
      handler: function(){ return I18N[SESSION.lang].timeline; },
      suggestions: function(){ return [I18N[SESSION.lang].s_track, I18N[SESSION.lang].s_escalate, I18N[SESSION.lang].s_support]; }
    },
    {
      id: 'escalate',
      patterns: ['escalate','escalation','no action','no response','ignored','not resolved','appeal','senior','complaint not resolved'],
      handler: function(){ return I18N[SESSION.lang].escalate; },
      suggestions: function(){ return [I18N[SESSION.lang].s_support, I18N[SESSION.lang].s_track, I18N[SESSION.lang].s_file]; }
    },
    {
      id: 'help',
      patterns: ['help','guide','how to use','tutorial','steps','instruction','assist','kaise kare','कैसे करें'],
      handler: function(){ return I18N[SESSION.lang].help; },
      suggestions: function(){ return [I18N[SESSION.lang].s_go_help, I18N[SESSION.lang].s_file, I18N[SESSION.lang].s_track]; },
      action: { label: '📖 Help Guide', url: 'help.html' }
    },
    {
      id: 'transport',
      patterns: ['road','pothole','bus','traffic','transport','rto','driving license','highway','bridge','sadak','सड़क','parivahan'],
      handler: function(){ return I18N[SESSION.lang].transport; },
      suggestions: function(){ return [I18N[SESSION.lang].s_file, I18N[SESSION.lang].s_track, I18N[SESSION.lang].s_dept]; }
    },
    {
      id: 'goodbye',
      patterns: ['bye','goodbye','thanks','thank you','धन्यवाद','shukriya','alvida','see you'],
      handler: function(){ return I18N[SESSION.lang].goodbye; },
      suggestions: function(){ return [I18N[SESSION.lang].s_file, I18N[SESSION.lang].s_track]; }
    }
  ];

  // ── i18n strings ──────────────────────────────────
  var I18N = {
    en: {
      greeting:       '🙏 Namaskar! I\'m **GrievBot**, your AI assistant.\n\nI can help you file a complaint, track its status, find the right department, or guide you through the portal.\n\nWhat would you like to do today?',
      file_complaint: '📝 **Filing a Complaint is Easy!**\n\nNo login required. Just:\n1. Click **Lodge Complaint** on the home page\n2. Enter your name, mobile, state & complaint details\n3. AI will auto-detect the right department\n4. Capture a **live photo** with GPS location\n5. Submit → Get your unique **Complaint ID**\n\nWould you like to go to the complaint form?',
      track_complaint:'🔍 **Track Your Complaint**\n\nNo login needed!\n1. Go to the **Track** page\n2. Enter your **Complaint ID** (e.g., GRIEVA/2025/123456)\n3. See real-time status, officer updates & resolution ETA\n\nYour Complaint ID was sent via SMS/Email when you filed.',
      complaint_id:   '🆔 **What is a Complaint ID?**\n\nIt\'s your unique reference number:\n📋 Format: `GRIEVA/YYYY/XXXXXX`\n📌 Example: `GRIEVA/2025/783421`\n\nThis was sent to your registered mobile & email after submission. Use it to track status anytime.',
      departments:    '🏛️ **GrievAI covers 13 Departments:**\n\n💧 Water Supply &amp; Sanitation\n🏥 Health &amp; Family Welfare\n🎓 Education\n🚌 Transport Authority\n👮 Police Department\n🏙️ Municipal Corporation\n⚡ Electricity Department\n📋 Revenue &amp; Land Records\n🛒 Public Distribution (PDS)\n👷 Labour &amp; Employment\n👩‍👧 Social Welfare\n🌾 Agriculture\n📡 Telecommunications',
      health:         '🏥 **Ministry of Health & Family Welfare**\n\nHandles: Hospital services, medicines, doctor misconduct, health scheme grievances, ambulance issues, Ayushman Bharat problems.\n\nFile your health complaint for prompt departmental action.',
      education:      '🎓 **Department of Education**\n\nHandles: School/college complaints, teacher misconduct, scholarship issues, mid-day meal problems, exam grievances, infrastructure.\n\nFile your education grievance for prompt resolution.',
      police:         '👮 **Police Department**\n\nHandles: FIR issues, police misconduct, cybercrime, harassment, traffic violations, women\'s safety.\n\n⚠️ **Emergency?** Dial **112** immediately.\n🔴 Women\'s helpline: **1091**',
      water:          '💧 **Water Supply & Sanitation**\n\nHandles: Water leakage, pipe bursts, sewage overflow, water shortage, contamination, drainage issues.\n\nFile your complaint for immediate municipal action.',
      electricity:    '⚡ **Electricity Department**\n\nHandles: Power cuts, billing errors, meter issues, transformer failure, live wire hazards, voltage fluctuation.\n\nFile your electricity complaint for urgent resolution.',
      login:          '🔐 **Login Options in GrievAI:**\n\n👤 **Citizen Login** – View your past complaints\n🏛️ **Officer Login** – Manage assigned cases\n⚙️ **Admin Login** – Full portal administration\n\n💡 **Tip:** You can file &amp; track complaints WITHOUT logging in!',
      status:         '📊 **Complaint Status Types:**\n\n🔵 **Under Review** – Being verified by team\n🟡 **In Progress** – Officer actively working\n✅ **Resolved** – Issue fixed!\n⚫ **Pending** – Awaiting department response\n❌ **Rejected** – Did not meet criteria\n\nCheck your exact status on the Status page.',
      timeline:       '⏱️ **Resolution Timelines:**\n\n• Normal complaints → **30 working days**\n• Urgent/Priority → **7–15 working days**\n• Emergency → **24–48 hours**\n\nYou receive SMS/Email updates at each step. Non-action after 30 days triggers **auto-escalation** to senior officers.',
      escalate:       '⬆️ **Escalation Options:**\n\n1. **Auto-escalates** after 30 days of no action\n2. Manually escalate from your dashboard\n3. Call Ministry Helpline: **1800-11-7781**\n4. Email: **grievances@gov.in**\n\nKeep your Complaint ID ready. We take escalations seriously.',
      help:           '📖 **Quick Guide to GrievAI:**\n\n1️⃣ **Lodge Complaint** → No login, fill the form\n2️⃣ **Get Complaint ID** → Save it for tracking\n3️⃣ **Track Progress** → Use your ID anytime\n4️⃣ **Get Resolved** → Within 30 working days\n5️⃣ **Escalate if Needed** → Auto or manual escalation\n\nFor detailed help, visit the Help page.',
      transport:      '🚌 **Transport Authority**\n\nHandles: Road potholes, bus service issues, traffic signal failures, driving license problems, RTO complaints, highway maintenance.\n\nFile your transport complaint for road department action.',
      goodbye:        '🙏 Thank you for using GrievAI!\n\nYour grievance matters to us. Our team works every day to resolve citizen complaints efficiently.\n\nIs there anything else I can help you with?',
      fallback:       '🤔 I\'m not sure I understood that fully.\n\nTry asking about:\n• Filing a complaint\n• Tracking your complaint\n• Department information\n• Help & guidance\n\nOr type **help** for a full guide.',
      typing_label:   'GrievBot is thinking…',
      input_ph:       'Type your question…',
      // Suggestion labels
      s_file:         '📝 File Complaint',
      s_track:        '🔍 Track Complaint',
      s_help:         '❓ Get Help',
      s_dept:         '🏛️ Departments',
      s_go_form:      '📋 Go to Form',
      s_docs:         '📄 Documents Needed',
      s_go_track:     '🔍 Track Page',
      s_id:           '🆔 What is Complaint ID?',
      s_view_dept:    '🏛️ All Departments',
      s_support:      '☎️ Contact Support',
      s_go_login:     '🔐 Login Page',
      s_go_help:      '📖 Help Page',
      s_check_status: '📊 Check Status',
      s_escalate:     '⬆️ Escalate',
      s_emergency:    '🚨 Emergency Numbers'
    },
    hi: {
      greeting:       '🙏 नमस्कार! मैं **GrievBot** हूँ, आपका AI सहायक।\n\nमैं आपको शिकायत दर्ज करने, उसकी स्थिति ट्रैक करने, सही विभाग खोजने में मदद कर सकता हूँ।\n\nआप क्या जानना चाहते हैं?',
      file_complaint: '📝 **शिकायत दर्ज करें**\n\nकोई लॉगिन की जरूरत नहीं!\n1. होम पेज पर **शिकायत दर्ज करें** पर क्लिक करें\n2. नाम, मोबाइल, राज्य और शिकायत विवरण भरें\n3. AI अपने आप विभाग पहचान लेगा\n4. लाइव फोटो और GPS लोकेशन कैप्चर करें\n5. सबमिट करें → **Complaint ID** पाएं',
      track_complaint:'🔍 **शिकायत ट्रैक करें**\n\nलॉगिन की जरूरत नहीं!\n1. **ट्रैक** पेज पर जाएं\n2. अपना **Complaint ID** डालें\n3. रियल-टाइम स्टेटस देखें',
      complaint_id:   '🆔 **Complaint ID क्या है?**\n\nयह आपका विशेष संदर्भ नंबर है:\n📋 फॉर्मेट: `GRIEVA/YYYY/XXXXXX`\n📌 उदाहरण: `GRIEVA/2025/783421`\n\nयह आपके मोबाइल/ईमेल पर भेजा गया था।',
      departments:    '🏛️ **GrievAI के 13 विभाग:**\n\n💧 जल आपूर्ति\n🏥 स्वास्थ्य\n🎓 शिक्षा\n🚌 परिवहन\n👮 पुलिस\n🏙️ नगर निगम\n⚡ बिजली विभाग\n📋 राजस्व\n🛒 पीडीएस\n👷 श्रम\n👩‍👧 समाज कल्याण\n🌾 कृषि\n📡 दूरसंचार',
      health:         '🏥 **स्वास्थ्य और परिवार कल्याण मंत्रालय**\n\nअस्पताल सेवाएं, दवाइयां, डॉक्टर की शिकायतें, स्वास्थ्य योजनाएं और एम्बुलेंस सेवाओं की समस्याएं।',
      education:      '🎓 **शिक्षा विभाग**\n\nस्कूल/कॉलेज शिकायतें, शिक्षक आचरण, छात्रवृत्ति, मिड-डे मील, परीक्षा समस्याएं।',
      police:         '👮 **पुलिस विभाग**\n\nFIR, पुलिस अवव्यवहार, साइबर अपराध, उत्पीड़न।\n\n⚠️ आपात स्थिति में **112** डायल करें।',
      water:          '💧 **जल आपूर्ति और स्वच्छता**\n\nपानी रिसाव, पाइप फटना, सीवेज, पानी की कमी, प्रदूषण।',
      electricity:    '⚡ **बिजली विभाग**\n\nबिजली कटौती, बिलिंग त्रुटि, मीटर समस्या, ट्रांसफार्मर खराबी।',
      login:          '🔐 **लॉगिन विकल्प:**\n\n👤 नागरिक लॉगिन\n🏛️ अधिकारी लॉगिन\n⚙️ एडमिन लॉगिन\n\n💡 लॉगिन के बिना भी शिकायत दर्ज करें!',
      status:         '📊 **शिकायत स्थिति:**\n\n🔵 समीक्षाधीन\n🟡 प्रगति में\n✅ हल हो गई\n⚫ लंबित\n❌ अस्वीकृत',
      timeline:       '⏱️ **समाधान समयसीमा:**\n\n• सामान्य → **30 कार्य दिवस**\n• आपातकालीन → **24-48 घंटे**\n\nहर चरण पर SMS/ईमेल अपडेट मिलेगा।',
      escalate:       '⬆️ **एस्केलेशन:**\n\n30 दिनों में कोई कार्रवाई नहीं → ऑटो एस्केलेशन\nहेल्पलाइन: **1800-11-7781**\nईमेल: grievances@gov.in',
      help:           '📖 **GrievAI उपयोग गाइड:**\n\n1. शिकायत दर्ज करें\n2. Complaint ID सुरक्षित रखें\n3. स्थिति ट्रैक करें\n4. 30 दिनों में समाधान पाएं',
      transport:      '🚌 **परिवहन विभाग**\n\nसड़क के गड्ढे, बस सेवा, ट्रैफिक, RTO, ड्राइविंग लाइसेंस की समस्याएं।',
      goodbye:        '🙏 GrievAI का उपयोग करने के लिए धन्यवाद!\n\nहम आपकी शिकायतों को गंभीरता से लेते हैं।',
      fallback:       '🤔 मुझे समझ नहीं आया। कृपया दोबारा पूछें:\n• शिकायत दर्ज करना\n• शिकायत ट्रैक करना\n• विभाग जानकारी',
      typing_label:   'GrievBot सोच रहा है…',
      input_ph:       'अपना प्रश्न टाइप करें…',
      s_file:'📝 शिकायत दर्ज करें', s_track:'🔍 ट्रैक करें', s_help:'❓ सहायता', s_dept:'🏛️ विभाग',
      s_go_form:'📋 फॉर्म पर जाएं', s_docs:'📄 आवश्यक दस्तावेज', s_go_track:'🔍 ट्रैक पेज', s_id:'🆔 Complaint ID?',
      s_view_dept:'🏛️ सभी विभाग', s_support:'☎️ सहायता केंद्र', s_go_login:'🔐 लॉगिन', s_go_help:'📖 सहायता पेज',
      s_check_status:'📊 स्थिति देखें', s_escalate:'⬆️ एस्केलेट', s_emergency:'🚨 आपातकालीन नंबर'
    }
  };

  // Fill missing langs with English
  ['bn','te','mr','ta','gu','kn','ml','pa','or','ur'].forEach(function(c){
    I18N[c] = Object.assign({}, I18N.en);
  });

  // ── NLP: classify user input to an intent ─────────
  function classify(text) {
    var t = text.toLowerCase().trim();
    var best = null, bestScore = 0;
    INTENTS.forEach(function(intent) {
      var score = 0;
      intent.patterns.forEach(function(p) {
        if (t.indexOf(p) !== -1) score += p.length > 6 ? 3 : 2;
      });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    SESSION.context = best ? best.id : null;
    return best;
  }

  // ── Render markdown-style bold + newlines ─────────
  function renderMD(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:#f0f4f8;padding:2px 5px;border-radius:3px;font-size:0.83em;">$1</code>')
      .replace(/\n/g, '<br>');
  }

  // ── Build chat message DOM ────────────────────────
  function makeMessage(text, role, action) {
    var wrap = document.createElement('div');
    wrap.className = 'cb-msg cb-msg--' + role;

    if (role === 'bot') {
      var avatar = document.createElement('div');
      avatar.className = 'cb-avatar';
      avatar.innerHTML = '🤖';
      wrap.appendChild(avatar);
    }

    var bubble = document.createElement('div');
    bubble.className = 'cb-bubble';
    bubble.innerHTML = renderMD(text);

    if (action) {
      var btn = document.createElement('a');
      btn.className = 'cb-action-btn';
      btn.href = action.url;
      btn.textContent = action.label;
      bubble.appendChild(document.createElement('br'));
      bubble.appendChild(btn);
    }

    var ts = document.createElement('span');
    ts.className = 'cb-ts';
    ts.textContent = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
    bubble.appendChild(ts);

    wrap.appendChild(bubble);
    return wrap;
  }

  // ── Build typing indicator ────────────────────────
  function makeTyping() {
    var wrap = document.createElement('div');
    wrap.className = 'cb-msg cb-msg--bot cb-typing-wrap';
    wrap.innerHTML = '<div class="cb-avatar">🤖</div><div class="cb-bubble cb-typing"><span></span><span></span><span></span></div>';
    return wrap;
  }

  // ── Suggestions row ───────────────────────────────
  function makeSuggestions(suggs) {
    if (!suggs || !suggs.length) return null;
    var row = document.createElement('div');
    row.className = 'cb-suggestions';
    suggs.slice(0, 4).forEach(function(s) {
      var btn = document.createElement('button');
      btn.className = 'cb-sugg-btn';
      btn.textContent = s;
      btn.addEventListener('click', function(){
        sendMessage(s);
        row.remove();
      });
      row.appendChild(btn);
    });
    return row;
  }

  // ── Core send/receive ─────────────────────────────
  function sendMessage(text) {
    var msgs = document.getElementById('cbMessages');
    if (!msgs) return;
    text = text.trim();
    if (!text) return;

    // Append user bubble
    msgs.appendChild(makeMessage(text, 'user'));
    SESSION.history.push({ role: 'user', text: text });

    // Clear input
    var inp = document.getElementById('cbInput');
    if (inp) inp.value = '';

    // Scroll
    scrollToBottom();

    // Typing delay (realistic feel)
    var typing = makeTyping();
    msgs.appendChild(typing);
    scrollToBottom();

    var delay = 600 + Math.random() * 500;
    setTimeout(function() {
      typing.remove();

      // Classify
      var intent = classify(text);
      var lang = SESSION.lang;
      var strings = I18N[lang] || I18N.en;
      var response, suggs, action;

      if (intent) {
        response = intent.handler();
        suggs    = intent.suggestions();
        action   = intent.action || null;
      } else {
        response = strings.fallback;
        suggs = [strings.s_file, strings.s_track, strings.s_help, strings.s_dept];
        action = null;
      }

      var botMsg = makeMessage(response, 'bot', action);
      msgs.appendChild(botMsg);
      SESSION.history.push({ role: 'bot', text: response });

      if (suggs) {
        var suggRow = makeSuggestions(suggs);
        if (suggRow) msgs.appendChild(suggRow);
      }

      scrollToBottom();
    }, delay);
  }

  function scrollToBottom() {
    var msgs = document.getElementById('cbMessages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  // ── Build the widget HTML ─────────────────────────
  function buildWidget() {
    var widget = document.createElement('div');
    widget.id = 'cbWidget';
    widget.className = 'cb-widget';

    widget.innerHTML = (
      // FAB button
      '<button class="cb-fab" id="cbFab" aria-label="Open AI Assistant">' +
        '<span class="cb-fab-icon">🤖</span>' +
        '<span class="cb-fab-pulse"></span>' +
        '<span class="cb-fab-badge" id="cbBadge">1</span>' +
      '</button>' +

      // Chat panel
      '<div class="cb-panel" id="cbPanel" role="dialog" aria-label="GrievBot AI Assistant" aria-hidden="true">' +

        // Header
        '<div class="cb-header">' +
          '<div class="cb-header-info">' +
            '<div class="cb-header-avatar">🤖</div>' +
            '<div>' +
              '<div class="cb-header-name">GrievBot</div>' +
              '<div class="cb-header-status"><span class="cb-online-dot"></span>Online · AI Assistant</div>' +
            '</div>' +
          '</div>' +
          '<div class="cb-header-actions">' +
            '<button class="cb-icon-btn" id="cbVoiceBtn" title="Voice Input" style="display:none;">🎤</button>' +
            '<button class="cb-icon-btn" id="cbCloseBtn" title="Close" aria-label="Close chatbot">✕</button>' +
          '</div>' +
        '</div>' +

        // Messages
        '<div class="cb-messages" id="cbMessages" role="log" aria-live="polite"></div>' +

        // Input area
        '<div class="cb-input-area">' +
          '<div class="cb-quick-replies" id="cbQuickReplies">' +
            '<button class="cb-quick-btn" data-msg="File a complaint">📝 File Complaint</button>' +
            '<button class="cb-quick-btn" data-msg="Track my complaint">🔍 Track</button>' +
            '<button class="cb-quick-btn" data-msg="I need help">❓ Help</button>' +
          '</div>' +
          '<div class="cb-input-row">' +
            '<input type="text" id="cbInput" class="cb-input" placeholder="Type your question…" autocomplete="off" maxlength="300">' +
            '<button class="cb-send-btn" id="cbSend" aria-label="Send message">➤</button>' +
          '</div>' +
        '</div>' +

      '</div>'
    );

    document.body.appendChild(widget);
  }

  // ── Voice Input ───────────────────────────────────
  function setupVoice() {
    var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    var voiceBtn = document.getElementById('cbVoiceBtn');
    if (!SpeechRec || !voiceBtn) return;

    voiceBtn.style.display = 'flex';
    var rec = new SpeechRec();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = SESSION.lang === 'hi' ? 'hi-IN' : 'en-IN';

    var recording = false;
    voiceBtn.addEventListener('click', function() {
      if (recording) { rec.stop(); return; }
      rec.lang = SESSION.lang === 'hi' ? 'hi-IN' : 'en-IN';
      rec.start();
    });
    rec.onstart = function() {
      recording = true;
      voiceBtn.textContent = '🔴';
      voiceBtn.title = 'Listening…';
    };
    rec.onend = function() {
      recording = false;
      voiceBtn.textContent = '🎤';
      voiceBtn.title = 'Voice Input';
    };
    rec.onresult = function(e) {
      var transcript = e.results[0][0].transcript;
      var inp = document.getElementById('cbInput');
      if (inp) { inp.value = transcript; sendMessage(transcript); }
    };
  }

  // ── Bind all events ───────────────────────────────
  function bindEvents() {
    var fab      = document.getElementById('cbFab');
    var panel    = document.getElementById('cbPanel');
    var closeBtn = document.getElementById('cbCloseBtn');
    var sendBtn  = document.getElementById('cbSend');
    var input    = document.getElementById('cbInput');
    var badge    = document.getElementById('cbBadge');

    // Open/close
    function openPanel() {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden','false');
      badge.style.display = 'none';
      setTimeout(function(){ var inp = document.getElementById('cbInput'); if(inp) inp.focus(); }, 350);
    }
    function closePanel() {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden','true');
    }

    fab.addEventListener('click', function(){
      if (panel.classList.contains('open')) closePanel();
      else openPanel();
    });
    closeBtn.addEventListener('click', closePanel);

    // Send
    sendBtn.addEventListener('click', function(){ sendMessage(input.value); });
    input.addEventListener('keydown', function(e){
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input.value); }
    });

    // Quick replies
    document.querySelectorAll('.cb-quick-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        sendMessage(btn.getAttribute('data-msg'));
      });
    });

    // Close on outside click
    document.addEventListener('click', function(e){
      if (!panel.contains(e.target) && !fab.contains(e.target) && panel.classList.contains('open')) {
        closePanel();
      }
    });
  }

  // ── Watch for site language changes ──────────────
  function syncLang() {
    var saved = localStorage.getItem('grievai_lang') || 'en';
    SESSION.lang = saved;
    var inp = document.getElementById('cbInput');
    var strings = I18N[saved] || I18N.en;
    if (inp) inp.placeholder = strings.input_ph;
  }

  // ── Show initial greeting ─────────────────────────
  function showWelcome() {
    syncLang();
    var strings = I18N[SESSION.lang] || I18N.en;
    var msgs = document.getElementById('cbMessages');
    if (!msgs) return;

    // Welcome message after short delay
    setTimeout(function(){
      var botMsg = makeMessage(strings.greeting, 'bot');
      msgs.appendChild(botMsg);
      var suggs = makeSuggestions([strings.s_file, strings.s_track, strings.s_dept, strings.s_help]);
      if (suggs) msgs.appendChild(suggs);
      scrollToBottom();
    }, 400);
  }

  // ── Init ──────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function(){
    buildWidget();
    bindEvents();
    setupVoice();
    showWelcome();

    // Sync language on change
    window.addEventListener('storage', function(e){
      if (e.key === 'grievai_lang') syncLang();
    });
    // Also observe dropdown clicks
    document.addEventListener('click', function(e){
      if (e.target.classList.contains('nav-lang-item')) {
        setTimeout(syncLang, 100);
      }
    });
  });

})();
