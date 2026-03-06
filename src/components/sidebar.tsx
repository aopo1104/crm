"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Globe,
  Building2,
  FileText,
  CheckCircle,
  Megaphone,
  ListTodo,
  BarChart3,
  PieChart,
  Settings,
  TrendingUp,
  Search,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navGroups = [
  {
    items: [
      { label: "工作台", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "线索管理",
    items: [
      { label: "线索管理", href: "/leads", icon: Globe },
      { label: "线索查重", href: "/leads/search", icon: Search },
    ],
  },
  {
    title: "客户管理",
    items: [
      { label: "客户列表", href: "/customers", icon: Building2 },
    ],
  },
  {
    title: "报价管理",
    items: [
      { label: "报价列表", href: "/quotes", icon: FileText },
      { label: "审批中心", href: "/approvals", icon: CheckCircle },
    ],
  },
  {
    title: "推广管理",
    items: [
      { label: "推广任务", href: "/promotions", icon: ListTodo },
      { label: "监控看板", href: "/promotions/monitor", icon: BarChart3 },
    ],
  },
  {
    title: "数据分析",
    items: [
      { label: "报表中心", href: "/reports", icon: PieChart },
    ],
  },
  {
    items: [
      { label: "系统设置", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r bg-white flex flex-col">
      <div className="flex h-14 items-center px-4 border-b">
        <Megaphone className="h-6 w-6 text-primary mr-2" />
        <span className="font-bold text-lg">CRM 系统</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {gi > 0 && <Separator className="my-2" />}
            {group.title && (
              <p className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {group.title}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
            张
          </div>
          <div className="text-sm">
            <p className="font-medium">张总</p>
            <p className="text-xs text-muted-foreground">管理员</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
