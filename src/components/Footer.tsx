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
                        {/* Hakeem Jordan Logo */}
                        <div className="relative group cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl blur opacity-30 animate-pulse group-hover:animate-[pulse_0.5s_ease-in-out_infinite]"></div>
                            <img
                                src="/hakeem-logo.png"
                                alt="Hakeem Jordan Logo"
                                className="relative h-16 w-16 rounded-2xl shadow-2xl object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/logo.png';
                                }}
                            />
                        </div>

                        {/* Hakeem Jordan Brand Name */}
                        <h2 className="text-lg font-black tracking-tight bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 bg-clip-text text-transparent">
                            HAKEEM JORDAN
                        </h2>
                        <p className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                            Clinic Management System
                        </p>

                        {/* Divider */}
                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-blue-600/30 to-transparent my-2"></div>

                        {/* Al-Khatib Signature */}
                        <a
                            href="https://alkhatib-marketing.great-site.net/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                        >
                            <h3 className="text-xs font-black tracking-tight bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:via-blue-600 group-hover:to-orange-500 transition-all duration-500">
                                AL-KHATIB-MARKETING&SOFTWARE
                            </h3>
                        </a>

                        {/* Tagline */}
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-600/70 uppercase tracking-wider">
                            <Sparkles className="h-2 w-2 text-orange-500" />
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
                                className="p-1.5 rounded-full border border-blue-600/30 text-blue-600 transition-all duration-300 hover:scale-110 hover:border-orange-500 hover:bg-gradient-to-r hover:from-blue-600 hover:to-orange-500 hover:text-white hover:shadow-lg group"
                            >
                                <social.icon className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-[360deg]" />
                            </a>
                        ))}
                    </div>

                </div>
            </div>
        </footer>
    );
}
