// ====================================================
// GrievAI – AI Department Auto-Detection Module v2.0
// ai_department.js
// NLP keyword-based classification engine
// ====================================================

window.GrievAI_Dept = (function () {

  // ── Department Classification Rules ──────────────
  var DEPT_RULES = [
    {
      dept: 'Water Supply & Sanitation',
      icon: '💧',
      keywords: [
        'water','leakage','leak','pipe','drainage','sewage','sewer','flood',
        'water supply','water shortage','contamination','dirty water','tap',
        'borewell','handpump','water board','पानी','जल','पाइप','नाली',
        'drain','overflow','waterlog','stagnant'
      ]
    },
    {
      dept: 'Ministry of Health & Family Welfare',
      icon: '🏥',
      keywords: [
        'hospital','doctor','medicine','health','medical','ambulance','nurse',
        'clinic','patient','treatment','surgery','blood','icu','ward','bed',
        'pharmacy','drug','vaccine','injection','ayushman','pmjay','dispensary',
        'healthcare','ओपीडी','opd','disease','hygiene','swasthya','स्वास्थ्य',
        'epidemic','infection','quarantine'
      ]
    },
    {
      dept: 'Department of Education',
      icon: '🎓',
      keywords: [
        'school','college','teacher','student','exam','scholarship','university',
        'education','class','subject','book','syllabus','result','admission',
        'midday meal','mid day','mid-day','hostel','fees','tuition','shiksha',
        'शिक्षा','विद्यालय','professor','principal','headmaster','conduct',
        'certificate','marksheet','degree','board exam'
      ]
    },
    {
      dept: 'Transport Authority',
      icon: '🚌',
      keywords: [
        'road','pothole','bus','traffic','vehicle','driving license','licence',
        'rto','permit','transport','highway','toll','parking','accident',
        'signal','flyover','bridge','railway','train','metro','auto',
        'rickshaw','cab','taxi','parivahan','परिवहन','sadak','सड़क',
        'national highway','state highway','road repair','speed breaker'
      ]
    },
    {
      dept: 'Police Department',
      icon: '👮',
      keywords: [
        'police','fir','crime','theft','robbery','harassment','assault',
        'complaint','fraud','cybercrime','cyber','extortion','bribe',
        'corruption','misconduct','violence','threat','molestation','rape',
        'murder','kidnap','missing','abduction','drug','narcotic','gambling',
        'पुलिस','thana','police station','constable','inspector','illegal'
      ]
    },
    {
      dept: 'Municipal Corporation',
      icon: '🏙️',
      keywords: [
        'garbage','waste','trash','dustbin','sweeping','cleaning','municipal',
        'street light','streetlight','lamp','road light','park','garden',
        'encroachment','illegal construction','building','property tax',
        'birth certificate','death certificate','trade license','slum',
        'pavement','footpath','market','नगरपालिका','नगर निगम','ward',
        'sanitation','solid waste','compost','recycling'
      ]
    },
    {
      dept: 'Electricity Department',
      icon: '⚡',
      keywords: [
        'electricity','power','current','light','bijli','load shedding',
        'power cut','electric','voltage','transformer','wire','cable',
        'meter','billing','electric bill','power supply','blackout',
        'बिजली','विद्युत','outage','live wire','short circuit','pole'
      ]
    },
    {
      dept: 'Revenue & Land Records',
      icon: '📋',
      keywords: [
        'land','property','record','khatauni','khasra','mutation','jamabandi',
        'registry','deed','bhulekh','revenue','patwari','tehsildar','court',
        'boundary','dispute','encroachment','bhu','भूमि','जमीन','plot',
        'survey','cadastral','land acquisition','compensation','zameen'
      ]
    },
    {
      dept: 'Public Distribution System (PDS)',
      icon: '🛒',
      keywords: [
        'ration','ration card','pds','food','grain','wheat','rice','kerosene',
        'subsidy','fair price shop','ration shop','bpl','apl','antyodaya',
        'राशन','राशन कार्ड','food supply','quota','allocation','foodgrain'
      ]
    },
    {
      dept: 'Labour & Employment',
      icon: '👷',
      keywords: [
        'labour','labor','worker','employee','salary','wage','employment',
        'job','work','factory','industry','epf','pf','esic','workplace',
        'overtime','termination','layoff','accident','compensation',
        'shramik','मजदूर','श्रम','minimum wage','bonded labour','contractor'
      ]
    },
    {
      dept: 'Social Welfare & Women Development',
      icon: '👩‍👧',
      keywords: [
        'pension','widow','old age','disability','handicapped','senior citizen',
        'women','girl','child','domestic violence','dowry','harassment',
        'anganwadi','icds','scholarship','social','welfare','divyang','disabled',
        'mahila','बाल','बालिका','सामाजिक','orphan','destitute','backward'
      ]
    },
    {
      dept: 'Agriculture Department',
      icon: '🌾',
      keywords: [
        'farmer','crop','agriculture','farming','irrigation','kisan',
        'loan','msp','minimum support price','pm kisan','fertilizer',
        'pesticide','soil','seed','harvest','drought','flood damage',
        'krishi','कृषि','किसान','खेत','farm','agricultural','crop insurance'
      ]
    },
    {
      dept: 'Telecommunications Department',
      icon: '📡',
      keywords: [
        'internet','network','mobile network','broadband','signal','tower',
        'telecom','bsnl','jio','airtel','vi','trai','connectivity',
        'phone','call drop','slow internet','data','4g','5g','wifi'
      ]
    }
  ];

  // ── Default fallback ──────────────────────────────
  var DEFAULT = {
    dept: 'Ministry of Personnel, Public Grievances & Pensions',
    icon: '🏛️',
    confidence: 'low'
  };

  // ── Normalize text ────────────────────────────────
  function normalize(text) {
    return (text || '').toLowerCase()
      .replace(/[^a-z0-9\u0900-\u097f\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ── Score a department against text ──────────────
  function scoreRule(rule, text) {
    var score = 0;
    var matched = [];
    rule.keywords.forEach(function(kw) {
      var kwNorm = kw.toLowerCase();
      if (text.indexOf(kwNorm) !== -1) {
        score += kwNorm.length > 5 ? 3 : 2; // longer keyword = higher weight
        matched.push(kw);
      }
    });
    return { score: score, matched: matched };
  }

  // ── Main classify function ────────────────────────
  function classify(complaintText) {
    var text = normalize(complaintText);
    if (!text || text.length < 5) return DEFAULT;

    var best = null;
    var bestScore = 0;

    DEPT_RULES.forEach(function(rule) {
      var result = scoreRule(rule, text);
      if (result.score > bestScore) {
        bestScore = result.score;
        best = {
          dept: rule.dept,
          icon: rule.icon,
          confidence: result.score >= 6 ? 'high' : result.score >= 3 ? 'medium' : 'low',
          matched: result.matched,
          score: result.score
        };
      }
    });

    if (!best || bestScore === 0) return Object.assign({}, DEFAULT);
    return best;
  }

  // ── Update UI with detection result ──────────────
  function updateDetectionUI(result) {
    var display = document.getElementById('aiDeptDisplay');
    if (!display) return;

    var confidenceColor = {
      high:   '#1a7a3f',
      medium: '#b7791f',
      low:    '#4a5568'
    };
    var confidenceLabel = {
      high:   '✅ High Confidence',
      medium: '🔶 Medium Confidence',
      low:    '⬜ Low Confidence'
    };

    display.style.display = 'block';
    display.innerHTML =
      '<div class="ai-dept-result">' +
        '<div class="ai-dept-header">' +
          '<span class="ai-dept-icon">' + result.icon + '</span>' +
          '<div>' +
            '<small style="color:var(--text-muted);font-size:0.72rem;display:block;">🤖 AI Auto-Detected Department</small>' +
            '<strong class="ai-dept-name" style="color:var(--navy);font-size:0.95rem;">' + result.dept + '</strong>' +
          '</div>' +
          '<span class="ai-confidence-badge" style="background:' + confidenceColor[result.confidence] + '20;color:' + confidenceColor[result.confidence] + ';border:1px solid ' + confidenceColor[result.confidence] + '40;padding:3px 10px;border-radius:20px;font-size:0.7rem;font-weight:600;white-space:nowrap;">' +
            confidenceLabel[result.confidence] +
          '</span>' +
        '</div>' +
        (result.matched && result.matched.length > 0 ?
          '<div class="ai-dept-keywords" style="margin-top:6px;font-size:0.72rem;color:var(--text-muted);">Matched: ' +
            result.matched.slice(0,5).map(function(k){ return '<code style="background:#f0f4f8;padding:1px 5px;border-radius:3px;font-size:0.7rem;">' + k + '</code>'; }).join(' ') +
          '</div>' : '') +
      '</div>';

    // Store in hidden field
    var hiddenDept = document.getElementById('fDeptHidden');
    if (hiddenDept) hiddenDept.value = result.dept;
  }

  // ── Clear detection display ───────────────────────
  function clearDetectionUI() {
    var display = document.getElementById('aiDeptDisplay');
    if (display) {
      display.style.display = 'none';
      display.innerHTML = '';
    }
    var hiddenDept = document.getElementById('fDeptHidden');
    if (hiddenDept) hiddenDept.value = '';
  }

  // ── Public API ────────────────────────────────────
  return {
    classify:          classify,
    updateDetectionUI: updateDetectionUI,
    clearDetectionUI:  clearDetectionUI
  };

})();
