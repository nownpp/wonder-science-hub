import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Target, Heart, Sparkles, BookOpen, Atom } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">من نحن</h1>
            <p className="text-xl text-muted-foreground">نصنع المستقبل بالعلم والمتعة 🚀</p>
          </div>

          <div className="space-y-8">
            <section className="bg-card rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">رؤيتنا</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                نؤمن بأن كل طفل يستحق تعليماً ممتعاً وتفاعلياً. نسعى لجعل العلوم 
                مادة محببة للأطفال من خلال الفيديوهات التعليمية والمحاكاة التفاعلية 
                التي تجعل التعلم مغامرة شيقة.
              </p>
            </section>

            <section className="bg-card rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-simulation" />
                <h2 className="text-2xl font-bold">مهمتنا</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                تقديم محتوى علمي عربي عالي الجودة يناسب الأطفال، ويساعدهم على 
                فهم العالم من حولهم بطريقة ممتعة وتفاعلية. نهدف لإلهام جيل جديد 
                من العلماء والمبتكرين.
              </p>
            </section>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div 
                className="bg-card rounded-2xl p-6 shadow-lg text-center"
                whileHover={{ scale: 1.02 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-video/10 mb-4">
                  <BookOpen className="w-6 h-6 text-video" />
                </div>
                <h3 className="text-xl font-bold mb-2">فيديوهات تعليمية</h3>
                <p className="text-muted-foreground">
                  محتوى مرئي جذاب يشرح المفاهيم العلمية بطريقة مبسطة
                </p>
              </motion.div>

              <motion.div 
                className="bg-card rounded-2xl p-6 shadow-lg text-center"
                whileHover={{ scale: 1.02 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-simulation/10 mb-4">
                  <Atom className="w-6 h-6 text-simulation" />
                </div>
                <h3 className="text-xl font-bold mb-2">محاكاة تفاعلية</h3>
                <p className="text-muted-foreground">
                  تجارب افتراضية تتيح للأطفال استكشاف العلوم بأنفسهم
                </p>
              </motion.div>

              <motion.div 
                className="bg-card rounded-2xl p-6 shadow-lg text-center"
                whileHover={{ scale: 1.02 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">تعلم ممتع</h3>
                <p className="text-muted-foreground">
                  بيئة تعليمية آمنة ومشجعة تحفز حب الاستطلاع
                </p>
              </motion.div>
            </div>

            <section className="bg-gradient-to-r from-primary/10 to-simulation/10 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">انضم إلينا في رحلة الاستكشاف! 🌟</h2>
              <p className="text-muted-foreground text-lg">
                سواء كنت طالباً يريد التعلم أو معلماً يريد إثراء محتواه،
                نحن هنا لنجعل العلوم أكثر متعة وإلهاماً.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
