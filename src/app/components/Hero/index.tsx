'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import styles from './Hero.module.scss';
import heroImg from '@/app/assets/hero-image.png'; 

interface HeroProps {
  startAnimation: boolean;
}

export default function Hero({ startAnimation }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  // 1. Фото: Уменьшаем масштаб. 
  // Больше не двигаем Y, так как transformOrigin сделает всю работу.
  const imageScale = useTransform(scrollY, [0, 500], [1, 0.5]);
  const imageRadius = useTransform(scrollY, [0, 500], ["0px", "40px"]); // Скругление

  // 2. Текст (разлетается)
  const textLeftX = useTransform(scrollY, [0, 400], [0, -200]);
  const textRightX = useTransform(scrollY, [0, 400], [0, 200]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // --- АНИМАЦИЯ ПОЯВЛЕНИЯ (Start) ---
  const introTextVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
    }
  };

  const introImageVariants = {
    hidden: { 
      y: "110%", 
      scale: 0.8, // Начальный скейл для входа
      opacity: 0, 
      filter: "blur(10px)" 
    },
    visible: { 
      y: 0, 
      scale: 1, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.6 }
    }
  };

  return (
    <section ref={containerRef} className={styles.heroSection}>
      <div className={styles.stickyContainer}>
        <div className={styles.gridContainer}>
          
          {/* ЛЕВО */}
          <motion.div 
             className={styles.colLeft}
             style={{ x: textLeftX, opacity: textOpacity }}
          >
             <div className={styles.textMask}>
                <motion.div 
                  initial="hidden"
                  animate={startAnimation ? "visible" : "hidden"}
                  variants={introTextVariants}
                >
                  <h1 className={styles.name}>ARTEM<br/>ZAITSEV</h1>
                </motion.div>
             </div>
          </motion.div>

          {/* ЦЕНТР - ФОТО */}
          {/* Мы анимируем обертку colCenter или вложенный div. 
              В данном случае удобнее применить скейл к imageMotionWrapper */}
          <div className={styles.colCenter}>
              <motion.div 
                  className={styles.imageMotionWrapper}
                  // ВАЖНО: transformOrigin: 'bottom center' заставляет фото
                  // уменьшаться "в пол", не отрывая ног.
                  style={{ 
                      scale: imageScale, 
                      transformOrigin: 'bottom center' 
                  }}
              >
                {/* Внутренний div для анимации появления (Intro) */}
                <motion.div 
                    className={styles.imageContainer}
                    initial="hidden"
                    animate={startAnimation ? "visible" : "hidden"}
                    variants={introImageVariants}
                    style={{ 
                        borderRadius: imageRadius, 
                        overflow: 'hidden',
                        // Для интро анимации origin тоже снизу
                        transformOrigin: 'bottom center' 
                    }}
                >
                    <Image 
                      src={heroImg} 
                      alt="Artem Zaitsev"
                      fill 
                      priority 
                      sizes="(max-width: 768px) 100vw, 45vw"
                      style={{ 
                          objectFit: 'contain', 
                          objectPosition: 'bottom center'
                      }}
                    />
                </motion.div>
              </motion.div>
          </div>

          {/* ПРАВО */}
          <motion.div 
             className={styles.colRight}
             style={{ x: textRightX, opacity: textOpacity }}
          >
             <div className={styles.textMask}>
                <motion.div 
                  initial="hidden"
                  animate={startAnimation ? "visible" : "hidden"}
                  variants={introTextVariants}
                >
                  <h2 className={styles.job}>Frontend<br/>Developer</h2>
                </motion.div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}