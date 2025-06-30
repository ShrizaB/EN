"use client"

import Link from "next/link"
import { BookOpen, Heart, Github, Linkedin, Instagram, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: "Github", href: "https://github.com/omsohom01", icon: Github },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/sohom-roy-9a9852291/", icon: Linkedin },
    { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  ]

  return (
    <>
      <footer className="relative bg-black border-t border-white/10 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-5 left-10 w-16 h-16 border border-white rounded-full animate-pulse"></div>
          <div className="absolute top-5 right-20 w-12 h-12 border border-white rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-5 left-1/4 w-8 h-8 border border-white rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-5 right-1/3 w-10 h-10 border border-white rounded-full animate-pulse animation-delay-3000"></div>
        </div>

        {/* Main Footer Content */}
        <div className="relative z-10 container mx-auto px-6 py-8">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="group">
                <Link href="/" className="flex items-center gap-3 w-fit">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-lg blur-xl group-hover:bg-white/30 transition-all duration-300"></div>
                  </div>
                  <span className="text-xl font-black tracking-widest text-white uppercase group-hover:text-white/90 transition-colors duration-300">
                    EduNova
                  </span>
                </Link>
              </div>
              
              <p className="text-white/70 text-xs leading-relaxed font-medium">
                AI-powered educational platform for modern learners.
              </p>

              {/* Contact Info */}
              <div className="flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-300 group">
                <Mail className="h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs font-medium">omsohom01@gmail.com</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-white font-black text-sm tracking-wide uppercase">
                Platform
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link href="/about" className="text-white/70 hover:text-white transition-colors duration-300 font-medium">
                  About Us
                </Link>
                <Link href="/features" className="text-white/70 hover:text-white transition-colors duration-300 font-medium">
                  Features
                </Link>
                <Link href="/privacy" className="text-white/70 hover:text-white transition-colors duration-300 font-medium">
                  Privacy
                </Link>
                <Link href="/terms" className="text-white/70 hover:text-white transition-colors duration-300 font-medium">
                  Terms
                </Link>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors duration-300 font-medium">
                  Contact
                </Link>
                <Link href="/help" className="text-white/70 hover:text-white transition-colors duration-300 font-medium">
                  Help
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-white font-black text-sm tracking-wide uppercase">
                Connect
              </h3>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-8 h-8 bg-[#181818] rounded-lg hover:bg-white hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    <social.icon className="h-4 w-4 text-white group-hover:text-black transition-colors duration-300" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            {/* Copyright */}
            <div className="flex items-center gap-2">
              <p className="text-white/70 text-xs font-medium">
                © {currentYear} EduNova. All rights reserved.
              </p>
            </div>

            {/* Made with Love */}
            <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
              <span>by EduNova Team</span>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .letter-spacing-wide {
          letter-spacing: 0.12em;
        }
      `}</style>
    </>
  )
}
