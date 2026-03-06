"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Search } from "lucide-react";
import { customers, customerStageMap, customerStageColors, levelColors } from "@/lib/mock-data";

export default function CustomersPage() {
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  function daysSince(dateStr: string | null): number | null {
    if (!dateStr) return null;
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  const filtered = customers.filter((c) => {
    if (levelFilter !== "all" && c.level !== levelFilter) return false;
    if (stageFilter !== "all" && c.stage !== stageFilter) return false;
    if (search && !c.company.toLowerCase().includes(search.toLowerCase()) && !c.contact.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">客户列表</h1>
        <p className="text-muted-foreground">管理所有客户，查看客户详情</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className="pl-9 pr-4 py-2 border rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="搜索公司名/联系人..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "A", "B", "C"].map((f) => (
                <Button
                  key={f}
                  variant={levelFilter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLevelFilter(f)}
                >
                  {f === "all" ? "全部" : `${f}级`}
                </Button>
              ))}
              <span className="border-l mx-1" />
              {["all", "not_ordered", "sample", "closed"].map((f) => (
                <Button
                  key={f}
                  variant={stageFilter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStageFilter(f)}
                >
                  {f === "all" ? "全阶段" : customerStageMap[f]}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">公司名称</th>
                  <th className="pb-3 font-medium text-muted-foreground">联系人</th>
                  <th className="pb-3 font-medium text-muted-foreground">等级</th>
                  <th className="pb-3 font-medium text-muted-foreground">阶段</th>
                  <th className="pb-3 font-medium text-muted-foreground">品类</th>
                  <th className="pb-3 font-medium text-muted-foreground">最近下单</th>
                  <th className="pb-3 font-medium text-muted-foreground">负责人</th>
                  <th className="pb-3 font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 font-medium">{customer.company}</td>
                    <td className="py-3">{customer.contact}</td>
                    <td className="py-3">
                      <Badge className={`${levelColors[customer.level]} border-0`}>{customer.level}级</Badge>
                    </td>
                    <td className="py-3">
                      <Badge className={`${customerStageColors[customer.stage] || "bg-gray-100 text-gray-700"} border-0`}>{customerStageMap[customer.stage]}</Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {customer.categories.map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      {(() => {
                        const days = daysSince(customer.lastOrderDate);
                        if (days === null) return <span className="text-xs text-muted-foreground">未下单</span>;
                        if (days > 60) return <span className="text-xs text-red-600">{days}天前</span>;
                        return <span className="text-xs text-muted-foreground">{days}天前</span>;
                      })()}
                    </td>
                    <td className="py-3">{customer.owner}</td>
                    <td className="py-3">
                      <Link href={`/customers/${customer.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" /> 查看
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
