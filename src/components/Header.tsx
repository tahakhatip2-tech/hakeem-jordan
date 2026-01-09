import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    LogOut,
    Settings,
    Moon,
    Sun,
    ChevronDown,
    Clock,
    Calendar,
    Bell,
    LayoutDashboard,
    MessageCircle,
    Users,
    FileText,
    LineChart,
    CheckCircle2,
    Menu as MenuIcon,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/hooks/useTheme';
import { whatsappApi, appointmentsApi, BASE_URL } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface HeaderProps {
    onNavigate?: (path: string) => void;
    onTabChange?: (tab: string) => void;
    activeTab?: string;
    transparent?: boolean;
}

const Header = ({ onNavigate, onTabChange, activeTab, transparent }: HeaderProps) => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [settings, setSettings] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const loadHeaderData = async () => {
            try {
                const [settingsData, statsData] = await Promise.all([
                    whatsappApi.getSettings(),
                    appointmentsApi.getStats()
                ]);
                setSettings(settingsData);
                setStats(statsData);
            } catch (error) {
                console.error('Error fetching header data:', error);
            }
        };
        loadHeaderData();

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const clinicLogo = settings?.clinic_logo
        ? (settings.clinic_logo.startsWith('http') ? settings.clinic_logo : `${BASE_URL}${settings.clinic_logo}`)
        : '/logo.png';

    const clinicName = settings?.clinic_name || "نظام العيادة";
    const clinicDesc = settings?.clinic_description || "إدارة ذكية";

    // Format Date and Time in Arabic
    const timeString = currentTime.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const dateString = currentTime.toLocaleDateString('ar-EG', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    const navItems = [
        { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
        { id: 'whatsapp-bot', label: 'المحادثات', icon: MessageCircle },
        { id: 'contacts', label: 'المرضى', icon: Users },
        { id: 'appointments', label: 'المواعيد', icon: Calendar },
        { id: 'patient-inquiry', label: 'بوابة المرضى', icon: FileText },
        { id: 'bot-stats', label: 'الإحصائيات', icon: LineChart },
        { id: 'templates', label: 'النماذج', icon: FileText },
    ];

    return (
        <header className={`sticky top-0 z-50 w-full border-b-2 border-blue-600/30 transition-all duration-300 ${transparent ? 'bg-white/5 backdrop-blur-xl' : 'bg-background/40 backdrop-blur-2xl'} shadow-sm`}>
            <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 mx-auto max-w-7xl">

                {/* Mobile Layout: Unified Profile & Menu (Right) + Clinic Branding (Left) */}
                <div className="flex lg:hidden items-center justify-between w-full gap-2 min-w-0">
                    {/* Right Side: Merged Menu & Profile Dropdown */}
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="relative group outline-none active:scale-95 transition-all duration-300">
                                    {/* Profile Image with Blur Background */}
                                    <div className="relative">
                                        <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full blur-md opacity-20 group-hover:opacity-40 transition duration-500" />

                                        <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white overflow-hidden shadow-xl">
                                            {user?.avatar ?
                                                <img
                                                    src={user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}${user.avatar}`}
                                                    className="h-full w-full object-cover"
                                                /> :
                                                <User className="h-5 w-5" />
                                            }
                                        </div>

                                        {/* Integrated Hamburger Badge (Facebook Style) */}
                                        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-white dark:bg-blue-950 rounded-full flex flex-col items-center justify-center gap-0.5 border-2 border-blue-50 dark:border-blue-950 shadow-lg group-hover:scale-110 transition-transform">
                                            <div className="w-2.5 h-[1.5px] bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                                            <div className="w-1.5 h-[1.5px] bg-blue-600 dark:bg-blue-400 rounded-full self-center"></div>
                                            <div className="w-2.5 h-[1.5px] bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                                        </div>

                                        {/* Performance Dot (Green) */}
                                        <div className="absolute top-0.5 right-0.5 h-2.5 w-2.5 bg-green-500 border-2 border-white dark:border-blue-900 rounded-full animate-pulse shadow-sm" />
                                    </div>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-[calc(100vw-2rem)] sm:w-80 mt-4 p-2.5 rounded-[2rem] border-blue-200/50 dark:border-blue-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(37,99,235,0.2)] animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto scrollbar-hide"
                                sideOffset={8}
                            >
                                {/* Profile Header */}
                                <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl mb-3 flex items-center gap-4 border border-blue-400/20 shadow-lg shadow-blue-600/20">
                                    <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center text-white font-black text-xl border border-white/30 shadow-inner">
                                        {user?.name?.[0] || 'D'}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-black text-base text-white truncate leading-tight">{user?.name || 'Doctor Store'}</p>
                                        <p className="text-xs text-blue-100/80 font-bold uppercase tracking-widest">{user?.role === 'admin' ? 'مدير النظام' : 'طبيب'}</p>
                                    </div>
                                </div>

                                {/* Counters Section (New) */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 text-center flex flex-col items-center justify-center gap-0.5">
                                        <Users className="h-3.5 w-3.5 text-blue-200" />
                                        <p className="text-[14px] font-black text-white">{stats?.today_total || 0}</p>
                                        <p className="text-[8px] font-bold text-blue-100 opacity-60">مواعيد اليوم</p>
                                    </div>
                                    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 text-center flex flex-col items-center justify-center gap-0.5">
                                        <Clock className="h-3.5 w-3.5 text-orange-200" />
                                        <p className="text-[14px] font-black text-white">{stats?.today_waiting || 0}</p>
                                        <p className="text-[8px] font-bold text-blue-100 opacity-60">في الانتظار</p>
                                    </div>
                                    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 text-center flex flex-col items-center justify-center gap-0.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-200" />
                                        <p className="text-[14px] font-black text-white">{stats?.today_completed || 0}</p>
                                        <p className="text-[8px] font-bold text-blue-100 opacity-60">تم الفحص</p>
                                    </div>
                                </div>

                                {/* Navigation Section (Mobile Only) */}
                                <div className="space-y-1 mb-3">
                                    <div className="flex items-center justify-between px-3 pb-2">
                                        <DropdownMenuLabel className="p-0 text-[10px] uppercase font-black tracking-widest text-blue-600 dark:text-blue-400/60 opacity-60">
                                            التنقل السريع
                                        </DropdownMenuLabel>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {navItems.map((item) => (
                                            <DropdownMenuItem
                                                key={item.id}
                                                onSelect={() => onTabChange && onTabChange(item.id)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer group/item text-center gap-1.5",
                                                    activeTab === item.id
                                                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25"
                                                        : "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 text-blue-900 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-800/30"
                                                )}
                                            >
                                                <item.icon className={cn(
                                                    "h-5 w-5 transition-transform group-hover/item:scale-110",
                                                    activeTab === item.id ? "text-white" : "text-blue-600 dark:text-blue-400"
                                                )} />
                                                <span className="text-[10px] font-black">{item.label}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </div>
                                </div>

                                <DropdownMenuSeparator className="bg-blue-100/50 dark:bg-blue-900/50 my-2" />

                                {/* Management Actions (Card Style) */}
                                <div className="space-y-1 mb-2">
                                    <div className="flex items-center justify-between px-3 pb-1.5">
                                        <DropdownMenuLabel className="p-0 text-[10px] uppercase font-black tracking-widest text-blue-600 dark:text-blue-400/60 opacity-60">
                                            الإدارة والإعدادات
                                        </DropdownMenuLabel>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <DropdownMenuItem
                                            onSelect={() => onNavigate ? onNavigate('/profile') : navigate('/profile')}
                                            className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-blue-100 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-all cursor-pointer group/item text-center gap-1.5 focus:bg-blue-100 dark:focus:bg-blue-800/40"
                                        >
                                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-transform" />
                                            <span className="text-[9px] font-black whitespace-nowrap">حسابي</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onSelect={() => onTabChange && onTabChange('clinic-settings')}
                                            className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-blue-100 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-all cursor-pointer group/item text-center gap-1.5 focus:bg-blue-100 dark:focus:bg-blue-800/40"
                                        >
                                            <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-transform" />
                                            <span className="text-[9px] font-black whitespace-nowrap">الإعدادات</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onSelect={() => signOut()}
                                            className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 text-red-900 dark:text-red-100 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all cursor-pointer group/item text-center gap-1.5 focus:bg-red-100 dark:focus:bg-red-900/40"
                                        >
                                            <LogOut className="h-5 w-5 text-red-600 dark:text-red-400 group-hover/item:scale-110 transition-transform" />
                                            <span className="text-[9px] font-black whitespace-nowrap">خروج</span>
                                        </DropdownMenuItem>
                                    </div>
                                </div>

                                <div className="px-1 py-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full h-10 gap-3 rounded-2xl text-blue-600/60 dark:text-blue-400/60 font-black text-[11px] hover:bg-blue-50/50 border border-transparent hover:border-blue-100/50 transition-all"
                                        onClick={toggleTheme}
                                    >
                                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                        </div>
                                        {theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
                                    </Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Left Side: Dynamic Clinic Branding */}
                    <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                        <div className="flex flex-col items-end leading-none translate-y-0.5 min-w-0">
                            <h1 className="text-xs font-black tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent truncate w-full text-right">
                                {clinicName}
                            </h1>
                            <p className="text-[8px] text-blue-600 dark:text-blue-400 font-bold opacity-70 truncate w-full text-right">{clinicDesc}</p>
                        </div>
                        <div className="h-8 w-8 relative flex-shrink-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-20"></div>
                            <img
                                src={clinicLogo}
                                alt="Logo"
                                className="relative h-full w-full object-contain drop-shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop Layout: Original Structure */}
                <div className="hidden lg:flex items-center justify-between w-full">
                    {/* 1. Actions & Unified Profile (Right side in RTL) */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Notification Bell */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full h-10 w-10 hover:bg-blue-50 dark:hover:bg-blue-950/20 relative transition-all"
                                >
                                    <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 border-2 border-background"></span>
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl border-blue-100 dark:border-blue-900" sideOffset={8}>
                                <div className="flex items-center justify-between px-4 py-3 border-b border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
                                    <h4 className="font-bold text-sm text-blue-900 dark:text-blue-100">الإشعارات</h4>
                                    {unreadCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="xs"
                                            className="h-6 text-[10px] text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                            onClick={() => markAllAsRead.mutate()}
                                        >
                                            تحديد الكل كمقروء
                                        </Button>
                                    )}
                                </div>
                                <ScrollArea className="h-[300px]">
                                    {notifications?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                                            <Bell className="h-8 w-8 mb-2 opacity-20" />
                                            <p className="text-xs">لا توجد إشعارات جديدة</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col p-1">
                                            {notifications?.slice(0, 10).map((notification) => (
                                                <DropdownMenuItem
                                                    key={notification.id}
                                                    className={`flex flex-col items-start gap-1 p-3 cursor-pointer rounded-lg mb-1 focus:bg-muted ${!notification.is_read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
                                                    onSelect={() => {
                                                        if (!notification.is_read) markAsRead.mutate(notification.id);
                                                    }}
                                                >
                                                    <div className="flex items-start w-full gap-3">
                                                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!notification.is_read ? 'bg-blue-600' : 'bg-transparent'}`} />
                                                        <div className="flex-1 space-y-1">
                                                            <p className={`text-xs leading-none ${!notification.is_read ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                                                                {notification.title}
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground line-clamp-2">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-[9px] text-muted-foreground/50 pt-1">
                                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ar })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </DropdownMenuItem>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="rounded-full h-10 w-10 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all active:scale-90 relative group"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5 text-orange-400" /> : <Moon className="h-5 w-5 text-blue-600" />}
                            <span className="absolute -bottom-1 -left-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                            </span>
                        </Button>

                        <div className="h-8 w-[1px] bg-blue-200 dark:bg-blue-800" />

                        {/* Desktop Profile Pill */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/40 dark:hover:to-blue-800/30 transition-all duration-500 group outline-none border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-md hover:shadow-lg active:scale-95">
                                    <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />

                                    <div className="flex flex-col items-start mr-1 text-right">
                                        <span className="text-[10px] text-blue-600/70 dark:text-blue-400/70 font-bold uppercase tracking-tighter mb-0.5">
                                            مرحباً بك
                                        </span>
                                        <span className="text-[13px] font-black text-blue-900 dark:text-blue-100 leading-tight">
                                            {user?.name ? (user.name.includes('د.') || user.name.startsWith('د ') ? user.name : `د. ${user.name}`) : "دكتور"}
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition duration-500" />
                                        <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white overflow-hidden shadow-xl ring-2 ring-blue-200 dark:ring-blue-800 group-hover:ring-blue-300 dark:group-hover:ring-blue-700 transition-all">
                                            {user?.avatar ?
                                                <img
                                                    src={user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}${user.avatar}`}
                                                    className="h-full w-full object-cover"
                                                /> :
                                                <User className="h-5 w-5" />
                                            }
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full animate-pulse" />
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-64 mt-4 p-2 rounded-2xl border-blue-200 dark:border-blue-800 bg-card/95 backdrop-blur-3xl shadow-[0_20px_60px_rgba(37,99,235,0.15)] animate-in fade-in zoom-in-95"
                                sideOffset={8}
                            >
                                <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl mb-2 flex items-center gap-3 border border-blue-200 dark:border-blue-800">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {user?.name?.[0] || 'D'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-blue-900 dark:text-blue-100">{user?.name || 'Doctor Store'}</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">{user?.role === 'admin' ? 'مدير النظام' : 'طبيب'}</p>
                                    </div>
                                </div>

                                <DropdownMenuSeparator className="bg-blue-100 dark:bg-blue-900 my-1" />

                                <DropdownMenuItem
                                    onSelect={() => onNavigate ? onNavigate('/profile') : navigate('/profile')}
                                    className="rounded-xl focus:bg-blue-50 dark:focus:bg-blue-950/20 focus:text-blue-700 dark:focus:text-blue-300 cursor-pointer gap-3 py-2.5 text-sm font-bold group"
                                >
                                    <div className="p-1.5 rounded-lg bg-background border border-blue-200 dark:border-blue-800 group-hover:border-blue-400 dark:group-hover:border-blue-600 transition-colors">
                                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    حسابي
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onSelect={() => onTabChange && onTabChange('clinic-settings')}
                                    className="rounded-xl focus:bg-blue-50 dark:focus:bg-blue-950/20 focus:text-blue-700 dark:focus:text-blue-300 cursor-pointer gap-3 py-2.5 text-sm font-bold group"
                                >
                                    <div className="p-1.5 rounded-lg bg-background border border-blue-200 dark:border-blue-800 group-hover:border-blue-400 dark:group-hover:border-blue-600 transition-colors">
                                        <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    إعدادات النظام
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onSelect={() => onTabChange && onTabChange('dashboard')}
                                    className="rounded-xl focus:bg-blue-50 dark:focus:bg-blue-950/20 focus:text-blue-700 dark:focus:text-blue-300 cursor-pointer gap-3 py-2.5 text-sm font-bold group"
                                >
                                    <div className="p-1.5 rounded-lg bg-background border border-blue-200 dark:border-blue-800 group-hover:border-blue-400 dark:group-hover:border-blue-600 transition-colors">
                                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    كل الواجهات
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-blue-100 dark:bg-blue-900 my-2" />

                                <div className="p-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start gap-2 rounded-xl mb-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-700"
                                        onClick={toggleTheme}
                                    >
                                        {theme === 'dark' ? <Sun className="h-4 w-4 text-blue-600" /> : <Moon className="h-4 w-4 text-blue-600" />}
                                        <span>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="w-full justify-start gap-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:border-red-300"
                                        onClick={() => signOut()}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>تسجيل الخروج</span>
                                    </Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* 2. Professional Real-time Dynamic Clock (Center) */}
                    <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 px-6 py-2 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-md">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-blue-600 shadow-lg">
                                <Clock className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-black font-mono tabular-nums leading-none min-w-[90px] text-center text-blue-900 dark:text-blue-100">
                                {timeString}
                            </span>
                        </div>
                        <div className="h-6 w-[2px] bg-blue-300 dark:bg-blue-700 rounded-full" />
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-blue-600 shadow-lg">
                                <Calendar className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-xs font-bold leading-none text-blue-800 dark:text-blue-200">
                                {dateString}
                            </span>
                        </div>
                    </div>

                    {/* 3. Branding (Left side in RTL) */}
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end leading-none">
                            <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                {clinicName}
                            </h1>
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{clinicDesc}</p>
                        </div>
                        <div className="h-10 w-10 relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-20"></div>
                            <img
                                src={clinicLogo}
                                alt="Logo"
                                className="relative h-full w-full object-contain drop-shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
