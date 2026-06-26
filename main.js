/* ============================================================
   RADDECORE ERP — Main JavaScript
   ============================================================ */

const MODULES = [
  { icon:'💰', color:'rgba(79,140,255,.18)', name:'Accounting & Finance', desc:'Full double-entry bookkeeping, P&L, balance sheets, bank reconciliation, and automated invoicing with multi-currency support.', feats:['Invoicing & billing','Bank reconciliation','Tax compliance','Multi-currency ledger'] },
  { icon:'📦', color:'rgba(34,211,160,.18)', name:'Inventory Management', desc:'Real-time stock tracking, purchase orders, supplier management, and warehouse operations across all locations.', feats:['Real-time stock tracking','Purchase orders','Low-stock alerts','Multi-warehouse support'] },
  { icon:'👥', color:'rgba(124,92,252,.18)', name:'CRM', desc:'End-to-end customer lifecycle management — leads, deals, contacts, and support tickets in one unified view.', feats:['Lead & deal pipeline','Contact management','Email sequences','Support ticketing'] },
  { icon:'🏢', color:'rgba(255,107,74,.18)', name:'HR & Payroll', desc:'Employee records, attendance, leave management, automated payroll calculations, and compliance reporting.', feats:['Payroll automation','Leave management','Performance reviews','Org chart builder'] },
  { icon:'🍽', color:'rgba(250,176,53,.18)', name:'Restaurant Module', desc:'Table management, KOT/BOT printing, recipe costing, and integrated POS for food service businesses of any size.', feats:['Table & KOT system','Recipe costing','POS integration','Delivery tracking'] },
  { icon:'🏪', color:'rgba(34,211,160,.18)', name:'Retail & POS', desc:'Barcode scanning, cashier workflows, loyalty programs, and omnichannel inventory sync for retail operations.', feats:['Barcode scanner POS','Loyalty rewards','Returns & exchanges','Shift reporting'] },
  { icon:'🌿', color:'rgba(79,140,255,.18)', name:'Multi-branch Support', desc:'Manage unlimited locations from a single dashboard with consolidated reporting and branch-level granular controls.', feats:['Branch dashboards','Consolidated reports','Inter-branch transfers','Location-based RBAC'] },
  { icon:'🔒', color:'rgba(124,92,252,.18)', name:'Audit & Compliance', desc:'Full immutable audit trails, role-based access control, GDPR compliance tools, and automated compliance checks.', feats:['Immutable audit logs','Role permissions','GDPR toolkit','SOC 2 ready'] },
];

const PLANS = [
  {
    name: 'Starter', monthly: 49, yearly: 39,
    desc: 'Perfect for small businesses just getting started with ERP.',
    features: ['5 users included','10 GB storage','Accounting + Inventory','Basic reporting','Email support','1 branch location'],
    cta: 'Start Free Trial', ctaHref: '/auth/signup?plan=starter', fill: false, popular: false,
  },
  {
    name: 'Pro', monthly: 149, yearly: 119,
    desc: 'For growing teams that need automation and full module access.',
    features: ['25 users included','50 GB storage','All 8 core modules','CRM + HR + Payroll','Advanced reporting','Priority support','5 branch locations'],
    cta: 'Start Free Trial', ctaHref: '/auth/signup?plan=pro', fill: true, popular: true,
  },
  {
    name: 'Enterprise', monthly: 399, yearly: 319,
    desc: 'Custom power and integrations for large organisations.',
    features: ['Unlimited users','Scalable storage','All modules + Open API','Custom integrations','Dedicated account manager','SLA-backed support','Unlimited branches'],
    cta: 'Talk to Sales', ctaHref: null, fill: false, popular: false,
  },
];

const FEATURE_ROWS = [
  ['Users','5','25','Unlimited'],
  ['Storage','10 GB','50 GB','Scalable'],
  ['Accounting','✓','✓','✓'],
  ['Inventory','✓','✓','✓'],
  ['CRM','—','✓','✓'],
  ['HR & Payroll','—','✓','✓'],
  ['Restaurant/Retail','—','✓','✓'],
  ['Open API','—','—','✓'],
  ['Custom Integrations','—','—','✓'],
  ['Branches','1','5','Unlimited'],
  ['Support','Email','Priority','Dedicated'],
];

const CHART_DATA = [
  { m:'Jun', prod:42, serv:28 }, { m:'Jul', prod:55, serv:32 },
  { m:'Aug', prod:48, serv:29 }, { m:'Sep', prod:61, serv:36 },
  { m:'Oct', prod:52, serv:31 }, { m:'Nov', prod:68, serv:40 },
  { m:'Dec', prod:58, serv:35 },
];

