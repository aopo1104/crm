"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Phone, Globe, Building2, FileText, Megaphone, Plus, User, Package } from "lucide-react";
import {
  customers, contacts, timelineEvents, quotes, promotionTasks, orderDetails,
  customerStageMap, customerStageColors, levelColors, quoteStatusMap, timelineTypeIcons,
} from "@/lib/mock-data";

function Customer360PageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "orders";
  const customer = customers.find((c) => c.id === params.id);

  if (!customer) {
    return (
      <div className="p-6">
        <p>客户不存在</p>
        <Link href="/customers"><Button variant="link">返回列表</Button></Link>
      </div>
    );
  }

  function daysSince(dateStr: string | null): number | null {
    if (!dateStr) return null;
    return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  }

  const daysSinceOrder = daysSince(customer.lastOrderDate);
  const customerTimeline = timelineEvents
    .filter((e) => e.customerId === customer.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const customerQuotes = quotes.filter((q) => q.customerId === customer.id);
  const customerPromotions = promotionTasks.filter((t) => t.assignedTo.includes(customer.owner));
  const customerContacts = contacts.filter((c) => c.relatedId === customer.id);
  const customerOrders = orderDetails.filter((o) => o.customerId === customer.id);

  const totalRevenue = customerOrders.reduce((s, o) => s + o.totalAmount, 0);
  const categoryBreakdown = customerOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.category] = (acc[o.category] || 0) + o.totalAmount;
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/customers">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{customer.company}</h1>
            <Badge className={`${levelColors[customer.level]} border-0`}>{customer.level}级</Badge>
            <Badge className={`${customerStageColors[customer.stage] || "bg-gray-100 text-gray-700"} border-0`}>
              {customerStageMap[customer.stage]}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span>客户详情 · {customer.id}</span>
            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />业务员: {customer.salesperson}</span>
            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />跟单员: {customer.orderTracker}</span>
          </div>
          {daysSinceOrder !== null && daysSinceOrder > 60 && (
            <p className="text-xs text-red-600 mt-1">⚠️ 已 {daysSinceOrder} 天未下单，请及时跟进</p>
          )}
        </div>
        <Link href={`/quotes/new?customerId=${customer.id}`}>
          <Button><Plus className="h-4 w-4 mr-2" />新建报价</Button>
        </Link>
      </div>

      {/* Basic info card — always visible on top per V1.3 */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">主联系人</p>
              <p className="font-medium">
                {customerContacts.find((c) => c.isPrimary)?.name || customer.contact}
              </p>
              <p className="text-xs text-muted-foreground">
                {customerContacts.find((c) => c.isPrimary)?.title || ""}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">邮箱</p>
              <p className="font-medium flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{customer.email}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">电话</p>
              <p className="font-medium flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{customer.phone}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">国家/行业</p>
              <p className="font-medium flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{customer.country} · {customer.industry}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">品类</p>
              <div className="flex flex-wrap gap-1">
                {customer.categories.map((cat) => (
                  <Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">最近下单</p>
              <p className={`font-medium text-sm ${daysSinceOrder && daysSinceOrder > 60 ? "text-red-600" : ""}`}>
                {customer.lastOrderDate ? `${customer.lastOrderDate} (${daysSinceOrder}天前)` : "未下单"}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">累计销售额</p>
              <p className="font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">创建时间</p>
              <p className="font-medium">{customer.createdAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab}>
        <TabsList>
          <TabsTrigger value="orders">下单明细</TabsTrigger>
          <TabsTrigger value="contacts">联系人</TabsTrigger>
          <TabsTrigger value="timeline">跟进时间线</TabsTrigger>
          <TabsTrigger value="quotes">报价记录</TabsTrigger>
          <TabsTrigger value="promotions">推广记录</TabsTrigger>
        </TabsList>

        {/* ── Order Details Tab ── */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />下单产品明细
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customerOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">暂无下单记录</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-3 font-medium text-muted-foreground">下单日期</th>
                          <th className="pb-3 font-medium text-muted-foreground">SKU</th>
                          <th className="pb-3 font-medium text-muted-foreground">产品名称</th>
                          <th className="pb-3 font-medium text-muted-foreground">品类</th>
                          <th className="pb-3 font-medium text-muted-foreground">数量</th>
                          <th className="pb-3 font-medium text-muted-foreground">单价</th>
                          <th className="pb-3 font-medium text-muted-foreground">小计</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerOrders.map((o) => (
                          <tr key={o.id} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="py-3 text-muted-foreground">{o.orderDate}</td>
                            <td className="py-3 font-mono text-xs">{o.sku}</td>
                            <td className="py-3 font-medium">{o.productName}</td>
                            <td className="py-3"><Badge variant="outline" className="text-xs">{o.category}</Badge></td>
                            <td className="py-3">{o.quantity.toLocaleString()}</td>
                            <td className="py-3">${o.unitPrice}</td>
                            <td className="py-3 font-medium text-green-700">${o.totalAmount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t bg-muted/30">
                          <td colSpan={6} className="py-2 pl-2 font-medium text-sm">合计</td>
                          <td className="py-2 font-bold text-green-700">${totalRevenue.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  {Object.keys(categoryBreakdown).length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-2">品类销售额分布</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(categoryBreakdown).map(([cat, amt]) => (
                          <div key={cat} className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-lg text-sm">
                            <span className="font-medium">{cat}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-green-700 font-medium">${amt.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground">({Math.round(amt / totalRevenue * 100)}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Contacts Tab ── */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader><CardTitle className="text-base">联系人列表</CardTitle></CardHeader>
            <CardContent>
              {customerContacts.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">暂无联系人</p>
              ) : (
                <div className="space-y-3">
                  {customerContacts.map((ct) => (
                    <div key={ct.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {ct.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{ct.name}</p>
                          {ct.isPrimary && (
                            <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs">主联系人</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{ct.title}</p>
                        <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                          {ct.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{ct.email}</span>}
                          {ct.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{ct.phone}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Timeline Tab ── */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader><CardTitle className="text-base">跟进时间线</CardTitle></CardHeader>
            <CardContent>
              {customerTimeline.length === 0 ? (
                <p className="text-sm text-muted-foreground">暂无记录</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-4">
                    {customerTimeline.map((event) => {
                      const typeInfo = timelineTypeIcons[event.type];
                      return (
                        <div key={event.id} className="flex gap-4 relative">
                          <div className={`h-8 w-8 rounded-full ${typeInfo.color} flex items-center justify-center text-sm z-10 shrink-0`}>
                            {typeInfo.icon}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{event.title}</p>
                              <span className="text-xs text-muted-foreground">{event.createdAt}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">操作人: {event.createdBy}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Quotes Tab ── */}
        <TabsContent value="quotes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" />报价记录</CardTitle>
              <Link href={`/quotes/new?customerId=${customer.id}`}>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />新建报价</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {customerQuotes.length === 0 ? (
                <p className="text-sm text-muted-foreground">暂无报价记录</p>
              ) : (
                <div className="space-y-3">
                  {customerQuotes.map((q) => {
                    const statusInfo = quoteStatusMap[q.status];
                    return (
                      <div key={q.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{q.id}</p>
                            <Badge className={`${statusInfo.color} border-0`}>{statusInfo.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {q.items.map((i) => i.productName).join(", ")} · 总额 ${q.totalAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">{q.createdAt} · {q.createdBy}</p>
                        </div>
                        <div className="flex gap-2">
                          {(q.status === "approved" || q.status === "sent") && (
                            <Button variant="outline" size="sm" onClick={() => alert("已导出（mock）")}>导出</Button>
                          )}
                          {q.status === "pending_approval" && (
                            <Link href="/approvals">
                              <Button variant="outline" size="sm">查看审批</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Promotions Tab ── */}
        <TabsContent value="promotions">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Megaphone className="h-4 w-4" />推广记录</CardTitle></CardHeader>
            <CardContent>
              {customerPromotions.length === 0 ? (
                <p className="text-sm text-muted-foreground">暂无推广记录</p>
              ) : (
                <div className="space-y-3">
                  {customerPromotions.map((t) => (
                    <Link key={t.id} href={`/promotions/${t.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div>
                          <p className="font-medium">{t.name}</p>
                          <p className="text-sm text-muted-foreground">产品: {t.productName} · 目标等级: {t.targetLevel}</p>
                          <p className="text-xs text-muted-foreground">{t.createdAt}</p>
                        </div>
                        <Badge className={
                          t.status === "active" ? "bg-blue-100 text-blue-700 border-0" :
                          t.status === "completed" ? "bg-green-100 text-green-700 border-0" :
                          "bg-gray-100 text-gray-700 border-0"
                        }>
                          {t.status === "active" ? "进行中" : t.status === "completed" ? "已完成" : "草稿"}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Customer360Page() {
  return (
    <Suspense fallback={<div className="p-6">加载中...</div>}>
      <Customer360PageContent />
    </Suspense>
  );
}
