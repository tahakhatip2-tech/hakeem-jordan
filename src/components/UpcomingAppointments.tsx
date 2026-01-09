import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ChevronLeft } from "lucide-react";

interface Appointment {
    id: string;
    patientName: string;
    time: string;
    date?: string;
    type: string;
    status: "scheduled" | "confirmed" | "waiting";
}

interface UpcomingAppointmentsProps {
    appointments?: Appointment[];
    onViewAll?: () => void;
}

export function UpcomingAppointments({ appointments = [], onViewAll }: UpcomingAppointmentsProps) {
    const displayAppointments = appointments;

    return (
        <Card className="p-5 md:p-8 border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl">
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2.5 md:p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/20">
                        <Calendar className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg md:text-xl font-black text-blue-950 dark:text-blue-50">المواعيد القادمة</h3>
                        <p className="text-[10px] md:text-xs font-black text-blue-600 dark:text-blue-400 opacity-60">تتبع جدول الزيارات المحجوزة</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewAll}
                    className="text-blue-600 hover:text-white hover:bg-blue-600 rounded-xl px-4 font-black transition-all"
                >
                    عرض الكل
                    <ChevronLeft className="h-4 w-4 mr-1" />
                </Button>
            </div>

            <div className="space-y-4">
                {displayAppointments.map((appointment) => (
                    <div
                        key={appointment.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white/50 dark:bg-black/20 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 border border-blue-100 dark:border-blue-900/50 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/20 border-2 border-white dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-md group-hover:scale-110 transition-transform">
                                <User className="h-6 w-6 font-black" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <p className="font-black text-base text-blue-950 dark:text-blue-50 group-hover:text-blue-600 transition-colors leading-none">
                                    {appointment.patientName}
                                </p>
                                <div className="text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 uppercase tracking-wider inline-block w-fit">
                                    {appointment.type}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                            {appointment.date && (
                                <div className="flex items-center gap-2 text-xs font-black text-blue-600/60 dark:text-blue-400/60">
                                    <Calendar className="h-4 w-4" />
                                    <span>{appointment.date}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm tabular-nums">
                                <Clock className="h-4 w-4" />
                                <span>{appointment.time}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {displayAppointments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-blue-300 dark:text-blue-700 bg-blue-50/30 dark:bg-blue-950/20 rounded-[2rem] border-2 border-dashed border-blue-100 dark:border-blue-900/50">
                        <Calendar className="h-12 w-12 mb-4 opacity-50" />
                        <p className="text-sm font-black">لا توجد مواعيد قادمة</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
