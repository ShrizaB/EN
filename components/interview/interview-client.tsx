
'use client';

import { useEffect, useState } from 'react';
import InterviewProcess from './interview-process';

// Advanced Cyber Background component with multiple layers
const CyberBackground = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        // Animated grid with neural network effect
        const canvas = document.getElementById('cyberCanvas') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const gridSize = 40;
        const nodes: { x: number; y: number; vx: number; vy: number; connections: number[] }[] = [];

        // Create neural network nodes
        for (let i = 0; i < 150; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                connections: []
            });
        }

        let time = 0;
        const animate = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update nodes
            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                // Bounce off edges
                if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
                if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;

                // Draw node
                const pulse = Math.sin(time * 0.02 + i * 0.1) * 0.5 + 0.5;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 2 + pulse, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 230, 0, ${0.6 + pulse * 0.4})`;
                ctx.fill();

                // Draw connections
                nodes.forEach((otherNode, j) => {
                    if (i !== j) {
                        const dist = Math.sqrt(Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2));
                        if (dist < 120) {
                            const alpha = 1 - (dist / 120);
                            ctx.beginPath();
                            ctx.moveTo(node.x, node.y);
                            ctx.lineTo(otherNode.x, otherNode.y);
                            ctx.strokeStyle = `rgba(255, 230, 0, ${alpha * 0.1 + pulse * 0.05})`;
                            ctx.lineWidth = alpha;
                            ctx.stroke();
                        }
                    }
                });
            });

            time += 1;
            requestAnimationFrame(animate);
        };

        animate();

        // Matrix rain effect
        const matrixCanvas = document.getElementById('matrixCanvas') as HTMLCanvasElement;
        if (!matrixCanvas) return;

        const matrixCtx = matrixCanvas.getContext('2d');
        if (!matrixCtx) return;

        const resizeMatrixCanvas = () => {
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;
        };

        resizeMatrixCanvas();
        window.addEventListener('resize', resizeMatrixCanvas);

        const fontSize = 14;
        const columns = Math.floor(matrixCanvas.width / fontSize);
        const drops: number[] = Array(columns).fill(0);
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

        const drawMatrix = () => {
            matrixCtx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            matrixCtx.font = `${fontSize}px Orbitron`;

            drops.forEach((drop, i) => {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const brightness = Math.random();

                if (brightness > 0.8) {
                    matrixCtx.fillStyle = '#FFE600';
                } else if (brightness > 0.6) {
                    matrixCtx.fillStyle = '#FFEF33';
                } else {
                    matrixCtx.fillStyle = `rgba(255, 230, 0, ${brightness * 0.5})`;
                }

                matrixCtx.fillText(char, i * fontSize, drop * fontSize);

                if (drop * fontSize > matrixCanvas.height && Math.random() > 0.98) {
                    drops[i] = 0;
                }
                drops[i]++;
            });

            requestAnimationFrame(drawMatrix);
        };

        drawMatrix();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('resize', resizeMatrixCanvas);
        };
    }, []);

    return (
        <>
            {/* Neural network canvas */}
            <canvas
                id="cyberCanvas"
                className="fixed top-0 left-0 w-full h-full -z-30 pointer-events-none"
            />

            {/* Matrix rain canvas */}
            <canvas
                id="matrixCanvas"
                className="fixed top-0 left-0 w-full h-full -z-20 pointer-events-none opacity-20"
            />

            {/* Animated geometric shapes */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-32 h-32 border border-cyber-yellow/20 animate-border-spin"
                        style={{
                            left: `${20 + i * 20}%`,
                            top: `${10 + i * 15}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${3 + i}s`,
                            transform: 'rotate(45deg)',
                        }}
                    />
                ))}
            </div>

            {/* Mouse follower effect */}
            <div
                className="fixed w-96 h-96 pointer-events-none -z-10 transition-all duration-1000 ease-out"
                style={{
                    left: mousePos.x - 192,
                    top: mousePos.y - 192,
                    background: 'radial-gradient(circle, rgba(255, 230, 0, 0.1) 0%, transparent 70%)',
                }}
            />
        </>
    );
};

// Floating data streams
const DataStreams = () => {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute w-0.5 bg-gradient-to-b from-transparent via-cyber-yellow to-transparent animate-data-stream"
                    style={{
                        left: `${Math.random() * 100}%`,
                        height: `${50 + Math.random() * 100}px`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 3}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default function InterviewClient() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="relative min-h-screen bg-cyber-dark overflow-hidden font-orbitron">
            <CyberBackground />
            <DataStreams />

            {/* Animated border frame */}
            <div className="fixed inset-0 pointer-events-none z-40">
                {/* Top border with scanning effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-yellow to-transparent">
                    <div className="absolute top-0 left-0 w-20 h-full bg-cyber-yellow animate-scanline shadow-lg shadow-cyber-yellow/50"></div>
                </div>

                {/* Bottom border */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-yellow to-transparent">
                    <div className="absolute top-0 right-0 w-20 h-full bg-cyber-yellow animate-scanline shadow-lg shadow-cyber-yellow/50" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Left border */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyber-yellow to-transparent animate-cyber-pulse"></div>

                {/* Right border */}
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-cyber-yellow to-transparent animate-cyber-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Corner decorations with enhanced styling */}
                <div className="absolute top-0 left-0 w-12 h-12">
                    <div className="w-full h-2 bg-cyber-yellow animate-neon-flicker"></div>
                    <div className="w-2 h-full bg-cyber-yellow animate-neon-flicker"></div>
                </div>
                <div className="absolute top-0 right-0 w-12 h-12">
                    <div className="w-full h-2 bg-cyber-yellow animate-neon-flicker"></div>
                    <div className="absolute top-0 right-0 w-2 h-full bg-cyber-yellow animate-neon-flicker"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-12 h-12">
                    <div className="absolute bottom-0 w-full h-2 bg-cyber-yellow animate-neon-flicker"></div>
                    <div className="absolute bottom-0 w-2 h-full bg-cyber-yellow animate-neon-flicker"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-12 h-12">
                    <div className="absolute bottom-0 w-full h-2 bg-cyber-yellow animate-neon-flicker"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-full bg-cyber-yellow animate-neon-flicker"></div>
                </div>
            </div>

            <div className={`container mx-auto py-16 px-4 md:px-6 relative z-30 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                {/* Enhanced glitch title */}
                <div className="relative mb-12 text-center group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-cyber-yellow/20 via-transparent to-cyber-yellow/20 blur-xl animate-pulse"></div>
                    <h1 className="relative text-3xl md:text-5xl font-black tracking-wider">
                        <span className="relative inline-block font-[Orbitron] text-white">
                            <span className="relative z-10">
                                INTERVIEW
                            </span>
                            <span
                                className="absolute inset-0 text-transparent animate-text-glow"
                                style={{
                                    WebkitTextStroke: '2px #FFE600',
                                    textShadow: '0 0 10px #FFE600, 0 0 20px #FFE600, 0 0 30px #FFE600',
                                    animation: 'pulse 2s ease-in-out infinite'
                                }}
                            >
                                INTERVIEW
                            </span>
                        </span>
                    </h1>
                    <h2 className="text-xl md:text-2xl font-bold mt-4 tracking-widest font-[Orbitron]">
                        <span className="relative text-white">
                            <span className="relative z-10">
                                PROCESS
                            </span>
                            <span
                                className="absolute inset-0 text-transparent"
                                style={{
                                    WebkitTextStroke: '1px #FFE600',
                                    textShadow: '0 0 8px #FFE600, 0 0 16px #FFE600',
                                    animation: 'pulse 1.5s ease-in-out infinite',
                                    animationDelay: '0.5s'
                                }}
                            >
                                PROCESS
                            </span>
                        </span>
                    </h2>

                    {/* Cyber Terminal Box */}
                    <div className="mt-12 max-w-4xl mx-auto relative group">
                        {/* Glowing border effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-yellow via-amber-500 to-cyber-yellow rounded-lg opacity-80 group-hover:opacity-100 blur-sm transition-all duration-500 group-hover:duration-200 animate-pulse"></div>

                        {/* Main content box */}
                        <div className="relative bg-transparent backdrop-blur-sm p-8 border border-yellow-400/70 rounded-sm overflow-hidden">
                            {/* Animated grid overlay */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-grid-pattern"></div>
                            </div>

                            {/* Corner decorations */}
                            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-yellow-400/70"></div>
                            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-yellow-400/70"></div>
                            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-yellow-400/70"></div>
                            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-yellow-400/70"></div>

                            <p className="text-gray-200 text-lg md:text-xl leading-relaxed relative z-10">
                                <span className="text-cyber-yellow font-mono font-bold tracking-wider text-sm md:text-base">[SYSTEM INITIALIZED]</span>
                                <span className="inline-block ml-2 h-2 w-2 bg-cyber-yellow rounded-full animate-pulse"></span>
                                <br />
                                <span className="text-gray-200">
                                    Upload your resume and answer interview questions to receive personalized feedback on your strengths and areas for improvement.
                                </span>
                                <br />
                                <span className="inline-flex items-center mt-2 text-cyber-yellow/80 text-sm font-mono tracking-wider">
                                    <span className="inline-block w-2 h-2 bg-cyber-yellow rounded-full mr-2 animate-pulse"></span>
                                    &gt; NEURAL ANALYSIS PROTOCOL: <span className="text-green-400 ml-1">ACTIVE</span>
                                    <span className="ml-2 inline-flex space-x-1">
                                        {[1, 2, 3].map((i) => (
                                            <span key={i} className="inline-block w-1 h-1 bg-cyber-yellow/70 rounded-full animate-pulse"
                                                style={{ animationDelay: `${i * 0.2}s` }}></span>
                                        ))}
                                    </span>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enhanced main content container */}
                <div className="relative group">
                    {/* Outer glow effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-cyber-yellow/10 via-cyber-yellow/5 to-cyber-yellow/10 blur-2xl animate-pulse"></div>

                    {/* Main container with advanced styling */}
                    <div className="relative overflow-hidden rounded-none bg-transparent backdrop-blur-sm border-2 border-cyber-yellow/50 shadow-2xl shadow-cyber-yellow/20 animate-cyber-pulse">

                        {/* Top scanning line */}
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-yellow to-transparent">
                            <div className="absolute top-0 left-0 w-32 h-full bg-cyber-yellow animate-scanline shadow-lg shadow-cyber-yellow/80"></div>
                        </div>

                        {/* Side scanning lines */}
                        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-transparent via-cyber-yellow to-transparent animate-pulse"></div>
                        <div className="absolute top-0 right-0 w-0.5 h-full animate-pulse" style={{ animationDelay: '1s' }}></div>

                        {/* Corner accents */}
                        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-yellow-400/70 animate-neon-flicker"></div>
                        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-yellow-400/70 animate-neon-flicker"></div>
                        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-yellow-400/70 animate-neon-flicker"></div>
                        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-yellow-400/70 animate-neon-flicker"></div>

                        {/* Content area */}
                        <div className="relative p-8 md:p-12 border border-yellow-400/70">
                            <InterviewProcess />
                        </div>  
                    </div>
                </div>
            </div>

            {/* Global cyber styles */}
            <style jsx global>{`
        @keyframes glitch-anim {
          0% { clip-path: polygon(0 0%, 100% 0%, 100% 5%, 0 5%); }
          10% { clip-path: polygon(0 15%, 100% 15%, 100% 20%, 0 20%); }
          20% { clip-path: polygon(0 10%, 100% 10%, 100% 44%, 0 44%); }
          30% { clip-path: polygon(0 1%, 100% 1%, 100% 3%, 0 3%); }
          40% { clip-path: polygon(0 33%, 100% 33%, 100% 36%, 0 36%); }  
          50% { clip-path: polygon(0 45%, 100% 45%, 100% 48%, 0 48%); }
          60% { clip-path: polygon(0 50%, 100% 50%, 100% 53%, 0 53%); }
          70% { clip-path: polygon(0 70%, 100% 70%, 100% 73%, 0 73%); }
          80% { clip-path: polygon(0 80%, 100% 80%, 100% 83%, 0 83%); }
          90% { clip-path: polygon(0 50%, 100% 50%, 100% 53%, 0 53%); }
          100% { clip-path: polygon(0 70%, 100% 70%, 100% 73%, 0 73%); }
        }
        
        .glitch {
          position: relative;
        }
        
        .glitch::before, .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch::before {
          color: #00D4FF;
          z-index: -1;
          animation: glitch-anim 2s infinite linear alternate-reverse;
        }
        
        .glitch::after {
          color: #C77DFF;
          z-index: -2;
          animation: glitch-anim 3s infinite linear alternate-reverse;
        }
        
        .group:hover .glitch::before {
          animation: glitch-anim 0.3s infinite linear alternate-reverse;
        }
        
        .group:hover .glitch::after {
          animation: glitch-anim 0.5s infinite linear alternate-reverse;
        }
        
       
        
        /* Selection styling */
        ::selection {
          background: rgba(255, 230, 0, 0.3);
          color: #FFE600;
        }
        
        /* Enhanced focus states */
        *:focus {
          outline: 2px solid #FFE600;
          outline-offset: 2px;
        }

        @keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(255, 230, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 230, 0, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-scanline {
  animation: scanline 8s linear infinite;
}
      `}</style>
        </div>
    );
}
