"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, UserPlus, AlertCircle, Lock } from "lucide-react";
import { leads, customers, statusMap, customerStageMap, leadStageColors, customerStageColors } from "@/lib/mock-data";

const CURRENT_USER = "李明";

export default function LeadSearchPage() {
  const [query, setQuery] = useState("");
  const [localLeads, setLocalLeads] = useState(leads);

  const handleFollow = (leadId: string) => {
    setLocalLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, followers: [...l.followers, CURRENT_USER] } : l
      )
    );
  };

  const trimmed = query.trim().toLowerCase();

  const matchedLeads = trimmed
    ? localLeads.filter(
        (l) =>
          l.company.toLowerCase().includes(trimmed) ||
          l.contact.toLowerCase().includes(trimmed) ||
          l.email.toLowerCase().includes(trimmed)
      )
    : [];

  const matchedCustomers = trimmed
    ? customers.filter(
        (c) =>
          c.company.toLowerCase().includes(trimmed) ||
          c.contact.toLowerCase().includes(trimmed) ||
          c.email.toLowerCase().includes(trimmed)
      )
    : [];

  const hasResults = matchedLeads.length > 0 || matchedCustomers.length > 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/leads">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">线索查重</h1>
          <p className="text-muted-foreground">搜索系统中已存在的线索/客户，避免重复跟进</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="输入公司名、联系人或邮箱搜索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          {trimmed && !hasResults && (
            <div className="mt-6 flex flex-col items-center gap-2 text-muted-foreground py-8">
              <Search className="h-10 w-10 opacity-30" />
              <p>未找到匹配的线索或客户</p>
              <p className="text-sm">可以新建线索并开始跟进</p>
            </div>
          )}
        </CardContent>
      </Card>

      {matchedLeads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              线索记录
              <Badge variant="outline">{matchedLeads.length} 条</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">公司名称</th>
                  <th className="pb-3 font-medium text-muted-foreground">联系人</th>
                  <th className="pb-3 font-medium text-muted-foreground">邮箱</th>
                  <th className="pb-3 font-medium text-muted-foreground">阶段</th>
                  <th className="pb-3 font-medium text-muted-foreground">跟进人</th>
                  <th className="pb-3 font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {matchedLeads.map((lead) => {
                  const isFollowing = lead.followers.includes(CURRENT_USER);
                  const isMine = isFollowing || lead.followers.length === 0;
                  const canFollow = !isFollowing && (lead.status === "pending_contact" || lead.status === "contacting");
                  return (
                    <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 font-medium">{lead.company}</td>
                      <td className="py-3">{isMine ? lead.contact : <span className="flex items-center gap-1 text-muted-foreground text-xs"><Lock className="h-3 w-3" />保密</span>}</td>
                      <td className="py-3">{isMine ? <span className="text-muted-foreground">{lead.email}</span> : <span className="text-muted-foreground text-xs">保密</span>}</td>
                      <td className="py-3">
                        {isMine ? (
                          <Badge className={`${leadStageColors[lead.status] || "bg-gray-100 text-gray-700"} border-0`}>
                            {statusMap[lead.status]}
                          </Badge>
                        ) : <span className="text-muted-foreground text-xs">保密</span>}
                      </td>
                      <td className="py-3">
                        {isMine ? (
                          lead.followers.length > 0 ? (
                            <span className="text-xs">{lead.followers.join("、")}</span>
                          ) : (
                            <span className="text-muted-foreground text-xs">暂无</span>
                          )
                        ) : <span className="text-muted-foreground text-xs">保密</span>}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2 items-center">
                          {isFollowing && <span className="text-xs text-green-600 font-medium">已认领</span>}
                          {canFollow && (
                            <Button variant="outline" size="sm" onClick={() => handleFollow(lead.id)}>
                              <UserPlus className="h-3 w-3 mr-1" />认领
                            </Button>
                          )}
                          {!canFollow && !isFollowing && isMine && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />不可跟进
                            </span>
                          )}
                          {isMine && (
                            <Link href={`/leads/${lead.id}`}>
                              <Button variant="ghost" size="sm">查看</Button>
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
      )}

      {matchedCustomers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              客户记录
              <Badge variant="outline">{matchedCustomers.length} 条</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">公司名称</th>
                  <th className="pb-3 font-medium text-muted-foreground">联系人</th>
                  <th className="pb-3 font-medium text-muted-foreground">邮箱</th>
                  <th className="pb-3 font-medium text-muted-foreground">阶段</th>
                  <th className="pb-3 font-medium text-muted-foreground">负责人</th>
                  <th className="pb-3 font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {matchedCustomers.map((customer) => {
                  const isMine = customer.owner === CURRENT_USER || customer.salesperson === CURRENT_USER;
                  return (
                    <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 font-medium">{customer.company}</td>
                      <td className="py-3">{isMine ? customer.contact : <span className="flex items-center gap-1 text-muted-foreground text-xs"><Lock className="h-3 w-3" />保密</span>}</td>
                      <td className="py-3">{isMine ? <span className="text-muted-foreground">{customer.email}</span> : <span className="text-muted-foreground text-xs">保密</span>}</td>
                      <td className="py-3">
                        {isMine ? (
                          <Badge className={`${customerStageColors[customer.stage] || "bg-gray-100 text-gray-700"} border-0`}>
                            {customerStageMap[customer.stage]}
                          </Badge>
                        ) : <span className="text-muted-foreground text-xs">保密</span>}
                      </td>
                      <td className="py-3">{isMine ? customer.owner : <span className="text-muted-foreground text-xs">保密</span>}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {!isMine && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Lock className="h-3 w-3" />其他人客户
                            </span>
                          )}
                          {isMine && (
                            <>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />已为客户
                              </span>
                              <Link href={`/customers/${customer.id}`}>
                                <Button variant="ghost" size="sm">查看</Button>
                              </Link>
                            </>
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
      )}
    </div>
  );
}
