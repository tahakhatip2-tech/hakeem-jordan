import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, QrCode, Power, PowerOff, Loader2 } from 'lucide-react';
import { toastWithSound } from '@/lib/toast-with-sound';
import { cn } from '@/lib/utils';
import WhatsAppChat from '@/components/WhatsAppChat';
import { whatsappApi } from '@/lib/api';
import HeroSection from '@/components/HeroSection';

interface WhatsAppBotProps {
    initialPhone?: string | null;
    initialName?: string | null;
    doctorName?: string;
    onBackCleanup?: () => void;
}

export default function WhatsAppBot({ initialPhone, initialName, doctorName, onBackCleanup }: WhatsAppBotProps) {
    const [status, setStatus] = useState<{ connected: boolean; qrCode: string | null }>({ connected: false, qrCode: null });
    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any | null>(null);

    useEffect(() => {
        if (initialPhone) {
            // Normalize the initial phone for matching
            const cleanInitial = initialPhone.replace(/\D/g, '').replace(/^0+/, '');

            // Try to find exact or loose match
            const chat = chats.find(c => {
                if (!c.phone) return false;
                const cleanChatPhone = c.phone.replace(/\D/g, '').replace(/^0+/, '');

                // Critical check: Ensure valid lengths to avoid empty string matching
                if (cleanChatPhone.length < 5 || cleanInitial.length < 5) return false;

                // Check if one ends with the other (most robust for phone numbers with/without country codes)
                return cleanChatPhone.endsWith(cleanInitial) || cleanInitial.endsWith(cleanChatPhone);
            });

            if (chat) {
                // If found existing chat, update name if we have a better one
                if (initialName && chat.name !== initialName) {
                    // Just locally for now
                }
                setSelectedChat(chat);
            } else {
                // If no chat exists, create a temporary one to start conversation
                // Assume it's a new conversation
                // Normalize phone to international format (Jordan preference)
                let normalizedPhone = initialPhone.replace(/\D/g, '');
                if (normalizedPhone.startsWith('0')) normalizedPhone = '962' + normalizedPhone.substring(1);
                if (!normalizedPhone.startsWith('962') && normalizedPhone.length === 9) normalizedPhone = '962' + normalizedPhone;

                const tempChat = {
                    id: Date.now(), // Temporary ID
                    phone: normalizedPhone, // Use normalized phone for sending
                    name: initialName || initialPhone, // Use passed name or phone
                    unread_count: 0,
                    last_message: '',
                    last_message_time: new Date().toISOString(),
                    isTemp: true // Flag to indicate it's not from DB
                };
                setSelectedChat(tempChat);
            }
        }
    }, [initialPhone, chats]);

    useEffect(() => {
        checkStatus();
        loadChats();
        const interval = setInterval(() => {
            checkStatus();
            loadChats();
        }, 5000); // Poll every 5 seconds for status and chats
        return () => clearInterval(interval);
    }, []);

    const checkStatus = async () => {
        try {
            const data = await whatsappApi.getStatus();
            // console.log('[WhatsApp] Current Status:', data);
            setStatus(data);
        } catch (error) {
            console.error('Error checking status:', error);
        }
    };

    const loadChats = async () => {
        try {
            const data = await whatsappApi.getChats();
            setChats(data);
        } catch (error) {
            console.error('Error loading chats:', error);
        }
    };

    const handleConnect = async () => {
        setLoading(true);
        try {
            await whatsappApi.connect();
            toastWithSound.success('جاري بدء الاتصال... يرجى الانتظار');

            // The polling interval in useEffect will pick up the status change
            // But we keep the local loading state true until we see a change
            let attempts = 0;
            const checkInterval = setInterval(async () => {
                try {
                    const refreshedStatus = await whatsappApi.getStatus();
                    setStatus(refreshedStatus);
                    attempts++;

                    if (refreshedStatus.connected) {
                        clearInterval(checkInterval);
                        setLoading(false);
                        toastWithSound.success('تم الاتصال بنجاح!');
                    } else if (refreshedStatus.qrCode || attempts > 20) {
                        // Stop the local loading spinner once we have a QR or timeout
                        clearInterval(checkInterval);
                        setLoading(false);
                    }
                } catch (err) {
                    console.error('[WhatsApp] Status check failed during connect:', err);
                    attempts++;
                    if (attempts > 20) {
                        clearInterval(checkInterval);
                        setLoading(false);
                        toastWithSound.error('فشل التحقق من حالة الاتصال');
                    }
                }
            }, 2000);
        } catch (error: any) {
            toastWithSound.error(error.message);
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        try {
            await whatsappApi.disconnect();
            setStatus({ connected: false, qrCode: null });
            setSelectedChat(null);
            toastWithSound.success('تم قطع الاتصال');
        } catch (error: any) {
            toastWithSound.error(error.message);
        }
    };

    if (selectedChat) {
        return (
            <WhatsAppChat
                chat={selectedChat}
                onBack={() => {
                    setSelectedChat(null);
                    if (onBackCleanup) onBackCleanup();
                    loadChats();
                }}
            />
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <HeroSection
                doctorName={doctorName}
                pageTitle="مركز المحادثات المباشرة"
                description="تفعيل النظام والموظف الالي للرد على الرسائل"
                icon={MessageCircle}
                className="mb-8"
            >
                {status.connected ? (
                    <Button
                        onClick={handleDisconnect}
                        variant="outline"
                        className="gap-2 border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-500 hover:text-white rounded-md h-9 px-4 font-bold transition-all text-xs uppercase tracking-wider"
                    >
                        <PowerOff className="h-3.5 w-3.5" />
                        قطع الاتصال
                    </Button>
                ) : (
                    <Button
                        onClick={handleConnect}
                        disabled={loading}
                        className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-md h-9 px-6 font-bold transition-all hover:scale-105 text-xs uppercase tracking-wider"
                    >
                        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Power className="h-3.5 w-3.5" />}
                        {loading ? 'جاري الاتصال...' : 'بدء الاتصال بالنظام'}
                    </Button>
                )}
            </HeroSection>

            {/* Connection Status Card */}
            <Card className="p-8 border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

                <div className="flex items-center gap-6 relative z-10">
                    <div className={cn(
                        "h-16 w-16 rounded-3xl flex items-center justify-center shadow-xl transition-all",
                        status.connected
                            ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-green-500/20"
                            : "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-blue-500/20"
                    )}>
                        <MessageCircle className="h-8 w-8 font-black" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-black text-blue-900 dark:text-blue-100">حالة الاتصال بالنظام</h3>
                        <p className={cn(
                            "text-sm font-black mt-1 uppercase tracking-widest",
                            status.connected ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"
                        )}>
                            {status.connected ? '✅ النظام متصل ويعمل بنجاح' : '❌ بانتظار مسح كود الاتصال'}
                        </p>
                    </div>
                </div>

                {!status.connected && (
                    <div className="mt-8 p-8 bg-blue-50/50 dark:bg-blue-950/20 rounded-[2rem] border-2 border-dashed border-blue-200 dark:border-blue-800 text-center min-h-[350px] flex flex-col justify-center items-center relative z-10 transition-all">
                        {status.qrCode ? (
                            <div className="animate-in fade-in zoom-in duration-500">
                                <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                                    <QrCode className="h-6 w-6" />
                                </div>
                                <h4 className="text-lg font-black text-blue-950 dark:text-blue-50 mb-2">امسح الكود عبر واتساب</h4>
                                <p className="text-xs font-black text-blue-600 dark:text-blue-400 mb-6 max-w-sm mx-auto">
                                    افتح تطبيق واتساب على هاتفك ← الإعدادات ← الأجهزة المرتبطة ← ربط جهاز جديد
                                </p>
                                <div className="bg-white p-6 rounded-[2rem] inline-block shadow-2xl relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-[2.2rem] blur opacity-20 -z-10" />
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(status.qrCode)}`}
                                        alt="QR Code"
                                        className="w-48 h-48 rounded-xl"
                                    />
                                </div>
                            </div>
                        ) : loading ? (
                            <div className="space-y-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse" />
                                    <Loader2 className="h-16 w-16 animate-spin mx-auto text-blue-600 relative z-10" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-blue-900 dark:text-blue-100">جاري إنتاج كود الاتصال...</p>
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-2">يرجى الانتظار حوالي 30 ثانية</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 opacity-60">
                                <div className="h-20 w-20 rounded-full border-4 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center mx-auto">
                                    <QrCode className="h-10 w-10 text-blue-200 dark:text-blue-800" />
                                </div>
                                <p className="text-sm font-black text-blue-400">اضغط على زر البدء بالأعلى لبدء جلسة جديدة</p>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Chats List */}
            {status.connected && (
                <div className="mt-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <MessageCircle className="h-5 w-5" />
                        </div>
                        <h3 className="text-2xl font-black text-blue-950 dark:text-blue-50">المحادثات النشطة <span className="text-blue-600 opacity-60">({chats.length})</span></h3>
                    </div>

                    {chats.length === 0 ? (
                        <Card className="p-16 text-center border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem]">
                            <MessageCircle className="h-20 w-20 mx-auto text-blue-200 dark:text-blue-800 mb-6 opacity-50" />
                            <h4 className="text-lg font-black text-blue-900 dark:text-blue-100">لا توجد محادثات نشطة</h4>
                            <p className="text-sm text-blue-600/60 dark:text-blue-400/60 mt-2 font-black">ابدأ بإرسال رسالة من هاتفك لتظهر هنا</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {chats.map((chat) => (
                                <Card
                                    key={chat.id}
                                    className="p-6 border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[2rem] hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all cursor-pointer group relative overflow-hidden"
                                    onClick={() => setSelectedChat(chat)}
                                >
                                    <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/20 border-2 border-white dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-lg group-hover:scale-110 transition-transform">
                                            <div className="relative">
                                                <MessageCircle className="h-6 w-6 font-black" />
                                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-blue-950" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-black text-blue-950 dark:text-blue-50 truncate text-lg group-hover:text-blue-600 transition-colors">{chat.name || chat.phone}</h4>
                                            <p className="text-xs text-muted-foreground truncate">{chat.last_message}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                {new Date(chat.last_message_time).toLocaleString('ar-JO')}
                                            </p>
                                        </div>
                                        {chat.unread_count > 0 && (
                                            <span className="bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {chat.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
