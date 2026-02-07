import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, ThumbsUp, ThumbsDown, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NotificationCardProps {
  id: string;
  title: string;
  content: string;
  type: string;
  allowVoting: boolean;
  createdAt: string;
  expiresAt?: string;
  approveCount: number;
  rejectCount: number;
  userVote?: 'approve' | 'reject' | null;
  onVoteChange?: () => void;
  compact?: boolean;
}

const NotificationCard = ({
  id,
  title,
  content,
  type,
  allowVoting,
  createdAt,
  expiresAt,
  approveCount,
  rejectCount,
  userVote,
  onVoteChange,
  compact = false,
}: NotificationCardProps) => {
  const [isVoting, setIsVoting] = useState(false);
  const [currentVote, setCurrentVote] = useState(userVote);

  const totalVotes = approveCount + rejectCount;
  const approvePercentage = totalVotes > 0 ? (approveCount / totalVotes) * 100 : 50;

  const handleVote = async (vote: 'approve' | 'reject') => {
    setIsVoting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("يجب تسجيل الدخول للتصويت");
        return;
      }

      if (currentVote === vote) {
        // Remove vote
        const { error } = await supabase
          .from('notification_votes')
          .delete()
          .eq('notification_id', id)
          .eq('user_id', user.id);

        if (error) throw error;
        setCurrentVote(null);
        toast.success("تم إلغاء تصويتك");
      } else {
        // Upsert vote
        const { error } = await supabase
          .from('notification_votes')
          .upsert({
            notification_id: id,
            user_id: user.id,
            vote: vote,
          }, {
            onConflict: 'notification_id,user_id'
          });

        if (error) throw error;
        setCurrentVote(vote);
        toast.success(vote === 'approve' ? "تم تسجيل موافقتك" : "تم تسجيل رفضك");
      }

      onVoteChange?.();
    } catch (error) {
      console.error('Error voting:', error);
      toast.error("حدث خطأ أثناء التصويت");
    } finally {
      setIsVoting(false);
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'poll':
        return '📊';
      case 'alert':
        return '⚠️';
      default:
        return '📢';
    }
  };

  const getTypeBadgeVariant = () => {
    switch (type) {
      case 'poll':
        return 'secondary';
      case 'alert':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = expiresAt && new Date(expiresAt) < new Date();

  if (compact) {
    return (
      <div className={`p-3 ${isExpired ? 'opacity-60' : ''}`}>
        <div className="flex items-start gap-2">
          <span className="text-lg">{getTypeIcon()}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm truncate">{title}</h4>
              <Badge variant={getTypeBadgeVariant()} className="text-xs">
                {type === 'poll' ? 'تصويت' : type === 'alert' ? 'تنبيه' : 'إعلان'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{content}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatDate(createdAt)}
              {isExpired && <Badge variant="outline" className="text-xs text-destructive">منتهي</Badge>}
            </div>
            
            {allowVoting && !isExpired && (
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant={currentVote === 'approve' ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => handleVote('approve')}
                  disabled={isVoting}
                >
                  <ThumbsUp className="w-3 h-3" />
                  {approveCount}
                </Button>
                <Button
                  variant={currentVote === 'reject' ? 'destructive' : 'outline'}
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => handleVote('reject')}
                  disabled={isVoting}
                >
                  <ThumbsDown className="w-3 h-3" />
                  {rejectCount}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`overflow-hidden border-2 transition-all ${isExpired ? 'opacity-60' : 'hover:border-primary/50'}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getTypeIcon()}</span>
              <h3 className="font-bold text-lg">{title}</h3>
            </div>
            <Badge variant={getTypeBadgeVariant()}>
              {type === 'poll' ? 'تصويت' : type === 'alert' ? 'تنبيه' : 'إعلان'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(createdAt)}
            </span>
            {isExpired && (
              <Badge variant="outline" className="text-destructive">منتهي</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>

          {allowVoting && !isExpired && (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  إجمالي الأصوات: {totalVotes}
                </span>
              </div>

              {/* Vote Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    موافق ({approveCount})
                  </span>
                  <span className="text-red-600 font-medium flex items-center gap-1">
                    رافض ({rejectCount})
                    <ThumbsDown className="w-4 h-4" />
                  </span>
                </div>
                <div className="relative h-3 bg-red-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-green-500 transition-all duration-500"
                    style={{ width: `${approvePercentage}%` }}
                  />
                </div>
              </div>

              {/* Vote Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={currentVote === 'approve' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleVote('approve')}
                  disabled={isVoting}
                >
                  <ThumbsUp className="w-4 h-4" />
                  موافق
                </Button>
                <Button
                  variant={currentVote === 'reject' ? 'destructive' : 'outline'}
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleVote('reject')}
                  disabled={isVoting}
                >
                  <ThumbsDown className="w-4 h-4" />
                  رافض
                </Button>
              </div>
            </div>
          )}

          {allowVoting && isExpired && totalVotes > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm text-muted-foreground">نتيجة التصويت النهائية:</p>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-green-600">موافق: {approveCount} ({Math.round(approvePercentage)}%)</span>
                <span className="text-red-600">رافض: {rejectCount} ({Math.round(100 - approvePercentage)}%)</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationCard;
