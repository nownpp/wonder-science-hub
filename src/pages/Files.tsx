 import Navbar from "@/components/Navbar";
 import Footer from "@/components/Footer";
 import FileCard from "@/components/FileCard";
 import { motion } from "framer-motion";
 import { useState, useEffect, useMemo } from "react";
 import { Button } from "@/components/ui/button";
 import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
 import { Input } from "@/components/ui/input";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Loader2, Search, X, FileText, Download, ExternalLink } from "lucide-react";
 import { supabase } from "@/integrations/supabase/client";
 
 interface FileType {
   id: string;
   title: string;
   description: string | null;
   file_url: string;
   thumbnail_url: string | null;
   category: string;
   grade: string | null;
 }
 
 const FilesPage = () => {
   const [files, setFiles] = useState<FileType[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedCategory, setSelectedCategory] = useState("الكل");
   const [selectedGrade, setSelectedGrade] = useState("الكل");
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
 
   useEffect(() => {
     const fetchFiles = async () => {
       const { data, error } = await supabase
         .from('files')
         .select('id, title, description, file_url, thumbnail_url, category, grade')
         .order('created_at', { ascending: false });
       
       if (error) {
         console.error('Error fetching files:', error);
       } else {
         setFiles(data || []);
       }
       setLoading(false);
     };
 
     fetchFiles();
   }, []);
 
   const categories = useMemo(() => {
     const cats = new Set(files.map(f => f.category));
     return ["الكل", ...Array.from(cats)];
   }, [files]);
 
   const grades = useMemo(() => {
     const grds = new Set(files.filter(f => f.grade).map(f => f.grade!));
     return ["الكل", ...Array.from(grds)];
   }, [files]);
 
   const filteredFiles = useMemo(() => {
     return files.filter(f => {
       const matchesCategory = selectedCategory === "الكل" || f.category === selectedCategory;
       const matchesGrade = selectedGrade === "الكل" || f.grade === selectedGrade;
       const matchesSearch = searchQuery === "" || 
         f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));
       return matchesCategory && matchesGrade && matchesSearch;
     });
   }, [files, selectedCategory, selectedGrade, searchQuery]);
 
   const clearFilters = () => {
     setSelectedCategory("الكل");
     setSelectedGrade("الكل");
     setSearchQuery("");
   };
 
   const hasActiveFilters = selectedCategory !== "الكل" || selectedGrade !== "الكل" || searchQuery !== "";
 
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
               📄 <span className="text-primary">الملفات</span> التعليمية
             </h1>
             <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
               حمّل ملفات PDF تعليمية ومذكرات دراسية لمساعدتك في رحلة التعلم!
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
                   placeholder="ابحث عن ملف..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pr-10 text-right"
                 />
               </div>
 
               {/* Category Filter */}
               <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                 <SelectTrigger className="w-full md:w-48">
                   <SelectValue placeholder="التصنيف" />
                 </SelectTrigger>
                 <SelectContent>
                   {categories.map((cat) => (
                     <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
 
               {/* Grade Filter */}
               {grades.length > 1 && (
                 <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                   <SelectTrigger className="w-full md:w-48">
                     <SelectValue placeholder="الصف الدراسي" />
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
               عدد النتائج: {filteredFiles.length} ملف
             </div>
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
 
           {/* Files Grid */}
           {filteredFiles.length === 0 ? (
             <div className="text-center py-16">
               <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
               <p className="text-muted-foreground text-lg">
                 لا توجد ملفات متاحة حالياً
               </p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredFiles.map((file, index) => (
                 <motion.div
                   key={file.id}
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.1 }}
                 >
                   <FileCard 
                     id={file.id}
                     title={file.title}
                     description={file.description || ''}
                     thumbnail={file.thumbnail_url || undefined}
                     category={file.category}
                     grade={file.grade || undefined}
                     fileUrl={file.file_url}
                     onClick={() => setSelectedFile(file)} 
                   />
                 </motion.div>
               ))}
             </div>
           )}
         </div>
       </main>
 
       {/* File Preview Dialog */}
       <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
         <DialogContent className="max-w-2xl">
           <DialogHeader>
             <DialogTitle className="text-2xl">{selectedFile?.title}</DialogTitle>
           </DialogHeader>
           <div className="space-y-4">
             <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
               <FileText className="w-24 h-24 text-primary/50" />
             </div>
             {selectedFile?.description && (
               <p className="text-muted-foreground">{selectedFile.description}</p>
             )}
             <div className="flex gap-3">
               <Button
                 className="flex-1 gap-2"
                 onClick={() => window.open(selectedFile?.file_url, '_blank')}
               >
                 <Download className="w-4 h-4" />
                 تحميل الملف
               </Button>
               <Button
                 variant="outline"
                 className="gap-2"
                 onClick={() => window.open(selectedFile?.file_url, '_blank')}
               >
                 <ExternalLink className="w-4 h-4" />
                 فتح
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
 
       <Footer />
     </div>
   );
 };
 
 export default FilesPage;