"use client";

import { useEffect, useState } from "react";

type FloatingShapeProps = {
    id: number;
    size: number;
    color: string;
    top: number;
    left: number;
    animationName: string;
    duration: number;
    delay: number;
};

// Single shape component
const FloatingShape = ({
    size,
    color,
    top,
    left,
    animationName,
    duration,
    delay,
}: FloatingShapeProps) => (
    <div
        className="absolute rounded-full opacity-30 pointer-events-none"
        style={{
            width: `${size}rem`,
            height: `${size}rem`,
            top: `${top}%`,
            left: `${left}%`,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            animation: `${animationName} ${duration}s ease-in-out ${delay}s infinite alternate`,
        }}
    />
);

const FloatingShapesBackground = ({ shapeCount = 25 }: { shapeCount?: number }) => {
    const [shapes, setShapes] = useState<FloatingShapeProps[]>([]);

    useEffect(() => {
        const colors = ["#8B5CF6", "#6366F1", "#A855F7", "#EC4899"];
        const newShapes: FloatingShapeProps[] = [];
        let keyframesCSS = "";

        for (let i = 0; i < shapeCount; i++) {
            const angle = Math.random() * 360;
            const distance = Math.random() * 40 + 10;
            const x = Math.cos((angle * Math.PI) / 180) * distance;
            const y = Math.sin((angle * Math.PI) / 180) * distance;

            const animationName = `float-${i}`;
            keyframesCSS += `
        @keyframes ${animationName} {
          0% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          50% {
            transform: translate(${x / 2}px, ${y / 2}px) rotate(180deg);
          }
          100% {
            transform: translate(${x}px, ${y}px) rotate(360deg);
          }
        }
      `;

            newShapes.push({
                id: i,
                size: Math.random() * 8 + 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                top: Math.random() * 90,
                left: Math.random() * 90,
                animationName,
                duration: Math.random() * 10 + 2,
                delay: Math.random() * 5,
            });
        }

        setShapes(newShapes);

        const styleEl = document.createElement("style");
        styleEl.innerHTML = keyframesCSS;
        document.head.appendChild(styleEl);

        return () => {
            document.head.removeChild(styleEl);
        };
    }, [shapeCount]);

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            {shapes.map((shape) => (
                <FloatingShape key={shape.id} {...shape} />
            ))}
        </div>
    );
};

export default FloatingShapesBackground;
