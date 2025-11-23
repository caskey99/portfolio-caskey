'use client';
import { motion } from 'framer-motion';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <motion.div 
        className={styles.footerContent}
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }} // Сработает, когда увидим половину
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={styles.left}>
           <span>© 2025 Artem Zaitsev</span>
        </div>
        
        <div className={styles.center}>
           <a href="mailto:contact@artem.dev" className={styles.contactBtn}>
             Let's Talk
           </a>
        </div>

        <div className={styles.right}>
           {/* Соц иконки текстом или svg */}
           <a href="#">GH</a>
           <a href="#">LN</a>
           <a href="#">TG</a>
        </div>
      </motion.div>
    </footer>
  );
}