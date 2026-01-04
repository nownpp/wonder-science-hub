import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface SimulationCardProps {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const SimulationCard = ({ title, description, icon, color, onClick }: SimulationCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card variant="simulation" className="overflow-hidden cursor-pointer group h-full" onClick={onClick}>
        <CardContent className="p-6">
          <motion.div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${color}`}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.div>
          
          <h3 className="font-bold text-xl mb-2 group-hover:text-simulation transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">{description}</p>
          
          <Button variant="simulation" size="sm" className="w-full gap-2">
            <Zap className="w-4 h-4" />
            ابدأ التجربة
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SimulationCard;
