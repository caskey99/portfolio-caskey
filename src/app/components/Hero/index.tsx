'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import Image from 'next/image';
import styles from './Hero.module.scss';
import heroImg from '@/app/assets/hero-image.png'; 

// Данные проектов
const projects = [
  { id: 1, title: "Crypto Fintech", cat: "Dashboard" },
  { id: 2, title: "AI Assistant", cat: "Interface" },
  { id: 3, title: "Cyber eCommerce", cat: "Shop" },
  { id: 4, title: "WebGL Portfolio", cat: "Experience" },
  { 
    id: 5, 
    title: "Social Network", 
    cat: "Mobile", 
    description: "Next-gen social platform focused on privacy and decentralized identity. Features end-to-end encryption and zero-knowledge proofs." 
  },
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

  // --- ТАЙМЛАЙН ГЛАВНОГО ЭКРАНА ---

  // 1. МОНИТОР (Быстрое раскрытие 0% -> 10%)
  const cardWidth = useTransform(scrollYProgress, [0, 0.1], ["30%", "100vw"]);
  const cardHeight = useTransform(scrollYProgress, [0, 0.1], ["0%", "100vh"]);
  const cardRadius = useTransform(scrollYProgress, [0, 0.1], ["100px", "0px"]);
  const cardBorder = useTransform(scrollYProgress, [0.09, 0.1], ["1px", "0px"]); 
  const cardOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  // 2. ФОТОГРАФИЯ (Уход 10% -> 25%)
  const imageScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const imageY = useTransform(scrollYProgress, [0.1, 0.25], ["0%", "100%"]); 
  const imageOpacity = useTransform(scrollYProgress, [0.2, 0.25], [1, 0]);

  // 3. ТЕКСТ (0% -> 10%)
  const textOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const textLeftX = useTransform(scrollYProgress, [0, 0.1], [0, -300]);
  const textRightX = useTransform(scrollYProgress, [0, 0.1], [0, 300]);

  // 4. ЭКРАН (Фон)
  const screenOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  // 5. ДВИЖЕНИЕ СЕТКИ (ЗАМОРОЗКА)
  // Сетка движется до 0.85 (момент посадки последней карты), затем замирает.
  const gridZ = useTransform(scrollYProgress, [0, 0.85], [0, 500]); 

  // Входная анимация
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
              borderWidth: cardBorder,
            }}
          >
             <motion.div className={styles.monitorScreen} style={{ opacity: screenOpacity }}>
                {/* ФОН С ЗАМОРОЗКОЙ */}
                <motion.div 
                  className={styles.gridBackground} 
                  style={{ z: gridZ }} // Движение по Z (на нас)
                />

                {/* ПОТОК КАРТОЧЕК */}
                <div className={styles.tunnelContainer}>
                  {projects.map((project, index) => {
                    const isLast = index === projects.length - 1;
                    
                    if (isLast) {
                      return (
                        <LandingCard 
                          key={project.id} 
                          progress={scrollYProgress} 
                          data={project} 
                        />
                      );
                    }
                    
                    return (
                      <FlyingCard 
                        key={project.id} 
                        index={index} 
                        total={projects.length} 
                        progress={scrollYProgress} 
                        data={project}
                      />
                    );
                  })}
                </div>
             </motion.div>
          </motion.div>

          <motion.div className={styles.colLeft} style={{ x: textLeftX, opacity: textOpacity }}>
             <div className={styles.textMask}>
                <motion.div initial="hidden" animate={startAnimation ? "visible" : "hidden"} variants={introTextVariants}>
                  <h1 className={styles.name}>ARTEM<br/>ZAITSEV</h1>
                </motion.div>
             </div>
          </motion.div>

          <div className={styles.colCenter}>
              <motion.div 
                  className={styles.imageMotionWrapper}
                  style={{ 
                    scale: imageScale, 
                    y: imageY, 
                    transformOrigin: 'bottom center',
                    opacity: imageOpacity
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

          <motion.div className={styles.colRight} style={{ x: textRightX, opacity: textOpacity }}>
             <div className={styles.textMask}>
                <motion.div initial="hidden" animate={startAnimation ? "visible" : "hidden"} variants={introTextVariants}>
                  <h2 className={styles.job}>Frontend<br/>Developer</h2>
                </motion.div>
             </div>
          </motion.div>

        </div>

        <div className={styles.mobileProjects}>
            {projects.map((p) => (
               <div key={p.id} className={styles.mobCard}>
                  <h3>{p.title}</h3>
                  <p>{p.cat}</p>
               </div>
            ))}
        </div>

      </div>
      
      <div style={{ height: '500vh' }}></div>
    </section>
  );
}

