"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Search, Users, Globe, Lock, AlertCircle, CheckCircle2, Clock, CalendarClock } from "lucide-react";
import {
  leads, followUpRecords, statusMap, leadStageColors,
  salespersonPoints, calcClaimLimit,
} from "@/lib/mock-data";

const CURRENT_USER = "李明";

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

export default function LeadsPage() {
  const [tab, setTab] = useState<"public" | "private">("public");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [publicTimeFilter, setPublicTimeFilter] = useState<"7" | "30" | "90" | "all">("all");
  const [search, setSearch] = useState("");
  const [localLeads, setLocalLeads] = useState(leads);

  const myPoints = salespersonPoints.find((p) => p.name === CURRENT_USER);
  const claimLimit = myPoints ? calcClaimLimit(myPoints) : 5;
  const [claimedCount, setClaimedCount] = useState(myPoints?.claimedThisPeriod ?? 0);
  const remaining = Math.max(0, claimLimit - claimedCount);

  const handleClaim = (leadId: string) => {
    if (remaining <= 0) return;
    setLocalLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, followers: [...l.followers, CURRENT_USER] } : l
      )
    );
    setClaimedCount((c) => c + 1);
  };

  const publicLeads = localLeads
    .filter((l) => {
      if (l.followers.length > 0) return false;
      if (search && !l.company.toLowerCase().includes(search.toLowerCase()) && !l.contact.toLowerCase().includes(search.toLowerCase())) return false;
      if (publicTimeFilter !== "all") {
        const daysAgo = parseInt(publicTimeFilter);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysAgo);
        const dropped = l.droppedToPublicAt || l.createdAt;
        if (new Date(dropped) < cutoff) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const da = a.droppedToPublicAt || a.createdAt;
      const db = b.droppedToPublicAt || b.createdAt;
      return new Date(db).getTime() - new Date(da).getTime();
    });

  const privateLeads = localLeads.filter((l) => {
    if (l.followers.length === 0) return false;
    if (stageFilter !== "all" && l.status !== stageFilter) return false;
    if (search && !l.company.toLowerCase().includes(search.toLowerCase()) && !l.contact.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const publicCount = localLeads.filter((l) => l.followers.length === 0).length;
  const privateCount = localLeads.filter((l) => l.followers.length > 0).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">线索管理</h1>
          <p className="text-muted-foreground">公海线索对所有人可见，私有线索仅认领人可见</p>
        </div>
        <Link href="/leads/search">
          <Button variant="outline"><Search className="h-4 w-4 mr-2" />线索查重</Button>
        </Link>
      </div>

      {/* Claim quota card */}
      {myPoints && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-medium text-blue-900">本周期认领配额 — {CURRENT_USER}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-blue-700">
                  <span>加班积分 <strong>{myPoints.overtime}</strong></span>
                  <span>邮件积分 <strong>{myPoints.email}</strong></span>
                  <span>会谈积分 <strong>{myPoints.meeting}</strong></span>
                  <span>拜访积分 <strong>{myPoints.visit}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-700">{claimLimit}</p>
                  <p className="text-xs text-blue-600">总配额</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{claimedCount}</p>
                  <p className="text-xs text-muted-foreground">已认领</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${remaining > 0 ? "text-green-600" : "text-red-500"}`}>{remaining}</p>
                  <p className="text-xs text-muted-foreground">剩余可认领</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setTab("public")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${tab === "public" ? "bg-primary text-white border-primary" : "bg-white hover:bg-muted/50"}`}
        >
          <Globe className="h-4 w-4" /> 公海线索
          <Badge className="bg-white/20 text-inherit border-0 ml-1">{publicCount}</Badge>
        </button>
        <button
          onClick={() => setTab("private")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${tab === "private" ? "bg-primary text-white border-primary" : "bg-white hover:bg-muted/50"}`}
        >
          <Lock className="h-4 w-4" /> 私有线索
          <Badge className="bg-white/20 text-inherit border-0 ml-1">{privateCount}</Badge>
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className="pl-9 pr-4 py-2 border rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="搜索公司名/联系人..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {tab === "public" ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">掉入公海：</span>
                {([["7", "近7天"], ["30", "近30天"], ["90", "近90天"], ["all", "全部"]] as const).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={publicTimeFilter === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPublicTimeFilter(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {["all", "pending_contact", "contacting", "interacting"].map((f) => (
                  <Button
                    key={f}
                    variant={stageFilter === f ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStageFilter(f)}
                  >
                    {f === "all" ? "全部阶段" : statusMap[f]}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {tab === "public" ? (
              /* ── Public sea table ── */
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">公司名称</th>
                    <th className="pb-3 font-medium text-muted-foreground">来源</th>
                    <th className="pb-3 font-medium text-muted-foreground">行业/国家</th>
                    <th className="pb-3 font-medium text-muted-foreground">掉入公海时间 ↓</th>
                    <th className="pb-3 font-medium text-muted-foreground">之前跟进</th>
                    <th className="pb-3 font-medium text-muted-foreground">历史跟进</th>
                    <th className="pb-3 font-medium text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {publicLeads.map((lead) => {
                    const droppedDays = daysSince(lead.droppedToPublicAt || lead.createdAt);
                    const prevFollowers = lead.previousFollowers || [];
                    const leadRecords = followUpRecords.filter((r) => r.leadId === lead.id);
                    const lastRecord = leadRecords[leadRecords.length - 1];
                    return (
                      <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 font-medium">{lead.company}</td>
                        <td className="py-3 text-muted-foreground">{lead.source}</td>
                        <td className="py-3 text-muted-foreground">{lead.industry} · {lead.country}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{lead.droppedToPublicAt || lead.createdAt}</span>
                            {droppedDays !== null && (
                              <span className="text-muted-foreground">({droppedDays}天前)</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          {prevFollowers.length > 0 ? (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{prevFollowers.join("、")}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-3">
                          {lastRecord ? (
                            <div className="text-xs text-muted-foreground max-w-[160px]">
                              <span className="font-medium text-foreground">{lastRecord.createdBy}</span>：{lastRecord.content.slice(0, 30)}{lastRecord.content.length > 30 ? "…" : ""}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">暂无跟进记录</span>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            {remaining > 0 ? (
                              <Button variant="outline" size="sm" onClick={() => handleClaim(lead.id)}>
                                <CheckCircle2 className="h-3 w-3 mr-1" />认领
                              </Button>
                            ) : (
                              <span className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />配额已满
                              </span>
                            )}
                            <Link href={`/leads/${lead.id}`}>
                              <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" />详情</Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {publicLeads.length === 0 && (
                    <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">暂无公海线索</td></tr>
                  )}
                </tbody>
              </table>
            ) : (
              /* ── Private leads table ── */
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">公司名称</th>
                    <th className="pb-3 font-medium text-muted-foreground">联系人</th>
                    <th className="pb-3 font-medium text-muted-foreground">来源</th>
                    <th className="pb-3 font-medium text-muted-foreground">行业/国家</th>
                    <th className="pb-3 font-medium text-muted-foreground">阶段</th>
                    <th className="pb-3 font-medium text-muted-foreground">认领人</th>
                    <th className="pb-3 font-medium text-muted-foreground">最近跟进</th>
                    <th className="pb-3 font-medium text-muted-foreground">释放倒计时</th>
                    <th className="pb-3 font-medium text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {privateLeads.map((lead) => {
                    const days = daysSince(lead.lastFollowUpDate);
                    const releaseDate = lead.lastEmailDate
                      ? new Date(new Date(lead.lastEmailDate).getTime() + 60 * 24 * 60 * 60 * 1000)
                      : null;
                    const daysToRelease = releaseDate
                      ? Math.ceil((releaseDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                      : null;
                    return (
                      <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 font-medium">{lead.company}</td>
                        <td className="py-3">{lead.contact}</td>
                        <td className="py-3">{lead.source}</td>
                        <td className="py-3 text-muted-foreground">{lead.industry} · {lead.country}</td>
                        <td className="py-3">
                          <Badge className={`${leadStageColors[lead.status] || "bg-gray-100 text-gray-700"} border-0`}>
                            {statusMap[lead.status]}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{lead.followers.join("、")}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          {days === null ? (
                            <span className="text-muted-foreground text-xs">未跟进</span>
                          ) : days > 7 ? (
                            <span className="flex items-center gap-1 text-red-600 text-xs">
                              <AlertCircle className="h-3 w-3" />{days}天前
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">{days}天前</span>
                          )}
                        </td>
                        <td className="py-3">
                          {lead.extensionRequested ? (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <CalendarClock className="h-3 w-3" />已延期
                            </span>
                          ) : daysToRelease === null ? (
                            <span className="text-xs text-muted-foreground">无记录</span>
                          ) : daysToRelease <= 0 ? (
                            <span className="text-xs text-red-600 font-medium">应已释放</span>
                          ) : (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-xs font-medium ${daysToRelease <= 15 ? "text-red-600" : "text-muted-foreground"}`}>
                                {daysToRelease}天后释放
                              </span>
                              {daysToRelease <= 30 && (
                                <Button variant="outline" size="sm" className="h-6 text-xs px-2 py-0"
                                  onClick={(e) => { e.preventDefault(); alert("已提交延期申请（mock）"); }}>
                                  申请延期
                                </Button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3">
                          <Link href={`/leads/${lead.id}`}>
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" />详情</Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {privateLeads.length === 0 && (
                    <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">暂无私有线索</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
