import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Video, 
  Atom, 
  Plus, 
  Trash2, 
  Edit2,
  Play,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration
const mockVideos = [
  { id: 1, title: "دورة الماء في الطبيعة", category: "الطبيعة", status: "منشور" },
  { id: 2, title: "الكواكب والنجوم", category: "الفضاء", status: "مسودة" },
];

const mockSimulations = [
  { id: 1, title: "دورة الماء", status: "منشور" },
  { id: 2, title: "الطاقة الشمسية", status: "قيد التطوير" },
];

const DashboardPage = () => {
  const [videos, setVideos] = useState(mockVideos);
  const [simulations, setSimulations] = useState(mockSimulations);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoDescription, setNewVideoDescription] = useState("");
  const [newVideoCategory, setNewVideoCategory] = useState("");

  const handleAddVideo = () => {
    if (!newVideoTitle.trim()) {
      toast.error("الرجاء إدخال عنوان الفيديو");
      return;
    }
    
    const newVideo = {
      id: videos.length + 1,
      title: newVideoTitle,
      category: newVideoCategory || "عام",
      status: "مسودة",
    };
    
    setVideos([...videos, newVideo]);
    setNewVideoTitle("");
    setNewVideoDescription("");
    setNewVideoCategory("");
    toast.success("تمت إضافة الفيديو بنجاح!");
  };

  const handleDeleteVideo = (id: number) => {
    setVideos(videos.filter(v => v.id !== id));
    toast.success("تم حذف الفيديو");
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ⚙️ <span className="text-primary">لوحة</span> التحكم
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              أضف وأدر المحتوى التعليمي للموقع
            </p>
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
                        <label className="block text-sm font-medium mb-2">عنوان الفيديو</label>
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
                    <div>
                      <label className="block text-sm font-medium mb-2">الوصف</label>
                      <Textarea
                        placeholder="وصف مختصر للفيديو..."
                        value={newVideoDescription}
                        onChange={(e) => setNewVideoDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1 gap-2 h-24 border-dashed">
                        <Upload className="w-6 h-6" />
                        رفع الفيديو
                      </Button>
                      <Button variant="outline" className="flex-1 gap-2 h-24 border-dashed">
                        <ImageIcon className="w-6 h-6" />
                        رفع الصورة المصغرة
                      </Button>
                    </div>
                    <Button variant="video" onClick={handleAddVideo} className="w-full">
                      <Plus className="w-4 h-4 ml-2" />
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
                                <span>•</span>
                                <span className={video.status === "منشور" ? "text-science" : "text-accent"}>
                                  {video.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
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
                    <div>
                      <label className="block text-sm font-medium mb-2">عنوان المحاكاة</label>
                      <Input placeholder="مثال: الطاقة الشمسية" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الوصف</label>
                      <Textarea placeholder="وصف مختصر للمحاكاة..." rows={3} />
                    </div>
                    <Button variant="simulation" className="w-full">
                      <Plus className="w-4 h-4 ml-2" />
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
                              <span className={`text-sm ${sim.status === "منشور" ? "text-science" : "text-accent"}`}>
                                {sim.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
