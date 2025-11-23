'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './Preloader.module.scss';

const TARGET_TEXT = "Artem Zaitsev Dev";
const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const textRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let iteration = 0;
    
    // Анимация "хакера" / перебора букв
    const runTextAnimation = () => {
      interval = setInterval(() => {
        setDisplayText(prev => 
          TARGET_TEXT.split("")
            .map((letter, index) => {
              if (index < iteration) {
                return TARGET_TEXT[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        // 4 секунды анимации (зависит от скорости интервала и длины текста)
        // 17 букв. Чтобы длилось 4 сек, нужно замедлить инкремент.
        if (iteration >= TARGET_TEXT.length) { 
          clearInterval(interval);
          finishAnimation();
        }
        
        // Регулируем скорость "остановки" букв
        iteration += 1 / 8; 
      }, 30);
    };

    const finishAnimation = () => {
        const tl = gsap.timeline({
            onComplete: () => onComplete()
        });

        // Анимация шторы вверх
        tl.to(curtainRef.current, {
            y: "-100%",
            duration: 1,
            ease: "power4.inOut",
            delay: 0.5
        });
    };

    runTextAnimation();

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div ref={curtainRef} className={styles.preloader}>
      <div className={styles.textContainer}>
        <h1 ref={textRef} className={styles.glitchText}>
          {displayText}
        </h1>
      </div>
    </div>
  );
}