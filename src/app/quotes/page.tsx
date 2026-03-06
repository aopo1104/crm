"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { quotes, quoteStatusMap } from "@/lib/mock-data";

export default function QuotesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">报价列表</h1>
          <p className="text-muted-foreground">管理所有报价单，跟踪审批状态</p>
        </div>
        <Link href="/quotes/new">
          <Button><Plus className="h-4 w-4 mr-2" />新建报价</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-muted-foreground">报价单号</th>
                <th className="pb-3 font-medium text-muted-foreground">客户</th>
                <th className="pb-3 font-medium text-muted-foreground">产品</th>
                <th className="pb-3 font-medium text-muted-foreground">总金额</th>
                <th className="pb-3 font-medium text-muted-foreground">状态</th>
                <th className="pb-3 font-medium text-muted-foreground">创建人</th>
                <th className="pb-3 font-medium text-muted-foreground">创建时间</th>
                <th className="pb-3 font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => {
                const statusInfo = quoteStatusMap[q.status];
                return (
                  <tr key={q.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 font-medium">{q.id}</td>
                    <td className="py-3">
                      <Link href={`/customers/${q.customerId}?tab=quotes`} className="text-primary hover:underline">
                        {q.customerName}
                      </Link>
                    </td>
                    <td className="py-3">{q.items.map((i) => i.productName).join(", ")}</td>
                    <td className="py-3 font-medium">${q.totalAmount.toLocaleString()}</td>
                    <td className="py-3">
                      <Badge className={`${statusInfo.color} border-0`}>{statusInfo.label}</Badge>
                    </td>
                    <td className="py-3">{q.createdBy}</td>
                    <td className="py-3 text-muted-foreground">{q.createdAt}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Link href={`/customers/${q.customerId}?tab=quotes`}>
                          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        </Link>
                        {(q.status === "approved" || q.status === "sent") && (
                          <Button variant="ghost" size="sm" onClick={() => alert("报价单已导出为Excel（mock）")}>导出</Button>
                        )}
                        {q.status === "pending_approval" && (
                          <Link href="/approvals">
                            <Button variant="ghost" size="sm" className="text-yellow-600">审批</Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
