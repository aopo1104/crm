"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Users, MessageSquare } from "lucide-react";
import { promotionTasks, customers, leads, type PromotionFeedback } from "@/lib/mock-data";

export default function PromotionDetailPage() {
  const params = useParams();
  const task = promotionTasks.find((t) => t.id === params.id);

  const [showFeedback, setShowFeedback] = useState(false);
  const [fbType, setFbType] = useState<"manual" | "edm">("manual");
  const [fbCustomerId, setFbCustomerId] = useState("");
  const [fbLeadId, setFbLeadId] = useState("");
  const [fbContent, setFbContent] = useState("");
  const [fbEdmId, setFbEdmId] = useState("");
  const [localFeedbacks, setLocalFeedbacks] = useState<PromotionFeedback[]>([]);

  if (!task) {
    return (
      <div className="p-6">
        <p>推广任务不存在</p>
        <Link href="/promotions"><Button variant="link">返回列表</Button></Link>
      </div>
    );
  }

  const handleAddFeedback = () => {
    const fb: PromotionFeedback = {
      id: `FB${Date.now()}`,
      taskId: task.id,
      type: fbType,
      customerId: fbCustomerId || undefined,
      customerName: fbCustomerId ? customers.find(c => c.id === fbCustomerId)?.company : undefined,
      leadId: fbLeadId || undefined,
      leadCompany: fbLeadId ? leads.find(l => l.id === fbLeadId)?.company : undefined,
      content: fbContent,
      edmTaskId: fbEdmId || undefined,
      createdAt: new Date().toLocaleString("zh-CN"),
      createdBy: "李明",
    };
    setLocalFeedbacks(prev => [fb, ...prev]);
    setFbContent(""); setFbCustomerId(""); setFbLeadId(""); setFbEdmId("");
    setShowFeedback(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/promotions">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{task.name}</h1>
          <p className="text-muted-foreground">{task.id} · 产品: {task.productName}</p>
        </div>
        <Badge className={
          task.status === "active" ? "bg-blue-100 text-blue-700 border-0" :
          task.status === "completed" ? "bg-green-100 text-green-700 border-0" :
          "bg-gray-100 text-gray-700 border-0"
        }>
          {task.status === "active" ? "进行中" : task.status === "completed" ? "已完成" : "草稿"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Promoted salespeople */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />已推广业务员
              </CardTitle>
            </CardHeader>
            <CardContent>
              {task.promotedBy.length === 0 ? (
                <p className="text-sm text-muted-foreground">暂无业务员推广此任务</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {task.promotedBy.map(name => (
                    <Badge key={name} className="bg-blue-100 text-blue-700 border-0">{name}</Badge>
                  ))}
                </div>
              )}
              {task.advantages && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-1">推广优势</p>
                  <p className="text-sm">{task.advantages}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback records */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />推广反馈
              </CardTitle>
              <Button size="sm" onClick={() => setShowFeedback(true)}>
                <Plus className="h-3.5 w-3.5 mr-1" />录入反馈
              </Button>
            </CardHeader>
            <CardContent>
              {localFeedbacks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">暂无推广反馈，点击右上角录入</p>
              ) : (
                <div className="space-y-3">
                  {localFeedbacks.map(fb => (
                    <div key={fb.id} className="p-3 border rounded-lg space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={fb.type === "manual" ? "bg-purple-100 text-purple-700 border-0 text-xs" : "bg-orange-100 text-orange-700 border-0 text-xs"}>
                          {fb.type === "manual" ? "手动录入" : "EDM系统"}
                        </Badge>
                        {fb.customerName && (
                          <Link href={`/customers/${fb.customerId}`} className="text-xs text-primary hover:underline">客户: {fb.customerName}</Link>
                        )}
                        {fb.leadCompany && (
                          <Link href={`/leads/${fb.leadId}`} className="text-xs text-primary hover:underline">线索: {fb.leadCompany}</Link>
                        )}
                        {fb.edmTaskId && <span className="text-xs text-muted-foreground">EDM任务: {fb.edmTaskId}</span>}
                        <span className="text-xs text-muted-foreground ml-auto">{fb.createdAt} · {fb.createdBy}</span>
                      </div>
                      {fb.type === "edm" && (fb.sentCount || fb.openCount) && (
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          {fb.sentCount && <span>发送数: <strong>{fb.sentCount}</strong></span>}
                          {fb.openCount && <span>打开数: <strong>{fb.openCount}</strong></span>}
                        </div>
                      )}
                      <p className="text-sm">{fb.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">任务详情</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">业务员范围</span>
                <span className="text-right text-xs">{task.assignedTo.join("、")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">创建时间</span>
                <span>{task.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">截止日期</span>
                <span>{task.deadline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">打开率</span>
                <span className="text-blue-600 font-medium">{task.openRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">回复率</span>
                <span className="text-green-600 font-medium">{task.replyRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">转化率</span>
                <span className="text-purple-600 font-medium">{task.convertRate}</span>
              </div>
            </CardContent>
          </Card>

          <Link href="/promotions/monitor">
            <Button variant="outline" className="w-full">查看监控看板</Button>
          </Link>
          <Link href="/reports">
            <Button variant="outline" className="w-full">查看关联报表</Button>
          </Link>
        </div>
      </div>

      {/* Feedback dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>录入推广反馈</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">反馈类型</label>
              <div className="flex gap-3 mt-1">
                {(["manual", "edm"] as const).map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={fbType === t} onChange={() => setFbType(t)} />
                    <span className="text-sm">{t === "manual" ? "手动填写" : "钉富EDM任务"}</span>
                  </label>
                ))}
              </div>
            </div>
            {fbType === "manual" ? (
              <>
                <div>
                  <label className="text-sm font-medium">关联客户（可选）</label>
                  <select className="w-full mt-1 border rounded-md p-2 text-sm" value={fbCustomerId} onChange={e => setFbCustomerId(e.target.value)}>
                    <option value="">不关联客户</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">关联线索（可选）</label>
                  <select className="w-full mt-1 border rounded-md p-2 text-sm" value={fbLeadId} onChange={e => setFbLeadId(e.target.value)}>
                    <option value="">不关联线索</option>
                    {leads.filter(l => l.followers.length > 0).map(l => <option key={l.id} value={l.id}>{l.company}</option>)}
                  </select>
                </div>
              </>
            ) : (
              <div>
                <label className="text-sm font-medium">钉富EDM任务编号</label>
                <input className="w-full mt-1 border rounded-md p-2 text-sm" placeholder="例：EDM-20240301-001" value={fbEdmId} onChange={e => setFbEdmId(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">系统将自动抓取发送数、打开数及关联客户/线索</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">推广反馈内容</label>
              <textarea className="w-full mt-1 border rounded-md p-2 text-sm" rows={3} placeholder="填写推广反馈..." value={fbContent} onChange={e => setFbContent(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedback(false)}>取消</Button>
            <Button onClick={handleAddFeedback} disabled={!fbContent}>提交反馈</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
