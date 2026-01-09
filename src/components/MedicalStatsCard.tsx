import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicalStatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    color?: "blue" | "green" | "orange" | "purple";
    trend?: "up" | "down" | "neutral";
    backgroundImage?: string;
}

const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    green: "bg-primary/10 text-primary border-primary/20",
    orange: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export function MedicalStatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "blue",
    trend = "neutral",
    backgroundImage
}: MedicalStatsCardProps) {
    return (
        <Card className="relative overflow-hidden p-4 md:p-8 transition-all duration-300 border border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/40 backdrop-blur-2xl rounded-[1.25rem] md:rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-2xl hover:shadow-blue-500/10 group h-full">
            {/* Background Image Layer */}
            {backgroundImage && (
                <div
                    className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            )}

            {/* White/Black Glass Overlay */}
            <div className={cn(
                "absolute inset-0 z-10 backdrop-blur-[2px] transition-all duration-300",
                backgroundImage ? "bg-white/80 dark:bg-black/70" : "bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent"
            )} />

            {/* Content Layer */}
            <div className="relative z-20 flex flex-row-reverse md:flex-col items-center justify-between md:justify-center gap-4 h-full">
                {/* Icon Container */}
                <div className={cn(
                    "p-3 md:p-6 rounded-xl md:rounded-[2rem] border transition-all duration-300 group-hover:scale-110 shadow-lg shrink-0",
                    color === "blue" ? "bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20 text-blue-600 dark:text-blue-400" :
                        color === "green" ? "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                            color === "orange" ? "bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/20 text-orange-600 dark:text-orange-400" :
                                "bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/20 text-purple-600 dark:text-purple-400"
                )}>
                    <Icon className="h-6 w-6 md:h-10 md:w-10 font-black" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-start md:items-center text-right md:text-center flex-1 min-w-0 space-y-0.5 md:space-y-1">
                    <p className="text-[10px] md:text-sm font-black text-muted-foreground/80 uppercase tracking-[0.1em] truncate w-full">{title}</p>
                    <div className="flex items-center">
                        <span className={cn(
                            "text-xl md:text-4xl font-black tracking-tight",
                            color === "blue" ? "text-blue-900 dark:text-blue-50" :
                                color === "green" ? "text-emerald-900 dark:text-emerald-50" :
                                    color === "orange" ? "text-orange-900 dark:text-orange-50" :
                                        "text-purple-900 dark:text-purple-50"
                        )}>
                            {value}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
