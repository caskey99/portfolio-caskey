'use client';
import { useState } from 'react';
import Preloader from '@/app/components/Preloader';
import Hero from '@/app/components/Hero';
import Projects from '@/app/components/Projects';
import styles from './page.module.scss'; // Пустой файл или стили контейнера

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <main>
      {/* Прелоадер висит в DOM пока не завершится */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      {/* Показываем контент, но он скрыт за шторой прелоадера в момент анимации */}
      {!loading && (
        <>
          <Hero />
          <Projects />
          {/* Добавьте Footer и другие секции */}
        </>
      )}
    </main>
  );
}