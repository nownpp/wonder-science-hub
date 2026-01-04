import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

const allVideos = [
  {
    id: 1,
    title: "دورة الماء في الطبيعة",
    description: "تعلم كيف يتحرك الماء في الطبيعة من البحر إلى السحب والمطر",
    thumbnail: "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=400&h=300&fit=crop",
    duration: "5:30",
    category: "الطبيعة",
  },
  {
    id: 2,
    title: "الكواكب والنجوم",
    description: "رحلة ممتعة في الفضاء لاكتشاف الكواكب والنجوم",
    thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop",
    duration: "7:15",
    category: "الفضاء",
  },
  {
    id: 3,
    title: "جسم الإنسان",
    description: "اكتشف أسرار جسم الإنسان وكيف يعمل",
    thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop",
    duration: "6:45",
    category: "الأحياء",
  },
  {
    id: 4,
    title: "النباتات وكيف تنمو",
    description: "شاهد كيف تنمو النباتات من البذور إلى الأشجار",
    thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    duration: "4:20",
    category: "الطبيعة",
  },
  {
    id: 5,
    title: "البراكين والزلازل",
    description: "تعرف على كيفية حدوث البراكين والزلازل",
    thumbnail: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400&h=300&fit=crop",
    duration: "8:10",
    category: "الجيولوجيا",
  },
  {
    id: 6,
    title: "الحيوانات البرية",
    description: "رحلة إلى عالم الحيوانات البرية المذهلة",
    thumbnail: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=300&fit=crop",
    duration: "9:00",
    category: "الأحياء",
  },
];

const categories = ["الكل", "الطبيعة", "الفضاء", "الأحياء", "الجيولوجيا"];

const VideosPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedVideo, setSelectedVideo] = useState<typeof allVideos[0] | null>(null);

  const filteredVideos = selectedCategory === "الكل" 
    ? allVideos 
    : allVideos.filter(v => v.category === selectedCategory);

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
              🎬 <span className="text-video">الفيديوهات</span> التعليمية
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              شاهد فيديوهات تعليمية ممتعة عن العلوم واكتشف عالم المعرفة!
            </p>
          </motion.div>

          {/* Category Filter */}
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

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VideoCard {...video} onClick={() => setSelectedVideo(video)} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Video Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
            <p className="text-muted-foreground text-center p-8">
              📺 هنا سيتم عرض الفيديو<br />
              <span className="text-sm">(سيتم ربط الفيديوهات لاحقاً)</span>
            </p>
          </div>
          <p className="text-muted-foreground">{selectedVideo?.description}</p>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default VideosPage;
