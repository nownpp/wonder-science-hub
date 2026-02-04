import { motion } from "framer-motion";
import { Heart, Star, Shield, Info } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border py-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-5 h-5 text-accent fill-accent" />
            <span className="text-xl font-bold text-primary">علوم ممتعة</span>
            <Star className="w-5 h-5 text-accent fill-accent" />
          </div>
          
          <p className="text-muted-foreground mb-4">
            موقع تعليمي ممتع لتعليم العلوم للأطفال
          </p>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <Link 
              to="/about-us" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>من نحن</span>
            </Link>
            <Link 
              to="/privacy-policy" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>سياسة الخصوصية</span>
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <span>صُنع بـ</span>
            <Heart className="w-4 h-4 text-simulation fill-simulation animate-pulse" />
            <span>للأطفال الصغار</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
