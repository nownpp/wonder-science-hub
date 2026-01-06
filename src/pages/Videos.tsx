import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VideoType {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  duration: string | null;
  grade: string | null;
}

const VideosPage = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedGrade, setSelectedGrade] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('id, title, description, video_url, thumbnail_url, category, duration, grade')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching videos:', error);
      } else {
        setVideos(data || []);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(videos.map(v => v.category));
    return ["الكل", ...Array.from(cats)];
  }, [videos]);

  const grades = useMemo(() => {
    const grds = new Set(videos.filter(v => v.grade).map(v => v.grade!));
    return ["الكل", ...Array.from(grds)];
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      const matchesCategory = selectedCategory === "الكل" || v.category === selectedCategory;
      const matchesGrade = selectedGrade === "الكل" || v.grade === selectedGrade;
      const matchesSearch = searchQuery === "" || 
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesGrade && matchesSearch;
    });
  }, [videos, selectedCategory, selectedGrade, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory("الكل");
    setSelectedGrade("الكل");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategory !== "الكل" || selectedGrade !== "الكل" || searchQuery !== "";

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  if (loading) {
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
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎬 <span className="text-video">الفيديوهات</span> التعليمية
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              شاهد فيديوهات تعليمية ممتعة عن العلوم واكتشف عالم المعرفة!
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="bg-card rounded-2xl p-4 md:p-6 mb-8 shadow-sm border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن فيديو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Grade Filter */}
              {grades.length > 1 && (
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="الصف الدراسي" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" size="icon" onClick={clearFilters} className="shrink-0">
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-muted-foreground">
              عدد النتائج: {filteredVideos.length} فيديو
            </div>
          </motion.div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </motion.div>
          )}

          {/* Videos Grid */}
          {filteredVideos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                لا توجد فيديوهات متاحة حالياً
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <VideoCard 
                    id={video.id}
                    title={video.title}
                    description={video.description || ''}
                    thumbnail={video.thumbnail_url || 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=400&h=300&fit=crop'}
                    duration={video.duration || ''}
                    category={video.category}
                    onClick={() => setSelectedVideo(video)} 
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Video Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-xl overflow-hidden">
            {selectedVideo?.video_url ? (
              <iframe
                src={getYouTubeEmbedUrl(selectedVideo.video_url)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground text-center p-8">
                  📺 لا يوجد رابط فيديو
                </p>
              </div>
            )}
          </div>
          <p className="text-muted-foreground">{selectedVideo?.description}</p>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default VideosPage;
