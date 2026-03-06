"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft, UserPlus, ArrowRightCircle, Building2, Mail, Phone,
  Globe, MessageSquare, FileText, Users, Plus, Paperclip, Star, UserCheck,
} from "lucide-react";
import {
  leads, contacts, statusMap, leadStageColors, followUpRecords,
  followUpTypeMap, type FollowUpRecord, type Contact,
} from "@/lib/mock-data";

const CURRENT_USER = "李明";
const stageOrder = ["pending_contact", "contacting", "interacting"];
const stageBehavior: Record<string, string> = {
  pending_contact: "未上传跟进记录",
  contacting: "已上传跟进记录，未收到客户回复",
  interacting: "已收到客户回复",
};

export default function LeadDetailPage() {
  const params = useParams();
  const lead = leads.find((l) => l.id === params.id);
  const [currentStatus, setCurrentStatus] = useState(lead?.status || "pending_contact");
  const [localFollowers, setLocalFollowers] = useState(lead?.followers || []);
  const [localContacts, setLocalContacts] = useState<Contact[]>(
    contacts.filter((c) => c.relatedId === (lead?.id || ""))
  );
  const [showConvert, setShowConvert] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [converted, setConverted] = useState(false);
  const [localRecords, setLocalRecords] = useState<FollowUpRecord[]>(
    followUpRecords.filter((r) => r.leadId === lead?.id)
  );
  // Follow-up form state
  const [fuSubject, setFuSubject] = useState("");
  const [fuType, setFuType] = useState("email");
  const [fuContact, setFuContact] = useState("");
  const [fuContent, setFuContent] = useState("");
  const [fuFiles, setFuFiles] = useState<string[]>([]);
  // Reply form state
  const [replyContent, setReplyContent] = useState("");
  const [replyFiles, setReplyFiles] = useState<string[]>([]);
  // Contact form state
  const [ctName, setCtName] = useState("");
  const [ctTitle, setCtTitle] = useState("");
  const [ctEmail, setCtEmail] = useState("");
  const [ctPhone, setCtPhone] = useState("");
  const [ctPrimary, setCtPrimary] = useState(false);

  const currentStageIndex = stageOrder.indexOf(currentStatus);
  const isFollowing = localFollowers.includes(CURRENT_USER);

  if (!lead) {
    return (
      <div className="p-6">
        <p>线索不存在</p>
        <Link href="/leads"><Button variant="link">返回公海</Button></Link>
      </div>
    );
  }

  const handleFollow = () => {
    if (!localFollowers.includes(CURRENT_USER)) {
      setLocalFollowers([...localFollowers, CURRENT_USER]);
    }
  };

  const handleConvert = () => {
    setConverted(true);
    setShowConvert(false);
  };

  const mockFileUpload = (setter: (f: string[]) => void, current: string[]) => {
    const name = `附件_${Date.now()}.pdf`;
    setter([...current, name]);
  };

  const submitFollowUp = () => {
    if (!fuContent.trim()) return;
    const rec: FollowUpRecord = {
      id: `FR-${Date.now()}`, leadId: lead.id, type: "follow_up",
      followUpType: fuType as FollowUpRecord["followUpType"],
      subject: fuSubject, contactPerson: fuContact,
      content: fuContent + (fuFiles.length ? ` [附件: ${fuFiles.join(", ")}]` : ""),
      createdAt: new Date().toLocaleString(), createdBy: CURRENT_USER,
    };
    setLocalRecords([rec, ...localRecords]);
    if (currentStatus === "pending_contact") setCurrentStatus("contacting");
    setFuSubject(""); setFuType("email"); setFuContact(""); setFuContent(""); setFuFiles([]);
    setShowFollowUp(false);
  };

  const submitReply = () => {
    if (!replyContent.trim()) return;
    const rec: FollowUpRecord = {
      id: `FR-${Date.now()}`, leadId: lead.id, type: "customer_reply",
      content: replyContent + (replyFiles.length ? ` [附件: ${replyFiles.join(", ")}]` : ""),
      createdAt: new Date().toLocaleString(), createdBy: CURRENT_USER,
    };
    setLocalRecords([rec, ...localRecords]);
    if (currentStatus === "pending_contact" || currentStatus === "contacting") setCurrentStatus("interacting");
    // V1.3: invalidate other followers' leads when current user logs a customer reply
    setLocalFollowers((prev) => prev.filter((f) => f === CURRENT_USER));
    setReplyContent(""); setReplyFiles([]);
    setShowReply(false);
  };

  const submitContact = () => {
    if (!ctName.trim()) return;
    const newContact: Contact = {
      id: `CT-${Date.now()}`, relatedType: "lead", relatedId: lead.id,
      name: ctName, title: ctTitle, email: ctEmail, phone: ctPhone,
      isPrimary: ctPrimary || localContacts.length === 0,
    };
    if (ctPrimary) {
      setLocalContacts([newContact, ...localContacts.map((c) => ({ ...c, isPrimary: false }))]);
    } else {
      setLocalContacts([...localContacts, newContact]);
    }
    setCtName(""); setCtTitle(""); setCtEmail(""); setCtPhone(""); setCtPrimary(false);
    setShowAddContact(false);
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/leads">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{lead.company}</h1>
            <Badge className={`${leadStageColors[currentStatus] || "bg-gray-100 text-gray-700"} border-0`}>
              {statusMap[currentStatus]}
            </Badge>
            {converted && <Badge className="bg-purple-100 text-purple-700 border-0">已转客户</Badge>}
          </div>
          <p className="text-muted-foreground text-sm">线索 · {lead.id} · {lead.industry} · {lead.country}</p>
        </div>
        <div className="flex gap-2">
          {!isFollowing && currentStatus !== "invalid" && !converted && (
            <Button size="sm" onClick={handleFollow}><UserPlus className="h-4 w-4 mr-1" />认领</Button>
          )}
          {isFollowing && !converted && (
            <>
              <Button size="sm" variant="outline" onClick={() => alert("将跳转至新建报价单（mock）")}>
                <FileText className="h-4 w-4 mr-1" />生成报价单
              </Button>
              <Button size="sm" variant="default" onClick={() => setShowConvert(true)}>
                <ArrowRightCircle className="h-4 w-4 mr-1" />转为客户
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Pipeline bar — always on top per V1.3 */}
      <Card>
        <CardContent className="pt-3 pb-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">线索阶段进度</p>
            <p className="text-xs text-muted-foreground">{stageBehavior[currentStatus] ?? "线索已失效"}</p>
          </div>
          <div className="flex items-center gap-1">
            {stageOrder.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center gap-1">
                <div className={`h-1.5 w-full rounded-full ${
                  currentStatus === "invalid" ? "bg-red-200" : i <= currentStageIndex ? "bg-primary" : "bg-muted"
                }`} />
                <span className={`text-xs ${
                  currentStatus === "invalid" ? "text-red-400" :
                  i === currentStageIndex ? "font-bold text-primary" : "text-muted-foreground"
                }`}>
                  {statusMap[s]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs below the pipeline */}
      <Tabs defaultValue="followup">
        <TabsList>
          <TabsTrigger value="followup">跟进记录</TabsTrigger>
          <TabsTrigger value="info">基本信息</TabsTrigger>
          <TabsTrigger value="contacts">联系人</TabsTrigger>
          <TabsTrigger value="followers">跟进人</TabsTrigger>
        </TabsList>

        {/* ── Follow-up records tab ── */}
        <TabsContent value="followup">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">跟进记录</CardTitle>
              {isFollowing && !converted && currentStatus !== "invalid" && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowFollowUp(true)}>
                    <FileText className="h-3.5 w-3.5 mr-1" />录入跟进
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowReply(true)}>
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />录入回复
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {localRecords.length > 0 ? (
                <div className="space-y-3">
                  {localRecords.map((r) => (
                    <div key={r.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                        r.type === "follow_up" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                      }`}>
                        {r.type === "follow_up" ? "📤" : "📩"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`border-0 text-xs ${r.type === "follow_up" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                            {r.type === "follow_up" ? "跟进记录" : "客户回复"}
                          </Badge>
                          {r.followUpType && (
                            <Badge className="border-0 text-xs bg-gray-100 text-gray-600">{followUpTypeMap[r.followUpType]}</Badge>
                          )}
                          {r.subject && <span className="text-sm font-medium">{r.subject}</span>}
                          <span className="text-xs text-muted-foreground ml-auto">{r.createdBy} · {r.createdAt}</span>
                        </div>
                        {r.contactPerson && (
                          <p className="text-xs text-muted-foreground mt-0.5">联系人：{r.contactPerson}</p>
                        )}
                        <p className="text-sm mt-1">{r.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  {isFollowing ? "暂无跟进记录，点击「录入跟进」开始记录" : "加入跟进后可录入跟进记录"}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Basic info tab ── */}
        <TabsContent value="info">
          <Card>
            <CardHeader><CardTitle className="text-base">基本信息</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "公司名称", value: lead.company, icon: <Building2 className="h-3.5 w-3.5" /> },
                  { label: "来源渠道", value: lead.source },
                  { label: "邮箱", value: lead.email, icon: <Mail className="h-3.5 w-3.5" /> },
                  { label: "电话", value: lead.phone, icon: <Phone className="h-3.5 w-3.5" /> },
                  { label: "行业", value: lead.industry },
                  { label: "国家/地区", value: lead.country, icon: <Globe className="h-3.5 w-3.5" /> },
                  { label: "创建时间", value: lead.createdAt },
                  { label: "最近跟进", value: lead.lastFollowUpDate || "—" },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="space-y-1">
                    <p className="text-muted-foreground">{label}</p>
                    <p className="font-medium flex items-center gap-1.5">{icon}{value}</p>
                  </div>
                ))}
              </div>
              {isFollowing && !converted && (
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <Link href={`/quotes/new?leadId=${lead.id}`}>
                    <Button variant="outline" size="sm"><FileText className="h-3.5 w-3.5 mr-1" />生成报价单</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Contacts tab ── */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">联系人管理</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setShowAddContact(true)}>
                <Plus className="h-3.5 w-3.5 mr-1" />添加联系人
              </Button>
            </CardHeader>
            <CardContent>
              {localContacts.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">暂无联系人，请添加</p>
              ) : (
                <div className="space-y-3">
                  {localContacts.map((ct) => (
                    <div key={ct.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {ct.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{ct.name}</p>
                          {ct.isPrimary && (
                            <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs flex items-center gap-0.5">
                              <Star className="h-3 w-3" />主联系人
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{ct.title}</p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          {ct.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{ct.email}</span>}
                          {ct.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{ct.phone}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Followers tab ── */}
        <TabsContent value="followers">
          <Card>
            <CardHeader><CardTitle className="text-base">跟进人</CardTitle></CardHeader>
            <CardContent>
              {localFollowers.length > 0 ? (
                <div className="space-y-2">
                  {localFollowers.map((f) => (
                    <div key={f} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {f[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{f}</p>
                        {f === CURRENT_USER && <p className="text-xs text-muted-foreground">当前用户</p>}
                      </div>
                      {f === CURRENT_USER && <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">我</Badge>}
                      <UserCheck className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">暂无跟进人</p>
                  {!isFollowing && (
                    <Button size="sm" className="mt-3" onClick={handleFollow}>
                      <UserPlus className="h-3.5 w-3.5 mr-1" />认领
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Follow-up Dialog ── */}
      <Dialog open={showFollowUp} onOpenChange={setShowFollowUp}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>录入跟进记录</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">跟进类型</label>
              <select className="w-full mt-1 border rounded-md p-2 text-sm" value={fuType} onChange={(e) => setFuType(e.target.value)}>
                <option value="email">邮件联系</option>
                <option value="whatsapp">WhatsApp联系</option>
                <option value="visit">线下拜访</option>
                <option value="meeting">会议</option>
                <option value="social">社媒联系</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">跟进主题</label>
              <input className="w-full mt-1 border rounded-md p-2 text-sm" placeholder="请输入跟进主题" value={fuSubject} onChange={(e) => setFuSubject(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">联系人</label>
              <select className="w-full mt-1 border rounded-md p-2 text-sm" value={fuContact} onChange={(e) => setFuContact(e.target.value)}>
                <option value="">请选择联系人...</option>
                {localContacts.map((ct) => (
                  <option key={ct.id} value={ct.name}>{ct.name}{ct.isPrimary ? " (主)" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">跟进内容 <span className="text-red-500">*</span></label>
              <textarea className="w-full mt-1 border rounded-md p-2 text-sm" rows={4} placeholder="请输入跟进内容..." value={fuContent} onChange={(e) => setFuContent(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-1.5"><Paperclip className="h-3.5 w-3.5" />上传附件</label>
              <div className="mt-1 flex items-center gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => mockFileUpload(setFuFiles, fuFiles)}>
                  选择文件
                </Button>
                <span className="text-xs text-muted-foreground">可上传多个文件</span>
              </div>
              {fuFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {fuFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs bg-muted/50 rounded px-2 py-1">
                      <Paperclip className="h-3 w-3 text-muted-foreground" />
                      <span>{f}</span>
                      <button className="ml-auto text-red-500 hover:text-red-700" onClick={() => setFuFiles(fuFiles.filter((_, j) => j !== i))}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFollowUp(false)}>取消</Button>
            <Button onClick={submitFollowUp} disabled={!fuContent.trim()}>提交</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reply Dialog ── */}
      <Dialog open={showReply} onOpenChange={setShowReply}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>录入客户回复</DialogTitle></DialogHeader>
          <p className="text-xs text-amber-600 bg-amber-50 rounded p-2">提示：录入客户回复后，其他共同跟进人的线索状态将失效</p>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">回复内容 <span className="text-red-500">*</span></label>
              <textarea className="w-full mt-1 border rounded-md p-2 text-sm" rows={4} placeholder="请输入客户回复内容..." value={replyContent} onChange={(e) => setReplyContent(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-1.5"><Paperclip className="h-3.5 w-3.5" />上传附件</label>
              <div className="mt-1 flex items-center gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => mockFileUpload(setReplyFiles, replyFiles)}>
                  选择文件
                </Button>
                <span className="text-xs text-muted-foreground">可上传多个文件</span>
              </div>
              {replyFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {replyFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs bg-muted/50 rounded px-2 py-1">
                      <Paperclip className="h-3 w-3 text-muted-foreground" />
                      <span>{f}</span>
                      <button className="ml-auto text-red-500 hover:text-red-700" onClick={() => setReplyFiles(replyFiles.filter((_, j) => j !== i))}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReply(false)}>取消</Button>
            <Button onClick={submitReply} disabled={!replyContent.trim()}>提交</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add Contact Dialog ── */}
      <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
        <DialogContent>
          <DialogHeader><DialogTitle>添加联系人</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">姓名 <span className="text-red-500">*</span></label>
                <input className="w-full mt-1 border rounded-md p-2 text-sm" placeholder="联系人姓名" value={ctName} onChange={(e) => setCtName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">职位</label>
                <input className="w-full mt-1 border rounded-md p-2 text-sm" placeholder="职位/头衔" value={ctTitle} onChange={(e) => setCtTitle(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">邮箱</label>
              <input className="w-full mt-1 border rounded-md p-2 text-sm" placeholder="电子邮箱" value={ctEmail} onChange={(e) => setCtEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">电话</label>
              <input className="w-full mt-1 border rounded-md p-2 text-sm" placeholder="联系电话" value={ctPhone} onChange={(e) => setCtPhone(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={ctPrimary} onChange={(e) => setCtPrimary(e.target.checked)} />
              <span className="text-sm">设为主联系人</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddContact(false)}>取消</Button>
            <Button onClick={submitContact} disabled={!ctName.trim()}>添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Convert Dialog ── */}
      <Dialog open={showConvert} onOpenChange={setShowConvert}>
        <DialogContent>
          <DialogHeader><DialogTitle>转化为客户</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">客户等级</label>
              <select className="w-full mt-1 border rounded-md p-2 text-sm">
                <option value="B">B级 - 一般客户</option>
                <option value="A">A级 - 重要客户</option>
                <option value="C">C级 - 潜力客户</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">品类</label>
              <select className="w-full mt-1 border rounded-md p-2 text-sm">
                <option>升降桌</option>
                <option>工学椅</option>
                <option>配件</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">业务员</label>
              <select className="w-full mt-1 border rounded-md p-2 text-sm">
                <option>李明</option>
                <option>王芳</option>
                <option>赵强</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">跟单员</label>
              <select className="w-full mt-1 border rounded-md p-2 text-sm">
                <option>小王</option>
                <option>小李</option>
                <option>小张</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConvert(false)}>取消</Button>
            <Button onClick={handleConvert}>确认转化</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
