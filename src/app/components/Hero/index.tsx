'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Hero.module.scss';

// Замените '/hero.png' на путь к вашему реальному фото
// Рекомендую фото в формате WebP для оптимизации
import heroImg from '@/assets/hero-image.png'; 

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        
        {/* Левая часть: Имя */}
        <motion.div 
          className={styles.nameCol}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 4.2, duration: 0.8 }}
        >
          <h1>Artem<br/>Zaitsev</h1>
        </motion.div>

        {/* Центр: Фото */}
        <motion.div 
            className={styles.photoCol}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 4, duration: 1, ease: "circOut" }}
        >
           <div className={styles.imageWrapper}>
              {/* В реальном проекте используйте ваше фото */}
              <div className={styles.placeholderImg}>
                {/*  */}
                 <span style={{color: '#000'}}>YOUR PHOTO HERE</span>
              </div>
           </div>
        </motion.div>

        {/* Правая часть: Должность */}
        <motion.div 
          className={styles.jobCol}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 4.2, duration: 0.8 }}
        >
          <h2>Frontend<br/>Developer</h2>
        </motion.div>

      </div>
    </section>
  );
}