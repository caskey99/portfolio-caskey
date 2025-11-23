'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import Image from 'next/image';
import styles from './Hero.module.scss';
import heroImg from '@/app/assets/hero-image.png'; 

const projects = [
  { id: 1, title: "Crypto Fintech", cat: "Dashboard", color: "#8a0000" },
  { id: 2, title: "AI Assistant", cat: "Interface", color: "#00448a" },
  { id: 3, title: "Cyber eCommerce", cat: "Shop", color: "#008a44" },
  { id: 4, title: "WebGL Portfolio", cat: "Experience", color: "#8a4400" },
  { id: 5, title: "Social Network", cat: "Mobile", color: "#44008a" },
];

interface HeroProps {
  startAnimation: boolean;
}

export default function Hero({ startAnimation }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Превращаем число в строку для рендера
  const scrollPercentage = useTransform(scrollYProgress, (val) => Math.round(val * 100) + "%");

  // --- ФАЗА 1: ВХОД ---
  const imageScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.5]);
  const cardWidth = useTransform(scrollYProgress, [0, 0.15], ["30%", "90%"]);
  const cardHeight = useTransform(scrollYProgress, [0, 0.15], ["0%", "80%"]);
  const cardRadius = useTransform(scrollYProgress, [0, 0.15], ["100px", "20px"]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  const textOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const textLeftX = useTransform(scrollYProgress, [0, 0.1], [0, -300]);
  const textRightX = useTransform(scrollYProgress, [0, 0.1], [0, 300]);

  // --- ФАЗА 2: ВКЛЮЧЕНИЕ ---
  const screenOpacity = useTransform(scrollYProgress, [0.15, 0.2], [0, 1]);
  const flashOpacity = useTransform(scrollYProgress, [0.15, 0.16, 0.2], [0, 1, 0]);

  // --- ФАЗА 4: ВЫКЛЮЧЕНИЕ ---
  const monitorScaleY = useTransform(scrollYProgress, [0.85, 0.95], [1, 0.002]);
  const monitorScaleX = useTransform(scrollYProgress, [0.95, 1], [1, 0]);

  const introTextVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } }
  };
  const introImageVariants = {
    hidden: { y: "110%", scale: 0.8, opacity: 0, filter: "blur(10px)" },
    visible: { y: 0, scale: 1, opacity: 1, filter: "blur(0px)", transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.6 } }
  };

  return (
    <section ref={containerRef} className={styles.heroSection}>
      <div className={styles.stickyContainer}>
        <div className={styles.gridContainer}>
          
          {/* МОНИТОР */}
          <motion.div 
            className={styles.monitorFrame}
            style={{
              width: cardWidth,
              height: cardHeight,
              opacity: cardOpacity,
              borderRadius: cardRadius,
              scaleY: monitorScaleY,
              scaleX: monitorScaleX,
            }}
          >
             <motion.div className={styles.monitorScreen} style={{ opacity: screenOpacity }}>
                <div className={styles.gridBackground} />
                <motion.div className={styles.flashOverlay} style={{ opacity: flashOpacity }} />

                {/* ТУННЕЛЬ */}
                <div className={styles.tunnelContainer}>
                  {projects.map((project, index) => (
                    <TunnelCard 
                      key={project.id} 
                      index={index} 
                      total={projects.length} 
                      progress={scrollYProgress} 
                      data={project}
                    />
                  ))}
                </div>

                {/* UI OVERLAY */}
                <div className={styles.uiOverlay}>
                    <span>SYSTEM: ONLINE</span>
                    <span>SCROLL: <motion.span>{scrollPercentage}</motion.span></span>
                </div>

             </motion.div>
          </motion.div>

          {/* ЛЕВЫЙ ТЕКСТ */}
          <motion.div className={styles.colLeft} style={{ x: textLeftX, opacity: textOpacity }}>
             <div className={styles.textMask}>
                <motion.div initial="hidden" animate={startAnimation ? "visible" : "hidden"} variants={introTextVariants}>
                  <h1 className={styles.name}>ARTEM<br/>ZAITSEV</h1>
                </motion.div>
             </div>
          </motion.div>

          {/* ФОТО */}
          <div className={styles.colCenter}>
              <motion.div 
                  className={styles.imageMotionWrapper}
                  style={{ 
                    scale: imageScale, 
                    transformOrigin: 'bottom center',
                    opacity: useTransform(scrollYProgress, [0.15, 0.2], [1, 0.2]) 
                  }}
              >
                <motion.div 
                    className={styles.imageContainer}
                    initial="hidden"
                    animate={startAnimation ? "visible" : "hidden"}
                    variants={introImageVariants}
                    style={{ transformOrigin: 'bottom center' }}
                >
                    <Image 
                      src={heroImg} 
                      alt="Artem Zaitsev"
                      fill 
                      priority 
                      sizes="(max-width: 768px) 100vw, 45vw"
                      style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
                    />
                </motion.div>
              </motion.div>
          </div>

          {/* ПРАВЫЙ ТЕКСТ */}
          <motion.div className={styles.colRight} style={{ x: textRightX, opacity: textOpacity }}>
             <div className={styles.textMask}>
                <motion.div initial="hidden" animate={startAnimation ? "visible" : "hidden"} variants={introTextVariants}>
                  <h2 className={styles.job}>Frontend<br/>Developer</h2>
                </motion.div>
             </div>
          </motion.div>

        </div>

        {/* MOBILE */}
        <div className={styles.mobileProjects}>
            {projects.map((p) => (
               <div key={p.id} className={styles.mobCard}>
                  <h3>{p.title}</h3>
                  <p>{p.cat}</p>
               </div>
            ))}
        </div>

      </div>
      
      <div style={{ height: '50vh' }}></div>
    </section>
  );
}

function TunnelCard({ index, total, progress, data }: { index: number, total: number, progress: MotionValue<number>, data: any }) {
  const start = 0.20 + (index * (0.50 / total));
  const end = start + 0.3; 

  const scale = useTransform(progress, [start, end], [0, 2]);
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.1, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, end], ["0%", "-50%"]); 
  const blur = useTransform(progress, [start, start + 0.1, end - 0.1, end], ["10px", "0px", "0px", "20px"]);
  const display = useTransform(progress, (v) => (v >= start && v <= end ? "flex" : "none"));

  return (
    <motion.div 
      className={styles.tunnelCard}
      style={{
        scale, opacity, y, display,
        filter: useTransform(blur, (v) => `blur(${v})`),
        zIndex: index,
        borderColor: data.color,
        boxShadow: `0 0 30px ${data.color}40`
      }}
    >
       <div className={styles.cardInner}>
          <div className={styles.cardMockup} style={{ backgroundColor: data.color + '20' }} />
          <div className={styles.cardInfo}>
             <h3>{data.title}</h3>
             <p>{data.cat}</p>
          </div>
       </div>
    </motion.div>
  );
}