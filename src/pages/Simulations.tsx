import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Sun, Cloud, ArrowDown, RotateCcw, Play, Pause } from "lucide-react";

const WaterCycleSimulation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    { title: "التبخر", description: "تسخن الشمس الماء فيتحول إلى بخار ماء ويصعد للأعلى", icon: Sun, color: "text-accent" },
    { title: "التكثف", description: "يبرد بخار الماء في الجو العلوي ويتحول إلى قطرات ماء صغيرة تشكل السحب", icon: Cloud, color: "text-video" },
    { title: "الهطول", description: "تسقط قطرات الماء من السحب على شكل مطر أو ثلج", icon: Droplets, color: "text-secondary" },
    { title: "الجريان", description: "يجري الماء على سطح الأرض ليصل إلى الأنهار والبحار", icon: ArrowDown, color: "text-science" },
  ];

  const handlePlay = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  return (
    <Card variant="simulation" className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-6 h-6 text-video" />
          دورة الماء في الطبيعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Animation Area */}
        <div className="relative h-64 bg-gradient-to-b from-video/20 to-science/20 rounded-2xl mb-6 overflow-hidden">
          {/* Sun */}
          <motion.div
            className="absolute top-4 right-4"
            animate={{ scale: step === 0 ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 1, repeat: step === 0 && isPlaying ? Infinity : 0 }}
          >
            <Sun className={`w-12 h-12 ${step === 0 ? "text-accent" : "text-accent/50"}`} />
          </motion.div>

          {/* Cloud */}
          <motion.div
            className="absolute top-8 left-1/2 transform -translate-x-1/2"
            animate={{ 
              y: step >= 1 ? 0 : -50,
              opacity: step >= 1 ? 1 : 0,
              scale: step === 1 ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.8 }}
          >
            <Cloud className={`w-16 h-16 ${step === 1 ? "text-video" : "text-video/70"}`} />
          </motion.div>

          {/* Rain drops */}
          {step >= 2 && (
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [0, 100], opacity: [1, 0] }}
                  transition={{ duration: 1.5, delay: i * 0.3, repeat: isPlaying && step === 2 ? Infinity : 0 }}
                >
                  <Droplets className="w-4 h-4 text-secondary" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Water */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-video/40 rounded-t-full"
            animate={{ height: step >= 3 ? "60px" : "40px" }}
            transition={{ duration: 0.8 }}
          />

          {/* Evaporation arrows */}
          {step === 0 && isPlaying && (
            <div className="absolute bottom-16 left-1/3 flex gap-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [-50, -100], opacity: [1, 0] }}
                  transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                  className="text-accent text-xs"
                >
                  ↑
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Current Step */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-muted/50 rounded-xl p-4 mb-4"
        >
          <div className="flex items-center gap-3 mb-2">
            {(() => {
              const StepIcon = steps[step].icon;
              return <StepIcon className={`w-6 h-6 ${steps[step].color}`} />;
            })()}
            <h4 className="font-bold text-lg">{steps[step].title}</h4>
          </div>
          <p className="text-muted-foreground text-sm">{steps[step].description}</p>
        </motion.div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button
            variant="simulation"
            onClick={handlePlay}
            disabled={isPlaying}
            className="flex-1"
          >
            <Play className="w-4 h-4 ml-2" />
            تشغيل
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Steps indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === step ? "bg-simulation" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const SimulationsPage = () => {
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
              🔬 <span className="text-simulation">المحاكاة</span> التفاعلية
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              جرب التجارب العلمية بنفسك واكتشف كيف تعمل الأشياء!
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <WaterCycleSimulation />
            </motion.div>
          </div>

          {/* Coming Soon */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-muted-foreground">
              🚀 المزيد من المحاكاة قادمة قريباً!
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SimulationsPage;
