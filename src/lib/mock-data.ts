export interface Contact {
  id: string;
  relatedType: "lead" | "customer";
  relatedId: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  notes?: string;
}

export interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  source: string;
  status: "pending_contact" | "contacting" | "interacting" | "invalid";
  lastEmailDate?: string;
  extensionRequested?: boolean;
  industry: string;
  country: string;
  createdAt: string;
  followers: string[];
  lastFollowUpDate: string | null;
  droppedToPublicAt?: string;
  previousFollowers?: string[];
}

export interface SalespersonPoints {
  name: string;
  overtime: number;
  email: number;
  meeting: number;
  visit: number;
  claimedThisPeriod: number;
}

export interface OrderDetail {
  id: string;
  customerId: string;
  orderDate: string;
  sku: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
}

export interface Customer {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  industry: string;
  country: string;
  level: "A" | "B" | "C";
  stage: "not_ordered" | "sample" | "closed";
  createdAt: string;
  owner: string;
  salesperson: string;
  orderTracker: string;
  categories: string[];
  lastOrderDate: string | null;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  minPrice: number;
  currency: string;
}

export interface QuoteItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  items: QuoteItem[];
  totalAmount: number;
  status: "draft" | "pending_approval" | "approved" | "rejected" | "sent";
  createdAt: string;
  createdBy: string;
  needsApproval: boolean;
}