const TESTIMONIALS = [
  { quote:'Raddecore replaced four separate tools we were using. Inventory, accounting, CRM and HR are now completely connected. Our ops team saves about 12 hours a week.', name:'Sarah Mitchell', role:'COO, FreshMart Retail Group', initials:'SM' },
  { quote:'The restaurant module is genuinely the best we have ever used. KOT routing, table management, and recipe costing in one place. Setup took less than a day.', name:'Rajesh Patel', role:'Owner, PizzaCraft (14 locations)', initials:'RP' },
  { quote:'We manage 8 hotel branches across 3 countries. Multi-branch reporting and the role-based access system alone were worth the switch. The support team is world-class.', name:'Emma van der Berg', role:'Director of Finance, Meridian Hotels', initials:'EV' },
];

let currentBilling = 'monthly';
let kpiAnimated = false;

/* -- SALES MODAL ------------------------------------------ */

window.openSalesModal = function() {
  const modal = document.getElementById('salesModal');
  if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
};

window.closeSalesModal = function() {
  const modal = document.getElementById('salesModal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
};

function initSalesModal() {
  const modal = document.getElementById('salesModal');
  if (!modal) return;

  // Close on backdrop click
  modal.addEventListener('click', e => { if (e.target === modal) window.closeSalesModal(); });

  // Form submit
  const form = document.getElementById('salesForm');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('salesSubmitBtn');
    const errEl = document.getElementById('salesError');
    const successEl = document.getElementById('salesSuccess');
    if (errEl) errEl.style.display = 'none';
    btn.textContent = 'Sending…';
    btn.disabled = true;
    try {
      const res = await fetch('https://formspree.io/f/xgoqzjdl', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (res.ok) {
        form.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
        setTimeout(() => window.closeSalesModal(), 4000);
      } else {
        if (errEl) errEl.style.display = 'block';
        btn.textContent = 'Send Message →';
        btn.disabled = false;
      }
    } catch {
      if (errEl) errEl.style.display = 'block';
      btn.textContent = 'Send Message →';
      btn.disabled = false;
    }
  });
}

/* -- MODULES ---------------------------------------------- */

function renderModules() {
  const grid = document.getElementById('modulesGrid');
  if (!grid) return;
  grid.innerHTML = MODULES.map(m => `
    <div class="mod-card reveal">
      <div class="mod-icon" style="background:${m.color}">${m.icon}</div>
      <h3>${m.name}</h3>
      <p>${m.desc}</p>
      <div class="mod-feats">${m.feats.map(f => `<div class="mod-feat">${f}</div>`).join('')}</div>
    </div>`).join('');
  initReveal();
}

/* -- PRICING ---------------------------------------------- */

function renderPlans() {
  const grid = document.getElementById('plansGrid');
  if (!grid) return;

  grid.innerHTML = PLANS.map(p => {
    const price = currentBilling === 'monthly' ? p.monthly : p.yearly;
    const savingNote = currentBilling === 'yearly'
      ? `<span style="color:var(--accent3);font-size:11px;margin-left:4px">20% off</span>` : '';
    // Talk to Sales opens modal; other plans navigate
    const onclickAttr = p.cta === 'Talk to Sales'
      ? `onclick="openSalesModal()"`
      : `onclick="window.location.href='${p.ctaHref}'"`;

    return `
      <div class="plan-card${p.popular ? ' popular' : ''}">
        ${p.popular ? '<div class="plan-badge">MOST POPULAR</div>' : ''}
        <div class="plan-name">${p.name}</div>
        <div class="plan-price">
          <span class="price-dollar">$</span>
          <span class="price-num">${price}</span>
          <span class="price-per">/ mo</span>
        </div>
        <p class="plan-desc">${p.desc} ${savingNote}</p>
        <div class="plan-feats">
          ${p.features.map(f => `<div class="pf"><div class="pf-check">✓</div>${f}</div>`).join('')}
        </div>
        <button class="plan-cta ${p.fill ? 'plan-cta-fill' : 'plan-cta-ghost'}" ${onclickAttr}>
          ${p.cta}
        </button>
      </div>`;
  }).join('');
}

