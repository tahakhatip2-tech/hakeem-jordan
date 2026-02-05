import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function PatientLogin() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/patient/auth/login`, formData);

            // Save token
            localStorage.setItem('patient_token', response.data.token);
            localStorage.setItem('patient_user', JSON.stringify(response.data.patient));

            toast({
                title: 'مرحباً بعودتك!',
                description: 'تم تسجيل الدخول بنجاح',
            });

            navigate('/patient/dashboard');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'خطأ في تسجيل الدخول',
                description: error.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gradient-primary mb-2">حكيم الأردن</h1>
                    <p className="text-muted-foreground">بوابة المرضى</p>
                </div>

                <Card className="shadow-elevated animate-slide-up">
                    <CardHeader>
                        <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
                        <CardDescription>
                            أدخل بياناتك للوصول إلى حسابك
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                <div className="relative">
                                    <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pr-10"
                                        placeholder="example@email.com"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">كلمة المرور</Label>
                                <div className="relative">
                                    <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pr-10"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full gradient-primary text-white shadow-glow"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                        جاري تسجيل الدخول...
                                    </>
                                ) : (
                                    'تسجيل الدخول'
                                )}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground space-y-2">
                                <div>
                                    ليس لديك حساب؟{' '}
                                    <Link to="/patient/register" className="text-primary hover:underline font-medium">
                                        إنشاء حساب جديد
                                    </Link>
                                </div>
                                <div>
                                    <Link to="/" className="text-muted-foreground hover:text-primary">
                                        العودة للصفحة الرئيسية
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
