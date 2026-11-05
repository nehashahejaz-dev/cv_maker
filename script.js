const $ = s => document.querySelector(s);
const KEY = 'cvmaker.v1';
const COLORS = ['#0a66c2', '#0f766e', '#6d28d9', '#be123c', '#1f2937'];
const STEPS = ['Personal', 'Summary', 'Experience', 'Education', 'Skills', 'Projects'];
const LISTS = {
  exp: { label: 'Experience', f: [['title', 'Job title', 'full'], ['org', 'Company', 'full'], ['start', 'Start', ''], ['end', 'End (or Present)', ''], ['desc', 'Achievements (one per line)', 'full', 1]] },
  edu: { label: 'Education', f: [['title', 'Degree / program', 'full'], ['org', 'University / school', 'full'], ['start', 'Start', ''], ['end', 'End', ''], ['desc', 'Details (optional)', 'full', 1]] },
  proj: { label: 'Project', f: [['title', 'Project name', 'full'], ['org', 'Link (optional)', 'full'], ['desc', 'What it does (one point per line)', 'full', 1]] }
};
const BLANK = { name: '', job: '', email: '', phone: '', location: '', linkedin: '', website: '', photo: '', summary: '', exp: [], edu: [], proj: [], skills: [], tpl: 'classic', accent: COLORS[0], hasExp: true };
const SAMPLE = {
  name: 'Ayesha Khan', job: 'Full-Stack Developer', email: 'ayesha@example.com', phone: '+92 300 1234567', location: 'Karachi, Pakistan',
  linkedin: 'linkedin.com/in/ayeshakhan', website: 'ayesha.dev',
  summary: 'Full-stack developer with 4+ years building Laravel, React and Flutter products. I turn unclear requirements into fast, maintainable apps and enjoy mentoring junior developers.',
  exp: [{ id: 1, title: 'Software Developer', org: 'Tech Company', start: 'Jan 2025', end: 'Present', desc: 'Built REST APIs in Laravel serving 20k+ users\nShipped a Flutter app to Play Store and App Store\nCut page load time by 40% with query and cache tuning' },
  { id: 2, title: 'Instructor', org: 'Computer Education Institute', start: '2021', end: '2024', desc: 'Taught programming and web development to 300+ students\nDesigned hands-on labs and project-based assessments' }],
  edu: [{ id: 3, title: 'BS Computer Science', org: 'University of Karachi', start: '2017', end: '2021', desc: '' }],
  proj: [{ id: 4, title: 'Hotel Management System', org: '', start: '', end: '', desc: 'MERN stack with admin and guest panels\nRoom booking, billing and reports' }],
  skills: ['PHP', 'Laravel', 'React', 'Node.js', 'MongoDB', 'Flutter', 'Dart', 'REST APIs']
};

let S = load(); if (!['classic','sidebar'].includes(S.tpl)) S.tpl = 'classic';
let  step = 0, uid = Date.now();

