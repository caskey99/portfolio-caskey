import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 900) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // Проверка при загрузке
    checkMobile();

    // Оптимизированный листенер (можно добавить debounce в будущем)
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}