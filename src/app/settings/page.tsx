"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">系统设置</h1>
        <p className="text-muted-foreground">管理系统配置（占位页面）</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">个人信息</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">姓名</label>
              <input className="w-full mt-1 border rounded-md p-2 text-sm" defaultValue="张总" />
            </div>
            <div>
              <label className="text-sm font-medium">邮箱</label>
              <input className="w-full mt-1 border rounded-md p-2 text-sm" defaultValue="zhang@company.com" />
            </div>
            <div>
              <label className="text-sm font-medium">角色</label>
              <input className="w-full mt-1 border rounded-md p-2 text-sm bg-muted" value="管理员" readOnly />
            </div>
            <Button onClick={() => alert("设置已保存（mock）")}>保存</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">系统配置</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">公海线索保护期</p>
                <p className="text-xs text-muted-foreground">认领后的默认保护天数</p>
              </div>
              <select className="border rounded-md p-2 text-sm">
                <option>15天</option>
                <option>30天</option>
                <option>60天</option>
              </select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">报价审批阈值</p>
                <p className="text-xs text-muted-foreground">低于基准价百分比时触发审批</p>
              </div>
              <select className="border rounded-md p-2 text-sm">
                <option>5%</option>
                <option>10%</option>
                <option>15%</option>
              </select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">客户不活跃提醒</p>
                <p className="text-xs text-muted-foreground">超过N天未跟进时提醒</p>
              </div>
              <select className="border rounded-md p-2 text-sm">
                <option>15天</option>
                <option>30天</option>
                <option>45天</option>
              </select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">推广模板管理</p>
                <p className="text-xs text-muted-foreground">管理邮件/WhatsApp推广模板</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => alert("模板管理功能（占位）")}>管理</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">团队成员</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "张总", role: "管理员", email: "zhang@company.com" },
                { name: "李明", role: "高级销售", email: "liming@company.com" },
                { name: "王芳", role: "销售", email: "wangfang@company.com" },
                { name: "赵强", role: "销售", email: "zhaoqiang@company.com" },
              ].map((member) => (
                <div key={member.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {member.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-muted px-2 py-1 rounded">{member.role}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">产品目录管理</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">管理产品信息、基准价和最低售价</p>
            <Button variant="outline" className="w-full" onClick={() => alert("产品目录管理（占位）")}>
              打开产品目录
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
