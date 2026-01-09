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
        <Card className="relative overflow-hidden p-5 md:p-8 transition-all duration-300 border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 group h-full">
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

            {/* White Blur Overlay */}
            <div className={cn(
                "absolute inset-0 z-10 backdrop-blur-[2px] transition-all duration-300",
                backgroundImage ? "bg-white/90 dark:bg-black/80" : "bg-white/40 dark:bg-black/40"
            )} />

            {/* Content Layer */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center gap-4">
                <div className={cn(
                    "p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 transition-all duration-300 group-hover:scale-110 shadow-lg",
                    color === "blue" ? "bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400" :
                        color === "green" ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400" :
                            color === "orange" ? "bg-orange-50 dark:bg-orange-900/30 border-orange-100 dark:border-orange-800 text-orange-600 dark:text-orange-400" :
                                "bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-400"
                )}>
                    <Icon className="h-8 w-8 md:h-10 md:w-10 font-black" />
                </div>

                <div className="space-y-1">
                    <p className="text-sm font-bold text-muted-foreground/80 uppercase tracking-wider">{title}</p>
                    <div className="flex items-center justify-center">
                        <span className={cn(
                            "text-2xl md:text-4xl font-black tracking-tight",
                            color === "blue" ? "text-blue-900" :
                                color === "green" ? "text-emerald-900" :
                                    color === "orange" ? "text-orange-900" :
                                        "text-purple-900"
                        )}>
                            {value}
                        </span>
                    </div>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground font-medium bg-white/50 px-2 py-0.5 rounded-full inline-block mt-2">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}
