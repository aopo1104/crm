"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { promotionTasks } from "@/lib/mock-data";

export default function PromotionMonitorPage() {
  const activeTasks = promotionTasks.filter((t) => t.status === "active");
  const completedTasks = promotionTasks.filter((t) => t.status === "completed");

  const totalSent = promotionTasks.reduce((s, t) => s + t.sentCount, 0);
  const totalTarget = promotionTasks.reduce((s, t) => s + t.totalTarget, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/promotions">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">推广监控看板</h1>
          <p className="text-muted-foreground">实时监控所有推广任务执行情况</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{promotionTasks.length}</p>
            <p className="text-sm text-muted-foreground">总任务数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{activeTasks.length}</p>
            <p className="text-sm text-muted-foreground">进行中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">{completedTasks.length}</p>
            <p className="text-sm text-muted-foreground">已完成</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{totalSent}/{totalTarget}</p>
            <p className="text-sm text-muted-foreground">总发送进度</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">任务执行汇总</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-muted-foreground">任务名称</th>
                <th className="pb-3 font-medium text-muted-foreground">产品</th>
                <th className="pb-3 font-medium text-muted-foreground">状态</th>
                <th className="pb-3 font-medium text-muted-foreground">进度</th>
                <th className="pb-3 font-medium text-muted-foreground">打开率</th>
                <th className="pb-3 font-medium text-muted-foreground">回复率</th>
                <th className="pb-3 font-medium text-muted-foreground">转化率</th>
                <th className="pb-3 font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {promotionTasks.map((task) => (
                <tr key={task.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3 font-medium">{task.name}</td>
                  <td className="py-3">{task.productName}</td>
                  <td className="py-3">
                    <Badge className={
                      task.status === "active" ? "bg-blue-100 text-blue-700 border-0" :
                      task.status === "completed" ? "bg-green-100 text-green-700 border-0" :
                      "bg-gray-100 text-gray-700 border-0"
                    }>
                      {task.status === "active" ? "进行中" : task.status === "completed" ? "已完成" : "草稿"}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(task.sentCount / task.totalTarget) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs">{task.sentCount}/{task.totalTarget}</span>
                    </div>
                  </td>
                  <td className="py-3">{task.openRate}</td>
                  <td className="py-3">{task.replyRate}</td>
                  <td className="py-3">{task.convertRate}</td>
                  <td className="py-3">
                    <Link href={`/promotions/${task.id}`}>
                      <Button variant="ghost" size="sm">详情</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">渠道效果对比</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { channel: "邮件", sent: 150, open: "42%", reply: "18%", convert: "8%" },
                { channel: "WhatsApp", sent: 80, open: "65%", reply: "32%", convert: "12%" },
                { channel: "短信", sent: 50, open: "35%", reply: "10%", convert: "5%" },
              ].map((ch) => (
                <div key={ch.channel} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{ch.channel}</p>
                    <p className="text-xs text-muted-foreground">已发送 {ch.sent} 条</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span>打开 {ch.open}</span>
                    <span>回复 {ch.reply}</span>
                    <span className="font-medium text-primary">转化 {ch.convert}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">产品推广排名</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { product: "智能锁 SL-200", tasks: 2, totalSent: 120, convertRate: "10%" },
                { product: "户外灯 OL-100", tasks: 1, totalSent: 80, convertRate: "8%" },
                { product: "管控面板 CP-300", tasks: 1, totalSent: 40, convertRate: "5%" },
              ].map((p, i) => (
                <div key={p.product} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? "bg-yellow-100 text-yellow-700" : "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium">{p.product}</p>
                      <p className="text-xs text-muted-foreground">{p.tasks} 个任务 · {p.totalSent} 次发送</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0">转化 {p.convertRate}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
