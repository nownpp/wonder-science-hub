import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Atom, Loader2, ExternalLink, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SimulationType {
  id: string;
  title: string;
  description: string | null;
  simulation_url: string | null;
  thumbnail_url: string | null;
  category: string;
  difficulty: string | null;
  grade: string | null;
  html_code: string | null;
}

const SimulationsPage = () => {
  const [simulations, setSimulations] = useState<SimulationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedDifficulty, setSelectedDifficulty] = useState("الكل");
  const [selectedGrade, setSelectedGrade] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationType | null>(null);

  useEffect(() => {
    const fetchSimulations = async () => {
      const { data, error } = await supabase
        .from('simulations')
        .select('id, title, description, simulation_url, thumbnail_url, category, difficulty, grade, html_code')
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

  const difficulties = useMemo(() => {
    const diffs = new Set(simulations.filter(s => s.difficulty).map(s => s.difficulty!));
    return ["الكل", ...Array.from(diffs)];
  }, [simulations]);

  const grades = useMemo(() => {
    const grds = new Set(simulations.filter(s => s.grade).map(s => s.grade!));
    return ["الكل", ...Array.from(grds)];
  }, [simulations]);

  const filteredSimulations = useMemo(() => {
    return simulations.filter(s => {
      const matchesCategory = selectedCategory === "الكل" || s.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "الكل" || s.difficulty === selectedDifficulty;
      const matchesGrade = selectedGrade === "الكل" || s.grade === selectedGrade;
      const matchesSearch = searchQuery === "" || 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesDifficulty && matchesGrade && matchesSearch;
    });
  }, [simulations, selectedCategory, selectedDifficulty, selectedGrade, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory("الكل");
    setSelectedDifficulty("الكل");
    setSelectedGrade("الكل");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategory !== "الكل" || selectedDifficulty !== "الكل" || selectedGrade !== "الكل" || searchQuery !== "";

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
            className="text-center mb-8"
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

          {/* Search and Filters */}
          <motion.div
            className="bg-card rounded-2xl p-4 md:p-6 mb-8 shadow-sm border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن محاكاة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Difficulty Filter */}
              {difficulties.length > 1 && (
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-full md:w-36">
                    <SelectValue placeholder="الصعوبة" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Grade Filter */}
              {grades.length > 1 && (
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="الصف" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" size="icon" onClick={clearFilters} className="shrink-0">
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-muted-foreground">
              عدد النتائج: {filteredSimulations.length} محاكاة
            </div>
          </motion.div>

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
            {selectedSimulation?.html_code ? (
              <iframe
                srcDoc={selectedSimulation.html_code}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin allow-forms"
                title={selectedSimulation.title}
              />
            ) : selectedSimulation?.simulation_url ? (
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
          {(selectedSimulation?.simulation_url || selectedSimulation?.html_code) && (
            <Button 
              variant="outline" 
              className="w-fit"
              onClick={() => {
                if (selectedSimulation.html_code) {
                  // Open HTML code in a new window
                  const newWindow = window.open('', '_blank');
                  if (newWindow) {
                    newWindow.document.write(selectedSimulation.html_code);
                    newWindow.document.close();
                  }
                } else if (selectedSimulation.simulation_url) {
                  window.open(selectedSimulation.simulation_url, '_blank');
                }
              }}
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
