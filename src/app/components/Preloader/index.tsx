'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './Preloader.module.scss';

const TARGET_TEXT = "Artem Zaitsev Dev";
// Используем более чистый набор символов (без спецзнаков), чтобы не резало глаз
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; 

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Длительность анимации текста (примерно 2.5 сек)
    // Шаг инкремента (0.3) определяет скорость открытия букв
    const animationDuration = 2500;
    const totalIterations = TARGET_TEXT.length; 
    const step = totalIterations / (animationDuration / 30); 

    const runTextAnimation = () => {
      interval = setInterval(() => {
        setIteration(prev => {
          // Если дошли до конца текста
          if (prev >= totalIterations) {
            clearInterval(interval);
            finishAnimation();
            return totalIterations;
          }
          // Увеличиваем прогресс
          return prev + step;
        });
      }, 30);
    };

    const finishAnimation = () => {
        // Небольшая пауза после расшифровки перед поднятием шторы
        setTimeout(() => {
             const tl = gsap.timeline({
                onComplete: () => onComplete()
            });

            tl.to(curtainRef.current, {
                y: "-100%",
                duration: 1.2,
                ease: "power4.inOut", // Очень плавный, дорогой easing
            });
        }, 300);
    };

    runTextAnimation();

    return () => clearInterval(interval);
  }, [onComplete]);

  // Рендерим текст побуквенно для стилизации
  const renderText = () => {
    return TARGET_TEXT.split("").map((letter, index) => {
      // Если буква уже "отгадана" (индекс меньше итерации)
      if (index < Math.floor(iteration)) {
        return <span key={index} className={styles.locked}>{letter}</span>;
      }
      // Если буква еще "шифруется"
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
          <span className={styles.cursor}>_</span>
        </h1>
      </div>
    </div>
  );
}