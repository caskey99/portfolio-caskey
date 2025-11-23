'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './Hero.module.scss';
import heroImg from '@/app/assets/hero-image.png'; 

interface HeroProps {
  startAnimation: boolean;
}

export default function Hero({ startAnimation }: HeroProps) {
  
  const textVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.2 
      }
    }
  };

  const imageVariants = {
    hidden: { 
      y: "110%", 
      scale: 0.8, // Начинаем с 80% размера, чтобы не было слишком мелко
      opacity: 0,
      filter: "blur(10px)" 
    },
    visible: { 
      y: 0, 
      scale: 1, 
      opacity: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 1.4, 
        ease: [0.22, 1, 0.36, 1], 
        delay: 0.6 
      }
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        
        {/* Имя (Слева, поднято вверх стилями padding-bottom) */}
        <div className={styles.colLeft}>
           <div className={styles.textMask}>
              <motion.div 
                initial="hidden"
                animate={startAnimation ? "visible" : "hidden"}
                variants={textVariants}
              >
                <h1 className={styles.name}>
                  ARTEM<br/>ZAITSEV
                </h1>
              </motion.div>
           </div>
        </div>

        {/* Фото (По центру, прижато к низу) */}
        <div className={styles.colCenter}>
            <motion.div 
                className={styles.imageMotionWrapper}
                initial="hidden"
                animate={startAnimation ? "visible" : "hidden"}
                variants={imageVariants}
            >
              <div className={styles.imageContainer}>
                  <Image 
                    src={heroImg} 
                    alt="Artem Zaitsev"
                    fill 
                    priority 
                    sizes="(max-width: 768px) 100vw, 45vw"
                    style={{ 
                        objectFit: 'contain', 
                        objectPosition: 'bottom center' // Железобетонно к низу
                    }}
                  />
              </div>
            </motion.div>
        </div>

        {/* Должность (Справа, поднято вверх) */}
        <div className={styles.colRight}>
           <div className={styles.textMask}>
              <motion.div 
                initial="hidden"
                animate={startAnimation ? "visible" : "hidden"}
                variants={textVariants}
              >
                <h2 className={styles.job}>
                  Frontend<br/>Developer
                </h2>
              </motion.div>
           </div>
        </div>

      </div>
    </section>
  );
}