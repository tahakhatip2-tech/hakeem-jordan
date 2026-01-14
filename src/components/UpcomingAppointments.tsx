import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: "spring" as const, stiffness: 300, damping: 24 }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="px-4"
        >
            <Card className="p-4 md:p-6 border border-white/10 bg-white/[0.08] backdrop-blur-[80px] rounded-none shadow-2xl overflow-hidden relative group transition-all duration-700">
                <div className="">
                    {/* 1. Ultra-Premium Light Sweep */}
                    <div className="light-sweep" />

                    <div className="flex items-center justify-between mb-8 md:mb-12 relative z-10">
                        <div className="flex items-center gap-4">
                            <motion.div
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-12 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)] origin-top"
                            />
                            <div>
                                <h3 className="text-xl md:text-3xl font-black text-foreground tracking-tighter italic uppercase leading-none">المواعيد القادمة</h3>
                                <p className="text-[9px] md:text-[11px] font-black text-primary uppercase tracking-[0.3em] mt-2 opacity-70">Visit Schedule Analytics</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onViewAll}
                            className="h-10 px-8 font-black text-primary hover:bg-primary/10 transition-all text-[10px] uppercase tracking-[0.2em] border border-primary/20 backdrop-blur-md"
                        >
                            عرض الكل
                            <ChevronLeft className="h-4 w-4 mr-1" />
                        </Button>
                    </div>

                    {/* List Header Accent */}
                    <div className="hidden md:flex items-center gap-4 mb-6 opacity-20 px-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-12">Patient Detail</span>
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-12">Schedule</span>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3 relative z-10"
                    >
                        {displayAppointments.map((appointment) => (
                            <motion.div
                                key={appointment.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01, x: 5 }}
                                className="group/item flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-primary/40 transition-all duration-700 cursor-pointer relative overflow-hidden"
                            >
                                <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between">
                                    {/* Item Hover Light Sweep */}
                                    <div className="light-sweep opacity-30" />

                                    <div className="flex items-center gap-6 mb-4 sm:mb-0 relative z-10">
                                        <div className="h-14 w-1 flex bg-primary/20 group-hover/item:bg-primary group-hover/item:h-full transition-all duration-700 self-stretch" />
                                        <div className="h-14 w-14 bg-blue-950/40 flex items-center justify-center text-primary border border-white/10 shadow-lg group-hover/item:scale-105 transition-transform">
                                            <User className="h-7 w-7" strokeWidth={2} />
                                        </div>
                                        <div className="flex flex-col gap-1.5 text-right">
                                            <p className="font-black text-lg md:text-xl text-foreground group-hover/item:text-primary transition-colors italic uppercase tracking-tighter leading-none">
                                                {appointment.patientName}
                                            </p>
                                            <div className="text-[9px] font-black px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary uppercase tracking-[0.15em] inline-block w-fit">
                                                {appointment.type}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-10 w-full sm:w-auto relative z-10">
                                        {appointment.date && (
                                            <div className="flex flex-col items-end gap-0.5">
                                                <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">Scheduled Date</span>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-foreground/60 uppercase tracking-widest">
                                                    <Calendar className="h-3.5 w-3.5 text-primary opacity-50" />
                                                    <span>{appointment.date}</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 text-base font-black text-primary bg-primary/10 px-6 py-3 border border-primary/30 tabular-nums italic shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                                            <motion.div
                                                animate={{ rotate: [0, 10, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <Clock className="h-5 w-5" strokeWidth={3} />
                                            </motion.div>
                                            <span>{appointment.time}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Architectural Bottom Glow Line */}
                                <div className="absolute bottom-0 left-0 w-full flex scale-x-0 group-hover/item:scale-x-100 transition-transform duration-700 origin-right">
                                    <div className="h-[2px] w-full bg-primary" />
                                </div>
                            </motion.div>
                        ))}

                        {displayAppointments.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/5 bg-white/[0.01] animate-in fade-in zoom-in duration-1000">
                                <Calendar className="h-20 w-20 text-blue-900/20 mb-6" />
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-30 italic">No scheduled operations detected</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Bottom Professional "Power Line" */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="absolute bottom-0 left-0 flex opacity-30 group-hover:opacity-100 transition-opacity duration-1000"
                    >
                        <div className="h-[3px] w-1/4 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.6)]" />
                        <div className="h-[3px] flex-1 bg-white/5" />
                    </motion.div>

                    {/* Top Shine */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
            </Card>
        </motion.div>
    );
}
