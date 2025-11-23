'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './Preloader.module.scss';

const TARGET_TEXT = "Artem Zaitsev Dev";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; 

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const [iteration, setIteration] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    let interval: NodeJS.Timeout;
    const animationDuration = 2000; // Чуть ускорил текст для динамики
    const totalIterations = TARGET_TEXT.length; 
    const step = totalIterations / (animationDuration / 30); 

    const runTextAnimation = () => {
      interval = setInterval(() => {
        setIteration(prev => {
          if (prev >= totalIterations) {
            clearInterval(interval);
            finishAnimation();
            return totalIterations;
          }
          return prev + step;
        });
      }, 30);
    };

    const finishAnimation = () => {
        // Небольшая задержка перед стартом шторы
        setTimeout(() => {
             const tl = gsap.timeline();

             tl.to(curtainRef.current, {
                y: "-100%",
                duration: 1.5, // Время подъема шторы
                ease: "power4.inOut", // Важно: запомни этот ease
                onStart: () => {
                    // ГЛАВНОЕ ИЗМЕНЕНИЕ: 
                    // Сигнализируем странице, что штора поехала, ПРЯМО СЕЙЧАС
                    onComplete();
                }
            });
        }, 200);
    };

    runTextAnimation();

    return () => clearInterval(interval);
  }, [onComplete]);

  const renderText = () => {
    return TARGET_TEXT.split("").map((letter, index) => {
      if (index < Math.floor(iteration)) {
        return <span key={index} className={styles.locked}>{letter}</span>;
      }
      if (!isMounted) {
        return <span key={index} className={styles.scramble} style={{opacity: 0}}>-</span>;
      }
      return (
        <span key={index} className={styles.scramble}>
          {CHARS[Math.floor(Math.random() * CHARS.length)]}
        </span>
      );
    });
  };

  return (
    <div ref={curtainRef} className={styles.preloader}>
      <div className={styles.textContainer}>
        <h1 className={styles.glitchText}>
          {renderText()}
          {isMounted && <span className={styles.cursor}>_</span>}
        </h1>
      </div>
    </div>
  );
}