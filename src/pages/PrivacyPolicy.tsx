import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

const PrivacyPolicy = () => {
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
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">سياسة الخصوصية</h1>
            <p className="text-muted-foreground">آخر تحديث: فبراير 2024</p>
          </div>

          <div className="space-y-8">
            <section className="bg-card rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">حماية بياناتك</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                نحن في "علوم ممتعة" نولي أهمية قصوى لحماية خصوصية المستخدمين، خاصة الأطفال. 
                نلتزم بجمع الحد الأدنى من البيانات اللازمة لتقديم خدماتنا التعليمية.
              </p>
            </section>

            <section className="bg-card rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-video" />
                <h2 className="text-2xl font-bold">البيانات التي نجمعها</h2>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>اسم المستخدم ورقم الهاتف للتسجيل والتواصل</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>تقدم الطالب في المحتوى التعليمي</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>تفضيلات الاستخدام لتحسين التجربة</span>
                </li>
              </ul>
            </section>

            <section className="bg-card rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-simulation" />
                <h2 className="text-2xl font-bold">كيف نستخدم بياناتك</h2>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-simulation">•</span>
                  <span>تقديم المحتوى التعليمي المناسب</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-simulation">•</span>
                  <span>تتبع التقدم وتحسين تجربة التعلم</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-simulation">•</span>
                  <span>التواصل معك بخصوص حسابك</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-simulation">•</span>
                  <span>لن نشارك بياناتك مع أي طرف ثالث</span>
                </li>
              </ul>
            </section>

            <section className="bg-card rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">حقوقك</h2>
              <p className="text-muted-foreground leading-relaxed">
                يمكنك في أي وقت طلب الاطلاع على بياناتك أو تعديلها أو حذفها من خلال التواصل معنا.
                نحترم حقك في الخصوصية ونلتزم بالشفافية الكاملة.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