export interface Approval {
  id: string;
  type: "quote" | "extension";
  relatedId: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface PromotionTask {
  id: string;
  name: string;
  productId: string;
  productName: string;
  targetLevel: string;
  assignedTo: string[];
  promotedBy: string[];
  status: "draft" | "active" | "completed";
  template: string;
  advantages?: string;
  totalTarget: number;
  sentCount: number;
  openCount: number;
  replyCount: number;
  createdAt: string;
  deadline: string;
  channel: string;
  openRate: string;
  replyRate: string;
  convertRate: string;
}

export interface PromotionFeedback {
  id: string;
  taskId: string;
  type: "manual" | "edm";
  customerId?: string;
  customerName?: string;
  leadId?: string;
  leadCompany?: string;
  content: string;
  edmTaskId?: string;
  sentCount?: number;
  openCount?: number;
  createdAt: string;
  createdBy: string;
}

export interface FollowUpRecord {
  id: string;
  leadId: string;
  type: "follow_up" | "customer_reply";
  followUpType?: "visit" | "meeting" | "email" | "social" | "whatsapp";
  subject?: string;
  contactPerson?: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface BusinessOpportunity {
  id: string;
  name: string;
  relatedType: "lead" | "customer";
  relatedId: string;
  relatedName: string;
  estimatedAmount: number;
  expectedCloseDate: string;
  stage: "initial" | "requirement" | "proposal" | "negotiation" | "won" | "lost";
  products: string[];
  categories: string[];
  notes: string;
  createdAt: string;
  createdBy: string;
}

export interface TimelineEvent {
  id: string;
  customerId: string;
  type: "email" | "call" | "visit" | "quote" | "promotion" | "system" | "order";
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export const leads: Lead[] = [
  { id: "L001", company: "深圳创新科技有限公司", contact: "张伟", email: "zhangwei@innovate.com", phone: "+86-755-8888-1234", source: "Google Ads", status: "pending_contact", industry: "电子", country: "中国", createdAt: "2024-01-15", followers: ["李明"], lastFollowUpDate: "2024-02-20", lastEmailDate: "2026-01-10" },
  { id: "L002", company: "Berlin Tech GmbH", contact: "Hans Mueller", email: "hans@berlintech.de", phone: "+49-30-1234-5678", source: "展会", status: "pending_contact", industry: "家具", country: "德国", createdAt: "2024-01-18", followers: [], lastFollowUpDate: "2024-01-22", droppedToPublicAt: "2024-01-25", previousFollowers: ["王芳"] },
  { id: "L003", company: "Tokyo Office Co.", contact: "Yuki Tanaka", email: "yuki@tokyooffice.jp", phone: "+81-3-5555-0001", source: "官网", status: "interacting", industry: "办公", country: "日本", createdAt: "2024-01-20", followers: ["李明"], lastFollowUpDate: "2024-02-28", lastEmailDate: "2026-01-25" },
  { id: "L004", company: "Paris Design Studio", contact: "Marie Dupont", email: "marie@parisdesign.fr", phone: "+33-1-2345-6789", source: "推荐", status: "pending_contact", industry: "设计", country: "法国", createdAt: "2024-02-01", followers: [], lastFollowUpDate: "2024-02-07", droppedToPublicAt: "2024-02-10", previousFollowers: ["赵强"] },
  { id: "L005", company: "NY Furniture Inc.", contact: "Mike Johnson", email: "mike@nyfurniture.com", phone: "+1-212-555-0199", source: "Google Ads", status: "interacting", industry: "家具", country: "美国", createdAt: "2024-02-05", followers: ["王芳"], lastFollowUpDate: "2024-03-01", lastEmailDate: "2026-02-05" },
  { id: "L006", company: "Seoul Smart Living", contact: "Kim Jaeho", email: "kim@seoulsmart.kr", phone: "+82-2-1234-5678", source: "展会", status: "contacting", industry: "智能家居", country: "韩国", createdAt: "2024-02-10", followers: ["赵强", "李明"], lastFollowUpDate: "2024-02-25", lastEmailDate: "2026-01-15", extensionRequested: true },
  { id: "L007", company: "Melbourne Ergo Pty", contact: "Sarah Brown", email: "sarah@melbergo.au", phone: "+61-3-9876-5432", source: "官网", status: "pending_contact", industry: "人体工学", country: "澳大利亚", createdAt: "2024-02-15", followers: [], lastFollowUpDate: null, droppedToPublicAt: "2024-02-15", previousFollowers: [] },
  { id: "L008", company: "London Office Hub", contact: "James Wilson", email: "james@londonhub.uk", phone: "+44-20-7946-0958", source: "推荐", status: "contacting", industry: "办公", country: "英国", createdAt: "2024-02-18", followers: ["赵强"], lastFollowUpDate: "2024-02-26", lastEmailDate: "2026-01-25" },
];

export const customers: Customer[] = [
  { id: "C001", company: "ABC Trading Co., Ltd", contact: "John Smith", email: "john@abctrading.com", phone: "+1-212-555-0101", industry: "家居", country: "美国", level: "A", stage: "closed", createdAt: "2023-06-10", owner: "李明", salesperson: "李明", orderTracker: "小王", categories: ["升降桌", "工学椅"], lastOrderDate: "2024-02-15" },
  { id: "C002", company: "Euro Desk GmbH", contact: "Anna Schmidt", email: "anna@eurodesk.de", phone: "+49-89-1234-5678", industry: "办公家具", country: "德国", level: "A", stage: "sample", createdAt: "2023-08-15", owner: "李明", salesperson: "李明", orderTracker: "小李", categories: ["升降桌"], lastOrderDate: "2024-01-20" },
  { id: "C003", company: "Asia Pacific Corp", contact: "David Chen", email: "david@apacorp.sg", phone: "+65-6789-0123", industry: "综合贸易", country: "新加坡", level: "B", stage: "not_ordered", createdAt: "2023-10-20", owner: "王芳", salesperson: "王芳", orderTracker: "小刘", categories: ["升降桌", "配件"], lastOrderDate: null },
  { id: "C004", company: "Nordic Living AB", contact: "Erik Johansson", email: "erik@nordicliving.se", phone: "+46-8-555-1234", industry: "家居", country: "瑞典", level: "B", stage: "not_ordered", createdAt: "2023-12-01", owner: "王芳", salesperson: "王芳", orderTracker: "小刘", categories: ["工学椅"], lastOrderDate: null },
  { id: "C005", company: "Brazil Import SA", contact: "Carlos Silva", email: "carlos@brazilimport.br", phone: "+55-11-9876-5432", industry: "进口贸易", country: "巴西", level: "C", stage: "not_ordered", createdAt: "2024-01-05", owner: "赵强", salesperson: "赵强", orderTracker: "小张", categories: ["配件"], lastOrderDate: null },
  { id: "C006", company: "Canadian Office Plus", contact: "Emily Rogers", email: "emily@caofficeplus.ca", phone: "+1-416-555-7890", industry: "办公", country: "加拿大", level: "B", stage: "not_ordered", createdAt: "2024-01-10", owner: "赵强", salesperson: "赵强", orderTracker: "小张", categories: ["升降桌"], lastOrderDate: null },
];

export const contacts: Contact[] = [
  { id: "CT001", relatedType: "customer", relatedId: "C001", name: "John Smith", title: "CEO", email: "john@abctrading.com", phone: "+1-212-555-0101", isPrimary: true },
  { id: "CT002", relatedType: "customer", relatedId: "C001", name: "Sarah Lee", title: "Purchasing Manager", email: "sarah@abctrading.com", phone: "+1-212-555-0102", isPrimary: false },
  { id: "CT003", relatedType: "customer", relatedId: "C002", name: "Anna Schmidt", title: "Head of Procurement", email: "anna@eurodesk.de", phone: "+49-89-1234-5678", isPrimary: true },
  { id: "CT004", relatedType: "customer", relatedId: "C002", name: "Klaus Weber", title: "Technical Director", email: "k.weber@eurodesk.de", phone: "+49-89-1234-5679", isPrimary: false },
  { id: "CT005", relatedType: "lead", relatedId: "L003", name: "Yuki Tanaka", title: "Purchasing Director", email: "yuki@tokyooffice.jp", phone: "+81-3-5555-0001", isPrimary: true },
  { id: "CT006", relatedType: "lead", relatedId: "L003", name: "Hiro Sato", title: "Technical Lead", email: "hiro@tokyooffice.jp", phone: "+81-3-5555-0002", isPrimary: false },
  { id: "CT007", relatedType: "lead", relatedId: "L005", name: "Mike Johnson", title: "Owner", email: "mike@nyfurniture.com", phone: "+1-212-555-0199", isPrimary: true },
];

export const orderDetails: OrderDetail[] = [
  { id: "OD001", customerId: "C001", orderDate: "2024-02-15", sku: "E1PRO-WHT-120", productName: "电动升降桌 E1 Pro (白色/120cm)", category: "升降桌", quantity: 300, unitPrice: 260, totalAmount: 78000, currency: "USD" },
  { id: "OD002", customerId: "C001", orderDate: "2024-02-15", sku: "E1PRO-BLK-140", productName: "电动升降桌 E1 Pro (黑色/140cm)", category: "升降桌", quantity: 200, unitPrice: 265, totalAmount: 53000, currency: "USD" },
  { id: "OD003", customerId: "C001", orderDate: "2024-02-15", sku: "C1-GRY", productName: "人体工学椅 C1 (灰色)", category: "工学椅", quantity: 100, unitPrice: 420, totalAmount: 42000, currency: "USD" },
  { id: "OD004", customerId: "C002", orderDate: "2024-01-20", sku: "E1PRO-WHT-120", productName: "电动升降桌 E1 Pro (白色/120cm)", category: "升降桌", quantity: 50, unitPrice: 275, totalAmount: 13750, currency: "USD" },
];

export const products: Product[] = [
  { id: "P001", name: "电动升降桌 E1 Pro", category: "升降桌", basePrice: 299, minPrice: 249, currency: "USD" },
  { id: "P002", name: "电动升降桌 E2 标准版", category: "升降桌", basePrice: 199, minPrice: 169, currency: "USD" },
  { id: "P003", name: "人体工学椅 C1", category: "工学椅", basePrice: 459, minPrice: 389, currency: "USD" },
  { id: "P004", name: "显示器支架 M1", category: "配件", basePrice: 79, minPrice: 65, currency: "USD" },
  { id: "P005", name: "电动升降桌框架 F1", category: "桌框", basePrice: 159, minPrice: 135, currency: "USD" },
  { id: "P006", name: "笔记本支架 N1", category: "配件", basePrice: 49, minPrice: 39, currency: "USD" },
];

export const quotes: Quote[] = [
  { id: "Q001", customerId: "C001", customerName: "ABC Trading Co., Ltd", items: [{ productId: "P001", productName: "电动升降桌 E1 Pro", quantity: 500, unitPrice: 260, amount: 130000 }], totalAmount: 130000, status: "approved", createdAt: "2024-01-10", createdBy: "李明", needsApproval: true },
  { id: "Q002", customerId: "C003", customerName: "Asia Pacific Corp", items: [{ productId: "P002", productName: "电动升降桌 E2 标准版", quantity: 200, unitPrice: 185, amount: 37000 }, { productId: "P004", productName: "显示器支架 M1", quantity: 200, unitPrice: 70, amount: 14000 }], totalAmount: 51000, status: "pending_approval", createdAt: "2024-02-15", createdBy: "王芳", needsApproval: true },
  { id: "Q003", customerId: "C002", customerName: "Euro Desk GmbH", items: [{ productId: "P003", productName: "人体工学椅 C1", quantity: 100, unitPrice: 420, amount: 42000 }], totalAmount: 42000, status: "sent", createdAt: "2024-02-20", createdBy: "李明", needsApproval: false },
  { id: "Q004", customerId: "C006", customerName: "Canadian Office Plus", items: [{ productId: "P001", productName: "电动升降桌 E1 Pro", quantity: 50, unitPrice: 280, amount: 14000 }], totalAmount: 14000, status: "draft", createdAt: "2024-02-25", createdBy: "赵强", needsApproval: false },
];

export const approvals: Approval[] = [
  { id: "A001", type: "quote", relatedId: "Q002", title: "报价审批 - Asia Pacific Corp", description: "E2升降桌单价$185低于基准价$199，需审批", status: "pending", requestedBy: "王芳", requestedAt: "2024-02-15" },
  { id: "A002", type: "quote", relatedId: "Q001", title: "报价审批 - ABC Trading Co.", description: "E1 Pro单价$260低于基准价$299，大客户特批", status: "approved", requestedBy: "李明", requestedAt: "2024-01-10", approvedBy: "张总", approvedAt: "2024-01-11" },
  { id: "A003", type: "extension", relatedId: "L003", title: "客户延期 - Tokyo Office Co.", description: "客户正在评估方案，申请延期30天", status: "pending", requestedBy: "李明", requestedAt: "2024-02-28" },
];

export const promotionTasks: PromotionTask[] = [
  { id: "T001", name: "E1 Pro 新品推广", productId: "P001", productName: "电动升降桌 E1 Pro", targetLevel: "A+B", assignedTo: ["李明", "王芳", "赵强"], promotedBy: ["李明", "王芳"], status: "active", template: "尊敬的客户，我们很高兴为您介绍全新的 E1 Pro 电动升降桌...", advantages: "双电机驱动，载重达160kg；智能高度记忆；极静音设计", totalTarget: 45, sentCount: 32, openCount: 18, replyCount: 5, createdAt: "2024-02-01", deadline: "2024-03-01", channel: "邮件", openRate: "56%", replyRate: "16%", convertRate: "8%" },
  { id: "T002", name: "工学椅 C1 春季促销", productId: "P003", productName: "人体工学椅 C1", targetLevel: "A", assignedTo: ["李明", "王芳"], promotedBy: ["李明"], status: "active", template: "亲爱的客户，春季限时优惠，C1人体工学椅特惠价格...", advantages: "BIFMA认证；12年保修；可调节腰支撇", totalTarget: 20, sentCount: 8, openCount: 3, replyCount: 1, createdAt: "2024-02-10", deadline: "2024-03-15", channel: "WhatsApp", openRate: "38%", replyRate: "13%", convertRate: "5%" },
  { id: "T003", name: "配件组合推广", productId: "P004", productName: "显示器支架 M1", targetLevel: "B+C", assignedTo: ["赵强"], promotedBy: [], status: "draft", template: "您好，我们推出了桌面配件组合方案...", advantages: "全馓功能支架；兼容主流显示器尺寸", totalTarget: 30, sentCount: 0, openCount: 0, replyCount: 0, createdAt: "2024-02-20", deadline: "2024-04-01", channel: "邮件", openRate: "0%", replyRate: "0%", convertRate: "0%" },
  { id: "T004", name: "桌框批发推广", productId: "P005", productName: "电动升降桌框架 F1", targetLevel: "A+B", assignedTo: ["李明", "赵强"], promotedBy: ["李明", "赵强"], status: "completed", template: "尊敬的合作伙伴，F1桌框批量采购特惠方案...", advantages: "采用工业级钢材；适配市面主流桌板；OEM支持", totalTarget: 25, sentCount: 25, openCount: 15, replyCount: 8, createdAt: "2024-01-15", deadline: "2024-02-15", channel: "邮件", openRate: "60%", replyRate: "32%", convertRate: "12%" },
];

export const timelineEvents: TimelineEvent[] = [
  { id: "E001", customerId: "C001", type: "system", title: "客户创建", content: "从线索转化为客户", createdAt: "2023-06-10 09:00", createdBy: "系统" },
  { id: "E002", customerId: "C001", type: "email", title: "首次建联邮件", content: "发送产品目录和公司介绍", createdAt: "2023-06-12 14:30", createdBy: "李明" },
  { id: "E003", customerId: "C001", type: "call", title: "电话沟通", content: "客户对E1 Pro很感兴趣，需要500台报价", createdAt: "2023-07-01 10:00", createdBy: "李明" },
  { id: "E004", customerId: "C001", type: "quote", title: "发送报价单 Q001", content: "E1 Pro x500, 单价$260, 总额$130,000", createdAt: "2024-01-10 16:00", createdBy: "李明" },
  { id: "E005", customerId: "C001", type: "system", title: "报价审批通过", content: "张总审批通过报价单 Q001", createdAt: "2024-01-11 09:30", createdBy: "系统" },
  { id: "E006", customerId: "C001", type: "promotion", title: "推广邮件", content: "E1 Pro 新品推广任务 T001", createdAt: "2024-02-05 11:00", createdBy: "李明" },
  { id: "E007", customerId: "C001", type: "order", title: "确认订单", content: "客户确认订单，E1 Pro x500", createdAt: "2024-02-08 15:00", createdBy: "李明" },
  { id: "E008", customerId: "C002", type: "system", title: "客户创建", content: "手动录入客户", createdAt: "2023-08-15 10:00", createdBy: "系统" },
  { id: "E009", customerId: "C002", type: "email", title: "产品推介", content: "发送C1工学椅产品资料", createdAt: "2023-09-01 14:00", createdBy: "李明" },
  { id: "E010", customerId: "C002", type: "visit", title: "客户拜访", content: "赴德国慕尼黑拜访客户，洽谈合作", createdAt: "2023-10-15 09:00", createdBy: "李明" },
  { id: "E011", customerId: "C002", type: "quote", title: "发送报价单 Q003", content: "C1工学椅 x100, 单价$420, 总额$42,000", createdAt: "2024-02-20 11:00", createdBy: "李明" },
  { id: "E012", customerId: "C003", type: "system", title: "客户创建", content: "从线索转化", createdAt: "2023-10-20 10:00", createdBy: "系统" },
  { id: "E013", customerId: "C003", type: "email", title: "需求确认", content: "客户需要E2升降桌+显示器支架组合", createdAt: "2023-11-05 15:00", createdBy: "王芳" },
  { id: "E014", customerId: "C003", type: "quote", title: "发送报价单 Q002", content: "E2+M1组合, 总额$51,000, 待审批", createdAt: "2024-02-15 10:00", createdBy: "王芳" },
  { id: "E015", customerId: "C004", type: "system", title: "客户创建", content: "展会获取客户", createdAt: "2023-12-01 10:00", createdBy: "系统" },
  { id: "E016", customerId: "C004", type: "promotion", title: "推广邮件", content: "E1 Pro 新品推广", createdAt: "2024-02-03 09:00", createdBy: "王芳" },
  { id: "E017", customerId: "C005", type: "system", title: "客户创建", content: "Google Ads获取", createdAt: "2024-01-05 10:00", createdBy: "系统" },
  { id: "E018", customerId: "C006", type: "system", title: "客户创建", content: "推荐获取", createdAt: "2024-01-10 10:00", createdBy: "系统" },
  { id: "E019", customerId: "C006", type: "quote", title: "发送报价单 Q004", content: "E1 Pro x50, 草稿状态", createdAt: "2024-02-25 14:00", createdBy: "赵强" },
];

export const funnelStats = [
  { stage: "待接触", count: 856, conversionRate: "" },
  { stage: "接触阶段", count: 542, conversionRate: "63.3%" },
  { stage: "互联阶段", count: 328, conversionRate: "60.5%" },
  { stage: "报价阶段", count: 156, conversionRate: "47.6%" },
];

export const productStats = [
  { productId: "P001", name: "电动升降桌 E1 Pro", promotionCount: 120, inquiryCount: 45, quoteCount: 28, dealCount: 12, dealRate: "26.7%", revenue: 936000 },
  { productId: "P002", name: "电动升降桌 E2 标准版", promotionCount: 95, inquiryCount: 38, quoteCount: 22, dealCount: 8, dealRate: "21.1%", revenue: 319200 },
  { productId: "P003", name: "人体工学椅 C1", promotionCount: 80, inquiryCount: 32, quoteCount: 18, dealCount: 10, dealRate: "31.3%", revenue: 420000 },
  { productId: "P004", name: "显示器支架 M1", promotionCount: 60, inquiryCount: 20, quoteCount: 12, dealCount: 6, dealRate: "30.0%", revenue: 47400 },
  { productId: "P005", name: "电动升降桌框架 F1", promotionCount: 50, inquiryCount: 15, quoteCount: 8, dealCount: 4, dealRate: "26.7%", revenue: 63600 },
  { productId: "P006", name: "笔记本支架 N1", promotionCount: 40, inquiryCount: 10, quoteCount: 5, dealCount: 2, dealRate: "20.0%", revenue: 9800 },
];

export const leadStageMap: Record<string, string> = {
  pending_contact: "待接触",
  contacting: "接触阶段",
  interacting: "互联阶段",
  invalid: "已失效",
};

export const customerStageMap: Record<string, string> = {
  not_ordered: "未成交",
  sample: "样品阶段",
  closed: "已成交",
};

export const stageMap: Record<string, string> = {
  ...leadStageMap,
  ...customerStageMap,
};

export const levelColors: Record<string, string> = {
  A: "bg-orange-100 text-orange-700",
  B: "bg-blue-100 text-blue-700",
  C: "bg-gray-100 text-gray-700",
};

export const statusMap: Record<string, string> = leadStageMap;

export const leadStageColors: Record<string, string> = {
  pending_contact: "bg-gray-100 text-gray-700",
  contacting: "bg-blue-100 text-blue-700",
  interacting: "bg-purple-100 text-purple-700",
  invalid: "bg-red-100 text-red-700",
};

export const customerStageColors: Record<string, string> = {
  not_ordered: "bg-gray-100 text-gray-700",
  sample: "bg-orange-100 text-orange-700",
  closed: "bg-green-100 text-green-700",
};

export const stageColors: Record<string, string> = {
  ...leadStageColors,
  ...customerStageColors,
};

export const salespersonPoints: SalespersonPoints[] = [
  { name: "李明", overtime: 8, email: 24, meeting: 6, visit: 4, claimedThisPeriod: 2 },
  { name: "王芳", overtime: 4, email: 18, meeting: 8, visit: 2, claimedThisPeriod: 1 },
  { name: "赵强", overtime: 6, email: 12, meeting: 4, visit: 6, claimedThisPeriod: 3 },
];

export function calcClaimLimit(points: SalespersonPoints): number {
  return 5 + Math.floor((points.overtime * 2 + points.email + points.meeting * 2 + points.visit * 3) / 10);
}

export const followUpRecords: FollowUpRecord[] = [
  { id: "FR001", leadId: "L003", type: "follow_up", followUpType: "email", subject: "产品目录介绍", contactPerson: "Yuki Tanaka", content: "发送产品目录邮件，介绍E1 Pro和C1工学椅系列", createdAt: "2024-01-25 10:00", createdBy: "李明" },
  { id: "FR002", leadId: "L003", type: "customer_reply", content: "客户回复：对E1 Pro升降桌很感兴趣，想了解批量价格", createdAt: "2024-01-28 14:30", createdBy: "李明" },
  { id: "FR003", leadId: "L005", type: "follow_up", followUpType: "whatsapp", subject: "产品需求沟通", contactPerson: "Mike Johnson", content: "电话沟通产品需求，客户需要家具升降桌方案", createdAt: "2024-02-08 09:00", createdBy: "王芳" },
  { id: "FR004", leadId: "L005", type: "customer_reply", content: "客户邮件确认需要200台E2升降桌报价", createdAt: "2024-02-10 16:00", createdBy: "王芳" },
  { id: "FR005", leadId: "L006", type: "follow_up", followUpType: "email", subject: "展会后续跟进", contactPerson: "Kim Jaeho", content: "展会后跟进邮件，发送智能家居产品线介绍", createdAt: "2024-02-12 11:00", createdBy: "赵强" },
  { id: "FR006", leadId: "L008", type: "follow_up", followUpType: "meeting", subject: "公司介绍会议", contactPerson: "James Wilson", content: "发送公司介绍和办公家具方案", createdAt: "2024-02-20 14:00", createdBy: "赵强" },
  { id: "FR007", leadId: "L002", type: "follow_up", followUpType: "email", subject: "初次建联", contactPerson: "Hans Mueller", content: "发送产品目录，对方表示会内部评估", createdAt: "2024-01-20 10:00", createdBy: "王芳" },
  { id: "FR008", leadId: "L002", type: "follow_up", followUpType: "email", subject: "跟进回复", contactPerson: "Hans Mueller", content: "再次跟进，对方暂无采购计划，已释放线索", createdAt: "2024-01-22 09:00", createdBy: "王芳" },
  { id: "FR009", leadId: "L004", type: "follow_up", followUpType: "whatsapp", subject: "产品推介", contactPerson: "Marie Dupont", content: "通过WhatsApp发送样品图片，对方要求降价后再谈", createdAt: "2024-02-07 15:30", createdBy: "赵强" },
];

export const businessOpportunities: BusinessOpportunity[] = [
  { id: "BO001", name: "深圳创新科技 - E1 Pro批量采购", relatedType: "lead", relatedId: "L001", relatedName: "深圳创新科技有限公司", estimatedAmount: 50000, expectedCloseDate: "2024-04-15", stage: "initial", products: ["P001"], categories: ["升降桌"], notes: "客户对E1 Pro感兴趣，预计采购200台", createdAt: "2024-02-20", createdBy: "李明" },
  { id: "BO002", name: "Tokyo Office - 办公家具整体方案", relatedType: "lead", relatedId: "L003", relatedName: "Tokyo Office Co.", estimatedAmount: 120000, expectedCloseDate: "2024-05-01", stage: "proposal", products: ["P001", "P003"], categories: ["升降桌", "工学椅"], notes: "已提交方案，等待客户反馈", createdAt: "2024-01-25", createdBy: "李明" },
  { id: "BO003", name: "NY Furniture - E2升降桌订单", relatedType: "lead", relatedId: "L005", relatedName: "NY Furniture Inc.", estimatedAmount: 39800, expectedCloseDate: "2024-03-20", stage: "negotiation", products: ["P002"], categories: ["升降桌"], notes: "价格谈判中，客户要求8折优惠", createdAt: "2024-02-10", createdBy: "王芳" },
  { id: "BO004", name: "ABC Trading - 复购订单", relatedType: "customer", relatedId: "C001", relatedName: "ABC Trading Co., Ltd", estimatedAmount: 80000, expectedCloseDate: "2024-04-01", stage: "won", products: ["P001", "P003", "P004"], categories: ["升降桌", "工学椅", "配件"], notes: "老客户复购，已签约", createdAt: "2024-01-15", createdBy: "李明" },
  { id: "BO005", name: "Euro Desk - 样品转正式订单", relatedType: "customer", relatedId: "C002", relatedName: "Euro Desk GmbH", estimatedAmount: 150000, expectedCloseDate: "2024-03-30", stage: "proposal", products: ["P001", "P005"], categories: ["升降桌", "桌框"], notes: "样品测试通过，准备下正式订单", createdAt: "2024-02-01", createdBy: "李明" },
];

export const opportunityStageMap: Record<string, string> = {
  initial: "初步接触",
  requirement: "需求确认",
  proposal: "方案报价",
  negotiation: "商务谈判",
  won: "赢单",
  lost: "输单",
};

export const opportunityStageColors: Record<string, string> = {
  initial: "bg-gray-100 text-gray-700",
  requirement: "bg-blue-100 text-blue-700",
  proposal: "bg-purple-100 text-purple-700",
  negotiation: "bg-yellow-100 text-yellow-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

export const followUpTypeMap: Record<string, string> = {
  visit: "线下拜访",
  meeting: "会议",
  email: "邮件联系",
  social: "社媒联系",
  whatsapp: "WhatsApp联系",
};

export const salespersonFunnel = [
  { name: "李明", pending_contact: 15, contacting: 12, interacting: 8, quoting: 5, totalLeads: 40 },
  { name: "王芳", pending_contact: 12, contacting: 9, interacting: 6, quoting: 4, totalLeads: 31 },
  { name: "赵强", pending_contact: 18, contacting: 8, interacting: 4, quoting: 2, totalLeads: 32 },
];

export const quoteStatusMap: Record<string, { label: string; color: string }> = {
  draft: { label: "草稿", color: "bg-gray-100 text-gray-700" },
  pending_approval: { label: "待审批", color: "bg-yellow-100 text-yellow-700" },
  approved: { label: "已审批", color: "bg-green-100 text-green-700" },
  rejected: { label: "已拒绝", color: "bg-red-100 text-red-700" },
  sent: { label: "已发送", color: "bg-blue-100 text-blue-700" },
};

export const taskStatusMap: Record<string, { label: string; color: string }> = {
  draft: { label: "草稿", color: "bg-gray-100 text-gray-700" },
  active: { label: "进行中", color: "bg-blue-100 text-blue-700" },
  completed: { label: "已完成", color: "bg-green-100 text-green-700" },
};

export const timelineTypeIcons: Record<string, { icon: string; color: string }> = {
  email: { icon: "📧", color: "bg-blue-100" },
  call: { icon: "📞", color: "bg-green-100" },
  visit: { icon: "🏢", color: "bg-purple-100" },
  quote: { icon: "📄", color: "bg-yellow-100" },
  promotion: { icon: "📣", color: "bg-orange-100" },
  system: { icon: "⚙️", color: "bg-gray-100" },
  order: { icon: "📦", color: "bg-emerald-100" },
};
