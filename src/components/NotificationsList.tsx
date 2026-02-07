import { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import NotificationCard from "./NotificationCard";

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
  user_id: string;
  vote: string;
}

interface NotificationsListProps {
  userGrade?: string;
  userId?: string;
  compact?: boolean;
}

const NotificationsList = ({ userGrade, userId, compact = false }: NotificationsListProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch notifications
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: notificationsData, error: notificationsError } = await query;

      if (notificationsError) throw notificationsError;

      // Filter by grade if specified
      let filteredNotifications = notificationsData || [];
      if (userGrade) {
        filteredNotifications = filteredNotifications.filter(
          n => !n.target_grade || n.target_grade === userGrade
        );
      }

      setNotifications(filteredNotifications);

      // Fetch all votes for these notifications
      if (filteredNotifications.length > 0) {
        const notificationIds = filteredNotifications.map(n => n.id);
        const { data: votesData, error: votesError } = await supabase
          .from('notification_votes')
          .select('*')
          .in('notification_id', notificationIds);

        if (votesError) throw votesError;
        setVotes(votesData || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userGrade]);

  const getVoteCounts = (notificationId: string) => {
    const notificationVotes = votes.filter(v => v.notification_id === notificationId);
    return {
      approveCount: notificationVotes.filter(v => v.vote === 'approve').length,
      rejectCount: notificationVotes.filter(v => v.vote === 'reject').length,
    };
  };

  const getUserVote = (notificationId: string): 'approve' | 'reject' | null => {
    if (!userId) return null;
    const vote = votes.find(v => v.notification_id === notificationId && v.user_id === userId);
    return (vote?.vote as 'approve' | 'reject') || null;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${compact ? 'py-6' : 'py-12'}`}>
        <Loader2 className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} animate-spin text-primary`} />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className={`text-center ${compact ? 'py-6' : 'py-12'}`}>
        <Bell className={`${compact ? 'w-10 h-10' : 'w-16 h-16'} mx-auto mb-2 text-muted-foreground/50`} />
        <p className={`text-muted-foreground ${compact ? 'text-sm' : 'text-lg'}`}>لا توجد إشعارات حالياً</p>
      </div>
    );
  }

  return (
    <div className={compact ? 'divide-y' : 'space-y-4'}>
      {notifications.map((notification) => {
        const { approveCount, rejectCount } = getVoteCounts(notification.id);
        return (
          <NotificationCard
            key={notification.id}
            id={notification.id}
            title={notification.title}
            content={notification.content}
            type={notification.type}
            allowVoting={notification.allow_voting}
            createdAt={notification.created_at}
            expiresAt={notification.expires_at || undefined}
            approveCount={approveCount}
            rejectCount={rejectCount}
            userVote={getUserVote(notification.id)}
            onVoteChange={fetchData}
            compact={compact}
          />
        );
      })}
    </div>
  );
};

export default NotificationsList;
