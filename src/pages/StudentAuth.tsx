import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen, Mail, Lock, User, ArrowRight, KeyRound } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const emailSchema = z.string().email('البريد الإلكتروني غير صحيح');
const passwordSchema = z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
const nameSchema = z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل');

const grades = [
  'الصف الأول',
  'الصف الثاني', 
  'الصف الثالث',
  'الصف الرابع',
  'الصف الخامس',
  'الصف السادس',
];

type SignUpStep = 'form' | 'verification';

const StudentAuth = () => {
  const navigate = useNavigate();
  const { signIn, signUpStudent, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('الصف الثالث');
  const [loading, setLoading] = useState(false);
  const [signUpStep, setSignUpStep] = useState<SignUpStep>('form');
  const [verificationCode, setVerificationCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/student-dashboard');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validateSignInInputs = () => {
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

  const validateSignUpInputs = () => {
    try {
      nameSchema.parse(fullName);
    } catch {
      toast({
        title: 'خطأ',
        description: 'الاسم يجب أن يكون حرفين على الأقل',
        variant: 'destructive',
      });
      return false;
    }

    return validateSignInInputs();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignInInputs()) return;

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
      navigate('/student-dashboard');
    }
  };

  const sendVerificationCode = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { email, fullName }
      });

      if (error) throw error;

      toast({
        title: 'تم إرسال الكود',
        description: 'تحقق من بريدك الإلكتروني',
      });
      setSignUpStep('verification');
      setResendTimer(60);
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في إرسال رمز التحقق',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUpInputs()) return;
    await sendVerificationCode();
  };

  const handleVerifyAndSignUp = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال رمز التحقق المكون من 6 أرقام',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Verify the code first
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-code', {
        body: { email, code: verificationCode }
      });

      if (verifyError) throw verifyError;

      if (!verifyData.valid) {
        toast({
          title: 'خطأ',
          description: verifyData.error || 'رمز التحقق غير صحيح',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Now create the account
      const { error } = await signUpStudent(email, password, fullName, grade);

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
          description: 'مرحباً بك في رحلة التعلم',
        });
        navigate('/student-dashboard');
      }
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء التحقق',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    await sendVerificationCode();
  };

  const handleBackToForm = () => {
    setSignUpStep('form');
    setVerificationCode('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-secondary/10 p-4" dir="rtl">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 justify-center"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للصفحة الرئيسية
        </Link>
        
        <Card className="shadow-xl border-2 border-secondary/30">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              بوابة الطلاب 📚
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              سجل دخولك لتتبع تقدمك في التعلم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup" onClick={() => setSignUpStep('form')}>حساب جديد</TabsTrigger>
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
                {signUpStep === 'form' ? (
                  <form onSubmit={handleSendCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-foreground">الاسم الكامل</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="أحمد محمد"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pr-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade" className="text-foreground">الصف الدراسي</Label>
                      <Select value={grade} onValueChange={setGrade}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الصف" />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((g) => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                          جاري إرسال رمز التحقق...
                        </>
                      ) : (
                        'إرسال رمز التحقق'
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <KeyRound className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">أدخل رمز التحقق</h3>
                      <p className="text-sm text-muted-foreground">
                        تم إرسال رمز مكون من 6 أرقام إلى
                        <br />
                        <span className="font-medium text-foreground">{email}</span>
                      </p>
                    </div>
                    
                    <div className="flex justify-center" dir="ltr">
                      <InputOTP
                        maxLength={6}
                        value={verificationCode}
                        onChange={setVerificationCode}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button 
                      onClick={handleVerifyAndSignUp} 
                      className="w-full" 
                      disabled={loading || verificationCode.length !== 6}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري التحقق...
                        </>
                      ) : (
                        'تأكيد وإنشاء الحساب'
                      )}
                    </Button>

                    <div className="flex flex-col gap-2 text-center">
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendTimer > 0 || loading}
                        className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
                      >
                        {resendTimer > 0 
                          ? `إعادة الإرسال بعد ${resendTimer} ثانية` 
                          : 'إعادة إرسال الرمز'
                        }
                      </button>
                      <button
                        type="button"
                        onClick={handleBackToForm}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        تغيير البريد الإلكتروني
                      </button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAuth;
