"use client";

import Link from "next/link";
import { Calculator, FlaskRoundIcon as Flask, BookOpen, Code, Music, Palette, Globe, Brain } from "lucide-react";
import "./quiz.css";
import { useState, useRef, useEffect } from "react";
import JokerLoader from "./joker-loader";

const subjects = [
	{
		id: "math",
		title: "MATHEMATICS",
		description: "Numbers don't lie... but people do.",
		icon: Calculator,
		suit: "♠",
		color: "#32cd32",
	},
	{
		id: "science",
		title: "SCIENCE",
		description: "Every formula has a breaking point.",
		icon: Flask,
		suit: "♣",
		color: "#ff69b4",
	},
	{
		id: "reading",
		title: "LITERATURE",
		description: "Words are weapons. Choose carefully.",
		icon: BookOpen,
		suit: "♦",
		color: "#ffd700",
	},
	{
		id: "coding",
		title: "PROGRAMMING",
		description: "Debug... or watch it burn.",
		icon: Code,
		suit: "♥",
		color: "#dc143c",
	},
	{
		id: "music",
		title: "MUSIC",
		description: "Symphony of madness.",
		icon: Music,
		suit: "♠",
		color: "#6a0dad",
	},
	{
		id: "art",
		title: "ART",
		description: "Beauty is chaos.",
		icon: Palette,
		suit: "♣",
		color: "#ff69b4",
	},
	{
		id: "geography",
		title: "GEOGRAPHY",
		description: "Maps lead to dead ends.",
		icon: Globe,
		suit: "♦",
		color: "#ffd700",
	},
	{
		id: "history",
		title: "HISTORY",
		description: "History makes chaos.",
		icon: Brain,
		suit: "♥",
		color: "#dc143c",
	},
];

