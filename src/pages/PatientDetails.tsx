import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { contactsApi } from "@/lib/api";
import {
    User,
    Phone,
    Calendar,
    Stethoscope,
    FileText,
    Activity,
    AlertTriangle,
    Droplet,
    ArrowRight,
    MessageCircle,
    Clock,
    Shield,
    Pill,
    StickyNote,
    Loader2,
    Printer,
    ChevronRight,
    LucideIcon
} from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface PatientDetailsProps {
    patient: any;
    onBack: () => void;
    onOpenChat: (phone: string, name: string) => void;
    onBookAppointment: (phone: string, name: string) => void;
}

export const PatientDetails = ({ patient: initialPatient, onBack, onOpenChat, onBookAppointment }: PatientDetailsProps) => {
    const [patient, setPatient] = useState<any>(initialPatient);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'diagnosis' | 'treatment'>('all');

    useEffect(() => {
        const fetchPatientDetails = async () => {
            if (initialPatient?.id) {
                try {
                    const data = await contactsApi.getById(initialPatient.id);
                    setPatient(data);
                } catch (error) {
                    console.error("Failed to fetch patient details", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPatientDetails();
    }, [initialPatient?.id]);

    if (!patient) return null;

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const printContent = `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>السجل الطبي - ${patient.name}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { font-size: 28px; margin-bottom: 10px; }
                    .header p { color: #666; font-size: 14px; }
                    .patient-info { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                    .patient-info h2 { font-size: 20px; margin-bottom: 15px; color: #333; }
                    .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                    .info-label { font-weight: bold; color: #555; }
                    .medical-profile { margin-bottom: 30px; }
                    .medical-profile h3 { font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
                    .medical-item { background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 6px; margin-bottom: 15px; }
                    .medical-item h4 { color: #e67e22; margin-bottom: 8px; font-size: 16px; }
                    .visits { margin-top: 30px; }
                    .visits h3 { font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
                    .visit-card { border: 2px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 8px; page-break-inside: avoid; }
                    .visit-header { display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
                    .visit-date { font-weight: bold; font-size: 16px; }
                    .visit-status { padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
                    .status-completed { background: #d4edda; color: #155724; }
                    .status-cancelled { background: #f8d7da; color: #721c24; }
                    .status-scheduled { background: #fff3cd; color: #856404; }
                    .visit-section { margin-bottom: 15px; }
                    .visit-section h5 { color: #3498db; margin-bottom: 8px; font-size: 14px; }
                    .visit-section p { background: #f9f9f9; padding: 10px; border-radius: 4px; white-space: pre-wrap; }
                    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
                    @media print {
                        body { padding: 20px; }
                        .visit-card { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>السجل الطبي الكامل</h1>
                    <p>تاريخ الطباعة: ${format(new Date(), 'dd MMMM yyyy - hh:mm a', { locale: ar })}</p>
                </div>

                <div class="patient-info">
                    <h2>معلومات المريض</h2>
                    <div class="info-row">
                        <span class="info-label">الاسم:</span>
                        <span>${patient.name}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">رقم الملف:</span>
                        <span>#${patient.id}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">فصيلة الدم:</span>
                        <span>${patient.blood_type || 'غير محدد'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">إجمالي الزيارات:</span>
                        <span>${patient.appointment?.length || 0}</span>
                    </div>
                </div>

                <div class="medical-profile">
                    <h3>الملف الطبي</h3>
                    <div class="medical-item">
                        <h4>🔸 الحساسية</h4>
                        <p>${patient.allergies || 'لا توجد حساسية مسجلة'}</p>
                    </div>
                    <div class="medical-item">
                        <h4>🔸 التاريخ المرضي</h4>
                        <p>${patient.chronic_diseases || 'لا توجد أمراض مزمنة مسجلة'}</p>
                    </div>
                </div>

                <div class="visits">
                    <h3>سجل الزيارات والتشخيصات (${filteredAppointments.length} زيارة)</h3>
                    ${filteredAppointments.map((apt: any) => `
                        <div class="visit-card">
                            <div class="visit-header">
                                <div>
                                    <div class="visit-date">${format(new Date(apt.appointmentDate), 'EEEE، dd MMMM yyyy', { locale: ar })}</div>
                                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                                        ⏰ ${format(new Date(apt.appointmentDate), 'hh:mm a', { locale: ar })}
                                    </div>
                                </div>
                                <span class="visit-status status-${apt.status === 'completed' ? 'completed' : apt.status === 'cancelled' ? 'cancelled' : 'scheduled'}">
                                    ${apt.status === 'completed' ? 'مكتمل' : apt.status === 'cancelled' ? 'ملغي' : 'مجدول'}
                                </span>
                            </div>
                            
                            ${apt.notes ? `
                                <div class="visit-section">
                                    <h5>📝 ملاحظات الحجز</h5>
                                    <p>${apt.notes}</p>
                                </div>
                            ` : ''}
                            
                            ${apt.medicalRecords?.[0] ? `
                                <div class="visit-section">
                                    <h5>🩺 التشخيص</h5>
                                    <p>${apt.medicalRecords[0].diagnosis || 'غير محدد'}</p>
                                </div>
                                
                                ${apt.medicalRecords[0].treatment ? `
                                    <div class="visit-section">
                                        <h5>💊 العلاج والدواء</h5>
                                        <p>${apt.medicalRecords[0].treatment}</p>
                                    </div>
                                ` : ''}
                            ` : '<p style="color: #999; font-style: italic;">لم يتم تسجيل ملاحظات طبية لهذه الزيارة.</p>'}
                        </div>
                    `).join('')}
                </div>

                <div class="footer">
                    <p>هذا المستند تم إنشاؤه تلقائياً من نظام إدارة العيادة</p>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
    };



    // Calculate last visit from appointments
    const lastVisitDate = patient.appointment && patient.appointment.length > 0
        ? patient.appointment[0].appointmentDate
        : null;

    const stats = [
        { label: 'إجمالي الزيارات', value: patient.appointment?.length || 0, icon: Calendar },
        { label: 'آخر زيارة', value: lastVisitDate ? format(new Date(lastVisitDate), 'dd MMM yyyy', { locale: ar }) : '-', icon: Clock },
        { label: 'فصيلة الدم', value: patient.blood_type || 'غير متوفر', icon: Droplet },
    ];

    const filteredAppointments = patient.appointment?.filter((apt: any) => {
        if (filter === 'all') return true;
        if (filter === 'diagnosis') return !!apt.medicalRecords?.[0]?.diagnosis;
        if (filter === 'treatment') return !!apt.medicalRecords?.[0]?.treatment;
        return true;
    }) || [];

    return (
        <div className="space-y-6 animate-fade-in pb-10 max-w-5xl mx-auto">
            {/* Ultra-Premium Hero Header */}
            <div className="relative">
                <HeroSection
                    doctorName={patient.name}
                    pageTitle="ملف المريض الطبي"
                    description={`رقم الملف: #${patient.id} - ${patient.phone}`}
                    icon={FileText}
                    className="mb-0 border-b-0"
                >
                    <div className="flex gap-2 md:gap-3 items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="h-8 w-8 md:h-10 md:w-10 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-sm shadow-sm backdrop-blur-sm"
                            title="رجوع"
                        >
                            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 md:h-10 px-4 md:px-6 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-sm font-bold text-[10px] md:text-xs shadow-sm backdrop-blur-sm"
                            onClick={() => onOpenChat(patient.phone, patient.name)}
                        >
                            <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                            واتساب
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 md:h-10 px-4 md:px-6 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-sm font-bold text-[10px] md:text-xs shadow-sm backdrop-blur-sm"
                            onClick={handlePrint}
                        >
                            <Printer className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                            طباعة
                        </Button>
                    </div>
                </HeroSection>
            </div>

            {/* Quick Stats Bar */}
            <Card className="p-4 md:p-6 bg-blue-950/5 backdrop-blur-[80px] border-y border-white/5 rounded-none shadow-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 sm:divide-x sm:divide-x-reverse divide-white/5 relative group overflow-hidden transition-all duration-700">
                {/* 1. Ultra-Premium Light Sweep */}
                <div className="light-sweep opacity-40" />
                <div className="absolute inset-0 holographic-grid opacity-10" />

                {stats.map((stat, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-3 md:p-4 group/item relative z-10">
                        <div className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground mb-1 tracking-tighter italic uppercase leading-none transition-transform group-hover/item:scale-110 duration-700">
                            {loading && i === 0 ? <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin opacity-50 text-primary" /> : stat.value}
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-70 group-hover/item:opacity-100 transition-opacity">
                            <stat.icon className="h-3 w-3 md:h-4 md:w-4" />
                            {stat.label}
                        </div>
                    </div>
                ))}

                {/* Bottom Professional "Power Line" */}
                <div className="absolute bottom-0 left-0 w-full flex opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="h-[4px] w-1/3 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.6)]" />
                    <div className="h-[4px] flex-1 bg-white/5" />
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Right Column: Medical Profile (Sticky) */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-8 border-y border-white/10 rounded-none shadow-2xl bg-blue-950/20 backdrop-blur-3xl space-y-8 relative group overflow-hidden transition-all duration-700">
                        <div className="light-sweep opacity-30" />
                        <div className="absolute inset-0 holographic-grid opacity-5" />

                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="h-10 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                            <h3 className="font-black text-xl flex items-center gap-3 uppercase tracking-tighter italic leading-none">
                                <Activity className="h-6 w-6 text-primary" />
                                الملف الطبي
                            </h3>
                        </div>

                        <div className="space-y-5 relative z-10">
                            {/* Allergies Card */}
                            <div className="p-5 bg-white/[0.03] border border-white/10 hover:border-red-500/30 transition-all duration-500 overflow-hidden relative group/inner rounded-lg">
                                <div className="absolute top-0 left-0 p-2 opacity-5 scale-150 group-hover/inner:opacity-10 transition-opacity">
                                    <AlertTriangle className="h-12 w-12" />
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 rounded-md bg-red-500/10 text-red-500">
                                        <AlertTriangle className="h-4 w-4" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-xs font-bold text-red-400">الحساسية</span>
                                </div>
                                <p className="text-sm md:text-base font-medium text-foreground leading-relaxed">
                                    {patient.allergies || 'لا توجد حساسية مسجلة'}
                                </p>
                            </div>

                            {/* Chronic Diseases Card */}
                            <div className="p-5 bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all duration-500 overflow-hidden relative group/inner rounded-lg">
                                <div className="absolute top-0 left-0 p-2 opacity-5 scale-150 group-hover/inner:opacity-10 transition-opacity">
                                    <Stethoscope className="h-12 w-12" />
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-500">
                                        <Stethoscope className="h-4 w-4" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-xs font-bold text-blue-400">الأمراض المزمنة</span>
                                </div>
                                <p className="text-sm md:text-base font-medium text-foreground leading-relaxed">
                                    {patient.chronic_diseases || 'لا توجد أمراض مزمنة مسجلة'}
                                </p>
                            </div>
                        </div>

                        {/* Bottom Decoration */}
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-l from-transparent via-primary/30 to-transparent" />
                    </Card>
                </div>

                {/* Left Column: Visits Timeline */}
                <div className="lg:col-span-2">
                    <Card className="p-6 md:p-8 border-none bg-transparent shadow-none min-h-[500px] relative">

                        {/* Section Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                                    <FileText className="h-6 w-6 text-primary" strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground">سجل المراجعات</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        سجل كامل للزيارات والتشخيصات السابقة
                                    </p>
                                </div>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 backdrop-blur-md">
                                {[
                                    { id: 'all', label: 'الكل' },
                                    { id: 'diagnosis', label: 'تشخيص' },
                                    { id: 'treatment', label: 'علاج' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setFilter(tab.id as any)}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filter === tab.id
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading && (
                            <div className="flex flex-col items-center justify-center py-24 opacity-50">
                                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                                <p className="text-xs font-medium">جاري تحميل السجل الطبي...</p>
                            </div>
                        )}

                        {!loading && filteredAppointments.length > 0 ? (
                            <div className="relative border-r-2 border-primary/10 mr-4 space-y-8 py-2">
                                {filteredAppointments.map((apt: any) => (
                                    <div key={apt.id} className="relative pr-8 group/visit animate-fade-in">

                                        {/* Timeline Dot */}
                                        <div className="absolute -right-[9px] top-6 h-4 w-4 rounded-full bg-background border-[3px] border-primary shadow-[0_0_10px_rgba(var(--primary),0.4)] group-hover/visit:scale-110 transition-transform z-10" />

                                        {/* Card Content */}
                                        <div className="flex flex-col gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden">

                                            {/* Header: Date & Status */}
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-lg font-bold text-foreground flex items-center gap-2">
                                                        {format(new Date(apt.appointmentDate), 'EEEE، d MMMM yyyy', { locale: ar })}
                                                    </div>
                                                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                                                        <Clock className="h-3.5 w-3.5 text-primary opacity-70" />
                                                        {format(new Date(apt.appointmentDate), 'h:mm a', { locale: ar })}
                                                    </div>
                                                </div>

                                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${apt.status === 'completed' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                                                        apt.status === 'cancelled' ? 'border-red-500/30 text-red-500 bg-red-500/10' :
                                                            'border-amber-500/30 text-amber-500 bg-amber-500/10'
                                                    }`}>
                                                    {apt.status === 'completed' ? 'مكتمل' : apt.status === 'cancelled' ? 'ملغي' : 'مجدول'}
                                                </div>
                                            </div>

                                            {/* Notes Section */}
                                            {apt.notes && (
                                                <div className="p-4 rounded-lg bg-white/[0.02] border-r-4 border-primary/40">
                                                    <div className="flex items-center gap-2 mb-2 opacity-70">
                                                        <StickyNote className="h-3.5 w-3.5 text-primary" />
                                                        <span className="text-[10px] font-bold text-primary">ملاحظات الزيارة</span>
                                                    </div>
                                                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">{apt.notes}</p>
                                                </div>
                                            )}

                                            {/* Medical Records Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                {apt.medicalRecords?.[0] ? (
                                                    <>
                                                        {/* Diagnosis */}
                                                        <div className="p-4 rounded-lg bg-indigo-500/[0.03] border border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
                                                            <div className="flex items-center gap-2.5 mb-2">
                                                                <Activity className="h-4 w-4 text-indigo-400" />
                                                                <span className="text-xs font-bold text-indigo-400">التشخيص الطبي</span>
                                                            </div>
                                                            <p className="text-sm font-medium text-foreground leading-relaxed">
                                                                {apt.medicalRecords[0].diagnosis || 'بانتظار التشخيص'}
                                                            </p>
                                                        </div>

                                                        {/* Treatment */}
                                                        <div className="p-4 rounded-lg bg-emerald-500/[0.03] border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
                                                            <div className="flex items-center gap-2.5 mb-2">
                                                                <Pill className="h-4 w-4 text-emerald-400" />
                                                                <span className="text-xs font-bold text-emerald-400">الخطة العلاجية</span>
                                                            </div>
                                                            <p className="text-sm font-medium text-foreground leading-relaxed">
                                                                {apt.medicalRecords[0].treatment || 'لم يتم تحديد علاج'}
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="col-span-2 p-6 text-center border border-dashed border-white/10 rounded-lg bg-white/[0.01]">
                                                        <p className="text-xs text-muted-foreground opacity-50">لا توجد سجلات طبية مرتبطة بهذه الزيارة</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-xl">
                                <FileText className="h-16 w-16 text-muted-foreground/20 mb-4" />
                                <p className="text-sm text-muted-foreground opacity-50">
                                    لا توجد زيارات سابقة مسجلة في النظام
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};
