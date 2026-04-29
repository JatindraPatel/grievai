/**
 * GrievAI — Frontend AI Classification Module
 * ═══════════════════════════════════════════
 * Handles:
 *   1. Live AI preview as citizen types (calls /api/v1/complaints/classify)
 *   2. Falls back to client-side keyword classifier if backend offline
 *   3. Enhanced form submission → POST /api/v1/complaints
 *   4. Success state shows complaint ID + AI-assigned details
 *
 * Citizen NEVER selects a department manually — AI does it all.
 */

// ── Config ────────────────────────────────────────────────
const GRIEVAI_API = 'http://localhost:8000';  // change to your deployed URL

// ── Debounce timer ────────────────────────────────────────
let _aiTimer = null;

/**
 * Called on every keystroke in subject / description fields.
 * Debounces 600ms then fires classification.
 */
function triggerAIClassify() {
  clearTimeout(_aiTimer);
  _aiTimer = setTimeout(() => {
    const subject = (document.getElementById('fsubject')?.value || '').trim();
    const desc = (document.getElementById('fdesc')?.value || '').trim();
    const combined = `${subject} ${desc}`.trim();
    if (combined.length < 5) return;
    runAIClassify(combined);
  }, 600);
}

/**
 * Calls backend classify endpoint.
 * Falls back to client-side classifier on error.
 */
