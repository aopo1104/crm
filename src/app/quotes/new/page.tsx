"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2, AlertTriangle } from "lucide-react";
import { customers, products } from "@/lib/mock-data";

interface QuoteLineItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

function NewQuotePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get("customerId") || "";

  const [customerId, setCustomerId] = useState(preselectedCustomerId);
  const [items, setItems] = useState<QuoteLineItem[]>([
    { productId: "", quantity: 1, unitPrice: 0 },
  ]);
  const [showApproval, setShowApproval] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedCustomer = customers.find((c) => c.id === customerId);

  const addItem = () => setItems([...items, { productId: "", quantity: 1, unitPrice: 0 }]);

  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, field: keyof QuoteLineItem, value: string | number) => {
    const newItems = [...items];
    if (field === "productId") {
      const product = products.find((p) => p.id === value);
      newItems[index] = { ...newItems[index], productId: value as string, unitPrice: product?.basePrice || 0 };
    } else {
      newItems[index] = { ...newItems[index], [field]: Number(value) };
    }
    setItems(newItems);
  };

  const needsApproval = items.some((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product && item.unitPrice < product.basePrice;
  });

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const handleSubmit = () => {
    if (needsApproval) {
      setShowApproval(true);
    } else {
      setSubmitted(true);
      setTimeout(() => {
        if (customerId) {
          router.push(`/customers/${customerId}?tab=quotes`);
        } else {
          router.push("/quotes");
        }
      }, 1000);
    }
  };

  const handleApprovalSubmit = () => {
    setShowApproval(false);
    setSubmitted(true);
    setTimeout(() => {
      router.push("/approvals");
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/quotes">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">新建报价</h1>
          <p className="text-muted-foreground">快速生成标准报价单</p>
        </div>
      </div>

      {submitted ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-lg font-medium">
              {needsApproval ? "报价单已提交审批" : "报价单已创建"}
            </p>
            <p className="text-muted-foreground mt-2">正在跳转...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">客户选择</CardTitle></CardHeader>
              <CardContent>
                <select
                  className="w-full border rounded-md p-2 text-sm"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                >
                  <option value="">选择客户...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.company} ({c.contact})</option>
                  ))}
                </select>
                {selectedCustomer && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                    <p>联系人: {selectedCustomer.contact} · {selectedCustomer.email}</p>
                    <p>等级: {selectedCustomer.level}级 · 阶段: {selectedCustomer.stage}</p>
                    <Link href={`/customers/${selectedCustomer.id}`} className="text-primary hover:underline text-xs">
                      查看客户360° →
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">产品明细</CardTitle>
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-1" />添加产品
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const product = products.find((p) => p.id === item.productId);
                    const isBelowBase = product && item.unitPrice < product.basePrice;
                    const isBelowMin = product && item.unitPrice < product.minPrice;
                    return (
                      <div key={index} className="grid grid-cols-12 gap-3 items-start">
                        <div className="col-span-4">
                          <label className="text-xs text-muted-foreground">产品</label>
                          <select
                            className="w-full border rounded-md p-2 text-sm mt-1"
                            value={item.productId}
                            onChange={(e) => updateItem(index, "productId", e.target.value)}
                          >
                            <option value="">选择产品...</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>{p.name} (${p.basePrice})</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-muted-foreground">数量</label>
                          <input
                            type="number"
                            className="w-full border rounded-md p-2 text-sm mt-1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", e.target.value)}
                            min={1}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-muted-foreground">单价 (USD)</label>
                          <input
                            type="number"
                            className={`w-full border rounded-md p-2 text-sm mt-1 ${isBelowMin ? "border-red-500" : isBelowBase ? "border-yellow-500" : ""}`}
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                          />
                          {isBelowBase && !isBelowMin && (
                            <p className="text-xs text-yellow-600 mt-1">低于基准价，需审批</p>
                          )}
                          {isBelowMin && (
                            <p className="text-xs text-red-600 mt-1">低于最低售价!</p>
                          )}
                        </div>
                        <div className="col-span-3">
                          <label className="text-xs text-muted-foreground">小计</label>
                          <p className="mt-2 font-medium">${(item.quantity * item.unitPrice).toLocaleString()}</p>
                        </div>
                        <div className="col-span-1 pt-6">
                          {items.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">报价汇总</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">产品数</span>
                  <span>{items.filter((i) => i.productId).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">总数量</span>
                  <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t pt-3">
                  <span>总金额</span>
                  <span>${totalAmount.toLocaleString()}</span>
                </div>
                {needsApproval && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg text-yellow-700 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>含低于基准价产品，需触发审批</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button className="w-full" onClick={handleSubmit} disabled={!customerId || items.every((i) => !i.productId)}>
              {needsApproval ? "提交审批" : "生成报价单"}
            </Button>

            {showApproval && (
              <Card className="border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-base text-yellow-700 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />价格超权限审批
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">部分产品价格低于基准价，需要上级审批。</p>
                  <textarea
                    className="w-full border rounded-md p-2 text-sm"
                    rows={3}
                    placeholder="请说明低价原因（如大客户折扣、竞品对标等）..."
                  />
                  <Button className="w-full" onClick={handleApprovalSubmit}>确认提交审批</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewQuotePage() {
  return (
    <Suspense fallback={<div className="p-6">加载中...</div>}>
      <NewQuotePageContent />
    </Suspense>
  );
}
