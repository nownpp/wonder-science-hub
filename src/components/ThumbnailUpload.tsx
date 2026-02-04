import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { X, Loader2, Image as ImageIcon, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ThumbnailUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  acceptPdf?: boolean;
}

const ThumbnailUpload = ({ value, onChange, folder = 'general', acceptPdf = false }: ThumbnailUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFileType = (file: File) => {
    if (file.type.startsWith('image/')) return true;
    if (acceptPdf && file.type === 'application/pdf') return true;
    return false;
  };

  const isPdf = (url: string) => {
    return url.toLowerCase().endsWith('.pdf');
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isValidFileType(file)) {
      toast.error(acceptPdf ? 'يرجى اختيار ملف صورة أو PDF' : 'يرجى اختيار ملف صورة');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('thumbnails')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(fileName);

      onChange(publicUrl);
      toast.success('تم رفع الصورة بنجاح');
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast.error('حدث خطأ في رفع الصورة');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  const acceptTypes = acceptPdf ? "image/*,application/pdf" : "image/*";

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept={acceptTypes}
        onChange={handleUpload}
        ref={fileInputRef}
        className="hidden"
      />

      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
          {isPdf(value) ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted">
              <FileText className="w-16 h-16 text-primary mb-2" />
              <span className="text-sm text-muted-foreground">ملف PDF</span>
              <a 
                href={value} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline mt-1"
              >
                عرض الملف
              </a>
            </div>
          ) : (
            <img
              src={value}
              alt="Thumbnail preview"
              className="w-full h-full object-cover"
            />
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 left-2 w-8 h-8"
            onClick={handleRemove}
            type="button"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-32 border-dashed flex flex-col gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">جاري الرفع...</span>
            </>
          ) : (
            <>
              {acceptPdf ? (
                <div className="flex gap-2">
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
              ) : (
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">
                {acceptPdf ? 'اضغط لرفع صورة أو ملف PDF' : 'اضغط لرفع صورة مصغرة'}
              </span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default ThumbnailUpload;