function load() { try { return { ...BLANK, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return { ...BLANK }; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { } }
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ph = (v, t) => v ? esc(v) : `<span class="ph">${t}</span>`;
const bullets = t => { const l = (t || '').split('\n').map(x => x.trim()).filter(Boolean); return l.length ? `<ul>${l.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''; };

/* ---------- Preview ---------- */
const href = v => /^(https?:|mailto:|tel:)/i.test(v) ? v : 'https://' + v;
const show = v => v.replace(/^https?:\/\//i, '').replace(/\/$/, '');
const lnk = (h, t) => `<a href="${esc(h)}" target="_blank" rel="noopener">${esc(t)}</a>`;
function contacts() {
  const c = [];
  if (S.email) c.push(lnk('mailto:' + S.email.trim(), S.email));
  if (S.phone) c.push(lnk('tel:' + S.phone.replace(/[^\d+]/g, ''), S.phone));
  if (S.location) c.push(esc(S.location));
  if (S.linkedin) c.push(lnk(href(S.linkedin.trim()), show(S.linkedin.trim())));
  if (S.website) c.push(lnk(href(S.website.trim()), show(S.website.trim())));
  return c;
}
function items(type) {
  return S[type].map(i => `<div class="it"><div class="row"><span>${esc(i.title) || '<span class="ph">Title</span>'}</span><span>${esc([i.start, i.end].filter(Boolean).join(' – '))}</span></div>${i.org ? `<div class="org">${type === 'proj' ? lnk(href(i.org.trim()), show(i.org.trim())) : esc(i.org)}</div>` : ''}${bullets(i.desc)}</div>`).join('');
}
function renderCV() {
  const cv = $('#cv'), side = S.tpl === 'sidebar';
  cv.className = side ? 'sidebar' : 'classic';
  document.documentElement.style.setProperty('--ac', S.accent);
  cv.style.setProperty('--ac', S.accent);
  const cs = contacts();
  const sum = S.summary ? `<p>${esc(S.summary)}</p>` : '<span class="ph">Write a short professional summary.</span>';
  const exp = S.hasExp ? `<h3>Experience</h3>${items('exp') || '<span class="ph">Add your work experience.</span>'}` : '';
  const edu = items('edu') || '<span class="ph">Add your education.</span>';
  const proj = (S.proj.length || !S.hasExp) ? `<h3>Projects</h3>${items('proj') || '<span class="ph">Add your projects.</span>'}` : '';
  const sk = S.skills.length ? S.skills.map(x => `<div>${esc(x)}</div>`).join('') : '<span class="ph">Add skills.</span>';
  const name = `<h1>${ph(S.name, 'Your Name')}</h1><div class="role">${ph(S.job, 'Job title')}</div>`;
  const skl = `<h3>Skills</h3>${S.skills.length ? `<p>${S.skills.map(esc).join(' &nbsp;|&nbsp; ')}</p>` : '<span class="ph">Add skills.</span>'}`;
  if (side) {
    cv.innerHTML = `<div class="wrap"><aside>
      ${S.photo ? `<div class="ph-img" style="background-image:url('${S.photo}')"></div>` : ''}
      <h3>Contact</h3>${cs.length ? cs.map(c => `<div class="ci">${c}</div>`).join('') : '<span class="ph">Email, phone, location</span>'}
      <h3>Skills</h3><div class="sk">${sk}</div>
      <h3>Education</h3>${edu}</aside>
      <main>${name.replace('class="role"', 'class="role"')}<h3>Profile</h3>${sum}${S.hasExp ? exp + proj : proj}</main></div>`;
  } else {
    cv.innerHTML = `<div class="head">${name}<div class="contact">${cs.length ? cs.map(c => `<span>${c}</span>`).join('') : '<span class="ph">Email • Phone • Location</span>'}</div></div>
      <div class="cols"><h3>Professional Summary</h3>${sum}${S.hasExp ? exp + `<h3>Education</h3>${edu}` + skl + proj : `<h3>Education</h3>${edu}` + proj + skl}</div>`;
  }
  fit(); progress(); save();
}
function fit() {
  const box = $('#fit'), cv = $('#cv');
  const sc = Math.min(1, box.clientWidth / 794);
  cv.style.transform = `scale(${sc})`;
  box.style.height = cv.offsetHeight * sc + 'px';
}
function progress() {
  const checks = [S.name, S.job, S.email, S.phone, S.summary.length > 40, (S.hasExp ? S.exp.length : S.proj.length), S.edu.length, S.skills.length >= 3];
  const p = Math.round(checks.filter(Boolean).length / checks.length * 100);
  $('#pct').textContent = p + '%'; $('#bar').style.width = p + '%';
}

/* ---------- Editors ---------- */
function renderList(type) {
  const L = LISTS[type];
  $('#list-' + type).innerHTML = S[type].map((it, n) => `
    <div class="item" data-id="${it.id}">
      <header><span>${L.label} ${n + 1}</span><div>
        <button class="ic" data-mv="-1" data-type="${type}" aria-label="Move up">↑</button>
        <button class="ic" data-mv="1" data-type="${type}" aria-label="Move down">↓</button>
        <button class="ic" data-rm="${type}" aria-label="Remove">✕</button></div></header>
      <div class="g">${L.f.map(([k, lab, cls, ta]) => `<div class="${cls}"><label>${lab}</label>${ta
      ? `<textarea rows="3" data-type="${type}" data-f="${k}">${esc(it[k])}</textarea>`
      : `<input type="text" data-type="${type}" data-f="${k}" value="${esc(it[k])}">`}</div>`).join('')}</div>
    </div>`).join('');
}
function renderChips() {
  $('#chips').innerHTML = S.skills.map((s, i) => `<span class="chip">${esc(s)}<button data-sk="${i}" aria-label="Remove ${esc(s)}">✕</button></span>`).join('');
}
function syncForm() {
  document.querySelectorAll('[data-k]').forEach(e => e.value = S[e.dataset.k] || '');
  $('#pv').style.backgroundImage = S.photo ? `url('${S.photo}')` : '';
  $('#cnt').textContent = S.summary.length;
  ['exp', 'edu', 'proj'].forEach(renderList); renderChips();
  document.querySelectorAll('#expSeg button').forEach(b => b.classList.toggle('on', (b.dataset.x === '1') === S.hasExp));
  const eb = document.querySelectorAll('#steps button')[2]; if (eb) eb.style.display = S.hasExp ? '' : 'none';
  document.querySelectorAll('#tplSeg button').forEach(b => b.classList.toggle('on', b.dataset.t === S.tpl));
  document.querySelectorAll('#swatches button').forEach(b => b.classList.toggle('on', b.dataset.c === S.accent));
}
function goStep(n) {
  step = Math.max(0, Math.min(STEPS.length - 1, n));
  document.querySelectorAll('.step').forEach(s => s.classList.toggle('on', +s.dataset.s === step));
  document.querySelectorAll('#steps button').forEach((b, i) => b.classList.toggle('on', i === step));
  $('#back').style.visibility = step ? 'visible' : 'hidden';
  $('#next').textContent = step === STEPS.length - 1 ? 'Download PDF' : 'Next';
}

/* ---------- Events ---------- */
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.k) {
    S[t.dataset.k] = t.value;
    if (t.dataset.k === 'summary') $('#cnt').textContent = t.value.length;
    if (t.dataset.k === 'email') { const bad = t.value && !/^\S+@\S+\.\S+$/.test(t.value); t.classList.toggle('bad', bad); $('#emailErr').style.display = bad ? 'block' : 'none'; }
    renderCV();
  } else if (t.dataset.f) {
    const it = S[t.dataset.type].find(i => i.id === +t.closest('.item').dataset.id);
    if (it) { it[t.dataset.f] = t.value; renderCV(); }
  }
});
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset;
  if (d.add) { S[d.add].push({ id: ++uid, title: '', org: '', start: '', end: '', desc: '' }); renderList(d.add); renderCV(); }
  else if (d.rm) { const id = +b.closest('.item').dataset.id; S[d.rm] = S[d.rm].filter(i => i.id !== id); renderList(d.rm); renderCV(); }
  else if (d.mv) {
    const a = S[d.type], i = a.findIndex(x => x.id === +b.closest('.item').dataset.id), j = i + +d.mv;
    if (j >= 0 && j < a.length) { [a[i], a[j]] = [a[j], a[i]]; renderList(d.type); renderCV(); }
  }
  else if (d.sk) { S.skills.splice(+d.sk, 1); renderChips(); renderCV(); }
  else if (d.x) { S.hasExp = d.x === '1'; syncForm(); renderCV(); }
  else if (d.t) { S.tpl = d.t; syncForm(); renderCV(); }
  else if (d.c) { S.accent = d.c; syncForm(); renderCV(); }
});
$('#skillIn').addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ',') return;
  e.preventDefault();
  const v = e.target.value.trim().replace(/,$/, '');
  if (v && !S.skills.some(s => s.toLowerCase() === v.toLowerCase())) { S.skills.push(v); renderChips(); renderCV(); }
  e.target.value = '';
});
$('#photo').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { // downscale so storage stays small
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'), s = 240, m = Math.min(img.width, img.height);
      c.width = c.height = s;
      c.getContext('2d').drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, s, s);
      S.photo = c.toDataURL('image/jpeg', .85); syncForm(); renderCV();
    };
    img.src = r.result;
  };
  r.readAsDataURL(f);
});
$('#sample').onclick = () => { S = { ...S, ...JSON.parse(JSON.stringify(SAMPLE)) }; syncForm(); renderCV(); };
$('#reset').onclick = () => { if (confirm('Clear all CV data?')) { S = { ...BLANK }; syncForm(); renderCV(); goStep(0); } };
$('#print').onclick = () => window.print();
const move = d => { let n = step + d; if (n === 2 && !S.hasExp) n += d; goStep(n); };
$('#back').onclick = () => move(-1);
$('#next').onclick = () => step === STEPS.length - 1 ? window.print() : move(1);
window.addEventListener('resize', fit);

/* ---------- Init ---------- */
$('#steps').innerHTML = STEPS.map((s, i) => `<button data-step="${i}">${s}</button>`).join('');
$('#steps').addEventListener('click', e => { if (e.target.dataset.step) goStep(+e.target.dataset.step); });
$('#swatches').innerHTML = COLORS.map(c => `<button data-c="${c}" style="background:${c}" aria-label="Accent ${c}"></button>`).join('');
syncForm(); renderCV(); goStep(0);