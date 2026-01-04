import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Atom, BookOpen, Beaker } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    id: 1,
    title: "الفيديوهات التعليمية",
    description: "شاهد دروس العلوم بطريقة ممتعة",
    icon: Play,
    color: "video",
    link: "/videos",
  },
  {
    id: 2,
    title: "المحاكاة التفاعلية",
    description: "جرب التجارب العلمية بنفسك",
    icon: Atom,
    color: "simulation",
    link: "/simulations",
  },
  {
    id: 3,
    title: "الدروس المكتوبة",
    description: "اقرأ وتعلم العلوم",
    icon: BookOpen,
    color: "science",
    link: "/lessons",
  },
  {
    id: 4,
    title: "التجارب المنزلية",
    description: "تجارب سهلة يمكنك تجربتها في البيت",
    icon: Beaker,
    color: "accent",
    link: "/experiments",
  },
];

const colorClasses = {
  video: "bg-video text-video-foreground",
  simulation: "bg-simulation text-simulation-foreground",
  science: "bg-science text-science-foreground",
  accent: "bg-accent text-accent-foreground",
};

const CategoryCards = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          اختر <span className="text-primary">قسمك</span> المفضل!
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={category.link}>
                <Card
                  variant="fun"
                  className="h-full cursor-pointer group hover:border-primary/50"
                >
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center ${colorClasses[category.color as keyof typeof colorClasses]}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <category.icon className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
