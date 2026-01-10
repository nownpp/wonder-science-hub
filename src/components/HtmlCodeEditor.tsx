import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Eye, Copy, Check, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";

interface HtmlCodeEditorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}

const HtmlCodeEditor = ({ value, onChange, label = "كود HTML للمحاكاة" }: HtmlCodeEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localCode, setLocalCode] = useState(value || "");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("code");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleOpen = () => {
    setLocalCode(value || "");
    setIsOpen(true);
  };

  const handleSave = () => {
    onChange(localCode.trim() || null);
    setIsOpen(false);
    toast.success("تم حفظ الكود بنجاح!");
  };

  const handleCopy = async () => {
    if (localCode) {
      await navigator.clipboard.writeText(localCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("تم نسخ الكود!");
    }
  };

  const generatePreviewHtml = () => {
    // Create a safe preview using srcdoc
    return localCode;
  };

  const hasCode = value && value.trim().length > 0;

  return (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium">{label}</label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={hasCode ? "default" : "outline"}
            onClick={handleOpen}
            className="flex-1 gap-2"
          >
            <Code className="w-4 h-4" />
            {hasCode ? "تعديل الكود" : "إضافة كود HTML"}
          </Button>
          {hasCode && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onChange(null)}
              className="text-destructive"
              title="حذف الكود"
            >
              ×
            </Button>
          )}
        </div>
        {hasCode && (
          <p className="text-xs text-muted-foreground">
            ✓ تم إضافة كود HTML ({value.length} حرف)
          </p>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`${isFullscreen ? 'max-w-[95vw] h-[95vh]' : 'max-w-4xl max-h-[85vh]'} flex flex-col`}>
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-simulation" />
                محرر كود HTML للمحاكاة
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? "تصغير" : "ملء الشاشة"}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
              <TabsTrigger value="code" className="gap-2">
                <Code className="w-4 h-4" />
                الكود
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="w-4 h-4" />
                معاينة
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="flex-1 overflow-hidden mt-4">
              <div className="h-full flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    أدخل كود HTML الكامل للمحاكاة
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!localCode}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        تم النسخ
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        نسخ
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  value={localCode}
                  onChange={(e) => setLocalCode(e.target.value)}
                  placeholder={`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>عنوان المحاكاة</title>
  <style>
    /* أضف الأنماط هنا */
  </style>
</head>
<body>
  <!-- أضف محتوى المحاكاة هنا -->
  <script>
    // أضف الكود التفاعلي هنا
  </script>
</body>
</html>`}
                  className="flex-1 font-mono text-sm leading-relaxed resize-none min-h-[300px]"
                  style={{ direction: 'ltr', textAlign: 'left' }}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 overflow-hidden mt-4">
              <div className="h-full border rounded-lg overflow-hidden bg-white">
                {localCode ? (
                  <iframe
                    srcDoc={generatePreviewHtml()}
                    className="w-full h-full min-h-[400px]"
                    sandbox="allow-scripts allow-same-origin"
                    title="معاينة المحاكاة"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground min-h-[400px]">
                    <div className="text-center">
                      <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>أضف كود HTML لمعاينة المحاكاة</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex-shrink-0 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Check className="w-4 h-4" />
              حفظ الكود
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HtmlCodeEditor;