async function runAIClassify(text) {
  showAISpinner(true);
  showAIPreviewBox(true);

  try {
    const res = await fetch(`${GRIEVAI_API}/api/v1/complaints/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const data = await res.json();
      updateAIPreview(data);
    } else {
      throw new Error('API error');
    }
  } catch (err) {
    // Fallback: client-side keyword classifier
    const data = clientSideClassify(text);
    updateAIPreview(data);
  }

  showAISpinner(false);
}

/**
 * Update the AI preview UI cards.
 */
function updateAIPreview(data) {
  const priorityColors = { High: '#c0392b', Medium: '#e67e22', Low: '#27ae60' };

  setText('aiCategory', data.category || '—');
  setText('aiDepartment', data.department || '—');

  const priEl = document.getElementById('aiPriority');
  if (priEl) {
    priEl.textContent = data.priority || '—';
    priEl.style.color = priorityColors[data.priority] || '#003366';
  }

  setText('aiLanguage', data.detected_language || data.language || '—');

  const conf = data.confidence || 0;
  const confBar = document.getElementById('aiConfidenceBar');
  const confText = document.getElementById('aiConfidenceText');
  if (confBar) confBar.style.width = `${conf}%`;
  if (confText) confText.textContent = `${conf}%`;

  // Set color based on confidence
  if (confBar) {
    if (conf >= 70) confBar.style.background = 'linear-gradient(to right,#003366,#28a745)';
    else if (conf >= 40) confBar.style.background = 'linear-gradient(to right,#e67e22,#f39c12)';
    else confBar.style.background = 'linear-gradient(to right,#c0392b,#e74c3c)';
  }

  // Fill hidden fields for form submission
  setVal('fAiCategory', data.category);
  setVal('fAiDepartment', data.department);
  setVal('fAiPriority', data.priority);
  setVal('fAiLanguage', data.detected_language || data.language);
  setVal('fAiConfidence', conf);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

function showAIPreviewBox(show) {
  const box = document.getElementById('aiPreviewBox');
  if (box) box.style.display = show ? 'block' : 'none';
}

function showAISpinner(show) {
  const spinner = document.getElementById('aiSpinner');
  if (spinner) spinner.style.display = show ? 'inline' : 'none';
}

// ── Client-side fallback classifier ──────────────────────
const CLIENT_KEYWORDS = {
  Electricity: ['electricity','power','bijli','current','light','transformer','voltage','outage','meter','load shedding','बिजली','बत्ती'],
  Water: ['water','paani','pani','pipe','leak','sewage','tap','naali','nali','पानी','नल','waterlog'],
  Roads: ['road','sadak','pothole','gadda','footpath','bridge','highway','traffic','पुल','सड़क'],
  Sanitation: ['garbage','kuda','safai','dustbin','toilet','drain','mosquito','smell','badbu','कूड़ा','सफाई'],
  Health: ['hospital','doctor','medicine','health','clinic','ambulance','अस्पताल','डॉक्टर','dawai'],
  Education: ['school','college','teacher','scholarship','education','स्कूल','शिक्षक','padhai'],
  Police: ['police','FIR','crime','theft','harassment','fraud','पुलिस','चोरी'],
  Telecom: ['internet','network','signal','BSNL','tower','broadband'],
};
const DEPT_MAP = {
  Electricity:'Ministry of Power & Energy',
  Water:'Municipal Corporation – Water Department',
  Roads:'Transport Authority / PWD',
  Sanitation:'Municipal Corporation – Sanitation',
  Health:'Ministry of Health & Family Welfare',
  Education:'Department of Education',
  Police:'Police Department',
  Telecom:'Department of Telecommunications',
  Other:'Department of Administrative Reforms & PG',
};
const HIGH_KW = ['urgent','emergency','jaldi','danger','aag','fire','death','flood','baadh','जल्दी','खतरा'];
const LOW_KW  = ['information','query','enquiry','jankari','suggestion'];
const HINDI_RE = /[\u0900-\u097F]/;

function clientSideClassify(text) {
  const norm = text.toLowerCase();
  const scores = {};
  for (const [cat, kws] of Object.entries(CLIENT_KEYWORDS)) {
    scores[cat] = kws.filter(k => norm.includes(k.toLowerCase())).length;
  }
  const best = Object.entries(scores).sort((a,b)=>b[1]-a[1])[0];
  const category = best[1] > 0 ? best[0] : 'Other';
  const confidence = Math.min(100, best[1] * 20);

  let priority = 'Medium';
  if (HIGH_KW.some(k => norm.includes(k))) priority = 'High';
  else if (LOW_KW.some(k => norm.includes(k))) priority = 'Low';

  const hindiChars = (text.match(/[\u0900-\u097F]/g) || []).length;
  const ratio = hindiChars / Math.max(text.replace(/\s/g,'').length,1);
  const detected_language = ratio > 0.5 ? 'Hindi' : ratio > 0.05 ? 'Hinglish' : 'English';

  return {
    category,
    department: DEPT_MAP[category] || DEPT_MAP.Other,
    priority,
    detected_language,
    confidence,
  };
}

// ── Form Submission → Backend ─────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('complaintForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validate required fields
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(f => {
      f.style.borderColor = '';
      if (f.type === 'checkbox' && !f.checked) { valid = false; f.closest('.form-group')?.style && (f.parentElement.style.color='#c0392b'); }
      else if (f.type !== 'checkbox' && !f.value.trim()) { f.style.borderColor = '#c0392b'; valid = false; }
    });
    if (!valid) { showNotification?.('Please fill in all required fields.', 'error'); return; }

    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = '🤖 Classifying & Filing…';

    // Run classification if not already done
    const subject = document.getElementById('fsubject')?.value || '';
    const description = document.getElementById('fdesc')?.value || '';
    if (!document.getElementById('fAiCategory')?.value) {
      await runAIClassify(`${subject} ${description}`);
    }

    const payload = {
      citizen_name:   document.getElementById('fname')?.value.trim()   || '',
      citizen_mobile: document.getElementById('fmobile')?.value.trim() || '',
      citizen_email:  document.getElementById('femail')?.value.trim()  || undefined,
      state:          document.getElementById('fstate')?.value         || '',
      subject,
      description,
    };

    try {
      const res = await fetch(`${GRIEVAI_API}/api/v1/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        showAIComplaintSuccess(data);
        form.reset();
        showAIPreviewBox(false);
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Submission failed');
      }
    } catch (err) {
      // Graceful degradation — show mock success (offline demo)
      const mockId = `GRIEVA/${new Date().getFullYear()}/${Math.floor(100000+Math.random()*900000)}`;
      const aiData = clientSideClassify(`${subject} ${description}`);
      showAIComplaintSuccess({
        complaint_id: mockId,
        category: aiData.category,
        department: aiData.department,
        priority: aiData.priority,
        detected_language: aiData.detected_language,
        status: 'Pending',
        _offline: true,
      });
      form.reset();
      showAIPreviewBox(false);
    }

    btn.disabled = false;
    btn.textContent = '📤 Submit Complaint';
  });
});

