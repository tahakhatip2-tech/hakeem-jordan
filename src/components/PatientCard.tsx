import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, User, MessageCircle, Copy, Calendar, FileText, Trash2, Activity, Droplet, AlertTriangle } from "lucide-react";
import { toastWithSound } from '@/lib/toast-with-sound';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface PatientCardProps {
    id: string;
    name: string;
    phone?: string;
    status?: string;
    last_visit?: string;
    medical_notes?: string;
    blood_type?: string;
    allergies?: string;
    chronic_diseases?: string;
    onDelete: (id: string) => void;
    onUpdateStatus: (id: string, status: string) => void;
    onOpenChat?: (phone: string, name?: string) => void;
    onBookAppointment?: (phone: string, name: string) => void;
    total_appointments?: number;
    last_diagnosis?: string;
}

export const PatientCard = ({
    id, name, phone, status = 'new',
    last_visit, medical_notes, blood_type, allergies, chronic_diseases,
    total_appointments, last_diagnosis,
    onDelete, onUpdateStatus, onOpenChat, onBookAppointment
}: PatientCardProps) => {
    const hasPhone = phone && phone.length > 3;

    const copyToClipboard = () => {
        if (hasPhone) {
            navigator.clipboard.writeText(phone);
            toastWithSound.success("تم نسخ رقم الهاتف");
        }
    };

    const statusConfig: any = {
        new: { label: 'جديد', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
        active: { label: 'نشط', color: 'bg-primary/10 text-primary border-primary/20' },
        inactive: { label: 'غير نشط', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
    };

    return (
        <Card className={cn(
            "p-6 transition-all duration-300 border border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/40 backdrop-blur-2xl rounded-[1.25rem] md:rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden group flex flex-col",
            status === 'active' && "ring-4 ring-blue-500/10 border-blue-500/50"
        )}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-[1.25rem] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/20 border-2 border-white dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-lg group-hover:scale-110 transition-transform">
                        <User className="h-7 w-7 font-black" />
                    </div>
                    <div>
                        <h4 className="font-black text-lg text-blue-950 dark:text-blue-50 leading-none mb-2">{name || 'مريض جديد'}</h4>
                        <div className="flex items-center gap-2">
                            <div className={cn("text-[9px] font-black py-0.5 px-2.5 rounded-full border uppercase tracking-wider shadow-sm", statusConfig[status]?.color)}>
                                {statusConfig[status]?.label}
                            </div>
                            {total_appointments !== undefined && total_appointments > 0 && (
                                <div className="text-[9px] font-black py-0.5 px-2.5 rounded-full bg-blue-600 text-white border border-blue-500 shadow-sm">
                                    {total_appointments} {total_appointments === 1 ? 'زيارة' : 'زيارات'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDelete(id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-3 mb-5 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800 shadow-inner">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Phone className="h-4 w-4" />
                </div>
                {hasPhone ? (
                    <>
                        <span className="font-black tabular-nums flex-1 text-center text-sm text-blue-900 dark:text-blue-100" dir="ltr">{phone}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-600 hover:text-white transition-all rounded-lg" onClick={copyToClipboard}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </>
                ) : (
                    <span className="flex-1 text-center text-xs font-black text-blue-400">لا يوجد رقم هاتف</span>
                )}
            </div>

            {/* Medical Info */}
            <div className="space-y-2.5 mb-6">
                {last_visit && (
                    <div className="flex items-center gap-3 text-xs p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-blue-100 dark:border-blue-900 group/row hover:border-blue-400 transition-colors">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400 font-bold" />
                        <span className="text-blue-900/60 dark:text-blue-100/60 font-black">آخر زيارة:</span>
                        <span className="font-black text-blue-900 dark:text-blue-100 mr-auto">{format(new Date(last_visit), 'dd/MM/yyyy', { locale: ar })}</span>
                    </div>
                )}

                {blood_type && (
                    <div className="flex items-center gap-3 text-xs p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 group/row hover:border-red-400 transition-colors">
                        <div className="h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center scale-90">
                            <Droplet className="h-3.5 w-3.5 font-black" />
                        </div>
                        <span className="text-red-900/60 dark:text-red-100/60 font-black">فصيلة الدم:</span>
                        <span className="font-black text-red-600 mr-auto">{blood_type}</span>
                    </div>
                )}

                {(allergies || chronic_diseases || medical_notes || last_diagnosis) && (
                    <div className="grid grid-cols-1 gap-2">
                        {allergies && (
                            <div className="flex items-start gap-3 text-xs p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900">
                                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                                <div className="flex-1">
                                    <span className="text-orange-900/60 dark:text-orange-100/60 font-black">حساسية:</span>
                                    <p className="font-black text-orange-700 dark:text-orange-400 mt-1">{allergies}</p>
                                </div>
                            </div>
                        )}
                        {chronic_diseases && (
                            <div className="flex items-start gap-3 text-xs p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
                                <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                                <div className="flex-1">
                                    <span className="text-purple-900/60 dark:text-purple-100/60 font-black">أمراض مزمنة:</span>
                                    <p className="font-black text-purple-700 dark:text-purple-400 mt-1">{chronic_diseases}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto pt-4 border-t border-blue-100 dark:border-blue-900/50">
                {hasPhone && (
                    <Button
                        variant="outline"
                        className="flex-1 gap-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all h-11 font-black rounded-2xl shadow-sm"
                        size="sm"
                        onClick={() => {
                            if (onOpenChat) {
                                onOpenChat(phone, name);
                            } else {
                                window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
                            }
                        }}
                    >
                        <MessageCircle className="h-4 w-4" />
                        محادثة
                    </Button>
                )}
                {hasPhone && onBookAppointment && (
                    <Button
                        className="flex-1 gap-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-200 dark:border-blue-800 transition-all h-11 font-black rounded-2xl"
                        size="sm"
                        onClick={() => onBookAppointment(phone, name)}
                    >
                        <Calendar className="h-4 w-4" />
                        حجز
                    </Button>
                )}
            </div>

            {/* Status Toggle */}
            <div className="flex bg-blue-50/50 dark:bg-blue-900/10 p-1.5 rounded-2xl gap-2 mt-4 border border-blue-100 dark:border-blue-900/50">
                {Object.keys(statusConfig).map((s) => (
                    <button
                        key={s}
                        onClick={() => onUpdateStatus(id, s)}
                        className={cn(
                            "flex-1 py-2 rounded-xl text-[10px] font-black transition-all",
                            status === s
                                ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-md scale-[1.05]"
                                : "text-blue-900/40 dark:text-blue-100/40 hover:text-blue-600 hover:bg-white/50"
                        )}
                    >
                        {statusConfig[s].label}
                    </button>
                ))}
            </div>
        </Card>
    );
};
