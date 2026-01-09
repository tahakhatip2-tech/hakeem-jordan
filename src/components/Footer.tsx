import React from 'react';
import {
    Sparkles,
    Facebook,
    Instagram,
    Linkedin,
    Twitter
} from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-border/50 bg-card/30 backdrop-blur-md py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-3">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative group cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-20 animate-pulse group-hover:animate-[pulse_0.5s_ease-in-out_infinite]"></div>
                            <img
                                src="/logo.png"
                                alt="Al-Khatib Marketing Logo"
                                className="relative h-12 w-12 rounded-full border-2 border-primary/20 shadow-lg object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://alkhatib-marketing.great-site.net/favicon.ico';
                                }}
                            />
                        </div>


                        {/* Brand Name */}
                        <a
                            href="https://alkhatib-marketing.great-site.net/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                        >
                            <h2 className="text-base font-black tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent group-hover:from-accent group-hover:via-primary group-hover:to-accent transition-all duration-500">
                                AL-KHATIB-MARKETING&SOFTWARE
                            </h2>
                        </a>

                        {/* Tagline */}
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary/70 uppercase tracking-wider">
                            <Sparkles className="h-2.5 w-2.5 text-accent" />
                            Premium Digital Solutions
                        </div>
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
                                className="p-1.5 rounded-full border border-primary/30 text-primary transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg group"
                            >
                                <social.icon className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-[360deg]" />
                            </a>
                        ))}
                    </div>

                    {/* Description */}
                    <p className="text-center text-xs text-primary/60 max-w-2xl leading-relaxed">
                        نقدم حلولاً برمجية وتسويقية متكاملة، من تطوير الأنظمة وتطبيقات الويب إلى استراتيجيات التسويق الرقمي المتقدمة.
                    </p>

                    {/* Copyright */}
                    <div className="text-[10px] text-primary/40 text-center space-y-0.5">
                        <div>All Rights Reserved © 2026 Al-Khatib Software | Hakeem Jo v1.0</div>
                        <div className="italic">Crafted with Love in Jordan ❤️</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
