import React from 'react'
import './DoctorStrangeLoader.css'

export default function DoctorStrangeLoader() {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
        <div className="relative w-80 h-80">
          {/* Portal background effect - subtle animated gradient */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-900/80 via-red-800/40 to-yellow-900/60 animate-pulse opacity-60"></div>

          {/* OUTER RINGS - Using SVG with explicit animateTransform replaced by CSS */}
          <svg className="absolute w-full h-full" viewBox="0 0 200 200">
            {/* Outermost ring - clockwise */}
            <circle 
              cx="100" 
              cy="100" 
              r="96" 
              fill="none" 
              stroke="#f97316" 
              strokeWidth="4" 
              strokeOpacity="0.8"
              className="portal-glow ring-shimmer rotate-cw"
            />
            
            {/* Second ring - counter-clockwise */}
            <circle 
              cx="100" 
              cy="100" 
              r="90" 
              fill="none" 
              stroke="#fbbf24" 
              strokeWidth="2" 
              strokeOpacity="0.7"
              className="portal-glow-inner rotate-ccw"
            />
            
            {/* Third ring - clockwise faster */}
            <circle 
              cx="100" 
              cy="100" 
              r="84" 
              fill="none" 
              stroke="#fef08a" 
              strokeWidth="1" 
              strokeOpacity="0.6"
              className="portal-glow-inner rotate-cw-fast"
            />

            {/* Main fire ring - counter-clockwise fast */}
            <circle 
              cx="100" 
              cy="100" 
              r="78" 
              fill="none" 
              stroke="#f97316" 
              strokeWidth="6" 
              className="portal-glow-intense rotate-ccw-fast"
            />

            {/* Secondary fire ring - clockwise medium */}
            <circle 
              cx="100" 
              cy="100" 
              r="68" 
              fill="none" 
              stroke="#fbbf24" 
              strokeWidth="3" 
              className="portal-glow rotate-cw-med"
            />
          </svg>

          {/* Mandala patterns - more dynamic */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full text-orange-300 opacity-80"
          >
            <defs>
              <radialGradient id="mandalaGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fffbe6" stopOpacity="0.5" />
                <stop offset="80%" stopColor="#ffb347" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ff9100" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="url(#mandalaGlow)"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="2,3"
            >
              <animateTransform 
                attributeName="transform" 
                attributeType="XML" 
                type="rotate" 
                from="0 50 50" 
                to="360 50 50" 
                dur="16s" 
                repeatCount="indefinite" 
              />
            </circle>
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
              strokeDasharray="1,2"
            />
            {/* Complex mandala pattern */}
            <g>
              <animateTransform 
                attributeName="transform" 
                attributeType="XML" 
                type="rotate" 
                from="0 50 50" 
                to="360 50 50" 
                dur="20s" 
                repeatCount="indefinite" 
              />
              {[...Array(12)].map((_, i) => (
                <g key={i} transform={`rotate(${i * 30}, 50, 50)`}>
                  <path 
                    d="M50 10 L52 15 L50 45 L48 15 Z" 
                    fill="rgba(255,165,0,0.6)"
                    stroke="rgba(255,140,0,0.8)"
                    strokeWidth="0.2"
                    className="animate-pulse"
                  />
                  <circle cx="50" cy="20" r="1" fill="rgba(255,200,0,0.9)" className="animate-pulse" />
                </g>
              ))}
            </g>
          </svg>

          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full text-amber-200 opacity-60"
          >
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="1,3"
            >
              <animateTransform 
                attributeName="transform" 
                attributeType="XML" 
                type="rotate" 
                from="0 50 50" 
                to="-360 50 50" 
                dur="12s" 
                repeatCount="indefinite" 
              />
            </circle>
            {/* Inner mandala pattern */}
            <g>
              <animateTransform 
                attributeName="transform" 
                attributeType="XML" 
                type="rotate" 
                from="0 50 50" 
                to="-360 50 50" 
                dur="25s" 
                repeatCount="indefinite" 
              />
              {[...Array(8)].map((_, i) => (
                <g key={i} transform={`rotate(${i * 45}, 50, 50)`}>
                  <path 
                    d="M50 20 Q55 35 50 40 Q45 35 50 20" 
                    fill="rgba(255,190,0,0.3)"
                    stroke="rgba(255,170,0,0.5)"
                    strokeWidth="0.2"
                    className="animate-pulse"
                  />
                </g>
              ))}
            </g>
          </svg>

          {/* Ancient runes rotating in opposite direction */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full text-yellow-300 opacity-70"
          >
            <circle
              cx="50"
              cy="50"
              r="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeDasharray="3,2,1,2"
            >
              <animateTransform 
                attributeName="transform" 
                attributeType="XML" 
                type="rotate" 
                from="0 50 50" 
                to="-180 50 50" 
                dur="20s" 
                repeatCount="indefinite" 
              />
            </circle>
            <g>
              <animateTransform 
                attributeName="transform" 
                attributeType="XML" 
                type="rotate" 
                from="0 50 50" 
                to="-180 50 50" 
                dur="20s" 
                repeatCount="indefinite" 
              />
              <text
                x="50%"
                y="30%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                fontSize="4"
                fontFamily="monospace"
                letterSpacing="1"
              >
                ᛞᛟᚲᛏᛟᚱᛊᛏᚱᚨᚾᚷᛖ
              </text>
              <text
                x="50%"
                y="70%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                fontSize="4"
                fontFamily="monospace"
                letterSpacing="1"
              >
                ᛈᛟᚱᛏᚨᛚᛗᚨᚷᛁᚲ
              </text>
            </g>
          </svg>

          {/* Swirling, glowing mist in the center (replaces old orb) */}
          <svg
            viewBox="0 0 100 100"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32"
            style={{ filter: 'blur(6px)' }}
          >
            <radialGradient id="portal-mist" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbe6" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#ffb347" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff9100" stopOpacity="0.1" />
            </radialGradient>
            <ellipse
              cx="50"
              cy="50"
              rx="32"
              ry="18"
              fill="url(#portal-mist)"
              opacity="0.8"
            >
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="3.5s" repeatCount="indefinite" />
            </ellipse>
            <ellipse
              cx="50"
              cy="50"
              rx="18"
              ry="8"
              fill="url(#portal-mist)"
              opacity="0.5"
            >
              <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="2.2s" repeatCount="indefinite" />
            </ellipse>
          </svg>

          {/* Magical glyph shimmer overlay */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.18 }}
          >
            <defs>
              <radialGradient id="glyphShimmer" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fffbe6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ff9100" stopOpacity="0.05" />
              </radialGradient>
            </defs>
            <g>
              <animateTransform 
                attributeName="transform" 
                attributeType="XML" 
                type="rotate" 
                from="0 50 50" 
                to="-360 50 50" 
                dur="35s" 
                repeatCount="indefinite" 
              />
              {[...Array(6)].map((_, i) => (
                <text
                  key={i}
                  x="50%"
                  y={`${20 + i * 12}%`}
                  textAnchor="middle"
                  fill="url(#glyphShimmer)"
                  fontSize="10"
                  fontFamily="monospace"
                  letterSpacing="2"
                  style={{ opacity: 0.7 - i * 0.1 }}
                >
                  ✵ᚠᛇᚱᛏᚨᛉᚹᚾᛃᚺᚢᚴᛗᛜ✵
                </text>
              ))}
            </g>
          </svg>

          {/* Flying spark particles */}
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[3px] h-[3px] bg-orange-400 rounded-full blur-sm"
              style={{
                top: `${50 + (Math.random() * 20 - 10)}%`,
                left: `${50 + (Math.random() * 20 - 10)}%`,
                animation: `portal-particle ${1 + Math.random() * 2}s ease-out ${Math.random()}s infinite`,
              }}
            />
          ))}

          {/* Golden trailing sparks */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`trail-${i}`}
              className="absolute w-[2px] h-[8px] bg-yellow-300 rounded-full blur-sm"
              style={{
                top: `${50 + (Math.random() * 30 - 15)}%`,
                left: `${50 + (Math.random() * 30 - 15)}%`,
                animation: `portal-trail ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>

        {/* Magical text effect */}
        <p className="absolute bottom-32 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-amber-500 text-xl tracking-widest font-bold drop-shadow-lg font-mono animate-pulse-text">
          Opening the Multiverse...
        </p>

        <style jsx>{`
          @keyframes portal-particle {
            0% {
              transform: scale(1) translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: scale(0.5) translate(${Math.random() > 0.5 ? '-' : ''}${40 + Math.random() * 80}px, ${Math.random() > 0.5 ? '-' : ''}${40 + Math.random() * 80}px) rotate(${Math.random() * 360}deg);
              opacity: 0;
            }
          }
          @keyframes portal-trail {
            0% {
              transform: scale(0.5) translateX(0) rotate(0deg);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.2) translateX(${Math.random() > 0.5 ? '-' : ''}${20 + Math.random() * 40}px) rotate(${Math.random() * 180}deg);
              opacity: 0.8;
              background: rgba(255, 215, 0, 0.9);
            }
            100% {
              transform: scale(0.5) translateX(${Math.random() > 0.5 ? '-' : ''}${40 + Math.random() * 60}px) rotate(${Math.random() * 360}deg);
              opacity: 0;
            }
          }
          @keyframes pulse-text {
            0%, 100% {
              opacity: 0.8;
              letter-spacing: 0.2em;
            }
            50% {
              opacity: 1;
              letter-spacing: 0.25em;
            }
          }
          .animate-pulse-text {
            animation: pulse-text 2.5s ease-in-out infinite;
          }
          .portal-glow {
            filter: drop-shadow(0 0 10px #f97316aa); 
          }
          .portal-glow-inner {
            filter: drop-shadow(0 0 6px #fbbf24aa);
          }
          .portal-glow-intense {
            filter: drop-shadow(0 0 15px #f97316);
          }
          .ring-shimmer {
            filter: drop-shadow(0 0 8px #ffb34788);
          }
          /* SVG ring rotation keyframes */
          @keyframes rotate-cw {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes rotate-ccw {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
          .rotate-cw {
            transform-origin: 50% 50%;
            animation: rotate-cw 10s linear infinite;
          }
          .rotate-ccw {
            transform-origin: 50% 50%;
            animation: rotate-ccw 15s linear infinite;
          }
          .rotate-cw-fast {
            transform-origin: 50% 50%;
            animation: rotate-cw 7s linear infinite;
          }
          .rotate-ccw-fast {
            transform-origin: 50% 50%;
            animation: rotate-ccw 5s linear infinite;
          }
          .rotate-cw-med {
            transform-origin: 50% 50%;
            animation: rotate-cw 8s linear infinite;
          }
        `}</style>
      </div>
    </>
  )
}