// --- 1. ЛЕТЯЩИЕ КАРТОЧКИ (ЛИНЕЙНЫЕ) ---
function FlyingCard({ index, total, progress, data }: { index: number, total: number, progress: MotionValue<number>, data: any }) {
  // Начинаем с 0.15, заканчиваем полет всех "мусорных" карточек к 0.80
  const START_OFFSET = 0.15; 
  const END_OFFSET = 0.80; 
  
  const step = (END_OFFSET - START_OFFSET) / (total - 1);
  const start = START_OFFSET + (index * step);
  const end = start + 0.30; // Быстрый пролет

  // --- ЛИНЕЙНАЯ ТРАЕКТОРИЯ ---
  const life = useTransform(progress, [start, end], [0, 1]);

  const isLeft = index % 2 === 0;
  
  // X: Строго вбок
  const targetX = isLeft ? -1500 : 1500;
  // Y: Строго вверх/вниз (без синусоид, просто чередование)
  // 0, 1 -> Вверх; 2, 3 -> Вниз
  const targetY = (index % 4 < 2) ? -400 : 400;

  // Scale: Растет линейно
  const scale = useTransform(life, [0, 1], [0.1, 2.5]);
  
  // Opacity: Без исчезновения в конце
  const opacity = useTransform(progress, [start, start + 0.05], [0, 1]);

  const x = useTransform(life, [0, 1], [0, targetX]);
  const y = useTransform(life, [0, 1], [0, targetY]);
  
  const display = useTransform(progress, (v) => (v >= start && v < end ? "flex" : "none"));

  return (
    <motion.div 
      className={styles.tunnelCard}
      style={{ scale, opacity, x, y, display, zIndex: index }}
    >
       <div className={styles.cardImage} />
       <div className={styles.cardInfo}>
          <h3>{data.title}</h3>
          <p>{data.cat}</p>
       </div>
    </motion.div>
  );
}

// --- 2. ПОСАДОЧНАЯ КАРТОЧКА (СЛЕВА) ---
function LandingCard({ progress, data }: { progress: MotionValue<number>, data: any }) {
  // Стартует, когда остальные уже почти улетели
  const start = 0.75;
  const landed = 0.90; // Момент фиксации

  const life = useTransform(progress, [start, landed], [0, 1]);
  
  // Scale: Из центра (маленькая) до нормального размера
  // scale 1 будет соответствовать размеру, заданному в CSS (.landingCard)
  const scale = useTransform(life, [0, 1], [0.1, 1]);
  
  // Позиция: 
  // Start: 0,0 (Центр)
  // End: x = -25vw (Сдвиг влево), y = 0
  const x = useTransform(life, [0, 1], ["0vw", "-25vw"]); 
  const y = useTransform(life, [0, 1], ["0vh", "0vh"]);

  const opacity = useTransform(progress, [start, start + 0.05], [0, 1]);
  
  // Текст: появляется только когда карточка села
  const textOpacity = useTransform(progress, [landed, landed + 0.05], [0, 1]);
  const textX = useTransform(progress, [landed, landed + 0.05], [50, 0]);

  const display = useTransform(progress, (v) => (v >= start ? "flex" : "none"));

  return (
    <>
      <motion.div 
        className={`${styles.tunnelCard} ${styles.landingCard}`}
        style={{ scale, x, y, opacity, display, zIndex: 100 }}
      >
         <div className={styles.cardImage} />
         {/* Скрываем инфо внутри карточки, оно будет снаружи */}
         <div className={styles.cardInfo} style={{ display: 'none' }} />
      </motion.div>

      {/* ОПИСАНИЕ (СПРАВА ОТ КАРТОЧКИ) */}
      <motion.div 
        className={styles.landingDescription}
        style={{ 
          opacity: textOpacity, 
          x: textX,
          display 
        }}
      >
        <div className={styles.descHeader}>
          <span>LATEST</span>
          <h4>FEATURED WORK</h4>
        </div>
        
        <h2 className={styles.descTitle}>{data.title}</h2>
        <p className={styles.descText}>{data.description}</p>

        <div className={styles.descTags}>
           <span>React Native</span>
           <span>Firebase</span>
           <span>Web3</span>
        </div>
      </motion.div>
    </>
  );
}