import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, ExternalLink, Eye, X, Maximize2 } from "lucide-react";
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
  const [showViewer, setShowViewer] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = title;
    link.click();
  };

  const handleOpenNew = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(fileUrl, '_blank');
  };

  const toggleViewer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowViewer(!showViewer);
  };

  return (
    <motion.div
      whileHover={{ scale: showViewer ? 1 : 1.02, y: showViewer ? 0 : -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className="overflow-hidden border-2 hover:border-primary/50 transition-all h-full"
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
          
          {/* Action Buttons */}
          <div className="flex gap-2 mb-3">
            <Button
              variant={showViewer ? "secondary" : "default"}
              size="sm"
              className="flex-1 gap-2"
              onClick={toggleViewer}
            >
              {showViewer ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showViewer ? "إغلاق" : "عرض مباشر"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleOpenNew}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>

          {/* Inline PDF Viewer */}
          <AnimatePresence>
            {showViewer && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border rounded-lg overflow-hidden bg-muted">
                  <iframe
                    src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    className="w-full h-[400px]"
                    title={title}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FileCard;