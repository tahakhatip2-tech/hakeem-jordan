import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

interface AutoReplyToggleProps {
    isActive?: boolean;
    onToggle?: (active: boolean) => void;
}

export function AutoReplyToggle({ isActive = true }: AutoReplyToggleProps) {
    const active = true; // Hardcoded to always active as per user request

    return (
        <Card className={cn(
            "p-6 border-border/50 backdrop-blur-sm transition-all duration-500",
            "bg-primary/5 shadow-[0_0_20px_rgba(29,78,216,0.1)]"
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "p-3 rounded-xl border transition-colors duration-500",
                        "bg-primary/10 border-primary/20"
                    )}>
                        <MessageCircle className={cn(
                            "h-6 w-6",
                            "text-primary"
                        )} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-1">سكرتير العيادة</h3>
                        <p className="text-sm text-muted-foreground">
                            نشط - يعمل على خدمة المرضى وتنظيم المواعيد على مدار الساعة
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="default" className={cn(
                        "px-3 py-1 transition-all duration-500",
                        "bg-primary hover:bg-primary/90 text-white"
                    )}>
                        🟢 نشط
                    </Badge>
                </div>
            </div>
        </Card>
    );
}
