const express = require('express');
const path = require('path');
const {
  leads, customers, contacts, orderDetails, products, quotes, approvals,
  promotionTasks, timelineEvents, followUpRecords, businessOpportunities,
  salespersonPoints, calcClaimLimit, daysSince,
  leadStageMap, customerStageMap, levelColors, leadStageColors, customerStageColors,
  quoteStatusMap, taskStatusMap, opportunityStageMap, opportunityStageColors,
  followUpTypeMap, timelineTypeIcons, funnelStats, productStats, salespersonFunnel,
} = require('./data/mock-data');

const app = express();
const PORT = process.env.PORT || 3002;

// In-memory state for approvals (simulates React state)
let localApprovals = JSON.parse(JSON.stringify(approvals));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ── Workbench ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  const publicLeads = leads.filter(l => l.followers.length === 0);
  const pendingApprovals = localApprovals.filter(a => a.status === 'pending');
  const activeTasks = promotionTasks.filter(t => t.status === 'active');

  const leadReminders = leads
    .filter(l => { const d = daysSince(l.lastFollowUpDate); return d === null || d > 7; })
    .slice(0, 3)
    .map(l => ({
      id: `L-${l.id}`, link: `/leads/${l.id}`, type: 'warning',
      text: `线索「${l.company}」${l.lastFollowUpDate ? `已 ${daysSince(l.lastFollowUpDate)} 天未跟进` : '尚未跟进'}`,
    }));

  const customerReminders = customers
    .filter(c => { const d = daysSince(c.lastOrderDate); return d !== null && d > 60; })
    .slice(0, 3)
    .map(c => ({
      id: `C-${c.id}`, link: `/customers/${c.id}`, type: 'order',
      text: `客户「${c.company}」已 ${daysSince(c.lastOrderDate)} 天未下单`,
    }));

  res.render('index', {
    page: 'workbench',
    publicLeadsCount: publicLeads.length,
    customersCount: customers.length,
    pendingApprovals,
    activeTasks,
    allReminders: [...leadReminders, ...customerReminders],
    recentQuotes: quotes.slice(0, 3),
    quoteStatusMap,
  });
});

// ── Leads ──────────────────────────────────────────────────────────────────
app.get('/leads', (req, res) => {
  const CURRENT_USER = '李明';
  const myPoints = salespersonPoints.find(p => p.name === CURRENT_USER);
  const claimLimit = myPoints ? calcClaimLimit(myPoints) : 5;
  res.render('leads/index', {
    page: 'leads',
    leads,
    leadStageMap,
    leadStageColors,
    daysSince,
    myPoints,
    claimLimit,
    CURRENT_USER,
    followUpTypeMap,
  });
});

app.get('/leads/search', (req, res) => {
  res.render('leads/search', { page: 'leads-search', leads, customers });
});

app.get('/leads/:id', (req, res) => {
  const lead = leads.find(l => l.id === req.params.id);
  if (!lead) return res.redirect('/leads');
  const leadContacts = contacts.filter(c => c.relatedId === lead.id);
  const leadFollowUps = followUpRecords.filter(f => f.leadId === lead.id);
  const leadOpps = businessOpportunities.filter(o => o.relatedId === lead.id);
  res.render('leads/detail', {
    page: 'leads',
    lead, leadContacts, leadFollowUps, leadOpps,
    leadStageMap, leadStageColors, followUpTypeMap, opportunityStageMap, opportunityStageColors,
    daysSince,
  });
});

// ── Customers ──────────────────────────────────────────────────────────────
app.get('/customers', (req, res) => {
  res.render('customers/index', {
    page: 'customers',
    customers,
    customerStageMap,
    customerStageColors,
    levelColors,
    daysSince,
  });
});

app.get('/customers/:id', (req, res) => {
  const customer = customers.find(c => c.id === req.params.id);
  if (!customer) return res.redirect('/customers');
  const customerContacts = contacts.filter(c => c.relatedId === customer.id);
  const customerTimeline = timelineEvents.filter(e => e.customerId === customer.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const customerQuotes = quotes.filter(q => q.customerId === customer.id);
  const customerOrders = orderDetails.filter(o => o.customerId === customer.id);
  const customerOpps = businessOpportunities.filter(o => o.relatedId === customer.id);
  const totalRevenue = customerOrders.reduce((s, o) => s + o.totalAmount, 0);
  const defaultTab = req.query.tab || 'orders';
  res.render('customers/detail', {
    page: 'customers',
    customer, customerContacts, customerTimeline, customerQuotes,
    customerOrders, customerOpps, totalRevenue, defaultTab,
    customerStageMap, customerStageColors, levelColors,
    quoteStatusMap, timelineTypeIcons, opportunityStageMap, opportunityStageColors,
    daysSince,
  });
});

// ── Opportunities ──────────────────────────────────────────────────────────
app.get('/opportunities', (req, res) => {
  res.render('opportunities/index', {
    page: 'opportunities',
    opportunities: businessOpportunities,
    opportunityStageMap,
    opportunityStageColors,
  });
});

// ── Promotions ─────────────────────────────────────────────────────────────
app.get('/promotions', (req, res) => {
  res.render('promotions/index', {
    page: 'promotions',
    promotionTasks,
    taskStatusMap,
    products,
  });
});

app.get('/promotions/new', (req, res) => {
  res.render('promotions/new', { page: 'promotions', products });
});

app.get('/promotions/monitor', (req, res) => {
  res.render('promotions/monitor', {
    page: 'promotions-monitor',
    promotionTasks,
    taskStatusMap,
  });
});

app.get('/promotions/:id', (req, res) => {
  const task = promotionTasks.find(t => t.id === req.params.id);
  if (!task) return res.redirect('/promotions');
  res.render('promotions/detail', {
    page: 'promotions',
    task,
    taskStatusMap,
    customers,
    leads,
  });
});

// ── Quotes ─────────────────────────────────────────────────────────────────
app.get('/quotes', (req, res) => {
  res.render('quotes/index', {
    page: 'quotes',
    quotes,
    quoteStatusMap,
  });
});

app.get('/quotes/new', (req, res) => {
  const customerId = req.query.customerId || '';
  const customer = customers.find(c => c.id === customerId);
  res.render('quotes/new', {
    page: 'quotes',
    customers,
    products,
    customer: customer || null,
  });
});

// ── Approvals ──────────────────────────────────────────────────────────────
app.get('/approvals', (req, res) => {
  res.render('approvals/index', {
    page: 'approvals',
    approvals: localApprovals,
  });
});

app.post('/approvals/:id/approve', (req, res) => {
  const a = localApprovals.find(x => x.id === req.params.id);
  if (a) { a.status = 'approved'; a.approvedBy = '张总'; a.approvedAt = new Date().toISOString().slice(0, 10); }
  res.redirect('/approvals');
});

app.post('/approvals/:id/reject', (req, res) => {
  const a = localApprovals.find(x => x.id === req.params.id);
  if (a) { a.status = 'rejected'; a.approvedBy = '张总'; a.approvedAt = new Date().toISOString().slice(0, 10); }
  res.redirect('/approvals');
});

// ── Reports ────────────────────────────────────────────────────────────────
app.get('/reports', (req, res) => {
  res.render('reports/index', {
    page: 'reports',
    funnelStats,
    productStats,
    salespersonFunnel,
    customers,
    leads,
  });
});

// ── Settings ───────────────────────────────────────────────────────────────
app.get('/settings', (req, res) => {
  res.render('settings/index', { page: 'settings' });
});

app.listen(PORT, () => {
  console.log(`CRM running at http://localhost:${PORT}`);
});
