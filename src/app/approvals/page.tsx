"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { approvals as initialApprovals } from "@/lib/mock-data";

export default function ApprovalsPage() {
  const [localApprovals, setLocalApprovals] = useState(initialApprovals);
  const [filter, setFilter] = useState<string>("all");

  const filtered = localApprovals.filter((a) => {
    if (filter === "pending") return a.status === "pending";
    if (filter === "done") return a.status !== "pending";
    return true;
  });

  const handleApprove = (id: string) => {
    setLocalApprovals((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "approved" as const, approvedBy: "张总", approvedAt: new Date().toISOString().slice(0, 10) } : a
      )
    );
  };

  const handleReject = (id: string) => {
    setLocalApprovals((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "rejected" as const, approvedBy: "张总", approvedAt: new Date().toISOString().slice(0, 10) } : a
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">审批中心</h1>
        <p className="text-muted-foreground">处理报价审批与客户延期申请</p>
      </div>

      <div className="flex gap-2">
        {["all", "pending", "done"].map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f === "all" ? "全部" : f === "pending" ? "待处理" : "已处理"}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((approval) => (
          <Card key={approval.id} className={approval.status === "pending" ? "border-yellow-200" : ""}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {approval.status === "pending" ? (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    ) : approval.status === "approved" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <h3 className="font-medium">{approval.title}</h3>
                    <Badge className={
                      approval.status === "pending" ? "bg-yellow-100 text-yellow-700 border-0" :
                      approval.status === "approved" ? "bg-green-100 text-green-700 border-0" :
                      "bg-red-100 text-red-700 border-0"
                    }>
                      {approval.status === "pending" ? "待审批" : approval.status === "approved" ? "已通过" : "已拒绝"}
                    </Badge>
                    <Badge variant="outline">{approval.type === "quote" ? "报价审批" : "延期申请"}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{approval.description}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>申请人: {approval.requestedBy}</span>
                    <span>申请时间: {approval.requestedAt}</span>
                    {approval.approvedBy && <span>审批人: {approval.approvedBy}</span>}
                    {approval.approvedAt && <span>审批时间: {approval.approvedAt}</span>}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {approval.type === "quote" && (
                      <Link href={`/customers/${approval.relatedId === "Q002" ? "C003" : "C001"}?tab=quotes`}>
                        <Button variant="link" size="sm" className="px-0">查看客户报价 →</Button>
                      </Link>
                    )}
                    {approval.type === "extension" && (
                      <Link href={`/leads/${approval.relatedId}`}>
                        <Button variant="link" size="sm" className="px-0">查看线索 →</Button>
                      </Link>
                    )}
                  </div>
                </div>
                {approval.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleReject(approval.id)}>
                      <XCircle className="h-4 w-4 mr-1" />拒绝
                    </Button>
                    <Button size="sm" onClick={() => handleApprove(approval.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" />通过
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
