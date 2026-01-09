import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, FileText, Plus, Filter, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toastWithSound } from '@/lib/toast-with-sound';
import { appointmentsApi, dataApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import AddAppointmentDialog from './AddAppointmentDialog';
import CompleteAppointmentDialog from './CompleteAppointmentDialog';

interface Appointment {
    id: number;
    patient_name?: string; // Legacy
    customerName?: string; // New
    patient_name_new?: string; // Fallback helper if needed
    phone: string;
    appointment_date?: string; // Legacy
    appointmentDate?: string; // New
    duration: number;
    appointment_type?: string; // Legacy
    type?: string; // New
    appointmentType?: string; // Just in case
    status: string;
    notes: string;
    doctor_name?: string;
    doctorName?: string;
}

const statusConfig = {
    scheduled: { label: 'محجوز', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    confirmed: { label: 'مؤكد', color: 'bg-primary/10 text-primary border-primary/20' },
    completed: { label: 'مكتمل', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
    cancelled: { label: 'ملغي', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
    'no-show': { label: 'لم يحضر', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
};

const typeConfig = {
    consultation: 'استشارة',
    checkup: 'فحص دوري',
    followup: 'متابعة',
    emergency: 'طارئ',
};

export default function AppointmentsCalendar() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'today' | 'week'>('today');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedApt, setSelectedApt] = useState<any>(null);
    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

    useEffect(() => {
        loadAppointments();
    }, [filter]);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            let data;

            if (filter === 'today') {
                const today = new Date().toISOString().split('T')[0];
                data = await dataApi.get(`/appointments?date_from=${today}&date_to=${today}`);
            } else if (filter === 'week') {
                const today = new Date();
                const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                data = await dataApi.get(`/appointments?date_from=${today.toISOString()}&date_to=${weekLater.toISOString()}`);
            } else {
                data = await appointmentsApi.getAll();
            }

            setAppointments(data);
        } catch (error) {
            console.error('Error loading appointments:', error);
            toastWithSound.error('فشل تحميل المواعيد');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, newStatus: string, appointment?: any) => {
        if (newStatus === 'completed') {
            setSelectedApt(appointment);
            setIsCompleteDialogOpen(true);
            return;
        }

        try {
            await appointmentsApi.update(id, { status: newStatus });
            toastWithSound.success('تم تحديث حالة الموعد');
            loadAppointments();
        } catch (error) {
            console.error('Error updating status:', error);
            toastWithSound.error('فشل تحديث الحالة');
        }
    };

    const filteredAppointments = statusFilter === 'all'
        ? appointments
        : appointments.filter(apt => apt.status === statusFilter);

    const groupedByDate = filteredAppointments.reduce((acc, apt) => {
        const dateRaw = apt.appointmentDate || apt.appointment_date;
        if (!dateRaw) return acc;

        try {
            const dateObj = new Date(dateRaw);
            if (isNaN(dateObj.getTime())) return acc;

            const date = dateObj.toISOString().split('T')[0];
            if (!acc[date]) acc[date] = [];
            acc[date].push(apt);
        } catch (e) {
            console.error('Invalid date for appointment:', apt.id, dateRaw);
        }
        return acc;
    }, {} as Record<string, Appointment[]>);

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center gap-2">
                        <Calendar className="h-7 w-7 text-blue-600" />
                        المواعيد
                    </h2>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-bold opacity-80">إدارة وتتبع مواعيد المرضى اليومية والأسبوعية</p>
                </div>
                <Button
                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-xl shadow-blue-600/20 rounded-2xl h-11 px-6 transition-all hover:scale-105 active:scale-95 group font-black"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    حجز موعد جديد
                </Button>
            </div>

            <AddAppointmentDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSuccess={loadAppointments}
            />

            {/* Filters */}
            <Card className="p-4 border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl shadow-xl">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-800">
                            <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-black text-blue-900 dark:text-blue-100 uppercase tracking-wider">الفترة :</span>
                        <div className="flex gap-2 p-1 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800">
                            {[
                                { id: 'today', label: 'اليوم' },
                                { id: 'week', label: 'الأسبوع' },
                                { id: 'all', label: 'الكل' }
                            ].map((item) => (
                                <Button
                                    key={item.id}
                                    variant={filter === item.id ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setFilter(item.id as any)}
                                    className={cn(
                                        "h-8 px-4 rounded-lg text-xs font-black transition-all",
                                        filter === item.id
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-blue-600 dark:text-blue-400 hover:bg-blue-600/10"
                                    )}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="h-8 w-px bg-blue-200 dark:bg-blue-800 hidden md:block" />

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-blue-900 dark:text-blue-100 uppercase tracking-wider">الحالة :</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="text-xs font-black border-2 border-blue-100 dark:border-blue-800/50 rounded-xl px-4 py-2 bg-white/50 dark:bg-black/20 text-blue-900 dark:text-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        >
                            <option value="all">الكل</option>
                            <option value="scheduled">محجوز</option>
                            <option value="confirmed">مؤكد</option>
                            <option value="completed">مكتمل</option>
                            <option value="cancelled">ملغي</option>
                            <option value="no-show">لم يحضر</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Appointments List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-4">جاري التحميل...</p>
                </div>
            ) : Object.keys(groupedByDate).length === 0 ? (
                <Card className="p-12 text-center">
                    <Calendar className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-bold mb-2">لا توجد مواعيد</h3>
                    <p className="text-sm text-muted-foreground">لم يتم العثور على مواعيد في الفترة المحددة</p>
                </Card>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedByDate).map(([date, dayAppointments]) => (
                        <div key={date} className="relative">
                            <div className="flex items-center gap-4 mb-6 sticky top-0 z-10 py-2 bg-gradient-to-b from-blue-50/80 to-transparent dark:from-blue-950/80 backdrop-blur-sm px-4 -mx-4 rounded-b-3xl">
                                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/20">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-black text-blue-900 dark:text-blue-100 drop-shadow-sm">
                                    {format(new Date(date), 'EEEE، d MMMM yyyy', { locale: ar })}
                                </h3>
                                <div className="mr-auto px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-black">
                                    {dayAppointments.length} مواعيد
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {dayAppointments.map((appointment) => (
                                    <Card
                                        key={appointment.id}
                                        className="p-6 transition-all duration-300 border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-blue-500/10 rounded-[2rem] relative group overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="space-y-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-2 border-white dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-lg group-hover:scale-110 transition-transform">
                                                        <User className="h-6 w-6 font-black" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-lg text-blue-900 dark:text-blue-100 leading-tight">
                                                            {appointment.customerName || appointment.patient_name || 'بدون اسم'}
                                                        </h4>
                                                        <a
                                                            href={`tel:${appointment.phone.split('@')[0]}`}
                                                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1.5 mt-1 font-black"
                                                        >
                                                            <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center scale-75">
                                                                <Phone className="h-3 w-3" />
                                                            </div>
                                                            {appointment.phone.split('@')[0]}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "px-3 py-1 rounded-xl text-[10px] font-black border uppercase tracking-wider shadow-sm",
                                                    statusConfig[appointment.status as keyof typeof statusConfig]?.color
                                                )}>
                                                    {statusConfig[appointment.status as keyof typeof statusConfig]?.label}
                                                </div>
                                            </div>

                                            {/* Time & Type & Messaging */}
                                            <div className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/30 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <div className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400">
                                                        <Clock className="h-4 w-4" />
                                                        <span className="tabular-nums">{format(new Date(appointment.appointmentDate || appointment.appointment_date || ""), 'hh:mm a', { locale: ar })}</span>
                                                    </div>
                                                    <div className="h-4 w-px bg-blue-200 dark:bg-blue-800" />
                                                    <div className="text-[10px] font-black text-blue-900/60 dark:text-blue-100/60">
                                                        {typeConfig[(appointment.type || appointment.appointment_type) as keyof typeof typeConfig] || appointment.type || appointment.appointment_type}
                                                    </div>
                                                </div>

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 rounded-xl text-blue-600 hover:text-white hover:bg-blue-600 bg-white dark:bg-black/40 border border-blue-200 dark:border-blue-800 shadow-sm transition-all"
                                                    onClick={() => {
                                                        const cleanPhone = appointment.phone.split('@')[0].replace(/\D/g, '');
                                                        if (cleanPhone.length > 5) {
                                                            window.open(`https://wa.me/${cleanPhone}`, '_blank');
                                                        } else {
                                                            toastWithSound.error('رقم الهاتف غير صالح للمراسلة');
                                                        }
                                                    }}
                                                >
                                                    <MessageCircle className="h-5 w-5" />
                                                </Button>
                                            </div>

                                            {/* Notes */}
                                            {appointment.notes && (
                                                <div className="p-3 rounded-xl bg-orange-50/30 border border-orange-100/50 text-xs">
                                                    <div className="flex items-start gap-2">
                                                        <FileText className="h-3.5 w-3.5 text-orange-400 mt-0.5" />
                                                        <p className="text-muted-foreground leading-relaxed line-clamp-2 italic">
                                                            {appointment.notes}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="pt-2">
                                                {appointment.status === 'scheduled' && (
                                                    <div className="flex gap-3">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="flex-1 rounded-xl text-xs font-black border-blue-200 dark:border-blue-800 text-blue-600 hover:bg-blue-600 hover:text-white transition-all h-10"
                                                            onClick={() => updateStatus(appointment.id, 'confirmed')}
                                                        >
                                                            تأكيد الحجز
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="flex-1 rounded-xl text-xs font-black border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-500 hover:text-white transition-all h-10"
                                                            onClick={() => updateStatus(appointment.id, 'cancelled')}
                                                        >
                                                            إلغاء
                                                        </Button>
                                                    </div>
                                                )}
                                                {appointment.status === 'confirmed' && (
                                                    <Button
                                                        size="sm"
                                                        className="w-full h-11 rounded-xl font-black bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                                                        onClick={() => updateStatus(appointment.id, 'completed', appointment)}
                                                    >
                                                        ✅ تسجيل الحضور وإتمام الكشف
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CompleteAppointmentDialog
                isOpen={isCompleteDialogOpen}
                onClose={() => {
                    setIsCompleteDialogOpen(false);
                    setSelectedApt(null);
                }}
                appointment={selectedApt}
                onSuccess={() => {
                    loadAppointments();
                }}
            />
        </div>
    );
}
