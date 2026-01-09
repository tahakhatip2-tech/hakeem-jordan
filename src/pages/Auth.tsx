import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toastWithSound } from '@/lib/toast-with-sound';
import { Loader2 } from "lucide-react";
import { authSchema } from "@/lib/validations";
import Footer from "@/components/Footer";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate with Zod
      const validationData = isLogin
        ? { email, password }
        : { email, password, name: fullName };

      const validation = authSchema.safeParse(validationData);

      if (!validation.success) {
        toastWithSound.error(validation.error.errors[0].message);
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.includes("Invalid credentials") || error.includes("401")) {
            toastWithSound.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
          } else {
            toastWithSound.error(error);
          }
        } else {
          toastWithSound.success("تم تسجيل الدخول بنجاح");
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.includes("already exists") || error.includes("400")) {
            toastWithSound.error("هذا البريد الإلكتروني مسجل مسبقاً");
          } else {
            toastWithSound.error(error);
          }
        } else {
          toastWithSound.success("تم إنشاء الحساب بنجاح");
          navigate("/");
        }
      }
    } catch (error) {
      toastWithSound.error("حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden" dir="rtl">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 resize-bg-animation"
        style={{ backgroundImage: 'url(/auth-bg-pro.png?v=5)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-blue-900/40 via-blue-900/20 to-transparent backdrop-blur-[1px]"></div>
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center w-full px-4 lg:px-20 relative z-10 gap-12 lg:gap-20">

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-auto flex flex-col items-center justify-center">
          {/* ... form ... */}
          <Card className="w-full max-w-sm p-6 border-white/20 shadow-2xl bg-white/10 backdrop-blur-xl animate-fade-in-up hover:bg-white/15 transition-all duration-300 border-t-white/30 rounded-3xl">
            <div className="flex flex-col items-center justify-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full"></div>
                <img src="./logo.png" alt="Hakeem Jordan Logo" className="h-20 w-auto object-contain drop-shadow-2xl relative z-10 transition-transform hover:scale-105 duration-500" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-black text-white drop-shadow-md mb-1 tracking-tight">
                  Hakeem Jordan
                </h1>
                <p className="text-xs text-blue-200 font-bold uppercase tracking-[0.2em] drop-shadow-sm">Clinic Management System</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-center mb-4 text-white drop-shadow-sm">
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-blue-100 text-xs">الاسم الكامل</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="bg-white/10 border-white/20 focus:border-blue-400 text-white placeholder:text-blue-200/50 rounded-xl h-10 text-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-100 text-xs">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                  className="bg-white/10 border-white/20 focus:border-blue-400 text-white placeholder:text-blue-200/50 rounded-xl h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-100 text-xs">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  required
                  className="bg-white/10 border-white/20 focus:border-blue-400 text-white placeholder:text-blue-200/50 rounded-xl h-10 text-sm"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold h-10 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 border border-white/10 text-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    معالجة...
                  </>
                ) : (
                  isLogin ? "دخول للنظام" : "إنشاء حساب"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-blue-100 hover:text-white underline decoration-blue-400/50 hover:decoration-blue-400 underline-offset-4 transition-all"
              >
                {isLogin
                  ? "ليس لديك حساب؟ إنشاء حساب جديد"
                  : "لديك حساب بالفعل؟ تسجيل الدخول"}
              </button>
            </div>

            {/* Mobile Vision & Footer (Inside Card) */}
            <div className="lg:hidden mt-6 pt-4 border-t border-white/10 flex flex-col items-center gap-3 animate-fade-in-up">
              {/* Vision - Compact */}
              <div className="text-center space-y-1">
                <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-wider opacity-80">الرؤية الوطنية</h3>
                <p className="text-xs font-bold leading-tight text-blue-50/90 max-w-[250px] mx-auto">
                  "أول نظام عربي لإدارة النظام الصحي إلكترونياً بسكرتير آلي ذكي."
                </p>
              </div>

              {/* Tags - Compact */}
              <div className="flex flex-wrap justify-center gap-1.5 opacity-80">
                <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-400/20 rounded-full text-[8px] text-blue-200">الاول في الشرق الأوسط</span>
                <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-400/20 rounded-full text-[8px] text-blue-200">سكرتير آلي</span>
              </div>

              {/* Signature & Version - Compact Row */}
              <div className="w-full flex items-center justify-between text-[9px] text-blue-300/50 font-medium tracking-wider pt-2 border-t border-white/5 mt-1">
                <span>By Al-Khatib Software</span>
                <span className="font-mono opacity-70">v1.0</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Left Side: Vision Text - Condensed & Professional */}
        <div className="hidden lg:flex w-full lg:w-1/2 flex-col justify-center items-start text-white p-8 animate-fade-in-up delay-200">
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-20 bg-gradient-to-b from-orange-400 to-transparent rounded-full"></div>
            <div className="pl-6 space-y-4">
              <h3 className="text-xl font-black text-orange-400 uppercase tracking-wider drop-shadow-md">الرؤية الوطنية</h3>
              <p className="text-2xl font-bold leading-relaxed text-blue-50 max-w-lg drop-shadow-sm" style={{ lineHeight: '1.5' }}>
                "رؤيتنا أول نظام عربي في الشرق الأوسط لإدارة النظام الصحي إلكترونياً، يعتمد على سكرتير آلي لإتمام المهام وإدارة النظام بالكامل."
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs text-blue-200 font-bold backdrop-blur-sm">
                  الاول في الشرق الأوسط
                </span>
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs text-blue-200 font-bold backdrop-blur-sm">
                  سكرتير آلي ذكي
                </span>
              </div>
              <div className="flex items-center gap-2 text-orange-400/90 text-sm font-bold pt-4">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                نحو تحول رقمي شامل
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer minimal */}
      <div className="absolute bottom-4 left-0 right-0 z-10 text-center pointer-events-none">
        <p className="text-[10px] text-white/40">Powered by Al-Khatib Software</p>
      </div>
    </div>
  );
};

export default Auth;
