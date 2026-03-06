"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Building2,
  FileText,
  CheckCircle,
  Megaphone,
  AlertTriangle,
  Clock,
  ArrowRight,
  BarChart2,
} from "lucide-react";
import { approvals, leads, quotes, promotionTasks, customers } from "@/lib/mock-data";

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

const pendingApprovals = approvals.filter((a) => a.status === "pending");
const activeTasks = promotionTasks.filter((t) => t.status === "active");
const publicLeads = leads.filter((l) => l.followers.length === 0);

const leadReminders = leads
  .filter((l) => {
    const days = daysSince(l.lastFollowUpDate);
    return days === null || days > 7;
  })
  .slice(0, 3)
  .map((l) => ({
    id: `L-${l.id}`,
    text: `线索「${l.company}」${
      l.lastFollowUpDate
        ? `已 ${daysSince(l.lastFollowUpDate)} 天未跟进`
        : "尚未跟进"
    }`,
    type: "warning" as const,
    link: `/leads/${l.id}`,
  }));

const customerReminders = customers
  .filter((c) => {
    const days = daysSince(c.lastOrderDate);
    return days !== null && days > 60;
  })
  .slice(0, 3)
  .map((c) => ({
    id: `C-${c.id}`,
    text: `客户「${c.company}」已 ${daysSince(c.lastOrderDate)} 天未下单`,
    type: "order" as const,
    link: `/customers/${c.id}`,
  }));

const allReminders = [...leadReminders, ...customerReminders];

export default function WorkbenchPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">工作台</h1>
        <p className="text-muted-foreground">欢迎回来，张总。以下是今日待办概览。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/leads">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">公海线索</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publicLeads.length}</div>
              <p className="text-xs text-muted-foreground">公海线索（待认领）</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/customers">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">客户总数</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-muted-foreground">活跃客户</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/approvals">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">待审批</CardTitle>
              <CheckCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingApprovals.length}</div>
              <p className="text-xs text-muted-foreground">需要您处理</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/promotions">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">进行中推广</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTasks.length}</div>
              <p className="text-xs text-muted-foreground">推广任务执行中</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/reports">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">业务员漏斗</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.filter(c => c.stage === "closed").length}</div>
              <p className="text-xs text-muted-foreground">已成交客户</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              智能提醒
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allReminders.map((r) => (
              <Link key={r.id} href={r.link}>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    {r.type === "warning" ? (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">{r.text}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-yellow-500" />
              待审批事项
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApprovals.map((a) => (
              <Link key={a.id} href={a.type === "quote" ? `/approvals` : `/leads/${a.relatedId}`}>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.description}</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">待审批</Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-blue-500" />
              待执行推广任务
            </CardTitle>
            <Link href="/promotions">
              <Button variant="ghost" size="sm">查看全部</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeTasks.map((t) => (
              <Link key={t.id} href={`/promotions/${t.id}`}>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      已发送 {t.sentCount}/{t.totalTarget} · 截止 {t.deadline}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">进行中</Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-500" />
              最近报价
            </CardTitle>
            <Link href="/quotes">
              <Button variant="ghost" size="sm">查看全部</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {quotes.slice(0, 3).map((q) => (
              <Link key={q.id} href={`/customers/${q.customerId}?tab=quotes`}>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">{q.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      ${q.totalAmount.toLocaleString()} · {q.createdAt}
                    </p>
                  </div>
                  <Badge className={
                    q.status === "pending_approval" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                    q.status === "approved" ? "bg-green-100 text-green-700 border-green-200" :
                    q.status === "sent" ? "bg-blue-100 text-blue-700 border-blue-200" :
                    "bg-gray-100 text-gray-700 border-gray-200"
                  }>
                    {q.status === "pending_approval" ? "待审批" : q.status === "approved" ? "已审批" : q.status === "sent" ? "已发送" : "草稿"}
                  </Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
