import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.png";
import scientistKid from "@/assets/scientist-kid.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] overflow-hidden gradient-hero">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-accent/30 rounded-full animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-highlight/20 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-right"
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-primary">مغامرة</span> العلوم
              <br />
              <span className="text-secondary">للأطفال!</span>
            </motion.h1>
            
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md mx-auto lg:mr-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              اكتشف عالم العلوم الممتع من خلال فيديوهات شيقة ومحاكاة تفاعلية!
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/videos">
                <Button variant="fun" size="lg" className="w-full sm:w-auto">
                  🎬 شاهد الفيديوهات
                </Button>
              </Link>
              <Link to="/simulations">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  🔬 جرب المحاكاة
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              <img
                src={heroBanner}
                alt="عالم العلوم الممتع"
                className="w-full max-w-lg mx-auto rounded-3xl card-shadow"
              />
              <motion.img
                src={scientistKid}
                alt="عالم صغير"
                className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border-4 border-card card-shadow bg-card"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
