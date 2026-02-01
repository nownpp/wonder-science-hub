import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCards from "@/components/CategoryCards";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import VideoCard from "@/components/VideoCard";
import SimulationCard from "@/components/SimulationCard";
import { Droplets, Sun, Zap, TreePine } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
const featuredVideos = [
  {
    id: 1,
    title: "دورة الماء في الطبيعة",
    description: "تعلم كيف يتحرك الماء في الطبيعة من البحر إلى السحب والمطر",
    thumbnail: "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=400&h=300&fit=crop",
    duration: "5:30",
  },
  {
    id: 2,
    title: "الكواكب والنجوم",
    description: "رحلة ممتعة في الفضاء لاكتشاف الكواكب والنجوم",
    thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop",
    duration: "7:15",
  },
  {
    id: 3,
    title: "جسم الإنسان",
    description: "اكتشف أسرار جسم الإنسان وكيف يعمل",
    thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop",
    duration: "6:45",
  },
];

const featuredSimulations = [
  {
    id: 1,
    title: "دورة الماء",
    description: "شاهد كيف يتبخر الماء ويتحول لسحب ثم مطر",
    icon: <Droplets className="w-8 h-8" />,
    color: "bg-video text-video-foreground",
  },
  {
    id: 2,
    title: "الطاقة الشمسية",
    description: "تعلم كيف تتحول أشعة الشمس إلى طاقة",
    icon: <Sun className="w-8 h-8" />,
    color: "bg-accent text-accent-foreground",
  },
  {
    id: 3,
    title: "الكهرباء",
    description: "اكتشف كيف تسري الكهرباء في الأسلاك",
    icon: <Zap className="w-8 h-8" />,
    color: "bg-primary text-primary-foreground",
  },
];

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleVideoClick = () => {
    if (!user) {
      navigate('/student-auth');
    } else {
      navigate('/videos');
    }
  };

  const handleSimulationClick = () => {
    if (!user) {
      navigate('/student-auth');
    } else {
      navigate('/simulations');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <CategoryCards />
        
        {/* Featured Videos Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              أحدث <span className="text-video">الفيديوهات</span>
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <VideoCard {...video} onClick={handleVideoClick} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Simulations Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-simulation">محاكاة</span> تفاعلية
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSimulations.map((simulation, index) => (
                <motion.div
                  key={simulation.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SimulationCard {...simulation} onClick={handleSimulationClick} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fun Facts Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-science/10 text-science px-4 py-2 rounded-full mb-6">
                <TreePine className="w-5 h-5" />
                <span className="font-bold">هل تعلم؟</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                الشجرة الواحدة تنتج أكسجين يكفي لشخصين!
              </h3>
              <p className="text-muted-foreground">
                الأشجار تمتص ثاني أكسيد الكربون وتنتج الأكسجين الذي نتنفسه.
                لذلك من المهم أن نحافظ على الأشجار والغابات! 🌳
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
