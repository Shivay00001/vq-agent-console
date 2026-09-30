/* VQ Agent Console — config-driven panels over n8n webhooks.
   No dependencies. Base URL configurable, stored in localStorage. */
'use strict';
const DEFAULT_BASE = 'https://automation-832k.onrender.com';
const LS_KEY = 'vq_console_base_url';

/* field: {k, label, t, ph, sample, opts, rows}
   t: text|tel|email|number|date|datetime|textarea|select
   sample "@+2h" = now+2h for datetime-local, "@now" = now ISO */
const AGENTS = [
/* ---------------- LEADS ---------------- */
{group:'Leads', name:'Instant Lead Responder — Demo', path:'lead-in',
 desc:'Scores any inbound lead HOT / WARM / COLD in ~1s. The demo you show prospects.',
 fields:[
  {k:'name',label:'Name',t:'text',sample:'Rahul Sharma'},
  {k:'phone',label:'Phone',t:'tel',sample:'+919876543210'},
  {k:'email',label:'Email',t:'email',sample:'rahul@example.com'},
  {k:'service',label:'Service',t:'select',opts:['AI Agent','Website','SEO','Ads'],sample:'AI Agent'},
  {k:'message',label:'Message',t:'textarea',rows:2,sample:'Hi, I need a quote urgently, please call me today'}]},
{group:'Leads', name:'AI Enquiry Agent', path:'enquiry-in',
 desc:'Understands the enquiry (booking / pricing / complaint) and drafts the ideal instant reply.',
 fields:[
  {k:'name',label:'Name',t:'text',sample:'Priya Nair'},
  {k:'phone',label:'Phone',t:'tel',sample:'+919812345678'},
  {k:'email',label:'Email',t:'email',sample:'priya@example.com'},
  {k:'channel',label:'Channel',t:'select',opts:['web','whatsapp'],sample:'web'},
  {k:'business',label:'Business',t:'text',sample:'Sharma Dental'},
  {k:'message',label:'Enquiry',t:'textarea',rows:2,sample:'Do you offer teeth cleaning? What are your prices?'}]},
{group:'Leads', name:'Website Lead Capture', path:'lead-form',
 desc:'Validates a website form submit, scores it, and raises an owner alert for HOT leads.',
 fields:[
  {k:'name',label:'Name',t:'text',sample:'Test User'},
  {k:'phone',label:'Phone',t:'tel',sample:'+919876543210'},
  {k:'email',label:'Email',t:'email',sample:'test@example.com'},
  {k:'service',label:'Service needed',t:'text',sample:'AI agent'}]},
{group:'Leads', name:'Ad Lead Instant Responder', path:'ad-lead',
 desc:'Fires the second a Meta/Google lead ad form is submitted — scores and drafts the first touch.',
 fields:[
  {k:'name',label:'Name',t:'text',sample:'Amit Verma'},
  {k:'phone',label:'Phone',t:'tel',sample:'+919812345678'},
  {k:'email',label:'Email',t:'email',sample:'amit@gmail.com'},
  {k:'campaign',label:'Campaign',t:'text',sample:'Diwali Offer'},
  {k:'platform',label:'Platform',t:'select',opts:['meta','google'],sample:'meta'}]},
{group:'Leads', name:'Follow-Up Engine', path:'followup-start',
 desc:'Builds the Day 0 / 2 / 7 follow-up sequence for a new lead.',
 note:'Returns the full message plan. Real sending needs a <b>callback_url</b> or provider keys.',
 fields:[
  {k:'name',label:'Name',t:'text',sample:'Priya'},
  {k:'phone',label:'Phone',t:'tel',sample:'+919876543210'},
  {k:'email',label:'Email',t:'email',sample:'priya@example.com'},
  {k:'interest',label:'Interested in',t:'text',sample:'AI chatbot'},
  {k:'business',label:'Business',t:'text',sample:'VisionQuantech'}]},

/* ---------------- CHAT & VOICE ---------------- */
{group:'Chat & Voice', name:'Website Chatbot', path:'chat',
 desc:'FAQ + lead capture chat. Keep the same session_id across turns to hold a conversation.',
 fields:[
  {k:'session_id',label:'Session ID',t:'text',sample:'demo-1'},
  {k:'message',label:'Message',t:'textarea',rows:2,sample:'What are your prices?'}]},
{group:'Chat & Voice', name:'WhatsApp AI Agent', path:'wa-in',
 desc:'Understands a WhatsApp message (Twilio-style fields) and drafts the reply.',
 note:'Drafts the reply only. Real delivery needs Twilio/Meta keys or a <b>callback_url</b>.',
 fields:[
  {k:'Body',label:'Body (message text)',t:'textarea',rows:2,sample:'Hi, I want to book an appointment'},
  {k:'From',label:'From (phone)',t:'tel',sample:'+919876543210'},
  {k:'ProfileName',label:'Profile name',t:'text',sample:'Rahul'}]},
{group:'Chat & Voice', name:'Email AI Agent', path:'email-in',
 desc:'Classifies an inbound email (billing / support / spam…) and drafts the reply.',
 note:'Drafts the reply only. Real sending needs Gmail/SMTP or a <b>callback_url</b>.',
 fields:[
  {k:'subject',label:'Subject',t:'text',sample:'Refund for invoice #123'},
  {k:'from',label:'From',t:'email',sample:'customer@example.com'},
  {k:'body',label:'Body',t:'textarea',rows:3,sample:'I was charged twice, please refund urgently'}]},
{group:'Chat & Voice', name:'AI Calling Agent', path:'call-in',
 desc:'Answers an inbound call with TwiML voice (booking IVR).',
 note:'Returns TwiML XML. Real calls need Twilio/Exotel. Business-hours check uses server time.',
 fields:[
  {k:'Caller',label:'Caller phone',t:'tel',sample:'+919876543210'},
  {k:'business',label:'Business',t:'text',sample:'VisionQuantech'}]},
{group:'Chat & Voice', name:'Call Choice (IVR)', path:'call-choice',
 desc:'Handles the caller\u2019s keypress from the IVR menu.',
 fields:[
  {k:'Digits',label:'Digits pressed',t:'select',opts:['1','2','9'],sample:'1'},
  {k:'Caller',label:'Caller phone',t:'tel',sample:'+919876543210'}]},

/* ---------------- BOOKINGS ---------------- */
{group:'Bookings', name:'Smart Booking Agent', path:'agent-booking',
 desc:'Takes a booking request, validates it, and confirms the slot.',
 note:'Logic-only: no real calendar or availability check until Google Calendar is connected.',
 fields:[
  {k:'name',label:'Name',t:'text',sample:'Rahul Sharma'},
  {k:'phone',label:'Phone',t:'tel',sample:'+919876543210'},
  {k:'email',label:'Email',t:'email',sample:'rahul@example.com'},
  {k:'booking_type',label:'Type',t:'select',opts:['appointment','table','room'],sample:'appointment'},
  {k:'date',label:'Date',t:'date',sample:'2026-09-28'},
  {k:'time',label:'Time',t:'text',ph:'HH:MM',sample:'11:00'},
  {k:'party_size',label:'Party size',t:'number',sample:'2'},
  {k:'notes',label:'Notes',t:'text',sample:''}]},
{group:'Bookings', name:'Appointment Booker + Reminders', path:'booking-in', badge:'Needs Google setup',
 desc:'Books on Google Calendar and schedules reminders.',
 note:'<b>Requires Google OAuth</b> (Calendar + Gmail). Will error until connected.',
 fields:[
  {k:'name',label:'Name',t:'text',sample:'Rahul Sharma'},
  {k:'phone',label:'Phone',t:'tel',sample:'+919876543210'},
  {k:'service',label:'Service',t:'text',sample:'Dental checkup'},
  {k:'datetime',label:'Date & time',t:'datetime',sample:'@+2h'}]},
{group:'Bookings', name:'Reminder Sender', path:'reminder-in',
 desc:'Schedules a reminder for a future time.',
 note:'Schedules and validates. Real delivery needs a <b>callback_url</b> or provider keys.',
 fields:[
  {k:'to',label:'To (phone)',t:'tel',sample:'+919876543210'},
  {k:'message',label:'Message',t:'textarea',rows:2,sample:'Your appointment is tomorrow at 11 AM'},
  {k:'send_at',label:'Send at',t:'datetime',sample:'@+2h'}]},
{group:'Bookings', name:'After-Hours Lead Catcher', path:'missed-call',
 desc:'Catches a missed call after hours and drafts the instant callback text.',
 fields:[
  {k:'caller_phone',label:'Caller phone',t:'tel',sample:'+919876543210'},
  {k:'caller_name',label:'Caller name',t:'text',sample:'Rahul'},
  {k:'business',label:'Business',t:'text',sample:'Sharma Clinic'},
  {k:'business_open',label:'Opens',t:'text',ph:'HH:MM',sample:'09:00'},
  {k:'business_close',label:'Closes',t:'text',ph:'HH:MM',sample:'21:00'},
  {k:'missed_at',label:'Missed at',t:'datetime',sample:'@now'}]},

/* ---------------- MARKETING ---------------- */
{group:'Marketing', name:'Local SEO Audit', path:'seo-audit',
 desc:'Fetches a website and scores on-page SEO 0\u2013100 with fixes.',
 note:'Takes 20\u201360s \u2014 it really fetches and reads the site.',
 fields:[
  {k:'url',label:'Website URL',t:'text',sample:'https://example.com'},
  {k:'business_name',label:'Business',t:'text',sample:'Example Co'}]},
{group:'Marketing', name:'Keyword Planner', path:'kw-in',
 desc:'Generates keyword ideas + content briefs from a seed keyword.',
 note:'Heuristic generator, not live search-volume data.',
 fields:[
  {k:'seed_keyword',label:'Seed keyword',t:'text',sample:'real estate'},
  {k:'location',label:'Location',t:'text',sample:'Mumbai'},
  {k:'business_type',label:'Business type',t:'text',sample:'agency'}]},
{group:'Marketing', name:'Local Presence Booster', path:'presence-in',
 desc:'Builds the Google-Maps visibility plan: checklist, review plan, post ideas.',
 note:'Action plan, not live Maps ranking data (that needs a SERP API).',
 fields:[
  {k:'business_name',label:'Business',t:'text',sample:'Sharma Dental'},
  {k:'category',label:'Category',t:'text',sample:'Dentist'},
  {k:'city',label:'City',t:'text',sample:'Mumbai'}]},
{group:'Marketing', name:'Review Request Agent', path:'review-ask',
 desc:'Happy customer \u2192 review link. Unhappy \u2192 owner-resolution path.',
 fields:[
  {k:'name',label:'Name',t:'text',sample:'Rahul'},
  {k:'phone',label:'Phone',t:'tel',sample:'+919876543210'},
  {k:'rating',label:'Rating',t:'select',opts:['5','4','3','2','1'],sample:'5'},
  {k:'review_link',label:'Review link',t:'text',sample:'https://g.page/demo'},
  {k:'business',label:'Business',t:'text',sample:'Sharma Dental'}]},

/* ---------------- OPERATIONS ---------------- */
{group:'Operations', name:'Support Ticket Triage', path:'ticket-in',
 desc:'Classifies a ticket (billing / technical / account) and sets urgency + escalation.',
 fields:[
  {k:'subject',label:'Subject',t:'text',sample:'Site outage \u2014 website is down'},
  {k:'body',label:'Body',t:'textarea',rows:2,sample:'Down since morning, urgent fix needed'}]},
{group:'Operations', name:'AI SDR Agent', path:'sdr-lead',
 desc:'Qualifies a lead 0\u2013100, writes the first-touch message, suggests IST meeting slots.',
 fields:[
  {k:'name',label:'Name',t:'text',sample:'Priya'},
  {k:'company',label:'Company',t:'text',sample:'Acme Realty'},
  {k:'email',label:'Email',t:'email',sample:'priya@acmerealty.com'},
  {k:'phone',label:'Phone',t:'tel',sample:'+919876543210'},
  {k:'budget_hint',label:'Budget hint',t:'text',sample:'approved 50k'},
  {k:'need',label:'Need',t:'textarea',rows:2,sample:'Need AI chatbot for lead follow-up'}]},
{group:'Operations', name:'Document Processing', path:'doc-in',
 desc:'Extracts invoice no, date, vendor, total from pasted text. Routes auto vs human review.',
 note:'Reads extracted <b>text</b> \u2014 scanned PDFs/images need OCR first.',
 fields:[
  {k:'text',label:'Document text',t:'textarea',rows:4,sample:'INVOICE #INV-2041\nDate: 12/09/2026\nABC Traders\nGrand Total: Rs. 45,000'},
  {k:'doc_type',label:'Type',t:'select',opts:['invoice','receipt','document'],sample:'invoice'}]},
{group:'Operations', name:'Lead Responder Pro', path:'lead-in-pro', badge:'Needs Google setup',
 desc:'Pro responder: logs to Google Sheets and emails the owner.',
 note:'<b>Requires Google OAuth</b> (Gmail + Sheets). Will error until connected.',
 fields:[
  {k:'name',label:'Name',t:'text',sample:'Rahul Sharma'},
  {k:'phone',label:'Phone',t:'tel',sample:'+919876543210'},
  {k:'email',label:'Email',t:'email',sample:'rahul@example.com'},
  {k:'service',label:'Service',t:'text',sample:'AI Agent'},
  {k:'message',label:'Message',t:'textarea',rows:2,sample:'Need pricing urgently'}]},
];

