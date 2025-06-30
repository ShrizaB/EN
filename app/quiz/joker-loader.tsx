import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Define props interfaces
interface JokerLoaderProps {
  imageUrl: string; // Prop for your PNG link
}

interface LoaderContainerProps {
  $isVisible: boolean;
}

interface JokerCardProps {
  $imageUrl: string;
}

// Styled components
const LoaderContainer = styled.div<{ $isVisible: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--joker-black, #0a0a0a);
  padding: 4rem;
  position: relative;
  overflow: hidden;

  /* Pulsing background glow */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, var(--joker-purple, #6a0dad) 5%, transparent 60%);
    transform: translate(-50%, -50%);
    opacity: 0.2;
    animation: pulse 5s infinite ease-in-out;
  }

  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
    50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.4; }
  }
`;

const JokerCard = styled.div<{ $imageUrl: string }>`
  width: 400px;
  height: 400px;
  background: url(${({ $imageUrl }) => $imageUrl}) center/contain no-repeat;
  border-radius: 14px;
  animation: spin 1.8s infinite ease-in-out, wobble 0.9s infinite alternate;
  transform-style: preserve-3d;
  position: relative;
  z-index: 10;
  background-color: transparent;

  /* Cracked texture overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent 40%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 60%
    );
    opacity: 0.3;
    animation: crackleShift 6s infinite linear;
  }

  /* Back face with "HA HA HA" */
  &::after {
    content: 'HA HA HA';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 14px;
    backface-visibility: hidden;
    transform: rotateY(180deg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--joker-red, #dc143c);
    font-family: 'Creepster', cursive;
    font-size: 2.5rem;
    text-shadow: 3px 3px 0 var(--joker-green, #32cd32);
    animation: smear 3s infinite;
  }

  @keyframes spin {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(360deg); }
  }

  @keyframes wobble {
    0% { transform: translateX(-15px) rotate(5deg); }
    100% { transform: translateX(15px) rotate(-5deg); }
  }

  @keyframes crackle {
    0%, 100% { box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); }
    50% { box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); }
  }

  @keyframes crackleShift {
    0% { background-position: 0 0; }
    100% { background-position: 100px 100px; }
  }

  @keyframes smear {
    0%, 100% { text-shadow: 3px 3px 0 var(--joker-green, #32cd32); }
    50% { text-shadow: 5px 5px 5px var(--joker-green, #32cd32); }
  }
`;

const LoaderText = styled.div`
  color: var(--joker-red, #dc143c);
  font-family: cursive;
  font-size: 3rem;
  margin-top: 3.5rem;
  opacity: 0;
  animation: textFade 2.5s infinite, glitch 0.3s infinite alternate, drip 2s infinite;
  z-index: 10;
  position: relative;

  /* Drip effect */
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    width: 10px;
    height: 20px;
    background: var(--joker-red, #dc143c);
    opacity: 0;
    animation: dripDrop 2s infinite;
  }

  @keyframes textFade {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }

  @keyframes glitch {
    0% { text-shadow: 0.07em 0 0 var(--joker-green, #32cd32), -0.07em 0 0 var(--joker-purple, #6a0dad); }
    100% { text-shadow: -0.07em 0 0 var(--joker-green, #32cd32), 0.07em 0 0 var(--joker-purple, #6a0dad); }
  }

  @keyframes drip {
    0%, 100% { opacity: 1; }
    10%, 20%, 30% { opacity: 0.5; }
  }

  @keyframes dripDrop {
    0% { transform: translateX(-50%) translateY(0); opacity: 0; }
    50% { transform: translateX(-50%) translateY(20px); opacity: 0.5; }
    100% { transform: translateX(-50%) translateY(40px); opacity: 0; }
  }
`;

const SmokeParticle = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background: var(--joker-gray, #2a2a2a);
  border-radius: 50%;
  opacity: 0.3;
  animation: smoke 6s infinite linear;
  z-index: 5;

  &:nth-child(1) { left: 20%; animation-delay: 0s; }
  &:nth-child(2) { left: 40%; animation-delay: 1.5s; }
  &:nth-child(3) { left: 60%; animation-delay: 3s; }
  &:nth-child(4) { left: 80%; animation-delay: 4.5s; }

  @keyframes smoke {
    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
    100% { transform: translateY(-300px) translateX(20px) scale(2); opacity: 0; }
  }
`;

const Spark = styled.div`
  position: absolute;
  width: 5px;
  height: 5px;
  background: var(--joker-red, #dc143c);
  border-radius: 50%;
  opacity: 0.7;
  animation: spark 3s infinite linear;
  z-index: 5;

  &:nth-child(5) { left: 30%; top: 50%; animation-delay: 0.5s; }
  &:nth-child(6) { left: 70%; top: 50%; animation-delay: 1s; }

  @keyframes spark {
    0% { transform: translate(0, 0); opacity: 0.7; }
    100% { transform: translate(100px, -100px); opacity: 0; }
  }
`;

const GlitchLine = styled.div`
  position: absolute;
  width: 100%;
  height: 2px;
  background: var(--joker-light-gray, #404040);
  opacity: 0.4;
  animation: glitchLine 2s infinite linear;
  z-index: 5;

  &:nth-child(7) { top: 30%; animation-delay: 0.2s; }
  &:nth-child(8) { top: 70%; animation-delay: 0.8s; }

  @keyframes glitchLine {
    0% { transform: translateX(-100%); opacity: 0.4; }
    50% { opacity: 0.6; }
    100% { transform: translateX(100%); opacity: 0; }
  }
`;

const ChaosBurst = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, var(--joker-dark-gray, #1a1a1a) 10%, transparent 70%);
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: chaosBurst 7s infinite;
  z-index: 5;

  @keyframes chaosBurst {
    0%, 90% { opacity: 0; }
    95% { opacity: 0.5; }
    100% { opacity: 0; }
  }
`;

const JokerLoader: React.FC<JokerLoaderProps> = ({ imageUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading for 3 seconds
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Fade out animation
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3500);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(fadeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out">
      <LoaderContainer $isVisible={isLoading}>
        <JokerCard $imageUrl={imageUrl} />
        <LoaderText>Why so serious?</LoaderText>
        <SmokeParticle />
        <SmokeParticle />
        <SmokeParticle />
        <SmokeParticle />
        <Spark />
        <Spark />
        <GlitchLine />
        <GlitchLine />
        <ChaosBurst />
      </LoaderContainer>
    </div>
  );
};

export default JokerLoader;