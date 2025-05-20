'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Rocket, Gamepad2, BookOpen, Award } from 'lucide-react';
import './cta-animations.css';

const CtaSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Create glowing strings
  const glowingStrings = Array.from({ length: 12 }).map((_, i) => ({
    id: `string-${i}`,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 150 + 50}px`,
    height: `${Math.random() * 5 + 2}px`,
    rotation: Math.random() * 180,
    opacity: Math.random() * 0.3 + 0.1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  }));

  // Background images data
  const images = [
    {
      id: 1,
      src: 'https://i.postimg.cc/cCq8yXyQ/59f5964a930539fc26650d8c917fdc4a.png', 
      className: 'z-20 absolute bottom-0 left-4 md:left-8 w-[180px] h-[400px] object-cover opacity-60 floating-element'
    },
    {
      id: 2,
      src: 'https://i.postimg.cc/TY2GCgB1/d4efd630671c3721210611ad172ea772.png', 
      className: 'z-0 absolute bottom-0 left-8 md:left-44 w-[280px] h-[330px] object-cover opacity-60 floating-element'
    },
    {
      id: 3,
      src: 'https://i.postimg.cc/ZKFtxKTT/4dfabb18a05996b6a938d1ff05bf6d43.png', 
      className: 'z-0 absolute bottom-0 left-[200px] md:left-[370px] w-[320px] h-[330px] opacity-50 object-cover floating-element'
    },
    {
      id: 4,
      src: 'https://i.postimg.cc/SskdfqVM/ab48a3cbdf9473b19887ef9f0c6df059.png', 
      className: 'z-0 absolute bottom-0 right-[200px] md:right-[440px] w-[280px] h-[330px] opacity-50 object-cover floating-element'
    },
    {
      id: 5,
      src: 'https://i.postimg.cc/dQHPHQpv/9574b8a23b986040192ab785ce4e1a7f.png', 
      className: 'z-0 absolute bottom-0 right-32 md:right-[220px] w-[280px] h-[300px] opacity-50 object-cover floating-element'
    },
    {
      id: 6,
      src: 'https://i.postimg.cc/9XD5kR9b/6ee376be136689599f1ca40dfc8c2d75.png', 
      className: 'z-0 absolute bottom-0 right-0 md:-right-2 w-[280px] h-[300px] opacity-60 object-cover floating-element'
    },
  ];

  // Stats data
  const stats = [
    { value: '10K+', label: 'Active Learners', icon: <BookOpen className="h-6 w-6" /> },
    { value: '500+', label: 'Interactive Lessons', icon: <Gamepad2 className="h-6 w-6" /> },
    { value: '99%', label: 'Satisfaction Rate', icon: <Award className="h-6 w-6" /> }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative z-0 py-16 md:py-20 bg-white dark:bg-gray-900 overflow-hidden"
    >
      <div className="container px-4 md:px-6 relative z-10">
        <div
          className={`cta-box relative bg-gradient-to-br from-[#ff4834] via-[#30025c] to-[#660101] rounded-[3rem] p-8 md:p-14 text-white text-center overflow-hidden border-2 border-white/20 shadow-[0_0_100px_20px_rgba(255,0,0,0.3)] ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
          style={{
            position: 'relative',
          }}
        >
          {/* Upward-facing black shadow */}
          <div 
            className="absolute left-0 right-0 bottom-0 h-1/3 z-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
              borderBottomLeftRadius: '3rem',
              borderBottomRightRadius: '3rem',
              filter: 'blur(15px)',
              transform: 'translateY(0px) scale(0.96)',
            }}
          />
          
          {/* 3D effect border */}
          <div className="absolute inset-0 rounded-[3rem] border-2 border-white/5 pointer-events-none" />
          <div className="absolute inset-4 rounded-[2.5rem] border-2 border-white/5 pointer-events-none" />

          {/* Glowing strings inside the box */}
          <div className="string-container">
            {glowingStrings.map((string) => (
              <div
                key={string.id}
                className="glowing-string animate-float-slow"
                style={{
                  top: string.top,
                  left: string.left,
                  width: string.width,
                  height: string.height,
                  opacity: string.opacity,
                  transform: `rotate(${string.rotation}deg)`,
                  animationDuration: `${string.duration}s`,
                  animationDelay: `${string.delay}s`
                }}
              />
            ))}
          </div>

          {/* Dynamic background images */}
          <div className="absolute inset-0 z-0 flex items-end gap-6 pointer-events-none">
            {images.map((image) => (
              <img
                key={image.id}
                src={image.src}
                alt={`Character ${image.id}`}
                className={`${image.className}`}
              />
            ))}
          </div>

          {/* Content Container - ensuring content stays above shadow */}
          <div className="relative z-10">
            {/* Title with CSS animations instead of Framer Motion */}
            <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tight mb-3 uppercase ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '0.2s' }}>
              <span className="text-3xl md:text-5xl">
                Ready for an Epic Learning Journey?
              </span>
            </h2>

            {/* Description with CSS animation */}
            <p
              className={`text-xl mb-3 max-w-3xl mx-auto text-white/90 leading-relaxed ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: '0.4s' }}
            >
              Join our community of young explorers and unlock a world of knowledge through play!
            </p>

            {/* Stats grid with CSS animations */}
            <div
              className={`grid grid-cols-3 gap-4 md:gap-6 mb-10 max-w-2xl mx-auto ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: '0.6s' }}
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`bg-transparent p-3 md:p-4 rounded-xl border border-white/20 transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-6'}`}
                  style={{ animationDelay: `${0.6 + index * 0.2}s` }}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-white">{stat.icon}</div>
                      <span className="text-lg md:text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                    <span className="text-xs md:text-sm text-white">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons with CSS animations */}
            <div
              className={`flex flex-col sm:flex-row gap-4 md:gap-6 justify-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: '0.8s' }}
            >
              <div className="transform transition-all duration-300 hover:scale-105 active:scale-95">
                <Button
                  asChild
                  size="lg"
                  className="relative overflow-hidden bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-xl shadow-red-500/30 hover:shadow-red-600/50 transition-all duration-300 rounded-full text-lg font-bold group"
                >
                  <Link href="/subjects">
                    <span className="flex items-center gap-2 z-10 relative">
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                        Start Learning Now
                      </span>
                      <Rocket className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                    {/* Button shine effect */}
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <span className="absolute top-0 left-0 w-full h-full overflow-hidden">
                      <span className="absolute top-0 left-0 w-10 h-full bg-white/30 skew-x-12 animate-shine group-hover:animate-shine-fast" />
                    </span>
                  </Link>
                </Button>
              </div>

              <div className="transform transition-all duration-300 hover:scale-105 active:scale-95">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="relative overflow-hidden border-2 border-white/30 hover:border-white/50 bg-transparent hover:bg-white/10 backdrop-blur-sm shadow-lg shadow-white/10 hover:shadow-white/20 transition-all duration-300 rounded-full text-lg font-bold group"
                >
                  <Link href="/games">
                    <span className="flex items-center gap-2 z-10 relative">
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                        Explore Games
                      </span>
                      <Gamepad2 className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                    </span>
                    {/* Button particles */}
                    <span className="absolute inset-0 overflow-hidden pointer-events-none">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <span
                          key={i}
                          className="absolute rounded-full bg-white opacity-20 animate-float-particle"
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            animationDuration: `${Math.random() * 4 + 2}s`,
                            animationDelay: `${Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;