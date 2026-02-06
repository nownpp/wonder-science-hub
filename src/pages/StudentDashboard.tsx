import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, LogOut, Home, BookOpen, Play, Trophy, 
  Clock, CheckCircle2, Video, Atom, TrendingUp, FileText, Bell 
} from 'lucide-react';
import NotificationsList from '@/components/NotificationsList';

interface Profile {
  id: string;
  full_name: string | null;
  grade: string | null;
  avatar_url: string | null;
}

interface StudentProgress {
  id: string;
  content_type: string;
  content_id: string;
  completed: boolean;
  progress_percentage: number;
  time_spent_seconds: number;
  last_accessed_at: string;
}

interface ContentItem {
  id: string;
  title: string;
  category: string;
  thumbnail_url: string | null;
}

interface FileItem {
  id: string;
  title: string;
  category: string;
  thumbnail_url: string | null;
  file_url: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [videos, setVideos] = useState<ContentItem[]>([]);
  const [simulations, setSimulations] = useState<ContentItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/student-auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileData) {
      setProfile(profileData);
    }

    // Fetch progress
    const { data: progressData } = await supabase
      .from('student_progress')
      .select('*')
      .eq('user_id', user.id);
    
    if (progressData) {
      setProgress(progressData);
    }

    // Fetch videos filtered by student's grade
    const studentGrade = profileData?.grade || 'الصف الثالث';
    
    const { data: videosData } = await supabase
      .from('videos')
      .select('id, title, category, thumbnail_url, grade')
      .eq('grade', studentGrade);
    
    if (videosData) {
      setVideos(videosData);
    }

    // Fetch simulations filtered by student's grade
    const { data: simulationsData } = await supabase
      .from('simulations')
      .select('id, title, category, thumbnail_url, grade')
      .eq('grade', studentGrade);
    
    if (simulationsData) {
      setSimulations(simulationsData);
    }

    // Fetch files filtered by student's grade
    const { data: filesData } = await supabase
      .from('files')
      .select('id, title, category, thumbnail_url, file_url, grade')
      .eq('grade', studentGrade);
    
    if (filesData) {
      setFiles(filesData);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getCompletedCount = (type: string) => {
    return progress.filter(p => p.content_type === type && p.completed).length;
  };

  const getTotalTimeSpent = () => {
    const totalSeconds = progress.reduce((acc, p) => acc + p.time_spent_seconds, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return { hours, minutes };
  };

  const getOverallProgress = () => {
    const totalContent = videos.length + simulations.length + files.length;
    if (totalContent === 0) return 0;
    const completedCount = progress.filter(p => p.completed).length;
    return Math.round((completedCount / totalContent) * 100);
  };

  const getContentProgress = (contentId: string, contentType: string) => {
    const item = progress.find(p => p.content_id === contentId && p.content_type === contentType);
    return item ? item.progress_percentage : 0;
  };

  const isContentCompleted = (contentId: string, contentType: string) => {
    const item = progress.find(p => p.content_id === contentId && p.content_type === contentType);
    return item?.completed || false;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const timeSpent = getTotalTimeSpent();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted" dir="rtl">
      {/* Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-lg">
              {profile?.full_name?.charAt(0) || '؟'}
            </div>
            <div>
              <h1 className="font-bold text-foreground">
                مرحباً، {profile?.full_name || 'طالب'} 👋
              </h1>
              <p className="text-sm text-muted-foreground">{profile?.grade || 'الصف الثالث'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <Home className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-foreground">{getOverallProgress()}%</p>
              <p className="text-sm text-muted-foreground">التقدم الكلي</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-foreground">
                {getCompletedCount('video') + getCompletedCount('simulation')}
              </p>
              <p className="text-sm text-muted-foreground">مكتمل</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-foreground">
                {timeSpent.hours}س {timeSpent.minutes}د
              </p>
              <p className="text-sm text-muted-foreground">وقت التعلم</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <p className="text-2xl font-bold text-foreground">
                {Math.floor(getOverallProgress() / 10)}
              </p>
              <p className="text-sm text-muted-foreground">الإنجازات</p>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              تقدمك في التعلم - {profile?.grade || 'الصف الثالث'}
            </CardTitle>
          <CardDescription>
            أكملت {getCompletedCount('video') + getCompletedCount('simulation') + getCompletedCount('file')} من {videos.length + simulations.length + files.length} درس في صفك
          </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={getOverallProgress()} className="h-4" />
            <p className="text-center mt-2 text-sm text-muted-foreground">
              {getOverallProgress()}% مكتمل
            </p>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              الإشعارات
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              الفيديوهات ({getCompletedCount('video')}/{videos.length})
            </TabsTrigger>
            <TabsTrigger value="simulations" className="flex items-center gap-2">
              <Atom className="w-4 h-4" />
              المحاكاة ({getCompletedCount('simulation')}/{simulations.length})
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              الملفات ({getCompletedCount('file')}/{files.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <NotificationsList userGrade={profile?.grade || undefined} userId={user?.id} />
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <Card 
                  key={video.id} 
                  className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                    isContentCompleted(video.id, 'video') ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => navigate(`/videos`)}
                >
                  <div className="aspect-video bg-muted relative">
                    {video.thumbnail_url ? (
                      <img 
                        src={video.thumbnail_url} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    {isContentCompleted(video.id, 'video') && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{video.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>{video.category}</span>
                      <span>{getContentProgress(video.id, 'video')}%</span>
                    </div>
                    <Progress value={getContentProgress(video.id, 'video')} className="h-2" />
                  </CardContent>
                </Card>
              ))}
              {videos.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>لا توجد فيديوهات لـ {profile?.grade || 'صفك'} حالياً</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="simulations">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulations.map((simulation) => (
                <Card 
                  key={simulation.id} 
                  className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                    isContentCompleted(simulation.id, 'simulation') ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => navigate(`/simulations`)}
                >
                  <div className="aspect-video bg-muted relative">
                    {simulation.thumbnail_url ? (
                      <img 
                        src={simulation.thumbnail_url} 
                        alt={simulation.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Atom className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    {isContentCompleted(simulation.id, 'simulation') && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{simulation.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>{simulation.category}</span>
                      <span>{getContentProgress(simulation.id, 'simulation')}%</span>
                    </div>
                    <Progress value={getContentProgress(simulation.id, 'simulation')} className="h-2" />
                  </CardContent>
                </Card>
              ))}
              {simulations.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Atom className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>لا توجد محاكاة لـ {profile?.grade || 'صفك'} حالياً</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="files">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <Card 
                  key={file.id} 
                  className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                    isContentCompleted(file.id, 'file') ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => window.open(file.file_url, '_blank')}
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative flex items-center justify-center">
                    {file.thumbnail_url ? (
                      <img 
                        src={file.thumbnail_url} 
                        alt={file.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileText className="w-12 h-12 text-primary" />
                    )}
                    {isContentCompleted(file.id, 'file') && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{file.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>{file.category}</span>
                      <span>{getContentProgress(file.id, 'file')}%</span>
                    </div>
                    <Progress value={getContentProgress(file.id, 'file')} className="h-2" />
                  </CardContent>
                </Card>
              ))}
              {files.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>لا توجد ملفات لـ {profile?.grade || 'صفك'} حالياً</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;