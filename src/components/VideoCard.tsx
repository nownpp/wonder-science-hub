import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface VideoCardProps {
  id: string | number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category?: string;
  onClick?: () => void;
}

const VideoCard = ({ title, description, thumbnail, duration, onClick }: VideoCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card variant="fun" className="overflow-hidden cursor-pointer group" onClick={onClick}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center"
            >
              <Play className="w-8 h-8 text-primary-foreground fill-current" />
            </motion.div>
          </div>
          <span className="absolute bottom-2 left-2 bg-foreground/80 text-background px-2 py-1 rounded-lg text-sm font-bold">
            {duration}
          </span>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VideoCard;
