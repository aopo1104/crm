"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { products, customers } from "@/lib/mock-data";

export default function NewPromotionPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => router.push("/promotions"), 1000);
  };

  if (submitted) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-lg font-medium">推广任务已创建</p>
            <p className="text-muted-foreground mt-2">正在跳转...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/promotions">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">新建推广任务</h1>
          <p className="text-muted-foreground">创建营销推广任务并分配给销售人员</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">任务信息</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">任务名称</label>
              <input className="w-full mt-1 border rounded-md p-2 text-sm" placeholder="例：2024 春季新品推广" />
            </div>
            <div>
              <label className="text-sm font-medium">推广产品</label>
              <select className="w-full mt-1 border rounded-md p-2 text-sm">
                <option value="">选择产品...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">推广优势</label>
              <textarea className="w-full mt-1 border rounded-md p-2 text-sm" rows={4} placeholder="描述产品核心优势，用于推广内容..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">业务员范围</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">当前角色</label>
              <select className="w-full mt-1 border rounded-md p-2 text-sm">
                <option value="vp">副总（可选全部人员）</option>
                <option value="manager">部门经理（仅本部门）</option>
                <option value="salesperson">业务员（仅自己）</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">指定业务员</label>
              <div className="mt-2 border rounded-md p-3 space-y-2">
                <p className="text-xs text-muted-foreground mb-2">华南区</p>
                {["李明", "王芳"].map((name) => (
                  <label key={name} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">{name}</span>
                  </label>
                ))}
                <p className="text-xs text-muted-foreground mt-2 mb-1">华北区</p>
                {["赵强"].map((name) => (
                  <label key={name} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">截止日期</label>
              <input type="date" className="w-full mt-1 border rounded-md p-2 text-sm" defaultValue="2024-04-30" />
            </div>
            <Button className="w-full" onClick={handleSubmit}>创建推广任务</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