const GROUPS = ['Leads','Chat & Voice','Bookings','Marketing','Operations'];

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
function baseUrl(){ return ($('#baseUrl').value || DEFAULT_BASE).replace(/\/+$/,''); }
function fmtDT(d){ const p=n=>String(n).padStart(2,'0'); return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes()); }
function sampleVal(f){
  if(f.sample==='@+2h') return fmtDT(new Date(Date.now()+2*3600e3));
  if(f.sample==='@now') return fmtDT(new Date());
  return f.sample || '';
}
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function highlight(json){
  return esc(json).replace(/(&quot;([^&]|&(?!quot;))*?&quot;)(\s*:)?/g, m=>{
    if(/:\s*$/.test(m)) return '<span class="tok-k">'+m.replace(/\s*:$/,'')+'</span><span class="tok-p">:</span>';
    return '<span class="tok-s">'+m+'</span>';
  }).replace(/\b(true|false|null)\b/g,'<span class="tok-b">$1</span>')
    .replace(/(^|[\s\[,:])(-?\d[\d.]*)/g,'$1<span class="tok-n">$2</span>');
}

/* ---------- render ---------- */
function fieldHTML(f,i){
  const id='f_'+i+'_'+f.k, v=esc(sampleVal(f)), ph=f.ph?` placeholder="${esc(f.ph)}"`:'';
  const lab=`<label class="f${f.t==='textarea'?' full':''}">${esc(f.label)}`;
  let inp='';
  if(f.t==='select') inp=`<select id="${id}" data-k="${esc(f.k)}">${f.opts.map(o=>`<option${o===f.sample?' selected':''}>${esc(o)}</option>`).join('')}</select>`;
  else if(f.t==='textarea') inp=`<textarea id="${id}" data-k="${esc(f.k)}" rows="${f.rows||3}"${ph}>${v}</textarea>`;
  else if(f.t==='datetime') inp=`<input id="${id}" data-k="${esc(f.k)}" type="datetime-local" value="${v}">`;
  else inp=`<input id="${id}" data-k="${esc(f.k)}" type="${f.t||'text'}" value="${v}"${ph}>`;
  return lab+inp+'</label>';
}
function cardHTML(a,i){
  return `<div class="card" data-group="${esc(a.group)}" id="card${i}">
    <h3>${esc(a.name)} ${a.badge?`<span class="badge">${esc(a.badge)}</span>`:''}</h3>
    <p class="desc">${esc(a.desc)}</p>
    <div class="ep"><span class="m">POST</span><span class="p" data-url title="click to copy">/webhook/${esc(a.path)}</span></div>
    ${a.note?`<div class="note">${a.note}</div>`:''}
    <form id="form${i}">${a.fields.map((f,j)=>fieldHTML(f,i+'_'+j)).join('')}</form>
    <div class="actions">
      <button class="btn" data-send="${i}">Send</button>
      <button class="btn ghost" data-curl="${i}">Copy as cURL</button>
    </div>
    <div class="result" id="res${i}">
      <div class="rhead"><span class="pill" id="pill${i}"></span><span id="meta${i}"></span></div>
      <pre class="out" id="out${i}"></pre>
      <details class="req"><summary>Request JSON</summary><pre class="out" id="req${i}"></pre></details>
    </div>
  </div>`;
}
function render(){
  $('#groupNav').innerHTML = GROUPS.map((g,i)=>`<button data-g="${esc(g)}" class="${i===0?'active':''}">${esc(g)}</button>`).join('');
  $('#panels').innerHTML = AGENTS.map(cardHTML).join('');
  filterGroup(GROUPS[0]);
}
function filterGroup(g){
  document.querySelectorAll('#groupNav button').forEach(b=>b.classList.toggle('active',b.dataset.g===g));
  document.querySelectorAll('.card').forEach(c=>c.style.display = c.dataset.group===g?'':'none');
}
function payloadFor(i){
  const p={};
  document.querySelectorAll('#form'+i+' [data-k]').forEach(el=>{ p[el.dataset.k]=el.value; });
  return p;
}
async function send(i){
  const a=AGENTS[i], btn=document.querySelector(`[data-send="${i}"]`);
  const payload=payloadFor(i), url=baseUrl()+'/webhook/'+a.path;
  btn.disabled=true; btn.textContent='Sending\u2026';
  const t0=performance.now();
  try{
    const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const ms=Math.round(performance.now()-t0);
    const ct=r.headers.get('content-type')||'';
    const text=await r.text();
    let pretty=text;
    if(ct.includes('json')){ try{ pretty=JSON.stringify(JSON.parse(text),null,2); }catch(e){} }
    show(i,r.ok,r.status,ms,ct.includes('json')?highlight(pretty):esc(pretty),highlight(JSON.stringify(payload,null,2)));
  }catch(e){
    const ms=Math.round(performance.now()-t0);
    show(i,false,'ERR',ms,'',esc('Request failed: '+e.message+'\nIs the n8n instance awake? Is the base URL correct?'),highlight(JSON.stringify(payload,null,2)));
  }
  btn.disabled=false; btn.textContent='Send';
}
function show(i,ok,status,ms,bodyHTML,reqHTML){
  $('#res'+i).classList.add('show');
  const pill=$('#pill'+i);
  pill.textContent = status===200||status==='OK' ? status+' OK' : 'HTTP '+status;
  pill.className='pill '+(ok?'ok':'err');
  $('#meta'+i).textContent=ms+' ms';
  $('#out'+i).innerHTML=bodyHTML;
  $('#req'+i).innerHTML=reqHTML;
}
function curlFor(i){
  const a=AGENTS[i];
  const q=`curl -X POST ${baseUrl()}/webhook/${a.path} -H "Content-Type: application/json" -d '${JSON.stringify(payloadFor(i))}'`;
  navigator.clipboard.writeText(q).then(()=>toast('cURL copied'));
}
function toast(msg){
  const t=document.createElement('div');
  t.textContent=msg; t.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0d2b1f;color:#34d399;border:1px solid #14532d;padding:8px 18px;border-radius:20px;font-size:13px;z-index:99';
  document.body.appendChild(t); setTimeout(()=>t.remove(),1800);
}

/* ---------- wire up ---------- */
document.addEventListener('click',e=>{
  const nav=e.target.closest('#groupNav button'); if(nav){ filterGroup(nav.dataset.g); return; }
  const s=e.target.closest('[data-send]'); if(s){ send(+s.dataset.send); return; }
  const c=e.target.closest('[data-curl]'); if(c){ curlFor(+c.dataset.curl); return; }
  const u=e.target.closest('[data-url]'); if(u){ navigator.clipboard.writeText(baseUrl()+'/webhook/'+u.textContent.replace('/webhook/','')).then(()=>toast('URL copied')); return; }
});
$('#saveBase').addEventListener('click',()=>{
  localStorage.setItem(LS_KEY,$('#baseUrl').value.trim());
  toast('Base URL saved');
});
(function init(){
  const saved=localStorage.getItem(LS_KEY);
  $('#baseUrl').value=saved||DEFAULT_BASE;
  render();
})();
