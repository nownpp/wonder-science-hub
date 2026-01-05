import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GraduationCap, Mail, Lock } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('البريد الإلكتروني غير صحيح');
const passwordSchema = z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const validateInputs = () => {
    try {
      emailSchema.parse(email);
    } catch {
      toast({
        title: 'خطأ',
        description: 'البريد الإلكتروني غير صحيح',
        variant: 'destructive',
      });
      return false;
    }

    try {
      passwordSchema.parse(password);
    } catch {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      let message = 'حدث خطأ أثناء تسجيل الدخول';
      if (error.message.includes('Invalid login credentials')) {
        message = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      } else if (error.message.includes('Email not confirmed')) {
        message = 'يرجى تأكيد البريد الإلكتروني أولاً';
      }
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'مرحباً بك!',
        description: 'تم تسجيل الدخول بنجاح',
      });
      navigate('/dashboard');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      let message = 'حدث خطأ أثناء إنشاء الحساب';
      if (error.message.includes('User already registered')) {
        message = 'هذا البريد الإلكتروني مسجل بالفعل';
      } else if (error.message.includes('Password')) {
        message = 'كلمة المرور ضعيفة جداً';
      }
      toast({
        title: 'خطأ في التسجيل',
        description: message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم إنشاء الحساب!',
        description: 'يمكنك الآن تسجيل الدخول',
      });
      navigate('/dashboard');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-xl border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            بوابة المعلمين
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            سجل دخولك لإدارة المحتوى التعليمي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">حساب جديد</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-foreground">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-foreground">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-foreground">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-foreground">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="6 أحرف على الأقل"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري إنشاء الحساب...
                    </>
                  ) : (
                    'إنشاء حساب جديد'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
