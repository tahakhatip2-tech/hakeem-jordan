import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, Phone, Calendar, MapPin } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function PatientRegister() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/patient/auth/register`, formData);

            // Save token
            localStorage.setItem('patient_token', response.data.token);
            localStorage.setItem('patient_user', JSON.stringify(response.data.patient));

            toast({
                title: 'تم التسجيل بنجاح!',
                description: 'مرحباً بك في بوابة المرضى',
            });

            navigate('/patient/dashboard');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'خطأ في التسجيل',
                description: error.response?.data?.message || 'حدث خطأ أثناء التسجيل',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
            <div className="w-full max-w-2xl">
                {/* Logo/Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gradient-primary mb-2">حكيم الأردن</h1>
                    <p className="text-muted-foreground">إنشاء حساب جديد في بوابة المرضى</p>
                </div>

                <Card className="shadow-elevated animate-slide-up">
                    <CardHeader>
                        <CardTitle className="text-2xl">التسجيل</CardTitle>
                        <CardDescription>
                            أدخل بياناتك لإنشاء حساب جديد
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">الاسم الكامل *</Label>
                                    <div className="relative">
                                        <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="pr-10"
                                            placeholder="أدخل اسمك الكامل"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone">رقم الهاتف *</Label>
                                    <div className="relative">
                                        <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="pr-10"
                                            placeholder="07XXXXXXXX"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">البريد الإلكتروني *</Label>
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
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">كلمة المرور *</Label>
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
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Date of Birth */}
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">تاريخ الميلاد</Label>
                                    <div className="relative">
                                        <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            className="pr-10"
                                        />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div className="space-y-2">
                                    <Label htmlFor="gender">الجنس</Label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="">اختر...</option>
                                        <option value="male">ذكر</option>
                                        <option value="female">أنثى</option>
                                    </select>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label htmlFor="address">العنوان</Label>
                                <div className="relative">
                                    <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="pr-10"
                                        placeholder="المدينة، الحي"
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
                                        جاري التسجيل...
                                    </>
                                ) : (
                                    'إنشاء حساب'
                                )}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                لديك حساب بالفعل؟{' '}
                                <Link to="/patient/login" className="text-primary hover:underline font-medium">
                                    تسجيل الدخول
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
