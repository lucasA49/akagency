/**
 * @component CountUp
 * @description Compteur animé qui incrémente de 0 jusqu'à la valeur cible
 *              dès que l'élément entre dans le viewport.
 *
 * @param {number} end      Valeur finale à atteindre.
 * @param {number} duration Durée de l'animation en ms (défaut : 2000).
 * @param {string} suffix   Suffixe affiché après le nombre (ex: "+", "%").
 * @param {string} prefix   Préfixe affiché avant le nombre (ex: "€").
 *
 * @example
 * <CountUp end={50} suffix="+" />
 */

import { useEffect, useRef, useState } from 'react';

export default function CountUp({ end, duration = 2000, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          animateCount();
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  function animateCount() {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing : easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}
