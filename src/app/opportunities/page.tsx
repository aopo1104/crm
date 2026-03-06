"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, TrendingUp } from "lucide-react";
import {
  businessOpportunities,
  opportunityStageMap,
  opportunityStageColors,
} from "@/lib/mock-data";

export default function OpportunitiesPage() {
  const [stageFilter, setStageFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = businessOpportunities.filter((op) => {
    if (stageFilter !== "all" && op.stage !== stageFilter) return false;
    if (
      search &&
      !op.name.toLowerCase().includes(search.toLowerCase()) &&
      !op.relatedName.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const totalAmount = filtered.reduce((sum, op) => sum + op.estimatedAmount, 0);
  const wonAmount = filtered
    .filter((op) => op.stage === "won")
    .reduce((sum, op) => sum + op.estimatedAmount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">商机管理</h1>
          <p className="text-muted-foreground">跟踪所有销售商机，从初步接触到赢单</p>
        </div>
        <Link href="/opportunities/new">
          <Button><Plus className="h-4 w-4 mr-2" />新建商机</Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">商机总数</p>
            <p className="text-2xl font-bold mt-1">{filtered.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">预估总金额</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">${totalAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">已赢单金额</p>
            <p className="text-2xl font-bold mt-1 text-green-600">${wonAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className="pl-9 pr-4 py-2 border rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="搜索商机名称/客户..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "initial", "requirement", "proposal", "negotiation", "won", "lost"].map((s) => (
                <Button
                  key={s}
                  variant={stageFilter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStageFilter(s)}
                >
                  {s === "all" ? "全部" : opportunityStageMap[s]}
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
                  <th className="pb-3 font-medium text-muted-foreground">商机名称</th>
                  <th className="pb-3 font-medium text-muted-foreground">关联对象</th>
                  <th className="pb-3 font-medium text-muted-foreground">预估金额</th>
                  <th className="pb-3 font-medium text-muted-foreground">预计成交</th>
                  <th className="pb-3 font-medium text-muted-foreground">阶段</th>
                  <th className="pb-3 font-medium text-muted-foreground">品类</th>
                  <th className="pb-3 font-medium text-muted-foreground">创建人</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((op) => (
                  <tr key={op.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium">{op.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="text-xs text-muted-foreground">{op.relatedType === "lead" ? "线索" : "客户"}</p>
                        <Link
                          href={`/${op.relatedType === "lead" ? "leads" : "customers"}/${op.relatedId}`}
                          className="text-primary hover:underline text-xs"
                        >
                          {op.relatedName}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 font-medium text-blue-600">${op.estimatedAmount.toLocaleString()}</td>
                    <td className="py-3 text-muted-foreground">{op.expectedCloseDate || "—"}</td>
                    <td className="py-3">
                      <Badge className={`${opportunityStageColors[op.stage]} border-0`}>
                        {opportunityStageMap[op.stage]}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {op.categories.map((c) => (
                          <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                        ))}
                        {op.categories.length === 0 && <span className="text-muted-foreground text-xs">—</span>}
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{op.createdBy}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">暂无商机数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
