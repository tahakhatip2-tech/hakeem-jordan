import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    MessageCircle,
    Shield,
    Users,
    FileText,
    Calendar,
    LineChart,
    ExternalLink,
    Sparkles,
    Facebook,
    Instagram,
    Linkedin,
    Twitter
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { whatsappApi, BASE_URL } from "@/lib/api";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
    const navigate = useNavigate();
    const { signOut, user } = useAuth();
    const [branding, setBranding] = useState({
        name: 'Hakeem Jo',
        description: 'Clinic Management System',
        logo: './logo.png'
    });

    useEffect(() => {
        const loadBranding = async () => {
            try {
                const settings = await whatsappApi.getSettings();
                if (settings.clinic_name || settings.clinic_description || settings.clinic_logo) {
                    setBranding({
                        name: settings.clinic_name || 'عيادتي',
                        description: settings.clinic_description || 'نظام إدارة العيادات',
                        logo: settings.clinic_logo ? (settings.clinic_logo.startsWith('http') ? settings.clinic_logo : `${BASE_URL}${settings.clinic_logo}`) : './logo.png'
                    });
                }
            } catch (error) {
                console.error('Error loading branding:', error);
            }
        };
        loadBranding();
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate("/auth");
    };

    const mainNavItems = [
        { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
        { id: 'whatsapp-bot', label: 'المحادثات', icon: MessageCircle },
        { id: 'contacts', label: 'المرضى', icon: Users },
        { id: 'appointments', label: 'المواعيد', icon: Calendar },
        { id: 'patient-inquiry', label: 'بوابة المرضى', icon: FileText },
        { id: 'bot-stats', label: 'الإحصائيات', icon: LineChart },
        { id: 'templates', label: 'الرسائل الجاهزة', icon: FileText },
    ];

    return (
        <div className="w-full h-full bg-white/10 dark:bg-black/20 backdrop-blur-[40px] border-l border-white/20 dark:border-white/10 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <img
                        src={branding.logo}
                        alt="Logo"
                        className="h-10 w-10 rounded-xl shadow-glow object-cover transition-all duration-500 hover:scale-110"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = './logo.png';
                        }}
                    />
                    <div className="overflow-hidden">
                        <h1 className="text-xl font-display font-black leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate max-w-[150px]">
                            {branding.name}
                        </h1>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tighter truncate">
                            {branding.description}
                        </p>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 px-4 pt-4 pb-4">
                <nav className="space-y-1">
                    {mainNavItems.map((item) => (
                        <Button
                            key={item.id}
                            variant={activeTab === item.id ? "secondary" : "ghost"}
                            className={cn(
                                "w-full flex-row-reverse justify-start gap-3 transition-all duration-300 relative overflow-hidden group mb-1",
                                activeTab === item.id
                                    ? "bg-white text-primary shadow-md font-black border-r-4 border-primary rounded-l-lg rounded-r-none translate-x-1"
                                    : "text-primary/70 font-medium hover:text-primary hover:bg-white/50 hover:font-bold hover:translate-x-1"
                            )}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 transition-transform duration-300",
                                activeTab === item.id ? "scale-110" : "group-hover:scale-110"
                            )} />
                            <span className="text-sm">{item.label}</span>
                        </Button>
                    ))}

                    {user?.role === 'admin' && (
                        <Button
                            variant="ghost"
                            className="w-full flex-row-reverse justify-start gap-3 text-amber-600 hover:text-amber-700 hover:bg-amber-50 mt-4"
                            onClick={() => navigate('/admin')}
                        >
                            <Shield className="h-4 w-4" />
                            لوحة الإدارة
                        </Button>
                    )}
                </nav>
            </ScrollArea>

            {/* Sidebar Footer - Brand & Socials */}
            <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-md">
                <div className="flex flex-col items-center gap-3">
                    {/* Logo */}
                    <a
                        href="https://alkhatib-marketing.great-site.net/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group cursor-pointer"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-20 animate-pulse group-hover:animate-[pulse_0.5s_ease-in-out_infinite]"></div>
                        <img
                            src="/logo.png"
                            alt="Al-Khatib Logo"
                            className="relative h-10 w-10 rounded-full border-2 border-primary/20 shadow-lg object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://alkhatib-marketing.great-site.net/favicon.ico';
                            }}
                        />
                    </a>

                    {/* Brand Name */}
                    <h2 className="text-xs font-black tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-center leading-tight">
                        AL-KHATIB-MARKETING&SOFTWARE
                    </h2>

                    {/* Tagline */}
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary/70 uppercase tracking-wider">
                        <Sparkles className="h-2 w-2 text-accent" />
                        Premium Digital Solutions
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center justify-center gap-2">
                        {[
                            { icon: Facebook, href: "https://www.facebook.com/alkhatib.marketing/" },
                            { icon: Instagram, href: "https://www.instagram.com/alkhatib.marketing/" },
                            { icon: Twitter, href: "https://twitter.com/alkhatib_mkt" },
                            { icon: Linkedin, href: "https://www.linkedin.com/company/alkhatib-marketing/" }
                        ].map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-full border border-primary/30 text-primary transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg group"
                            >
                                <social.icon className="h-3 w-3 transition-transform duration-500 group-hover:rotate-[360deg]" />
                            </a>
                        ))}
                    </div>

                    {/* Description */}
                    <p className="text-center text-[9px] text-primary/60 leading-relaxed">
                        نقدم حلولاً برمجية وتسويقية متكاملة، من تطوير الأنظمة وتطبيقات الويب إلى استراتيجيات التسويق الرقمي المتقدمة.
                    </p>

                    {/* Copyright */}
                    <div className="text-[8px] text-primary/40 text-center space-y-0.5">
                        <div>© 2026 Al-Khatib Software</div>
                        <div>Hakeem Jo v1.0</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
