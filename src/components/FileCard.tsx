 import { motion } from "framer-motion";
 import { FileText, Download, ExternalLink } from "lucide-react";
 import { Card, CardContent, CardHeader } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 
 interface FileCardProps {
   id: string;
   title: string;
   description?: string;
   thumbnail?: string;
   category: string;
   grade?: string;
   fileUrl: string;
   onClick?: () => void;
 }
 
 const FileCard = ({
   title,
   description,
   thumbnail,
   category,
   grade,
   fileUrl,
   onClick,
 }: FileCardProps) => {
   const handleDownload = (e: React.MouseEvent) => {
     e.stopPropagation();
     window.open(fileUrl, '_blank');
   };
 
   return (
     <motion.div
       whileHover={{ scale: 1.02, y: -5 }}
       transition={{ type: "spring", stiffness: 300 }}
     >
       <Card
         className="overflow-hidden cursor-pointer border-2 hover:border-primary/50 transition-all h-full"
         onClick={onClick}
       >
         <CardHeader className="p-0">
           <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
             {thumbnail ? (
               <img
                 src={thumbnail}
                 alt={title}
                 className="w-full h-full object-cover"
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center">
                 <FileText className="w-16 h-16 text-primary/50" />
               </div>
             )}
             <Badge className="absolute top-2 right-2 bg-primary">
               {category}
             </Badge>
             {grade && (
               <Badge variant="secondary" className="absolute top-2 left-2">
                 {grade}
               </Badge>
             )}
           </div>
         </CardHeader>
         <CardContent className="p-4">
           <h3 className="font-bold text-lg mb-2 line-clamp-1">{title}</h3>
           {description && (
             <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
               {description}
             </p>
           )}
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1 gap-2"
                onClick={handleDownload}
              >
                <ExternalLink className="w-4 h-4" />
                عرض
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement('a');
                  link.href = fileUrl;
                  link.download = title;
                  link.click();
                }}
              >
                <Download className="w-4 h-4" />
                تحميل
              </Button>
            </div>
         </CardContent>
       </Card>
     </motion.div>
   );
 };
 
 export default FileCard;