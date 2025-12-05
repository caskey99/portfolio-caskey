'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import Image from 'next/image';
import styles from './Hero.module.scss';
import heroImg from '@/app/assets/hero-image.png'; 

const projects = [
  { id: 1, title: "Crypto Fintech", cat: "Dashboard" },
  { id: 2, title: "AI Assistant", cat: "Interface" },
  { id: 3, title: "Cyber eCommerce", cat: "Shop" },
  { id: 4, title: "WebGL Portfolio", cat: "Experience" },
  { 
    id: 5, 
    title: "Social Network", 
    cat: "Mobile", 
    description: "Next-gen social platform focused on privacy." 
  },
];

interface HeroProps {
  startAnimation: boolean;
}

export default function Hero({ startAnimation }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    checkMobile(); 
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // --- COMMON VARS ---
  const cardWidth = useTransform(scrollYProgress, [0, 0.1], ["30%", "100vw"]);
  const cardHeight = useTransform(scrollYProgress, [0, 0.1], ["0%", "100vh"]);
  const cardRadius = useTransform(scrollYProgress, [0, 0.1], ["100px", "0px"]);
  const cardBorder = useTransform(scrollYProgress, [0.09, 0.1], ["1px", "0px"]); 
  const cardOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const screenOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const gridZ = useTransform(scrollYProgress, [0, 0.85], [0, 500]); 

  // --- TEXT ANIMATION (TURBO EVAPORATION) ---
  // Исчезает ОЧЕНЬ быстро (0 -> 0.05)
  // Добавляем Blur для эффекта "пара"
  const textY = useTransform(scrollYProgress, [0, 0.1], ["0%", "-100%"]); // Резкий подъем
  const textOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);   // Мгновенное исчезновение
  const textBlur = useTransform(scrollYProgress, [0, 0.05], ["0px", "10px"]); // Размытие в туман

  // --- PHOTO ANIMATION ---
  
  // DESKTOP: Сжаться до 30% (0->0.1) и упасть вниз (0.1->0.25)
  const desktopScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.3]);
  const desktopY = useTransform(scrollYProgress, [0.1, 0.25], ["0%", "150vh"]);
  const desktopOpacity = useTransform(scrollYProgress, [0.15, 0.25], [1, 0]);

  // MOBILE: Уйти в глубину (scale 0.85)
  const mobileScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.85]);
  const mobileFilter = useTransform(scrollYProgress, [0, 0.2], ["brightness(1)", "brightness(0.4)"]);
  const mobileOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);

  // Выбор анимации фото
  const activeImageScale = isMobile ? mobileScale : desktopScale;
  const activeImageY = isMobile ? 0 : desktopY;
  const activeImageOpacity = isMobile ? mobileOpacity : desktopOpacity;
  const activeImageFilter = isMobile ? mobileFilter : "brightness(1)";

  // Intro variants
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
          
          {/* DESKTOP MONITOR */}
          <motion.div 
            className={styles.monitorFrame}
            style={{ width: cardWidth, height: cardHeight, opacity: cardOpacity, borderRadius: cardRadius, borderWidth: cardBorder }}
          >
             <motion.div className={styles.monitorScreen} style={{ opacity: screenOpacity }}>
                <motion.div className={styles.gridBackground} style={{ z: gridZ }} />
                <div className={styles.tunnelContainer}>
                  {projects.map((project, index) => {
                    const isLast = index === projects.length - 1;
                    if (isLast) return <LandingCard key={project.id} progress={scrollYProgress} data={project} />;
                    return <FlyingCard key={project.id} index={index} total={projects.length} progress={scrollYProgress} data={project}/>;
                  })}
                </div>
             </motion.div>
          </motion.div>

          {/* NAME */}
          <motion.div 
            className={styles.colLeft} 
            style={{ y: textY, opacity: textOpacity, filter: textBlur }}
          >
             <div className={styles.textMask}>
                <motion.div initial="hidden" animate={startAnimation ? "visible" : "hidden"} variants={introTextVariants}>
                  <h1 className={styles.name}>ARTEM<br/>ZAITSEV</h1>
                </motion.div>
             </div>
          </motion.div>

          {/* PHOTO */}
          <div className={styles.colCenter}>
              <motion.div 
                  className={styles.imageMotionWrapper}
                  style={{ 
                    scale: activeImageScale, 
                    y: activeImageY, 
                    opacity: activeImageOpacity,
                    filter: activeImageFilter,
                    transformOrigin: 'bottom center',
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
                      sizes="(max-width: 768px) 90vw, 45vw"
                      style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
                    />
                </motion.div>
              </motion.div>
          </div>

          {/* JOB TITLE (Hidden on Mobile via CSS) */}
          <motion.div 
            className={styles.colRight} 
            style={{ y: textY, opacity: textOpacity, filter: textBlur }}
          >
             <div className={styles.textMask}>
                <motion.div initial="hidden" animate={startAnimation ? "visible" : "hidden"} variants={introTextVariants}>
                  <h2 className={styles.job}>Frontend<br/>Developer</h2>
                </motion.div>
             </div>
          </motion.div>

        </div>
      </div>

      {/* MOBILE LIST */}
      <div className={styles.mobileProjects}>
          <motion.h2 
            className={styles.mobileTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6 }}
          >
            Selected Works
          </motion.h2>

          {projects.map((p, i) => (
              <MobileCard key={p.id} data={p} index={i} />
          ))}
      </div>
      
      <div className={styles.scrollSpacer}></div>
    </section>
  );
}

