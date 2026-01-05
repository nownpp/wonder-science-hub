import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Atom, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SimulationType {
  id: string;
  title: string;
  description: string | null;
  simulation_url: string | null;
  thumbnail_url: string | null;
  category: string;
  difficulty: string | null;
}

const SimulationsPage = () => {
  const [simulations, setSimulations] = useState<SimulationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationType | null>(null);

  useEffect(() => {
    const fetchSimulations = async () => {
      const { data, error } = await supabase
        .from('simulations')
        .select('id, title, description, simulation_url, thumbnail_url, category, difficulty')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching simulations:', error);
      } else {
        setSimulations(data || []);
      }
      setLoading(false);
    };

    fetchSimulations();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(simulations.map(s => s.category));
    return ["الكل", ...Array.from(cats)];
  }, [simulations]);

  const filteredSimulations = selectedCategory === "الكل" 
    ? simulations 
    : simulations.filter(s => s.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

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

          {/* Category Filter */}
          {categories.length > 1 && (
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
          )}

          {/* Simulations Grid */}
          {filteredSimulations.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                لا توجد محاكاة متاحة حالياً
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSimulations.map((sim, index) => (
                <motion.div
                  key={sim.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    variant="simulation" 
                    className="cursor-pointer hover:shadow-lg transition-shadow h-full"
                    onClick={() => setSelectedSimulation(sim)}
                  >
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      {sim.thumbnail_url ? (
                        <img 
                          src={sim.thumbnail_url} 
                          alt={sim.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-simulation/20 flex items-center justify-center">
                          <Atom className="w-16 h-16 text-simulation/50" />
                        </div>
                      )}
                      {sim.difficulty && (
                        <span className="absolute top-2 right-2 bg-simulation text-simulation-foreground text-xs px-2 py-1 rounded-full">
                          {sim.difficulty}
                        </span>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Atom className="w-5 h-5 text-simulation" />
                        {sim.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {sim.description || 'اكتشف هذه المحاكاة التفاعلية'}
                      </p>
                      <span className="inline-block mt-2 text-xs bg-muted px-2 py-1 rounded">
                        {sim.category}
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Simulation Dialog */}
      <Dialog open={!!selectedSimulation} onOpenChange={() => setSelectedSimulation(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Atom className="w-6 h-6 text-simulation" />
              {selectedSimulation?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-xl overflow-hidden">
            {selectedSimulation?.simulation_url ? (
              <iframe
                src={selectedSimulation.simulation_url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center flex-col gap-4">
                <Atom className="w-16 h-16 text-simulation/50" />
                <p className="text-muted-foreground text-center">
                  🔬 المحاكاة قيد التطوير
                </p>
              </div>
            )}
          </div>
          <p className="text-muted-foreground">{selectedSimulation?.description}</p>
          {selectedSimulation?.simulation_url && (
            <Button 
              variant="outline" 
              className="w-fit"
              onClick={() => window.open(selectedSimulation.simulation_url!, '_blank')}
            >
              <ExternalLink className="w-4 h-4 ml-2" />
              فتح في نافذة جديدة
            </Button>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default SimulationsPage;