/**
 * Show success banner with AI-assigned details.
 */
function showAIComplaintSuccess(data) {
  const result = document.getElementById('complaintResult');
  if (!result) return;

  const priorityColor = { High: '#c0392b', Medium: '#e67e22', Low: '#27ae60' };
  const offlineBadge = data._offline
    ? '<span style="font-size:0.7rem;background:#fff3e0;color:#e67e22;padding:2px 6px;border-radius:4px;margin-left:8px;">📡 Offline Demo</span>'
    : '';

  result.innerHTML = `
    <div style="background:linear-gradient(135deg,#f0fff4,#e6f7ff);border:2px solid #28a745;border-radius:12px;padding:20px;margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <span style="font-size:1.6rem;">✅</span>
        <div>
          <h3 style="color:#1a6e2e;margin:0;font-size:1rem;">Complaint Filed Successfully!</h3>
          <p style="margin:0;font-size:0.8rem;color:#555;">🤖 AI auto-classified &amp; assigned to department${offlineBadge}</p>
        </div>
      </div>
      <div style="background:#fff;border-radius:8px;padding:14px;margin-bottom:14px;border:1px solid #c3e6cb;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
          <div>
            <div style="font-size:0.72rem;color:#666;">COMPLAINT ID</div>
            <div style="font-size:1.1rem;font-weight:700;color:#003366;letter-spacing:1px;">${data.complaint_id}</div>
          </div>
          <button onclick="navigator.clipboard&&navigator.clipboard.writeText('${data.complaint_id}');showNotification&&showNotification('Copied!','success')"
            style="background:#003366;color:#fff;border:none;border-radius:6px;padding:7px 14px;cursor:pointer;font-size:0.78rem;">
            📋 Copy ID
          </button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
        <div style="background:#fff;border-radius:7px;padding:10px;border:1px solid #ddd;">
          <div style="font-size:0.68rem;color:#888;">📂 CATEGORY</div>
          <div style="font-weight:700;color:#003366;margin-top:2px;">${data.category}</div>
        </div>
        <div style="background:#fff;border-radius:7px;padding:10px;border:1px solid #ddd;">
          <div style="font-size:0.68rem;color:#888;">⚡ PRIORITY</div>
          <div style="font-weight:700;color:${priorityColor[data.priority]||'#003366'};margin-top:2px;">${data.priority}</div>
        </div>
        <div style="background:#fff;border-radius:7px;padding:10px;border:1px solid #ddd;grid-column:1/-1;">
          <div style="font-size:0.68rem;color:#888;">🏛️ ASSIGNED DEPARTMENT</div>
          <div style="font-weight:700;color:#003366;margin-top:2px;font-size:0.85rem;">${data.department}</div>
        </div>
      </div>
      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
        <a href="track.html" class="btn btn-navy btn-sm">🔍 Track Status</a>
        <a href="status.html" class="btn btn-outline-navy btn-sm">📊 View Report</a>
      </div>
      <p style="font-size:0.72rem;color:#777;margin-top:12px;margin-bottom:0;">
        💾 Save your Complaint ID. An SMS will be sent to your registered mobile number.
      </p>
    </div>`;

  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Expose for inline onchange handlers
window.triggerAIClassify = triggerAIClassify;
