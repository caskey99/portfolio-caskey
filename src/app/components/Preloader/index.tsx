'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './Preloader.module.scss';

const TARGET_TEXT = "Artem Zaitsev Dev";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; 

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const [iteration, setIteration] = useState(0);
  // 1. Добавляем стейт для отслеживания, что мы на клиенте
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 2. Как только компонент загрузился в браузере, ставим true
    setIsMounted(true);

    let interval: NodeJS.Timeout;
    const animationDuration = 2500;
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
        setTimeout(() => {
             const tl = gsap.timeline({
                onComplete: () => onComplete()
            });

            tl.to(curtainRef.current, {
                y: "-100%",
                duration: 1.2,
                ease: "power4.inOut",
            });
        }, 300);
    };

    runTextAnimation();

    return () => clearInterval(interval);
  }, [onComplete]);

  const renderText = () => {
    return TARGET_TEXT.split("").map((letter, index) => {
      // Если буква уже "отгадана"
      if (index < Math.floor(iteration)) {
        return <span key={index} className={styles.locked}>{letter}</span>;
      }
      
      // 3. ВАЖНОЕ ИСПРАВЛЕНИЕ:
      // Если мы на сервере или это первый рендер клиента - не используем Math.random().
      // Возвращаем пробел той же ширины (моноширинный шрифт это позволяет).
      if (!isMounted) {
        return <span key={index} className={styles.scramble} style={{opacity: 0}}>-</span>;
      }

      // Если мы уже "живые" в браузере - крутим рандом
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
          {/* Курсор тоже показываем только на клиенте, чтобы не дергался */}
          {isMounted && <span className={styles.cursor}>_</span>}
        </h1>
      </div>
    </div>
  );
}