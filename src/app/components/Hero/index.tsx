'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import Image from 'next/image';
import styles from './Hero.module.scss';
import heroImg from '@/app/assets/hero-image.png'; 

const projects = [
  { id: 1, title: "Crypto Fintech", cat: "Dashboard" },
  { id: 2, title: "AI Assistant", cat: "Interface" },
  { id: 3, title: "Cyber eCommerce", cat: "Shop" },
  { id: 4, title: "WebGL Portfolio", cat: "Experience" },
  { id: 5, title: "Social Network", cat: "Mobile" },
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

  // --- ТАЙМЛАЙН ---

  // 1. МОНИТОР (0% -> 10%): Мгновенное расширение
  const cardWidth = useTransform(scrollYProgress, [0, 0.1], ["30%", "100vw"]);
  const cardHeight = useTransform(scrollYProgress, [0, 0.1], ["0%", "100vh"]);
  const cardRadius = useTransform(scrollYProgress, [0, 0.1], ["100px", "0px"]);
  const cardBorder = useTransform(scrollYProgress, [0.09, 0.1], ["1px", "0px"]); 
  const cardOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  // 2. ФОТОГРАФИЯ (0% -> 30%): Уходит вниз
  const imageScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const imageY = useTransform(scrollYProgress, [0.1, 0.3], ["0%", "100%"]); 
  const imageOpacity = useTransform(scrollYProgress, [0.25, 0.3], [1, 0]);

  // 3. ТЕКСТ (0% -> 10%): Исчезает
  const textOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const textLeftX = useTransform(scrollYProgress, [0, 0.1], [0, -300]);
  const textRightX = useTransform(scrollYProgress, [0, 0.1], [0, 300]);

  // 4. ЭКРАН (0% -> 5%): Появляется фон
  const screenOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

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
                <div className={styles.gridBackground} />

                {/* ПОТОК КАРТОЧЕК */}
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
      
      {/* 500vh для долгого плавного полета */}
      <div style={{ height: '500vh' }}></div>
    </section>
  );
}

function TunnelCard({ index, total, progress, data }: { index: number, total: number, progress: MotionValue<number>, data: any }) {
  // --- ЛОГИКА "ЗВЕЗДНОГО ПОЛЕТА" ---
  
  // 1. Старт полета (после раскрытия монитора)
  const START_OFFSET = 0.15; 
  
  // 2. Длительность жизни одной карточки на экране (35% скролла)
  // Это обеспечивает одинаковую скорость для всех.
  const LIFESPAN = 0.35; 

  // 3. Равномерное распределение: каждая следующая карточка вылетает с задержкой
  // Мы распределяем их так, чтобы последняя исчезла ровно в 1.0
  const totalDuration = 1.0 - START_OFFSET;
  const step = (totalDuration - LIFESPAN) / (total - 1);

  const start = START_OFFSET + (index * step);
  const end = start + LIFESPAN;

  // --- КООРДИНАТЫ (Вектор движения) ---
  // Четко: влево, вправо, влево, вправо...
  const isLeft = index % 2 === 0;
  
  // Чтобы не было скучно, добавим немного вариативности по высоте (Y),
  // но X всегда будет очень широким, чтобы уходить за экран.
  
  // X: Цель - уйти за пределы экрана (например, +/- 1800px)
  const targetX = isLeft ? -1800 : 1800;
  
  // Y: Немного вверх или вниз, чтобы не перекрывать центр
  const targetY = (index % 4 === 0 || index % 4 === 3) ? -400 : 400;

  // --- АНИМАЦИЯ ---
  
  // Прогресс движения конкретной карточки (от 0 до 1)
  const life = useTransform(progress, [start, end], [0, 1]);

  // Scale: От точки (0) до гиганта (3.5)
  // Используем easeIn, чтобы она ускорялась при приближении к "лицу"
  const scale = useTransform(life, (v) => 0.1 + (Math.pow(v, 2) * 3.5));
  
  // Opacity: Быстрое появление в центре, дальше всегда видно
  const opacity = useTransform(progress, 
    [start, start + 0.05], 
    [0, 1]
  );

  // Движение: Линейная интерполяция от 0 до цели
  // Карточка рождается в 0,0 и летит в targetX, targetY
  const x = useTransform(life, [0, 1], [0, targetX]);
  const y = useTransform(life, [0, 1], [0, targetY]);
  
  const display = useTransform(progress, (v) => (v >= start ? "flex" : "none"));

  return (
    <motion.div 
      className={styles.tunnelCard}
      style={{
        scale, 
        opacity, 
        x, 
        y,
        display,
        // Z-Index: Чем больше progress, тем ближе карточка к камере -> выше z-index
        zIndex: Math.round(index * 10), 
      }}
    >
       <div className={styles.cardImage}>
          {/* Placeholder или <Image /> */}
       </div>
       <div className={styles.cardInfo}>
          <h3>{data.title}</h3>
          <p>{data.cat}</p>
       </div>
    </motion.div>
  );
}