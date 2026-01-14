import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Sparkles, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useClinicContext } from '@/context/ClinicContext';

interface HeroSectionProps {
    doctorName?: string;
    pageTitle: string;
    description?: string;
    icon?: LucideIcon;
    className?: string;
    stats?: any[];
    children?: React.ReactNode;
}

export function HeroSection({
    doctorName = "د. حكيم",
    pageTitle,
    description,
    icon: Icon = Sparkles,
    className,
    stats,
    children
}: HeroSectionProps) {
    const { settings } = useClinicContext();
    const brandingName = settings?.clinic_name || "HAKEEM";
    const brandingDesc = settings?.clinic_description || "Medical System";
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const dateString = currentTime.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
                "relative w-full mb-6 md:mb-12 overflow-hidden border-y border-white/5 group bg-slate-950",
                className
            )}
        >
            {/* 1. Ultra-Luxury Background Layering (Refined for Transparency) */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/10 to-transparent backdrop-blur-[6px]">
                {/* Image Base */}
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-cover bg-center pointer-events-none grayscale"
                    style={{ backgroundImage: 'url(/auth-bg-pro.png)' }}
                />

                {/* Advanced Medical Scanlines Utility */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,0,0,0.02),rgba(0,0,0,0.02),rgba(0,0,0,0.02))] bg-[length:100%_2px,3px_100%]" />

                {/* High-Tech Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

                {/* Dynamic Global Light Pulse (Subtle Professional Gradient) */}
                <motion.div
                    animate={{
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5"
                />
            </div>

            {/* 2. Content Layer (Refactored & Compressed) */}
            <div className="relative z-10 px-4 py-3 md:px-12 md:py-8 flex flex-col items-center md:items-start md:flex-row md:justify-between text-right overflow-hidden gap-4 md:gap-6">

                {/* BRANDING SECTION (Fixed) */}
                <div className="flex flex-col items-center md:items-start gap-1 relative flex-1 order-2 md:order-1 w-full">

                    {/* Ghost Branding (Background) */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.04 }}
                        className="absolute -top-6 -right-10 pointer-events-none select-none text-6xl md:text-8xl font-black italic uppercase tracking-tighter whitespace-nowrap leading-none transition-transform duration-1000 opacity-[0.03]"
                    >
                        {brandingName}
                    </motion.div>

                    {/* Dynamic Token */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 w-fit mb-2 md:mb-4 group/token hover:bg-white/10 transition-colors"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        <span className="text-[10px] font-bold text-blue-200 tracking-wider uppercase group-hover/token:text-blue-100 transition-colors">
                            {brandingDesc}
                        </span>
                    </motion.div>

                    {/* Typewriter Doctor Name Title */}
                    <div className="relative inline-block" key={`${doctorName}-${pageTitle}`}>
                        <div className="flex items-center">
                            <motion.h1
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "auto", opacity: 1 }}
                                transition={{
                                    width: { duration: 1.2, ease: "easeOut" },
                                    opacity: { duration: 0.3 }
                                }}
                                className="text-xl md:text-3xl font-black text-white tracking-tight leading-none italic uppercase group-hover:text-primary transition-colors duration-700 whitespace-nowrap overflow-hidden pr-1"
                            >
                                {doctorName}
                            </motion.h1>

                            <motion.span
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                className="inline-block w-[3px] h-[0.7em] bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
                            />
                        </div>

                        {/* Reflection with smooth reveal */}
                        <div className="absolute inset-0 pointer-events-none select-none flex items-center translate-y-[1px] opacity-20 overflow-hidden">
                            <motion.span
                                initial={{ width: 0 }}
                                animate={{ width: "auto" }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="text-xl md:text-3xl font-black text-white tracking-tight leading-none italic uppercase whitespace-nowrap"
                            >
                                {doctorName}
                            </motion.span>
                        </div>
                    </div>
                </div>

                {/* CLOCK SECTION (Transparent & Sleek) */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex order-1 md:order-2 self-center md:self-auto gap-3 items-center"
                >
                    {/* Patient Portal Button Removed as per request */}

                    <div className="relative p-3 md:p-5 bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-none shadow-2xl flex flex-col items-center justify-center gap-1 group/clock overflow-hidden min-w-[140px] md:min-w-[180px]">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover/clock:opacity-100 transition-opacity duration-1000" />

                        <div className="flex items-center gap-2 relative z-10">
                            <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary animate-pulse" />
                            <span className="text-xl md:text-3xl font-black font-mono tabular-nums text-primary tracking-tight leading-none drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                                {timeString}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 relative z-10 py-0.5 px-3 bg-white/5 border border-white/5 rounded-full mt-1">
                            <Calendar className="h-2.5 w-2.5 text-primary/60" />
                            <span className="text-[8px] md:text-[9px] font-black text-primary/80 uppercase tracking-[0.1em] whitespace-nowrap">
                                {dateString}
                            </span>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/50 origin-left scale-x-50 group-hover/clock:scale-x-100 transition-transform duration-700" />
                    </div>
                </motion.div>
            </div>

            {/* 3. NEW PAGE TITLE STRIP (Glass-Transparent) */}
            <div className="relative z-10 w-full border-t border-white/10 bg-gradient-to-r from-white/10 to-transparent backdrop-blur-[10px]">
                <div className="px-4 py-3 md:px-12 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-6 w-1 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.6)]" />
                        <div className="flex flex-col">
                            <motion.h2
                                key={pageTitle}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-sm md:text-lg font-black text-white uppercase tracking-tight leading-none"
                            >
                                {pageTitle === 'الرؤية الوطنية' ? 'رؤيتنا' : pageTitle}
                            </motion.h2>
                            {/* Modern Artistic Panel for Description */}
                            <div className="hidden md:flex mt-1 relative overflow-hidden group/desc">
                                <p className="text-[10px] font-bold text-muted-foreground/80 leading-none pl-2 border-l-2 border-primary/20 transition-all group-hover/desc:border-primary/60 group-hover/desc:text-primary/80 group-hover/desc:pl-3">
                                    {description || "نبدة لتطوير القطاع الصحي العام لتكون لوحة فنية عصرية"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Description (Optional/Hidden) or Breadcrumb */}
                    <div className="flex items-center gap-3">
                        {children}
                    </div>
                </div>
            </div>

            {/* 3. Ultra-Premium Bottom Accent Line */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 flex opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
            >
                <div className="h-[4px] w-1/3 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.8)]" />
                <div className="h-[4px] flex-1 bg-white/5" />
            </motion.div>

            {/* 4. Global Glass Overlay & Refraction */}
            <div className="absolute inset-0 pointer-events-none border-x border-white/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Interactive Light Refraction Slide */}
            <div className="light-sweep opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
        </motion.div>
    );
}

export default HeroSection;
