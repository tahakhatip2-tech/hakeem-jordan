import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { contactsApi } from '@/lib/api';
import { toastWithSound } from '@/lib/toast-with-sound';
import {
    Search,
    User,
    Loader2,
    Calendar,
    Stethoscope,
    FileText,
    Activity,
    AlertCircle,
    Phone
} from 'lucide-react';

export default function PatientInquiry() {
    const [nationalId, setNationalId] = useState('');
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nationalId.trim()) return;

        setLoading(true);
        setError(null);
        setPatient(null);

        try {
            const data = await contactsApi.findByNationalId(nationalId);
            if (data) {
                setPatient(data);
            } else {
                setError('لم يتم العثور على مريض بهذا الرقم الوطني');
            }
        } catch (err: any) {
            console.error('Search error:', err);
            setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 md:space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="text-right">
                <h2 className="text-xl md:text-3xl font-display font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    بوابة استعلام المرضى
                </h2>
                <p className="text-[11px] md:text-base text-muted-foreground mt-1 font-black">ابحث عن السجلات الطبية الكاملة باستخدام الرقم الوطني</p>
            </div>

            {/* Search Box - Redesigned for Responsiveness */}
            <div className="max-w-3xl mx-auto w-full">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 md:gap-0 relative group">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none group-focus-within:text-primary transition-colors z-10">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                            className="w-full h-14 md:h-16 pr-12 md:rounded-l-none md:rounded-r-3xl rounded-2xl border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/40 backdrop-blur-2xl shadow-xl focus:ring-2 focus:ring-primary/20 transition-all text-base md:text-xl font-bold"
                            placeholder="أدخل الرقم الوطني للمريض..."
                            value={nationalId}
                            onChange={(e) => setNationalId(e.target.value)}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-14 md:h-16 md:rounded-r-none md:rounded-l-3xl rounded-2xl px-8 font-black shadow-lg bg-primary hover:bg-primary/90 text-white transition-all shrink-0"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'بحث عن السجل'}
                    </Button>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-2xl mx-auto bg-red-500/10 text-red-600 border border-red-500/20 p-4 md:p-6 rounded-2xl md:rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-2 md:p-3 bg-white dark:bg-black/40 rounded-full shadow-sm">
                        <AlertCircle className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div className="font-black text-sm md:text-base">{error}</div>
                </div>
            )}

            {/* Patient Content */}
            {patient && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Patient Profile Card */}
                    <div className="lg:col-span-1 space-y-4 md:space-y-6">
                        <Card className="p-5 md:p-8 border border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/40 backdrop-blur-2xl shadow-2xl rounded-[1.25rem] md:rounded-[2.5rem] overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />

                            <div className="relative flex flex-col items-center text-center space-y-4 pt-4 md:pt-10 pb-4">
                                <div className="p-3 md:p-5 bg-white dark:bg-black/60 rounded-3xl shadow-2xl border-4 border-white/20 relative group">
                                    <User className="h-12 w-12 md:h-20 md:w-20 text-primary transition-transform group-hover:scale-110" />
                                    <div className="absolute bottom-1 right-1 h-5 w-5 md:h-7 md:w-7 bg-green-500 rounded-full border-4 border-white dark:border-black" />
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-xl md:text-3xl font-black text-foreground">{patient.name || 'مجهول'}</h3>
                                    <div className="px-3 py-1 bg-primary/10 rounded-full inline-block">
                                        <p className="text-primary font-black tracking-widest text-[10px] md:text-sm">{patient.nationalId}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 px-6 py-2.5 bg-white/50 dark:bg-black/40 border border-white/20 rounded-2xl font-black text-xs md:text-base shadow-sm">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <span dir="ltr">{patient.phone}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                                <div className="text-center p-3 bg-white/30 dark:bg-black/20 rounded-2xl border border-white/10">
                                    <div className="text-xl md:text-3xl font-black text-primary">{patient.appointment?.length || 0}</div>
                                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">زيارة</div>
                                </div>
                                <div className="text-center p-3 bg-white/30 dark:bg-black/20 rounded-2xl border border-white/10">
                                    <div className="text-xl md:text-3xl font-black text-green-600">نشط</div>
                                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">الحالة</div>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Stats or Tags */}
                        <div className="flex flex-wrap gap-2">
                            {patient.tags && patient.tags.map((tag: any) => (
                                <div key={tag.id} className="px-4 py-2 bg-white/30 dark:bg-black/40 backdrop-blur-md rounded-xl border border-white/20 shadow-sm flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tag.color || '#3b82f6' }} />
                                    <span className="font-black text-[10px] md:text-xs">{tag.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Medical Timeline */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3 pb-2 px-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Activity className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-black text-lg md:text-xl">سجل الزيارات والتشخيصات</h3>
                        </div>

                        {patient.appointment && patient.appointment.length > 0 ? (
                            <div className="space-y-4">
                                {patient.appointment.map((apt: any) => (
                                    <Card key={apt.id} className="group p-0 overflow-hidden border border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/40 backdrop-blur-2xl hover:bg-white/40 dark:hover:bg-black/60 transition-all rounded-[1.25rem] md:rounded-[2rem] shadow-lg">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Date Column */}
                                            <div className="md:w-32 bg-primary/10 p-4 md:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center text-center border-b md:border-b-0 md:border-l border-white/10">
                                                <div className="flex flex-col items-center">
                                                    <div className="text-2xl md:text-4xl font-black text-primary">
                                                        {new Date(apt.appointmentDate).getDate()}
                                                    </div>
                                                    <div className="text-xs md:text-sm font-black text-primary/80 uppercase">
                                                        {new Date(apt.appointmentDate).toLocaleDateString('ar-EG', { month: 'short' })}
                                                    </div>
                                                </div>
                                                <div className="text-[10px] md:text-xs text-muted-foreground/60 font-black md:mt-2">
                                                    {new Date(apt.appointmentDate).getFullYear()}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 p-5 md:p-8 space-y-4">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <div className="p-1.5 bg-primary/10 rounded-md">
                                                                <Stethoscope className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <span className="text-[10px] md:text-sm font-black text-primary uppercase tracking-widest">معاينة طبية</span>
                                                        </div>
                                                        <h4 className="font-black text-lg md:text-2xl text-foreground">
                                                            {apt.medicalRecords && apt.medicalRecords[0] ? 'تشخيص مكتمل' : 'زيارة اعتيادية'}
                                                        </h4>
                                                    </div>
                                                    <div className={`px-4 py-1.5 rounded-xl text-[10px] md:text-xs font-black shadow-sm ${apt.status === 'completed' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                                                        apt.status === 'cancelled' ? 'bg-red-500/10 text-red-600 border border-red-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                                        }`}>
                                                        {apt.status === 'completed' ? 'مكتمل' : apt.status === 'cancelled' ? 'ملغي' : 'مجدول'}
                                                    </div>
                                                </div>

                                                {/* Medical Record Details */}
                                                {patient.medicalRecords?.find((r: any) => r.appointmentId === apt.id) ? (
                                                    <div className="bg-white/40 dark:bg-black/40 rounded-2xl p-4 md:p-6 border border-white/20 space-y-3 shadow-inner">
                                                        <div className="text-xs md:text-base leading-relaxed">
                                                            <span className="font-black text-primary">التشخيص: </span>
                                                            <span className="text-foreground/90 font-medium">
                                                                {patient.medicalRecords.find((r: any) => r.appointmentId === apt.id).diagnosis}
                                                            </span>
                                                        </div>
                                                        <div className="h-px bg-white/20" />
                                                        <div className="text-xs md:text-base leading-relaxed">
                                                            <span className="font-black text-amber-600">العلاج الموصوف: </span>
                                                            <span className="text-foreground/90 font-medium">
                                                                {patient.medicalRecords.find((r: any) => r.appointmentId === apt.id).treatment}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-4 bg-muted/20 border border-dashed border-muted-foreground/20 rounded-2xl text-xs md:text-sm text-muted-foreground font-black italic text-center">
                                                        لا تتوفر تفاصيل طبية دقيقة لهذه الزيارة في السجل السحابي.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white/20 dark:bg-black/40 backdrop-blur-xl rounded-[2rem] border border-dashed border-white/20 animate-in fade-in zoom-in">
                                <div className="p-5 bg-primary/5 rounded-full inline-block mb-4">
                                    <FileText className="h-12 w-12 text-primary/40" />
                                </div>
                                <h3 className="font-black text-xl mb-1">لا يوجد تاريخ مرضي</h3>
                                <p className="text-muted-foreground font-black text-sm">لم نجد أي زيارات سابقة مسجلة لهذا المريض.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
