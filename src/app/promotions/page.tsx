"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Eye, BarChart3 } from "lucide-react";
import { promotionTasks } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};
const statusLabels: Record<string, string> = {
  draft: "草稿",
  active: "进行中",
  completed: "已完成",
};

export default function PromotionsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">推广任务</h1>
          <p className="text-muted-foreground">管理营销推广任务，追踪执行进度</p>
        </div>
        <div className="flex gap-2">
          <Link href="/promotions/monitor">
            <Button variant="outline"><BarChart3 className="h-4 w-4 mr-2" />监控看板</Button>
          </Link>
          <Link href="/promotions/new">
            <Button><Plus className="h-4 w-4 mr-2" />新建任务</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotionTasks.map((task) => (
          <Link key={task.id} href={`/promotions/${task.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{task.name}</CardTitle>
                  <Badge className={`${statusColors[task.status]} border-0`}>{statusLabels[task.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">产品</span>
                    <span>{task.productName}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">已推广业务员</span>
                    <span className="text-right">
                      {task.promotedBy.length > 0
                        ? task.promotedBy.join("、")
                        : <span className="text-muted-foreground">暂无</span>}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">业务员范围</span>
                    <span className="text-right text-xs text-muted-foreground">
                      {task.assignedTo.join("、")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">截止日期</span>
                    <span>{task.deadline}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
