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
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div>
                <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    بوابة استعلام المرضى
                </h2>
                <p className="text-muted-foreground mt-1">ابحث عن السجلات الطبية الكاملة باستخدام الرقم الوطني</p>
            </div>

            {/* Search Box */}
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none group-focus-within:text-primary transition-colors">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                        className="w-full h-16 pr-12 rounded-3xl border-border/50 bg-card/50 backdrop-blur-sm shadow-xl focus:ring-2 focus:ring-primary/20 transition-all text-xl font-bold"
                        placeholder="أدخل الرقم الوطني للمريض..."
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        className="absolute left-2 top-2 bottom-2 rounded-2xl px-6 font-bold shadow-glow"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'بحث'}
                    </Button>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-2xl mx-auto bg-destructive/5 text-destructive border border-destructive/10 p-6 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div className="font-bold">{error}</div>
                </div>
            )}

            {/* Patient Content */}
            {patient && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Patient Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />

                            <div className="relative flex flex-col items-center text-center space-y-4 pt-10 pb-4">
                                <div className="p-4 bg-background rounded-full shadow-2xl border-4 border-white/50 relative">
                                    <User className="h-16 w-16 text-primary" />
                                    <div className="absolute bottom-0 right-0 h-6 w-6 bg-primary rounded-full border-4 border-background" />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black">{patient.name || 'مجهول'}</h3>
                                    <p className="text-muted-foreground font-mono mt-1 text-sm">{patient.nationalId}</p>
                                </div>

                                <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl font-bold text-sm">
                                    <Phone className="h-4 w-4" />
                                    <span dir="ltr">{patient.phone}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/50">
                                <div className="text-center">
                                    <div className="text-2xl font-black text-primary">{patient.appointment?.length || 0}</div>
                                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">زيارة</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-black text-primary">نشط</div>
                                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">الحالة</div>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Stats or Tags */}
                        <div className="space-y-3">
                            {patient.tags && patient.tags.map((tag: any) => (
                                <div key={tag.id} className="p-3 bg-white rounded-xl border shadow-sm flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color || '#3b82f6' }} />
                                    <span className="font-bold text-sm">{tag.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Medical Timeline */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 pb-2">
                            <Activity className="h-5 w-5 text-primary" />
                            <h3 className="font-bold text-lg">سجل الزيارات والتشخيصات</h3>
                        </div>

                        {patient.appointment && patient.appointment.length > 0 ? (
                            <div className="space-y-4">
                                {patient.appointment.map((apt: any) => (
                                    <Card key={apt.id} className="group p-0 overflow-hidden border-border/50 bg-card/30 hover:bg-card/80 transition-all rounded-3xl">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Date Column */}
                                            <div className="md:w-32 bg-primary/5 p-6 flex flex-col items-center justify-center text-center border-l border-border/50">
                                                <div className="text-3xl font-black text-primary">
                                                    {new Date(apt.appointmentDate).getDate()}
                                                </div>
                                                <div className="text-sm font-bold text-muted-foreground uppercase">
                                                    {new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short' })}
                                                </div>
                                                <div className="text-xs text-muted-foreground/50 mt-1 font-mono">
                                                    {new Date(apt.appointmentDate).getFullYear()}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 p-6 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Stethoscope className="h-4 w-4 text-primary" />
                                                            <span className="text-sm font-bold text-primary">استشارة طبية</span>
                                                        </div>
                                                        <h4 className="font-black text-lg">
                                                            {apt.medicalRecords && apt.medicalRecords[0] ? 'تم التشخيص' : 'زيارة روتينية'}
                                                        </h4>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${apt.status === 'completed' ? 'bg-primary/10 text-primary' :
                                                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {apt.status}
                                                    </div>
                                                </div>

                                                {/* Medical Record Details */}
                                                {/* Note: The API should return nested medicalRecords for this to work perfectly. 
                                                    The findByNationalId in backend includes medicalRecords for the contact, 
                                                    but appointments might need to link them. 
                                                    Actually, medicalRecords are linked to appointments. 
                                                    Let's verify the backend response structure.
                                                */}
                                                {/* Assuming backend returns appointments with their linked medical records if possible, 
                                                     or we filter the contact.medicalRecords by appointmentId */}

                                                {patient.medicalRecords?.find((r: any) => r.appointmentId === apt.id) ? (
                                                    <div className="bg-white/50 rounded-2xl p-4 border border-border/50 space-y-2">
                                                        <div className="text-sm leading-relaxed">
                                                            <span className="font-bold text-primary">التشخيص: </span>
                                                            {patient.medicalRecords.find((r: any) => r.appointmentId === apt.id).diagnosis}
                                                        </div>
                                                        <div className="text-sm leading-relaxed">
                                                            <span className="font-bold text-amber-600">العلاج: </span>
                                                            {patient.medicalRecords.find((r: any) => r.appointmentId === apt.id).treatment}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-muted-foreground italic">
                                                        لا يوجد توثيق طبي لهذه الزيارة.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-muted/20 rounded-3xl">
                                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                                <p className="text-muted-foreground">لا يوجد سجل زيارات لهذا المريض.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
