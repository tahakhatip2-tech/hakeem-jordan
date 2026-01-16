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
                />

                {/* Floating Action Ribbon */}
                <div className="absolute top-6 left-4 right-4 md:top-12 md:left-12 md:right-auto flex flex-col md:flex-row gap-2 md:gap-3 z-30">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="h-10 w-10 md:h-12 md:w-12 bg-white/5 backdrop-blur-md border border-white/10 text-primary hover:bg-primary/20 rounded-none transition-all self-start"
                    >
                        <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
                    </Button>
                    <div className="flex gap-2 md:gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 md:h-12 px-4 md:px-8 bg-white/5 backdrop-blur-md border border-white/10 text-primary hover:bg-primary/20 rounded-none font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] md:text-[10px] flex-1 md:flex-none"
                            onClick={() => onOpenChat(patient.phone, patient.name)}
                        >
                            <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                            واتساب
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 md:h-12 px-4 md:px-8 bg-white/5 backdrop-blur-md border border-white/10 text-primary hover:bg-primary/20 rounded-none font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] md:text-[10px] flex-1 md:flex-none"
                            onClick={handlePrint}
                        >
                            <Printer className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                            طباعة
                        </Button>
                    </div>
                </div>
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
                            <div className="p-5 bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-all duration-500 overflow-hidden relative group/inner">
                                <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 group-hover/inner:opacity-10 transition-opacity">
                                    <AlertTriangle className="h-12 w-12" />
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1 rounded-sm bg-primary/20 text-primary">
                                        <AlertTriangle className="h-3.5 w-3.5" strokeWidth={3} />
                                    </div>
                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">HAKEEM_ALLERGIES</span>
                                </div>
                                <p className="text-sm md:text-base font-black text-foreground italic uppercase tracking-tighter leading-tight">
                                    {patient.allergies || 'لا توجد حساسية مسجلة'}
                                </p>
                            </div>

                            <div className="p-5 bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-all duration-500 overflow-hidden relative group/inner">
                                <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 group-hover/inner:opacity-10 transition-opacity">
                                    <Stethoscope className="h-12 w-12" />
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1 rounded-sm bg-primary/20 text-primary">
                                        <Stethoscope className="h-3.5 w-3.5" strokeWidth={3} />
                                    </div>
                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">MEDICAL_HISTORY</span>
                                </div>
                                <p className="text-sm md:text-base font-black text-foreground italic uppercase tracking-tighter leading-tight">
                                    {patient.chronic_diseases || 'لا توجد أمراض مزمنة مسجلة'}
                                </p>
                            </div>
                        </div>

                        {/* Bottom Professional "Power Line" */}
                        <div className="absolute bottom-0 left-0 w-full flex opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
                            <div className="h-[3px] w-1/2 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.6)]" />
                            <div className="h-[3px] flex-1 bg-white/5" />
                        </div>
                    </Card>
                </div>

                {/* Left Column: Visits Timeline */}
                <div className="lg:col-span-2">
                    <Card className="p-8 border-y border-white/10 rounded-none shadow-2xl bg-blue-950/10 backdrop-blur-3xl min-h-[500px] relative group overflow-hidden transition-all duration-700">
                        <div className="absolute inset-0 holographic-grid opacity-5" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 relative z-10 gap-6">
                            <div className="flex items-center gap-5">
                                <div className="h-16 w-16 bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-xl group-hover:scale-110 transition-transform">
                                    <FileText className="h-8 w-8 text-primary" strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-none">سجل المراجعات</h3>
                                    <p className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.3em] mt-2 opacity-60">
                                        Clinical Diagnosis History Registry
                                    </p>
                                </div>
                            </div>

                            {/* Filter Tabs - Flagship Style */}
                            <div className="flex bg-white/5 p-1.5 border border-white/10 backdrop-blur-xl">
                                {[
                                    { id: 'all', label: 'الكل' },
                                    { id: 'diagnosis', label: 'تشخيص' },
                                    { id: 'treatment', label: 'علاج' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setFilter(tab.id as any)}
                                        className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab.id
                                            ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.3)]'
                                            : 'text-muted-foreground/60 hover:text-foreground hover:bg-white/5'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading && (
                            <div className="flex flex-col items-center justify-center py-24 opacity-30">
                                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Accessing Encrypted Records...</p>
                            </div>
                        )}

                        {!loading && filteredAppointments.length > 0 ? (
                            <div className="relative border-r-[3px] border-primary/20 mr-6 space-y-10 py-4">
                                {filteredAppointments.map((apt: any) => (
                                    <div key={apt.id} className="relative pr-10 group/visit animate-fade-in">
                                        {/* Timeline Dot Architectural */}
                                        <div className="absolute -right-[11px] top-0 h-5 w-5 bg-blue-950 border-[3px] border-primary group-hover/visit:scale-125 transition-transform duration-500 shadow-[0_0_15px_rgba(var(--primary),0.5)]" />

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6 p-6 bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-700 relative overflow-hidden group/card">
                                            <div className="light-sweep opacity-10" />

                                            <div className="relative z-10">
                                                <div className="text-lg font-black text-foreground mb-2 flex items-center gap-3 italic uppercase tracking-tighter leading-tight">
                                                    {format(new Date(apt.appointmentDate), 'EEEE, dd MMMM yyyy', { locale: ar })}
                                                    <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 border border-primary/20 uppercase tracking-widest">
                                                        Visit_Confirmed
                                                    </span>
                                                </div>
                                                <div className="text-[10px] font-black text-muted-foreground/40 flex items-center gap-2 uppercase tracking-[0.2em]">
                                                    <Clock className="h-3.5 w-3.5 text-primary opacity-50" />
                                                    {format(new Date(apt.appointmentDate), 'hh:mm a', { locale: ar })}
                                                </div>
                                            </div>
                                            <div className={`px-6 py-2 border font-black text-[10px] uppercase tracking-[0.2em] italic relative z-10 transition-all duration-700
                                                ${apt.status === 'completed' ? 'border-primary text-primary bg-primary/10 group-hover/card:bg-primary group-hover/card:text-white' :
                                                    apt.status === 'cancelled' ? 'border-red-500/50 text-red-500 bg-red-500/10' : 'border-amber-500/50 text-amber-500 bg-amber-500/10'}`}>
                                                {apt.status === 'completed' ? 'Visit_Completed' : apt.status === 'cancelled' ? 'Visit_Cancelled' : 'Visit_Scheduled'}
                                            </div>
                                        </div>

                                        <div className="mr-6 space-y-4 relative z-10">
                                            {/* Notes if available */}
                                            {apt.notes && (
                                                <div className="p-6 bg-white/[0.03] border-r-4 border-primary/40 backdrop-blur-md">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <StickyNote className="h-4 w-4 text-primary opacity-50" />
                                                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Reservation_Notes</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-foreground/70 leading-relaxed uppercase tracking-wide">{apt.notes}</p>
                                                </div>
                                            )}

                                            {/* Medical Records */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {apt.medicalRecords?.[0] ? (
                                                    <>
                                                        <div className="p-6 bg-white/[0.04] border border-white/5 hover:border-primary/20 transition-all group/info">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="p-2 bg-primary/20 text-primary group-hover/info:bg-primary group-hover/info:text-white transition-all">
                                                                    <Activity className="h-4 w-4" />
                                                                </div>
                                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Diagnosis_Report</span>
                                                            </div>
                                                            <p className="text-base font-black text-foreground italic uppercase tracking-tighter leading-tight">{apt.medicalRecords[0].diagnosis || 'Pending_Diagnosis'}</p>
                                                        </div>

                                                        <div className="p-6 bg-white/[0.04] border border-white/5 hover:border-primary/20 transition-all group/info">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="p-2 bg-indigo-500/20 text-indigo-500 group-hover/info:bg-indigo-500 group-hover/info:text-white transition-all">
                                                                    <Pill className="h-4 w-4" />
                                                                </div>
                                                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Treatment_Plan</span>
                                                            </div>
                                                            <p className="text-sm font-black text-foreground/80 leading-relaxed uppercase tracking-tighter italic">
                                                                {apt.medicalRecords[0].treatment || 'No_Treatment_Assigned'}
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="col-span-2 p-12 text-center border-2 border-dashed border-white/5 bg-white/[0.01]">
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic opacity-30">Waiting for Clinical Record Entry</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5">
                                <FileText className="h-20 w-20 text-blue-900/20 mb-8" />
                                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-30 italic leading-loose text-center">
                                    {loading ? 'Decrypting Secure Database...' : 'DATABASE_QUERY_EMPTY: NO MATCHING CLINICAL RECORDS FOUND'}
                                </p>
                            </div>
                        )}

                        {/* Bottom Professional "Power Line" */}
                        <div className="absolute bottom-0 left-0 w-full flex opacity-30 group-hover:opacity-100 transition-opacity duration-1000">
                            <div className="h-[4px] w-1/4 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.6)]" />
                            <div className="h-[4px] flex-1 bg-white/5" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
