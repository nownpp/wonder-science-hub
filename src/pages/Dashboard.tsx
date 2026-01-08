import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThumbnailUpload from "@/components/ThumbnailUpload";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Atom, 
  Plus, 
  Trash2, 
  Edit2,
  Play,
  FileText,
  Loader2,
  LogOut
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const grades = [
  "الصف الأول",
  "الصف الثاني",
  "الصف الثالث",
  "الصف الرابع",
  "الصف الخامس",
  "الصف السادس",
];

const difficulties = ["سهل", "متوسط", "صعب"];

interface VideoType {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  grade: string | null;
  duration: string | null;
  views_count: number | null;
  created_at: string;
}

interface SimulationType {
  id: string;
  title: string;
  description: string | null;
  simulation_url: string | null;
  thumbnail_url: string | null;
  category: string;
  grade: string | null;
  difficulty: string | null;
  plays_count: number | null;
  created_at: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [simulations, setSimulations] = useState<SimulationType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Video form state
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoDescription, setNewVideoDescription] = useState("");
  const [newVideoCategory, setNewVideoCategory] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoThumbnail, setNewVideoThumbnail] = useState<string | null>(null);
  const [newVideoGrade, setNewVideoGrade] = useState("الصف الثالث");
  const [newVideoDuration, setNewVideoDuration] = useState("");
  const [addingVideo, setAddingVideo] = useState(false);
  
  // Simulation form state
  const [newSimTitle, setNewSimTitle] = useState("");
  const [newSimDescription, setNewSimDescription] = useState("");
  const [newSimCategory, setNewSimCategory] = useState("");
  const [newSimUrl, setNewSimUrl] = useState("");
  const [newSimThumbnail, setNewSimThumbnail] = useState<string | null>(null);
  const [newSimGrade, setNewSimGrade] = useState("الصف الثالث");
  const [newSimDifficulty, setNewSimDifficulty] = useState("سهل");
  const [addingSimulation, setAddingSimulation] = useState(false);
  
  // Edit dialog state
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const [editingSimulation, setEditingSimulation] = useState<SimulationType | null>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch data on mount
  useEffect(() => {
    if (user) {
      fetchVideos();
      fetchSimulations();
    }
  }, [user]);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching videos:', error);
      toast.error('حدث خطأ في جلب الفيديوهات');
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  const fetchSimulations = async () => {
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching simulations:', error);
      toast.error('حدث خطأ في جلب المحاكاة');
    } else {
      setSimulations(data || []);
    }
  };

  const handleAddVideo = async () => {
    if (!newVideoTitle.trim()) {
      toast.error("الرجاء إدخال عنوان الفيديو");
      return;
    }
    if (!newVideoUrl.trim()) {
      toast.error("الرجاء إدخال رابط الفيديو");
      return;
    }
    
    setAddingVideo(true);
    
    const { data, error } = await supabase
      .from('videos')
      .insert({
        title: newVideoTitle,
        description: newVideoDescription || null,
        category: newVideoCategory || 'عام',
        video_url: newVideoUrl,
        thumbnail_url: newVideoThumbnail,
        grade: newVideoGrade,
        duration: newVideoDuration || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding video:', error);
      toast.error('حدث خطأ في إضافة الفيديو');
    } else {
      setVideos([data, ...videos]);
      setNewVideoTitle("");
      setNewVideoDescription("");
      setNewVideoCategory("");
      setNewVideoUrl("");
      setNewVideoThumbnail(null);
      setNewVideoGrade("الصف الثالث");
      setNewVideoDuration("");
      toast.success("تمت إضافة الفيديو بنجاح!");
    }
    
    setAddingVideo(false);
  };

  const handleDeleteVideo = async (id: string) => {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting video:', error);
      toast.error('حدث خطأ في حذف الفيديو');
    } else {
      setVideos(videos.filter(v => v.id !== id));
      toast.success("تم حذف الفيديو");
    }
  };

  const handleUpdateVideo = async () => {
    if (!editingVideo) return;
    
    const { error } = await supabase
      .from('videos')
      .update({
        title: editingVideo.title,
        description: editingVideo.description,
        category: editingVideo.category,
        video_url: editingVideo.video_url,
        thumbnail_url: editingVideo.thumbnail_url,
        grade: editingVideo.grade,
        duration: editingVideo.duration,
      })
      .eq('id', editingVideo.id);
    
    if (error) {
      console.error('Error updating video:', error);
      toast.error('حدث خطأ في تحديث الفيديو');
    } else {
      setVideos(videos.map(v => v.id === editingVideo.id ? editingVideo : v));
      setEditingVideo(null);
      toast.success("تم تحديث الفيديو بنجاح!");
    }
  };

  const handleAddSimulation = async () => {
    if (!newSimTitle.trim()) {
      toast.error("الرجاء إدخال عنوان المحاكاة");
      return;
    }
    
    setAddingSimulation(true);
    
    const { data, error } = await supabase
      .from('simulations')
      .insert({
        title: newSimTitle,
        description: newSimDescription || null,
        category: newSimCategory || 'عام',
        simulation_url: newSimUrl || null,
        thumbnail_url: newSimThumbnail,
        grade: newSimGrade,
        difficulty: newSimDifficulty,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding simulation:', error);
      toast.error('حدث خطأ في إضافة المحاكاة');
    } else {
      setSimulations([data, ...simulations]);
      setNewSimTitle("");
      setNewSimDescription("");
      setNewSimCategory("");
      setNewSimUrl("");
      setNewSimThumbnail(null);
      setNewSimGrade("الصف الثالث");
      setNewSimDifficulty("سهل");
      toast.success("تمت إضافة المحاكاة بنجاح!");
    }
    
    setAddingSimulation(false);
  };

  const handleDeleteSimulation = async (id: string) => {
    const { error } = await supabase
      .from('simulations')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting simulation:', error);
      toast.error('حدث خطأ في حذف المحاكاة');
    } else {
      setSimulations(simulations.filter(s => s.id !== id));
      toast.success("تم حذف المحاكاة");
    }
  };

  const handleUpdateSimulation = async () => {
    if (!editingSimulation) return;
    
    const { error } = await supabase
      .from('simulations')
      .update({
        title: editingSimulation.title,
        description: editingSimulation.description,
        category: editingSimulation.category,
        simulation_url: editingSimulation.simulation_url,
        thumbnail_url: editingSimulation.thumbnail_url,
        grade: editingSimulation.grade,
        difficulty: editingSimulation.difficulty,
      })
      .eq('id', editingSimulation.id);
    
    if (error) {
      console.error('Error updating simulation:', error);
      toast.error('حدث خطأ في تحديث المحاكاة');
    } else {
      setSimulations(simulations.map(s => s.id === editingSimulation.id ? editingSimulation : s));
      setEditingSimulation(null);
      toast.success("تم تحديث المحاكاة بنجاح!");
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-12 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-center items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                ⚙️ <span className="text-primary">لوحة</span> التحكم
              </h1>
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  await signOut();
                  navigate('/auth');
                }}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              أضف وأدر المحتوى التعليمي للموقع
            </p>
            {user && (
              <p className="text-sm text-muted-foreground mt-2">
                مسجل كـ: {user.email}
              </p>
            )}
          </motion.div>

          <Tabs defaultValue="videos" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="videos" className="gap-2">
                <Video className="w-4 h-4" />
                الفيديوهات
              </TabsTrigger>
              <TabsTrigger value="simulations" className="gap-2">
                <Atom className="w-4 h-4" />
                المحاكاة
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos">
              <div className="grid gap-6">
                {/* Add New Video */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Plus className="w-5 h-5 text-video" />
                      إضافة فيديو جديد
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">عنوان الفيديو *</label>
                        <Input
                          placeholder="مثال: دورة الماء في الطبيعة"
                          value={newVideoTitle}
                          onChange={(e) => setNewVideoTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">التصنيف</label>
                        <Input
                          placeholder="مثال: الطبيعة"
                          value={newVideoCategory}
                          onChange={(e) => setNewVideoCategory(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">الصف الدراسي</label>
                        <Select value={newVideoGrade} onValueChange={setNewVideoGrade}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الصف" />
                          </SelectTrigger>
                          <SelectContent>
                            {grades.map((grade) => (
                              <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">المدة</label>
                        <Input
                          placeholder="مثال: 10:30"
                          value={newVideoDuration}
                          onChange={(e) => setNewVideoDuration(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">رابط الفيديو (YouTube أو رابط مباشر) *</label>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الوصف</label>
                      <Textarea
                        placeholder="وصف مختصر للفيديو..."
                        value={newVideoDescription}
                        onChange={(e) => setNewVideoDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الصورة المصغرة</label>
                      <ThumbnailUpload
                        value={newVideoThumbnail}
                        onChange={setNewVideoThumbnail}
                        folder="videos"
                      />
                    </div>
                    <Button 
                      variant="video" 
                      onClick={handleAddVideo} 
                      className="w-full"
                      disabled={addingVideo}
                    >
                      {addingVideo ? (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 ml-2" />
                      )}
                      إضافة الفيديو
                    </Button>
                  </CardContent>
                </Card>

                {/* Videos List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <FileText className="w-5 h-5" />
                      الفيديوهات المضافة ({videos.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {videos.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        لا توجد فيديوهات بعد. أضف أول فيديو!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {videos.map((video, index) => (
                          <motion.div
                            key={video.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-video/20 flex items-center justify-center">
                                <Play className="w-5 h-5 text-video" />
                              </div>
                              <div>
                                <h4 className="font-medium">{video.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{video.category}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setEditingVideo(video)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive"
                                onClick={() => handleDeleteVideo(video.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="simulations">
              <div className="grid gap-6">
                {/* Add New Simulation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Plus className="w-5 h-5 text-simulation" />
                      إضافة محاكاة جديدة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">عنوان المحاكاة *</label>
                        <Input 
                          placeholder="مثال: الطاقة الشمسية"
                          value={newSimTitle}
                          onChange={(e) => setNewSimTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">التصنيف</label>
                        <Input 
                          placeholder="مثال: الفيزياء"
                          value={newSimCategory}
                          onChange={(e) => setNewSimCategory(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">الصف الدراسي</label>
                        <Select value={newSimGrade} onValueChange={setNewSimGrade}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الصف" />
                          </SelectTrigger>
                          <SelectContent>
                            {grades.map((grade) => (
                              <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">مستوى الصعوبة</label>
                        <Select value={newSimDifficulty} onValueChange={setNewSimDifficulty}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الصعوبة" />
                          </SelectTrigger>
                          <SelectContent>
                            {difficulties.map((diff) => (
                              <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">رابط المحاكاة (اختياري)</label>
                      <Input 
                        placeholder="https://..."
                        value={newSimUrl}
                        onChange={(e) => setNewSimUrl(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الوصف</label>
                      <Textarea 
                        placeholder="وصف مختصر للمحاكاة..." 
                        rows={3}
                        value={newSimDescription}
                        onChange={(e) => setNewSimDescription(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الصورة المصغرة</label>
                      <ThumbnailUpload
                        value={newSimThumbnail}
                        onChange={setNewSimThumbnail}
                        folder="simulations"
                      />
                    </div>
                    <Button 
                      variant="simulation" 
                      className="w-full"
                      onClick={handleAddSimulation}
                      disabled={addingSimulation}
                    >
                      {addingSimulation ? (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 ml-2" />
                      )}
                      إضافة المحاكاة
                    </Button>
                  </CardContent>
                </Card>

                {/* Simulations List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Atom className="w-5 h-5" />
                      المحاكاة المضافة ({simulations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {simulations.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        لا توجد محاكاة بعد. أضف أول محاكاة!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {simulations.map((sim, index) => (
                          <motion.div
                            key={sim.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-simulation/20 flex items-center justify-center">
                                <Atom className="w-5 h-5 text-simulation" />
                              </div>
                              <div>
                                <h4 className="font-medium">{sim.title}</h4>
                                <span className="text-sm text-muted-foreground">
                                  {sim.category}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setEditingSimulation(sim)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive"
                                onClick={() => handleDeleteSimulation(sim.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      {/* Edit Video Dialog */}
      <Dialog open={!!editingVideo} onOpenChange={() => setEditingVideo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الفيديو</DialogTitle>
          </DialogHeader>
          {editingVideo && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان الفيديو</label>
                <Input
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">التصنيف</label>
                <Input
                  value={editingVideo.category}
                  onChange={(e) => setEditingVideo({...editingVideo, category: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">رابط الفيديو</label>
                <Input
                  value={editingVideo.video_url}
                  onChange={(e) => setEditingVideo({...editingVideo, video_url: e.target.value})}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">الصف الدراسي</label>
                  <Select 
                    value={editingVideo.grade || 'الصف الثالث'} 
                    onValueChange={(value) => setEditingVideo({...editingVideo, grade: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الصف" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">المدة</label>
                  <Input
                    value={editingVideo.duration || ''}
                    onChange={(e) => setEditingVideo({...editingVideo, duration: e.target.value})}
                    placeholder="مثال: 10:30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الوصف</label>
                <Textarea
                  value={editingVideo.description || ''}
                  onChange={(e) => setEditingVideo({...editingVideo, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الصورة المصغرة</label>
                <ThumbnailUpload
                  value={editingVideo.thumbnail_url}
                  onChange={(url) => setEditingVideo({...editingVideo, thumbnail_url: url})}
                  folder="videos"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingVideo(null)}>إلغاء</Button>
            <Button onClick={handleUpdateVideo}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Simulation Dialog */}
      <Dialog open={!!editingSimulation} onOpenChange={() => setEditingSimulation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المحاكاة</DialogTitle>
          </DialogHeader>
          {editingSimulation && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان المحاكاة</label>
                <Input
                  value={editingSimulation.title}
                  onChange={(e) => setEditingSimulation({...editingSimulation, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">التصنيف</label>
                <Input
                  value={editingSimulation.category}
                  onChange={(e) => setEditingSimulation({...editingSimulation, category: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">رابط المحاكاة</label>
                <Input
                  value={editingSimulation.simulation_url || ''}
                  onChange={(e) => setEditingSimulation({...editingSimulation, simulation_url: e.target.value})}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">الصف الدراسي</label>
                  <Select 
                    value={editingSimulation.grade || 'الصف الثالث'} 
                    onValueChange={(value) => setEditingSimulation({...editingSimulation, grade: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الصف" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">مستوى الصعوبة</label>
                  <Select 
                    value={editingSimulation.difficulty || 'سهل'} 
                    onValueChange={(value) => setEditingSimulation({...editingSimulation, difficulty: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الصعوبة" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الوصف</label>
                <Textarea
                  value={editingSimulation.description || ''}
                  onChange={(e) => setEditingSimulation({...editingSimulation, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الصورة المصغرة</label>
                <ThumbnailUpload
                  value={editingSimulation.thumbnail_url}
                  onChange={(url) => setEditingSimulation({...editingSimulation, thumbnail_url: url})}
                  folder="simulations"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSimulation(null)}>إلغاء</Button>
            <Button onClick={handleUpdateSimulation}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