export default function QuizPage() {
	const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
	const cursorRef = useRef<HTMLDivElement>(null);
	const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
	const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Simulate loading
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 3500);
		return () => clearTimeout(timer);
	}, []);

	// Custom cursor effect
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setCursorPos({
				x: e.clientX,
				y: e.clientY,
			});
		};
		document.addEventListener("mousemove", handleMouseMove);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	// Handle interactive hover effects
	useEffect(() => {
		const handleMouseEnter = () => setIsHoveringInteractive(true);
		const handleMouseLeave = () => setIsHoveringInteractive(false);

		const interactiveElements = document.querySelectorAll(
			"a, button, [role='button'], input, select, textarea"
		);

		interactiveElements.forEach((el) => {
			el.addEventListener("mouseenter", handleMouseEnter);
			el.addEventListener("mouseleave", handleMouseLeave);
		});

		return () => {
			interactiveElements.forEach((el) => {
				el.removeEventListener("mouseenter", handleMouseEnter);
				el.removeEventListener("mouseleave", handleMouseLeave);
			});
		};
	}, []);

	// 3D tilt effect for cards
	useEffect(() => {
		const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
		if (isTouchDevice) return;

		const handleMouseMove = (e: MouseEvent, card: HTMLElement) => {
			if (!card) return;

			const rect = card.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const centerX = rect.width / 2;
			const centerY = rect.height / 2;

			const rotateY = ((x - centerX) / centerX) * 10;
			const rotateX = ((centerY - y) / centerY) * 5;

			card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.06)`;
			card.style.filter = "brightness(1.3)";
			card.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.5)";
		};

		const handleMouseEnter = (e: MouseEvent, card: HTMLElement) => {
			if (!card) return;
			card.style.transition = "transform 0.1s ease, filter 0.3s ease, box-shadow 0.3s ease";
		};

		const handleMouseLeave = (card: HTMLElement) => {
			if (!card) return;
			card.style.transform = "translateY(0) scale(1)";
			card.style.filter = "brightness(1)";
			card.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)";
			card.style.transition = "transform 0.5s ease, filter 0.3s ease, box-shadow 0.3s ease";
		};

		const currentRefs = cardRefs.current;

		currentRefs.forEach((card) => {
			if (card) {
				card.addEventListener("mousemove", (e) => handleMouseMove(e, card));
				card.addEventListener("mouseenter", (e) => handleMouseEnter(e, card));
				card.addEventListener("mouseleave", () => handleMouseLeave(card));
			}
		});

		return () => {
			currentRefs.forEach((card) => {
				if (card) {
					card.removeEventListener("mousemove", (e) => handleMouseMove(e, card));
					card.removeEventListener("mouseenter", (e) => handleMouseEnter(e, card));
					card.removeEventListener("mouseleave", () => handleMouseLeave(card));
				}
			});
		};
	}, []);

	if (isLoading) {
		return <JokerLoader imageUrl="https://i.postimg.cc/zGGZpvTm/660988b39f691.png" />;
	}

	return (
		<div
			className="joker-container joker-font min-h-screen pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 mt-14 xs:mt-16 md:mt-0"
			role="main"
			style={{ cursor: "none" }}
		>
			{/* Custom cursor - always rendered, offscreen if no mouse yet */}
			<div
				ref={cursorRef}
				style={{
					position: "fixed",
					left: 0,
					top: 0,
					width: "48px",
					height: "48px",
					background: `url('https://i.postimg.cc/yx1ktsbx/favpng-d5954c16741557cbeef73cf3f8e183ef.png') center/cover no-repeat`,
					backgroundColor: "transparent",
					borderRadius: "50%",
					pointerEvents: "none",
					zIndex: 9999,
					transform: cursorPos ? `translate3d(${cursorPos.x - 24}px, ${cursorPos.y - 24}px, 0)` : 'translate3d(-9999px, -9999px, 0)',
					willChange: "transform",
					opacity: 1,
				}}
				className="invert-[1] md:visible invisible "
			/>
			{/* Background Image with overlay */}
			<div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
				<div className="flex gap-4">
					<div className="relative">
						<img
							src="https://i.postimg.cc/LhF8sT1Y/The-Joker-Comics.webp"
							alt="Joker"
							className="opacity-90 w-[300px] fixed md:bottom-16 bottom-6 left-10 h-auto"
						/>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto py-6 sm:py-8 md:py-10 lg:py-12 relative z-10 animate-fadeIn">
				<header className="text-center mb-6 sm:mb-8 md:mb-10">
					<div className="relative inline-block">
						<h1
							className="joker-main-title text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 animate-chaoticFloat"
							aria-label="Joker's Quiz"
						>
							CHAOS QUIZ
						</h1>
						<div className="joker-title-underline"></div>
					</div>
					<p className="joker-subtitle text-xs xs:text-sm sm:text-base md:text-lg max-w-xl xs:max-w-2xl sm:max-w-3xl mx-auto mt-3 sm:mt-4 px-2">
						Why so serious? Dare to play the game.
					</p>
				</header>

				<section className="quiz-grid" aria-label="Quiz subjects">
					{subjects.map((subject, index) => {
						const SubjectIcon = subject.icon;
						return (
							<div key={subject.id} className="h-full w-full flex justify-center">
								<Link
									ref={(el) => {
										if (el) cardRefs.current[index] = el;
									}}
									href={`/quiz/${subject.id}`}
									className="quiz-card-link group h-full w-full relative focus:outline-none focus-visible:ring-2 focus-visible:ring-joker-green focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-xl"
									aria-label={`Take ${subject.title} quiz: ${subject.description}`}
									style={{
										transformStyle: "preserve-3d",
										backfaceVisibility: "hidden",
										transform: "translateZ(0)",
									}}
								>
									<div className="absolute inset-0 transform transition-transform duration-300 group-hover:scale-105">
										<div className="absolute inset-0 bg-gradient-to-br from-joker-green/0 via-joker-purple/0 to-joker-red/0 rounded-xl transition-opacity duration-300"></div>
										<div className="card-suit top-left absolute top-2 xs:top-3 left-2 xs:left-3 text-lg xs:text-xl font-bold" aria-hidden="true">
											{subject.suit}
										</div>
										<div
											className="card-suit bottom-right absolute bottom-2 xs:bottom-3 right-2 xs:right-3 text-lg xs:text-xl font-bold rotate-180"
											aria-hidden="true"
										>
											{subject.suit}
										</div>
										<div className="card-content flex flex-col items-center justify-center h-full relative z-10 transform transition-transform duration-300 group-hover:translate-y-[-5px]">
											<div className="icon-container transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
												<SubjectIcon className="h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7" aria-hidden="true" />
											</div>
											<h2 className="card-title text-sm xs:text-base sm:text-lg font-bold transform transition-transform duration-300 group-hover:scale-105">
												{subject.title}
											</h2>
											<p className="card-description text-[0.65rem] xs:text-xs sm:text-sm transform transition-transform duration-300 group-hover:translate-y-1">
												{subject.description}
											</p>
										</div>
										<div className="burn-effect absolute inset-0" aria-hidden="true"></div>
									</div>
									<div className="shadow-card absolute inset-0 h-full w-full" aria-hidden="true">
										<div className="w-full h-full rounded-xl"></div>
									</div>
								</Link>
							</div>
						);
					})}
				</section>
			</div>
			<canvas id="joker-particles" className="absolute inset-0 z-0 pointer-events-none"></canvas>
		</div>
	);
}