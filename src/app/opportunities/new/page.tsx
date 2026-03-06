"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { leads, customers, products } from "@/lib/mock-data";

const CURRENT_USER = "李明";

function NewOpportunityPageContent() {
  const searchParams = useSearchParams();
  const preCustomerId = searchParams.get("customerId") || "";
  const preLeadId = searchParams.get("leadId") || "";

  const [submitted, setSubmitted] = useState(false);
  const [relatedType, setRelatedType] = useState<"lead" | "customer">(
    preLeadId ? "lead" : "customer"
  );
  const [relatedId, setRelatedId] = useState(preCustomerId || preLeadId || "");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [stage, setStage] = useState("initial");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const allCategories = Array.from(new Set(products.map((p) => p.category)));

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = () => {
    if (!name.trim() || !relatedId) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold">商机创建成功</h2>
        <p className="text-muted-foreground">商机「{name}」已成功创建</p>
        <div className="flex gap-3">
          <Link href="/opportunities">
            <Button variant="outline">查看商机列表</Button>
          </Link>
          <Button onClick={() => setSubmitted(false)}>继续创建</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/opportunities">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">新建商机</h1>
          <p className="text-muted-foreground">创建销售商机并跟踪转化进度</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">关联对象</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="relatedType"
                  value="customer"
                  checked={relatedType === "customer"}
                  onChange={() => { setRelatedType("customer"); setRelatedId(""); }}
                />
                <span className="text-sm font-medium">关联客户</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="relatedType"
                  value="lead"
                  checked={relatedType === "lead"}
                  onChange={() => { setRelatedType("lead"); setRelatedId(""); }}
                />
                <span className="text-sm font-medium">关联线索</span>
              </label>
            </div>
            <div>
              <label className="text-sm font-medium">
                {relatedType === "customer" ? "选择客户" : "选择线索"} <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full mt-1 border rounded-md p-2 text-sm"
                value={relatedId}
                onChange={(e) => setRelatedId(e.target.value)}
              >
                <option value="">请选择...</option>
                {relatedType === "customer"
                  ? customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.company} ({c.id})</option>
                    ))
                  : leads.map((l) => (
                      <option key={l.id} value={l.id}>{l.company} ({l.id})</option>
                    ))
                }
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">商机基本信息</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">商机名称 <span className="text-red-500">*</span></label>
              <input
                className="w-full mt-1 border rounded-md p-2 text-sm"
                placeholder="如：XX公司 - E1 Pro批量采购项目"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">预估金额 (USD)</label>
                <input
                  type="number"
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">预计成交日期</label>
                <input
                  type="date"
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">商机阶段</label>
              <select
                className="w-full mt-1 border rounded-md p-2 text-sm"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                <option value="initial">初步接触</option>
                <option value="requirement">需求确认</option>
                <option value="proposal">方案报价</option>
                <option value="negotiation">商务谈判</option>
                <option value="won">赢单</option>
                <option value="lost">输单</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">关联产品 / 品类</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">品类（多选）</label>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      selectedCategories.includes(cat)
                        ? "bg-primary text-white border-primary"
                        : "border-gray-200 hover:border-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">产品（多选）</label>
              <div className="space-y-2">
                {products.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(p.id)}
                      onChange={() => toggleProduct(p.id)}
                    />
                    <span className="text-sm">{p.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">${p.basePrice}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">备注</CardTitle></CardHeader>
          <CardContent>
            <textarea
              className="w-full border rounded-md p-2 text-sm"
              rows={4}
              placeholder="可选：补充商机背景、客户需求或其他说明..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Link href="/opportunities">
            <Button variant="outline">取消</Button>
          </Link>
          <Button onClick={handleSubmit} disabled={!name.trim() || !relatedId}>
            创建商机
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NewOpportunityPage() {
  return (
    <Suspense fallback={<div className="p-6">加载中...</div>}>
      <NewOpportunityPageContent />
    </Suspense>
  );
}
