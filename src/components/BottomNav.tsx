
import { useState } from "react";
import {
    Home,
    Users,
    Plus,
    Search,
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AddPatientDialog } from "@/components/AddPatientDialog";

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onSearchClick?: () => void;
}

export function BottomNav({ activeTab, setActiveTab, onSearchClick }: BottomNavProps) {
    const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'الرئيسية', icon: Home },
        { id: 'contacts', label: 'المرضى', icon: Users },
        { id: 'add-patient', label: 'إضافة', icon: Plus, isSpecial: true },
        { id: 'search', label: 'بحث', icon: Search, isAction: true, action: onSearchClick },
        { id: 'patient-inquiry', label: 'السجلات', icon: FileText },
    ];

    return (
        <>
            <div className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl z-50 shadow-lg flex justify-around items-center px-2">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;

                    if (item.isSpecial) {
                        return (
                            <div key={item.id} className="relative -top-6">
                                <Button
                                    size="icon"
                                    className="h-14 w-14 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 shadow-[0_8px_30px_rgb(59,130,246,0.5)] border-4 border-background/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                                    onClick={() => setIsAddPatientOpen(true)}
                                >
                                    <Plus className="h-7 w-7 text-white group-hover:rotate-90 transition-transform duration-300" />
                                </Button>
                            </div>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'search' && item.action) {
                                    item.action();
                                } else {
                                    setActiveTab(item.id);
                                }
                            }}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 transition-all duration-300 relative p-2",
                                isActive ? "scale-110" : "opacity-70 hover:opacity-100"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-6 w-6 transition-all duration-300 stroke-[1.5]",
                                    isActive ? "text-blue-500 fill-blue-500/10 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] border-b-2 border-blue-500 pb-0.5" : "text-blue-400"
                                )}
                            />
                        </button>
                    );
                })}
            </div>

            <AddPatientDialog
                isOpen={isAddPatientOpen}
                onClose={() => setIsAddPatientOpen(false)}
                onSuccess={() => setActiveTab('contacts')}
            />
        </>
    );
}
