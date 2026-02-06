import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2, Bell, Users, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const grades = [
  "الكل",
  "الصف الأول",
  "الصف الثاني",
  "الصف الثالث",
  "الصف الرابع",
  "الصف الخامس",
  "الصف السادس",
];

const notificationTypes = [
  { value: "announcement", label: "إعلان 📢" },
  { value: "poll", label: "تصويت 📊" },
  { value: "alert", label: "تنبيه ⚠️" },
];

interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  allow_voting: boolean;
  target_grade: string | null;
  created_at: string;
  expires_at: string | null;
}

interface Vote {
  notification_id: string;
  vote: string;
}

const NotificationsManagement = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("announcement");
  const [allowVoting, setAllowVoting] = useState(false);
  const [targetGrade, setTargetGrade] = useState("الكل");
  const [expiresAt, setExpiresAt] = useState("");

  // Edit state
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (notificationsError) {
      console.error('Error fetching notifications:', notificationsError);
    } else {
      setNotifications(notificationsData || []);
    }

    // Fetch all votes
    const { data: votesData } = await supabase
      .from('notification_votes')
      .select('notification_id, vote');

    setVotes(votesData || []);
    setLoading(false);
  };

  const getVoteCounts = (notificationId: string) => {
    const notificationVotes = votes.filter(v => v.notification_id === notificationId);
    return {
      approve: notificationVotes.filter(v => v.vote === 'approve').length,
      reject: notificationVotes.filter(v => v.vote === 'reject').length,
    };
  };

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("الرجاء إدخال العنوان والمحتوى");
      return;
    }

    setAdding(true);

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        title,
        content,
        type,
        allow_voting: allowVoting,
        target_grade: targetGrade === "الكل" ? null : targetGrade,
        expires_at: expiresAt || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding notification:', error);
      toast.error('حدث خطأ في إضافة الإشعار');
    } else {
      setNotifications([data, ...notifications]);
      resetForm();
      toast.success("تمت إضافة الإشعار بنجاح!");
    }

    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting notification:', error);
      toast.error('حدث خطأ في حذف الإشعار');
    } else {
      setNotifications(notifications.filter(n => n.id !== id));
      toast.success("تم حذف الإشعار");
    }
  };

  const handleUpdate = async () => {
    if (!editingNotification) return;

    const { error } = await supabase
      .from('notifications')
      .update({
        title: editingNotification.title,
        content: editingNotification.content,
        type: editingNotification.type,
        allow_voting: editingNotification.allow_voting,
        target_grade: editingNotification.target_grade,
        expires_at: editingNotification.expires_at,
      })
      .eq('id', editingNotification.id);

    if (error) {
      console.error('Error updating notification:', error);
      toast.error('حدث خطأ في تحديث الإشعار');
    } else {
      setNotifications(notifications.map(n => 
        n.id === editingNotification.id ? editingNotification : n
      ));
      setEditingNotification(null);
      toast.success("تم تحديث الإشعار بنجاح!");
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setType("announcement");
    setAllowVoting(false);
    setTargetGrade("الكل");
    setExpiresAt("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Add New Notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Plus className="w-5 h-5 text-primary" />
            إضافة إشعار جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">العنوان *</label>
              <Input
                placeholder="عنوان الإشعار"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">النوع</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">المحتوى *</label>
            <Textarea
              placeholder="محتوى الإشعار..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-2">الصف المستهدف</label>
              <Select value={targetGrade} onValueChange={setTargetGrade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">تاريخ الانتهاء (اختياري)</label>
              <Input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                checked={allowVoting}
                onCheckedChange={setAllowVoting}
              />
              <label className="text-sm font-medium">تفعيل التصويت</label>
            </div>
          </div>

          <Button onClick={handleAdd} disabled={adding} className="gap-2">
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            إضافة الإشعار
          </Button>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bell className="w-5 h-5 text-primary" />
            الإشعارات ({notifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">لا توجد إشعارات</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const voteCounts = getVoteCounts(notification.id);
                return (
                  <div
                    key={notification.id}
                    className="flex items-start justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <Badge variant={notification.type === 'poll' ? 'secondary' : notification.type === 'alert' ? 'destructive' : 'default'}>
                          {notification.type === 'poll' ? 'تصويت' : notification.type === 'alert' ? 'تنبيه' : 'إعلان'}
                        </Badge>
                        {notification.target_grade && (
                          <Badge variant="outline">{notification.target_grade}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {notification.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatDate(notification.created_at)}</span>
                        {notification.allow_voting && (
                          <span className="flex items-center gap-2">
                            <ThumbsUp className="w-3 h-3 text-green-600" />
                            {voteCounts.approve}
                            <ThumbsDown className="w-3 h-3 text-red-600" />
                            {voteCounts.reject}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingNotification(notification)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingNotification} onOpenChange={() => setEditingNotification(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل الإشعار</DialogTitle>
          </DialogHeader>
          {editingNotification && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">العنوان</label>
                <Input
                  value={editingNotification.title}
                  onChange={(e) => setEditingNotification({
                    ...editingNotification,
                    title: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المحتوى</label>
                <Textarea
                  value={editingNotification.content}
                  onChange={(e) => setEditingNotification({
                    ...editingNotification,
                    content: e.target.value
                  })}
                  rows={4}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">النوع</label>
                  <Select 
                    value={editingNotification.type} 
                    onValueChange={(value) => setEditingNotification({
                      ...editingNotification,
                      type: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch
                    checked={editingNotification.allow_voting}
                    onCheckedChange={(checked) => setEditingNotification({
                      ...editingNotification,
                      allow_voting: checked
                    })}
                  />
                  <label className="text-sm font-medium">تفعيل التصويت</label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNotification(null)}>
              إلغاء
            </Button>
            <Button onClick={handleUpdate}>
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationsManagement;
