"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leads, customers, productStats, leadStageMap } from "@/lib/mock-data";

const STAGES = ["pending_contact", "contacting", "interacting"] as const;
type Stage = typeof STAGES[number];

function getWeekStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay() + 1);
  return d;
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "all">("all");

  const now = new Date();
  const cutoff = new Date();
  if (timeRange === "week") cutoff.setDate(now.getDate() - 7);
  else if (timeRange === "month") cutoff.setMonth(now.getMonth() - 1);
  else if (timeRange === "quarter") cutoff.setMonth(now.getMonth() - 3);
  else cutoff.setFullYear(2000);

  const weekStart = getWeekStart();

  const filteredLeads = leads.filter((l) => new Date(l.createdAt) >= cutoff);

  const salespeople = Array.from(new Set([
    ...leads.map((l) => l.followers[0]).filter(Boolean),
    ...customers.map((c) => c.salesperson),
  ])).filter(Boolean);

  const spLeadStats = salespeople.map((sp) => {
    const spLeads = filteredLeads.filter((l) => l.followers.includes(sp));
    const stageCounts = STAGES.reduce((acc, s) => {
      acc[s] = spLeads.filter((l) => l.status === s).length;
      return acc;
    }, {} as Record<Stage, number>);
    const total = spLeads.length;
    const interactingRate = total > 0 ? Math.round((stageCounts.interacting / total) * 100) : 0;
    const weekNew = leads.filter((l) => l.followers.includes(sp) && new Date(l.createdAt) >= weekStart).length;
    const spCustomers = customers.filter((c) => c.salesperson === sp);
    const closedCustomers = spCustomers.filter((c) => c.stage === "closed").length;
    return { sp, total, stageCounts, interactingRate, weekNew, closedCustomers, totalCustomers: spCustomers.length };
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">报表中心</h1>
        <p className="text-muted-foreground">业务员漏斗与产品效果分析</p>
      </div>

      <Tabs defaultValue="salesperson">
        <TabsList>
          <TabsTrigger value="salesperson">业务员漏斗报表</TabsTrigger>
          <TabsTrigger value="product">产品效果报表</TabsTrigger>
        </TabsList>

        {/* ── 业务员漏斗报表 ── */}
        <TabsContent value="salesperson">
          <div className="space-y-6">
            {/* Time filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">时间筛选：</span>
              {([
                { key: "week", label: "近7天" },
                { key: "month", label: "近30天" },
                { key: "quarter", label: "近90天" },
                { key: "all", label: "全部" },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTimeRange(key)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                    timeRange === key ? "bg-primary text-white border-primary" : "bg-white hover:bg-muted/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Weekly new summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {spLeadStats.map((s) => (
                <Card key={s.sp}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{s.sp}</p>
                      <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">本周新增 {s.weekNew}</Badge>
                    </div>
                    <p className="text-2xl font-bold">{s.total}</p>
                    <p className="text-xs text-muted-foreground">线索总数 · 互联转化 {s.interactingRate}%</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Per-salesperson funnel bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {spLeadStats.map((s) => (
                <Card key={s.sp}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{s.sp}</CardTitle>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">线索 {s.total}</Badge>
                        <Badge variant="outline" className="text-xs">客户 {s.totalCustomers}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {STAGES.map((stage, i) => {
                        const count = s.stageCounts[stage];
                        const pct = s.total > 0 ? Math.round((count / s.total) * 100) : 0;
                        const colors = ["bg-gray-400", "bg-blue-400", "bg-purple-400", "bg-yellow-400"];
                        return (
                          <div key={stage} className="flex items-center gap-2 text-sm">
                            <span className="w-14 text-xs text-muted-foreground text-right">{leadStageMap[stage]}</span>
                            <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${colors[i]} rounded-full flex items-center justify-end pr-1`}
                                style={{ width: `${Math.max(pct, count > 0 ? 12 : 0)}%` }}
                              >
                                {count > 0 && <span className="text-[10px] text-white font-medium">{count}</span>}
                              </div>
                            </div>
                            <span className="w-8 text-xs text-muted-foreground">{pct}%</span>
                          </div>
                        );
                      })}
                      <div className="pt-2 border-t mt-2 text-xs text-muted-foreground flex justify-between">
                        <span>互联阶段转化率</span>
                        <span className="font-medium text-primary">{s.interactingRate}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>已成交客户</span>
                        <span className="font-medium text-green-600">{s.closedCustomers} 个</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary comparison table */}
            <Card>
              <CardHeader><CardTitle className="text-base">业务员漏斗汇总对比</CardTitle></CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-muted-foreground">业务员</th>
                      {STAGES.map((s) => (
                        <th key={s} className="pb-3 font-medium text-muted-foreground">{leadStageMap[s]}</th>
                      ))}
                      <th className="pb-3 font-medium text-muted-foreground">线索总计</th>
                      <th className="pb-3 font-medium text-muted-foreground">互联转化率</th>
                      <th className="pb-3 font-medium text-muted-foreground">本周新增</th>
                      <th className="pb-3 font-medium text-muted-foreground">已成交客户</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spLeadStats.map((s) => (
                      <tr key={s.sp} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 font-medium">{s.sp}</td>
                        {STAGES.map((stage) => (
                          <td key={stage} className="py-3">{s.stageCounts[stage]}</td>
                        ))}
                        <td className="py-3 font-medium">{s.total}</td>
                        <td className="py-3">
                          <Badge className={`border-0 ${s.interactingRate >= 20 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                            {s.interactingRate}%
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Badge className="bg-blue-100 text-blue-700 border-0">{s.weekNew}</Badge>
                        </td>
                        <td className="py-3 text-green-600 font-medium">{s.closedCustomers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── 产品效果报表 ── */}
        <TabsContent value="product">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {productStats.map((ps) => (
                <Card key={ps.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{ps.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="text-xl font-bold">{ps.quoteCount}</p>
                        <p className="text-xs text-muted-foreground">报价次数</p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="text-xl font-bold">{ps.dealCount}</p>
                        <p className="text-xs text-muted-foreground">成交数</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded col-span-2">
                        <p className="text-xl font-bold text-green-700">${ps.revenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">总营收 · 赢单率 {ps.dealRate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader><CardTitle className="text-base">产品效果汇总</CardTitle></CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-muted-foreground">产品</th>
                      <th className="pb-3 font-medium text-muted-foreground">推广次数</th>
                      <th className="pb-3 font-medium text-muted-foreground">询盘数</th>
                      <th className="pb-3 font-medium text-muted-foreground">报价数</th>
                      <th className="pb-3 font-medium text-muted-foreground">成交数</th>
                      <th className="pb-3 font-medium text-muted-foreground">营收</th>
                      <th className="pb-3 font-medium text-muted-foreground">赢单率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productStats.map((ps) => (
                      <tr key={ps.name} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 font-medium">{ps.name}</td>
                        <td className="py-3">{ps.promotionCount}</td>
                        <td className="py-3">{ps.inquiryCount}</td>
                        <td className="py-3">{ps.quoteCount}</td>
                        <td className="py-3">{ps.dealCount}</td>
                        <td className="py-3 font-medium text-green-700">${ps.revenue.toLocaleString()}</td>
                        <td className="py-3">
                          <Badge className="bg-green-100 text-green-700 border-0">{ps.dealRate}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