function MobileCard({ data, index }: { data: any, index: number }) {
  return (
    <motion.div 
      className={styles.mobCard}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
    >
      <h3>{data.title}</h3>
      <p>{data.cat}</p>
    </motion.div>
  );
}

function FlyingCard({ index, total, progress, data }: { index: number, total: number, progress: MotionValue<number>, data: any }) {
  const START_OFFSET = 0.15; 
  const END_OFFSET = 0.80; 
  const step = (END_OFFSET - START_OFFSET) / (total - 1);
  const start = START_OFFSET + (index * step);
  const end = start + 0.30; 
  const life = useTransform(progress, [start, end], [0, 1]);
  const isLeft = index % 2 === 0;
  const targetX = isLeft ? -1500 : 1500;
  const targetY = (index % 4 < 2) ? -400 : 400;
  const scale = useTransform(life, [0, 1], [0.1, 2.5]);
  const opacity = useTransform(progress, [start, start + 0.05], [0, 1]);
  const x = useTransform(life, [0, 1], [0, targetX]);
  const y = useTransform(life, [0, 1], [0, targetY]);
  const display = useTransform(progress, (v) => (v >= start && v < end ? "flex" : "none"));

  return (
    <motion.div className={styles.tunnelCard} style={{ scale, opacity, x, y, display, zIndex: index }}>
       <div className={styles.cardImage} />
       <div className={styles.cardInfo}>
          <h3>{data.title}</h3>
          <p>{data.cat}</p>
       </div>
    </motion.div>
  );
}

function LandingCard({ progress, data }: { progress: MotionValue<number>, data: any }) {
  const start = 0.75;
  const landed = 0.90; 
  const life = useTransform(progress, [start, landed], [0, 1]);
  const scale = useTransform(life, [0, 1], [0.1, 1]);
  const x = useTransform(life, [0, 1], ["0vw", "-25vw"]); 
  const y = useTransform(life, [0, 1], ["0vh", "0vh"]);
  const opacity = useTransform(progress, [start, start + 0.05], [0, 1]);
  const textOpacity = useTransform(progress, [landed, landed + 0.05], [0, 1]);
  const textX = useTransform(progress, [landed, landed + 0.05], [50, 0]);
  const display = useTransform(progress, (v) => (v >= start ? "flex" : "none"));

  return (
    <>
      <motion.div className={`${styles.tunnelCard} ${styles.landingCard}`} style={{ scale, x, y, opacity, display, zIndex: 100 }}>
         <div className={styles.cardImage} />
         <div className={styles.cardInfo} style={{ display: 'none' }} />
      </motion.div>
      <motion.div className={styles.landingDescription} style={{ opacity: textOpacity, x: textX, display }}>
        <div className={styles.descHeader}><span>LATEST</span><h4>FEATURED WORK</h4></div>
        <h2 className={styles.descTitle}>{data.title}</h2>
        <p className={styles.descText}>{data.description}</p>
        <div className={styles.descTags}><span>React Native</span><span>Firebase</span><span>Web3</span></div>
      </motion.div>
    </>
  );
}