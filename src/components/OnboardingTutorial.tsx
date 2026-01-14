import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, CheckCircle2, MessageCircle, Zap, Shield, Gift, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface OnboardingTutorialProps {
    onComplete: () => void;
    onSkip: () => void;
}

interface TutorialStep {
    id: number;
    type: 'welcome' | 'guide' | 'success';
    title: string;
    description: string;
    features?: { icon: any; text: string; color: string }[];
    action?: string;
    targetElement?: string;
}

const OnboardingTutorial = ({ onComplete, onSkip }: OnboardingTutorialProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const steps: TutorialStep[] = [
        {
            id: 1,
            type: 'welcome',
            title: 'مرحباً بك في حكيم جوردان',
            description: 'نظام إدارة العيادات الذكي الأول في الأردن',
            features: [
                { icon: Gift, text: 'تجربة مجانية لمدة 7 أيام', color: 'text-orange-400' },
                { icon: Shield, text: 'جميع المميزات متاحة بالكامل', color: 'text-blue-400' },
                { icon: Zap, text: 'سكرتير آلي ذكي يعمل 24/7', color: 'text-green-400' },
                { icon: Clock, text: 'إدارة تلقائية للمواعيد والحجوزات', color: 'text-purple-400' },
                { icon: MessageCircle, text: 'ردود فورية على استفسارات المرضى', color: 'text-pink-400' }
            ],
            action: 'ابدأ الجولة التعريفية'
        },
        {
            id: 2,
            type: 'guide',
            title: 'الخطوة 1: افتح قائمة المحادثات',
            description: 'اضغط على زر "المحادثات" في القائمة الجانبية لربط حساب الواتساب',
            targetElement: 'whatsapp-bot',
            action: 'فهمت، التالي'
        },
        {
            id: 3,
            type: 'guide',
            title: 'الخطوة 2: اربط حساب الواتساب',
            description: 'امسح رمز QR بكاميرا هاتفك لربط حسابك وتفعيل السكرتير الآلي',
            action: 'التالي'
        },
        {
            id: 4,
            type: 'success',
            title: 'مبروك! 🎊',
            description: 'الآن السكرتير الآلي جاهز لإدارة عيادتك',
            features: [
                { icon: CheckCircle2, text: 'سيرد على جميع الرسائل فوراً', color: 'text-green-400' },
                { icon: CheckCircle2, text: 'سيحجز المواعيد بشكل تلقائي', color: 'text-blue-400' },
                { icon: CheckCircle2, text: 'سيرسل تذكيرات للمرضى', color: 'text-orange-400' },
                { icon: CheckCircle2, text: 'ستحصل على تقارير يومية', color: 'text-purple-400' }
            ],
            action: 'ابدأ الاستخدام الآن'
        }
    ];

    const currentStepData = steps[currentStep];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        setTimeout(() => {
            onComplete();
        }, 300);
    };

    const handleSkipTutorial = () => {
        setIsVisible(false);
        setTimeout(() => {
            onSkip();
        }, 300);
    };

    // Highlight target element
    useEffect(() => {
        if (currentStepData.targetElement) {
            const element = document.querySelector(`[data-nav-id="${currentStepData.targetElement}"]`);
            if (element) {
                element.classList.add('tutorial-highlight');
                return () => {
                    element.classList.remove('tutorial-highlight');
                };
            }
        }
    }, [currentStep, currentStepData.targetElement]);

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gradient-to-br from-black/70 via-blue-950/60 to-black/70 backdrop-blur-md z-[100]"
                        onClick={handleSkipTutorial}
                    />

                    {/* Tutorial Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-3xl px-4"
                    >
                        <Card className="relative overflow-hidden border-2 border-white/10 shadow-[0_0_80px_rgba(59,130,246,0.3)] bg-gradient-to-br from-blue-950/98 via-blue-900/98 to-blue-950/98 backdrop-blur-2xl rounded-3xl">
                            {/* Animated Background Elements */}
                            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />

                            {/* Close Button */}
                            <button
                                onClick={handleSkipTutorial}
                                className="absolute top-6 left-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 z-10 group"
                                aria-label="إغلاق"
                            >
                                <X className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                            </button>

                            <div className="relative p-8 md:p-14">
                                {/* Step Indicator */}
                                <div className="flex items-center justify-center gap-2.5 mb-8">
                                    {steps.map((_, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: index === currentStep ? 1 : 0.8 }}
                                            className={`h-2.5 rounded-full transition-all duration-500 ${index === currentStep
                                                    ? 'w-12 bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg shadow-orange-500/50'
                                                    : index < currentStep
                                                        ? 'w-2.5 bg-gradient-to-r from-blue-500 to-blue-400'
                                                        : 'w-2.5 bg-white/20'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Content */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-center"
                                    >
                                        {/* Icon */}
                                        <div className="flex justify-center mb-8">
                                            {currentStepData.type === 'welcome' && (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: 'spring', damping: 15 }}
                                                    className="relative"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-full blur-2xl opacity-60 animate-pulse" />
                                                    <div className="relative bg-gradient-to-br from-blue-500 to-orange-500 p-6 rounded-full">
                                                        <Sparkles className="h-12 w-12 text-white" />
                                                    </div>
                                                </motion.div>
                                            )}
                                            {currentStepData.type === 'guide' && currentStep === 1 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', damping: 15 }}
                                                    className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-full shadow-lg shadow-blue-500/50"
                                                >
                                                    <MessageCircle className="h-12 w-12 text-white" />
                                                </motion.div>
                                            )}
                                            {currentStepData.type === 'guide' && currentStep === 2 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', damping: 15 }}
                                                    className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-full shadow-lg shadow-orange-500/50"
                                                >
                                                    <Zap className="h-12 w-12 text-white" />
                                                </motion.div>
                                            )}
                                            {currentStepData.type === 'success' && (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: 'spring', damping: 15 }}
                                                    className="relative"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full blur-2xl opacity-60 animate-pulse" />
                                                    <div className="relative bg-gradient-to-br from-green-500 to-blue-500 p-6 rounded-full">
                                                        <CheckCircle2 className="h-12 w-12 text-white" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <motion.h2
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
                                        >
                                            {currentStepData.title}
                                        </motion.h2>

                                        {/* Description */}
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-xl text-blue-200/90 mb-8 leading-relaxed max-w-2xl mx-auto"
                                        >
                                            {currentStepData.description}
                                        </motion.p>

                                        {/* Features List */}
                                        {currentStepData.features && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-3xl mx-auto">
                                                {currentStepData.features.map((feature, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.3 + index * 0.1 }}
                                                        className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                                                    >
                                                        <div className={`${feature.color} bg-white/10 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                                                            <feature.icon className="h-6 w-6" />
                                                        </div>
                                                        <span className="text-white text-base font-medium text-right flex-1">{feature.text}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Action Button */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                                        >
                                            <Button
                                                onClick={handleNext}
                                                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 text-white font-bold px-10 py-7 text-lg rounded-2xl shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300 border-0 hover:scale-105"
                                            >
                                                <span className="flex items-center gap-3">
                                                    {currentStepData.action}
                                                    <ArrowRight className="h-6 w-6" />
                                                </span>
                                            </Button>
                                            {currentStep === 0 && (
                                                <button
                                                    onClick={handleSkipTutorial}
                                                    className="text-sm text-blue-300/80 hover:text-white transition-colors duration-300 underline underline-offset-4"
                                                >
                                                    تخطي الجولة التعريفية
                                                </button>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Arrow Pointer for Guide Steps */}
                    {currentStepData.type === 'guide' && currentStepData.targetElement && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="fixed z-[102] pointer-events-none hidden lg:block"
                            style={{
                                top: '50%',
                                right: '320px',
                                transform: 'translateY(-50%)'
                            }}
                        >
                            <motion.div
                                animate={{
                                    x: [0, -15, 0],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                                className="flex items-center gap-3"
                            >
                                <div className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                                    اضغط هنا
                                </div>
                                <ArrowRight className="h-10 w-10 text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                            </motion.div>
                        </motion.div>
                    )}
                </>
            )}
        </AnimatePresence>
    );
};

export default OnboardingTutorial;
