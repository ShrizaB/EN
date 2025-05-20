'use client';

import { useMemo, useEffect, useState } from 'react';

function generateRandomPoints(count: number, width: number, height: number) {
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      id: i,
    });
  }
  return points;
}

function createCurvedLine(p1: { x: number; y: number }, p2: { x: number; y: number }): string {
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return `M${p1.x},${p1.y} L${p2.x},${p2.y}`;

  const perpX = -dy / len;
  const perpY = dx / len;
  const offsetAmount = (Math.random() - 0.5) * 20;

  const cx = midX + perpX * offsetAmount;
  const cy = midY + perpY * offsetAmount;

  return `M${p1.x.toFixed(2)},${p1.y.toFixed(2)} Q${cx.toFixed(2)},${cy.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
}

export default function SpiderWebBackground() {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const { width, height } = dimensions;
  const pointCount = Math.floor((width * height) / 15000); // adaptive point count
  const connectionDistance = Math.sqrt((width * height) / 40); // adaptive connection distance

  const points = useMemo(() => generateRandomPoints(pointCount, width, height), [pointCount, width, height]);

  const edges: { p1: typeof points[0]; p2: typeof points[0] }[] = [];

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i];
      const p2 = points[j];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= connectionDistance) {
        edges.push({ p1, p2 });
      }
    }
  }

  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ff0000" floodOpacity="0.8" />
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ff0000" floodOpacity="0.5" />
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#ff0000" floodOpacity="0.3" />
          <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#ff0000" floodOpacity="0.15" />
        </filter>

        <linearGradient id="redGlowGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff5555" />
          <stop offset="50%" stopColor="#ff0000" />
          <stop offset="100%" stopColor="#b20000" />
        </linearGradient>
      </defs>

      {edges.map(({ p1, p2 }, i) => (
        <path
          key={i}
          d={createCurvedLine(p1, p2)}
          stroke="url(#redGlowGradient)"
          strokeWidth={1.6}
          fill="none"
          filter="url(#glow)"
          strokeLinecap="round"
          opacity={0.75}
        />
      ))}

      {points.map((p) => (
        <circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={1.4}
          fill="#ff0000"
          filter="url(#glow)"
          opacity={0.6}
        />
      ))}
    </svg>
  );
}
