'use client';
import { useState } from 'react';
import Preloader from '@/app/components/Preloader';
import Hero from '@/app/components/Hero';
import Projects from '@/app/components/Projects';

export default function Home() {
  // Состояние: началась ли анимация главного экрана?
  const [heroAnimationStart, setHeroAnimationStart] = useState(false);

  return (
    <main>
      {/* Preloader не исчезает из DOM сразу, он уезжает вверх.
         onComplete сработает в момент НАЧАЛА движения шторы вверх.
      */}
      <Preloader onComplete={() => setHeroAnimationStart(true)} />
      
      {/* Передаем команду "На старт!" в Hero */}
      <Hero startAnimation={heroAnimationStart} />
      
      {/* Остальные секции можно показывать сразу или тоже анимировать */}
      <Projects />
    </main>
  );
}