function renderCompareTable() {
  const table = document.getElementById('compareTable');
  if (!table) return;
  const headers = ['Feature','Starter','Pro','Enterprise'];
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach(h => { const th = document.createElement('th'); th.textContent = h; headerRow.appendChild(th); });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  FEATURE_ROWS.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach((cell, ci) => {
      const td = document.createElement('td');
      td.textContent = cell;
      if (cell === '✓') td.style.color = 'var(--accent3)';
      if (cell === '—') td.style.color = 'var(--txt3)';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

window.setBilling = function(b) {
  currentBilling = b;
  document.getElementById('btnMonthly')?.classList.toggle('active', b === 'monthly');
  document.getElementById('btnYearly')?.classList.toggle('active', b === 'yearly');
  renderPlans();
};

/* -- CHART ------------------------------------------------ */

function renderChart() {
  const container = document.getElementById('barChart');
  if (!container) return;
  const maxVal = Math.max(...CHART_DATA.map(d => d.prod + d.serv));
  container.innerHTML = CHART_DATA.map(d => {
    const prodH = Math.round((d.prod / maxVal) * 90);
    const servH = Math.round((d.serv / maxVal) * 90);
    return `<div class="bar-col">
      <div class="bar-stack">
        <div class="bar-seg" style="height:${prodH}px;background:#4f8cff;border-radius:3px 3px 0 0"></div>
        <div class="bar-seg" style="height:${servH}px;background:#7c5cfc;border-radius:0"></div>
      </div>
      <span class="bar-month">${d.m}</span>
    </div>`;
  }).join('');
}

/* -- TESTIMONIALS ----------------------------------------- */

function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;
  grid.innerHTML = TESTIMONIALS.map(t => `
    <div class="testi-card reveal">
      <div class="testi-stars">★★★★★</div>
      <p class="testi-quote">"${t.quote}"</p>
      <div class="testi-author">
        <div class="testi-avatar">${t.initials}</div>
        <div><div class="testi-name">${t.name}</div><div class="testi-role">${t.role}</div></div>
      </div>
    </div>`).join('');
  initReveal();
}

/* -- KPI COUNTER ------------------------------------------ */

function animateKPIs() {
  if (kpiAnimated) return;
  kpiAnimated = true;
  const kpis = [
    { id:'kpi-rev',    end:248920, format: v => '$' + Math.round(v).toLocaleString() },
    { id:'kpi-orders', end:1847,   format: v => Math.round(v).toLocaleString() },
    { id:'kpi-cust',   end:12403,  format: v => Math.round(v).toLocaleString() },
    { id:'kpi-margin', end:64.2,   format: v => v.toFixed(1) + '%' },
  ];
  const duration = 1800;
  kpis.forEach(kpi => {
    const el = document.getElementById(kpi.id);
    if (!el) return;
    let startTime = null;
    const step = ts => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = kpi.format(ease * kpi.end);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* -- SCROLL REVEAL ---------------------------------------- */

let revealObserver;
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

function watchKPIs() {
  const kpiEl = document.getElementById('kpiGrid');
  if (!kpiEl) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateKPIs(); obs.disconnect(); }
  }, { threshold: 0.3 });
  obs.observe(kpiEl);
}

/* -- NAVBAR ----------------------------------------------- */

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 40 ? 'rgba(8,9,12,.96)' : 'rgba(8,9,12,.85)';
  }, { passive: true });
}

/* -- MOBILE MENU ------------------------------------------ */

function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.style.display === 'flex';
    links.style.cssText = open ? '' : 'display:flex;flex-direction:column;position:absolute;top:64px;left:0;right:0;background:var(--bg2);padding:20px 5%;gap:16px;border-bottom:1px solid var(--border);z-index:199';
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { if (window.innerWidth < 768) links.style.cssText = ''; });
  });
}

/* -- SMOOTH SCROLL ---------------------------------------- */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });
}

/* -- COPY DEMO URL ---------------------------------------- */

window.copyDemoUrl = function() {
  navigator.clipboard.writeText('https://demo.raddecore.com').then(() => {
    const btn = document.querySelector('.copy-btn');
    if (btn) {
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.color = 'var(--accent3)';
      setTimeout(() => { btn.textContent = original; btn.style.color = ''; }, 2000);
    }
  });
};

/* -- SIDEBAR ---------------------------------------------- */

function initDashSidebar() {
  document.querySelectorAll('.s-item').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('.s-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

/* -- INIT ------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  renderModules();
  renderPlans();
  renderCompareTable();
  renderChart();
  renderTestimonials();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initSalesModal();
  initReveal();
  watchKPIs();
  initDashSidebar();
});
