/**
 * @component AnimatedSection
 * @description Wrapper qui déclenche une animation d'entrée dès que l'élément
 *              entre dans le viewport, via l'API IntersectionObserver.
 *
 * @param {'reveal'|'reveal-left'|'reveal-right'} animation
 *   Classe CSS d'animation à appliquer (définie dans index.css).
 * @param {number}  delay     Délai avant déclenchement de l'animation (ms).
 * @param {number}  threshold Pourcentage de visibilité nécessaire pour déclencher (0–1).
 * @param {string}  className Classes CSS additionnelles.
 * @param {string}  as        Tag HTML à rendre ('div', 'section', 'article', …).
 * @param {ReactNode} children
 *
 * @example
 * <AnimatedSection animation="reveal-left" delay={200}>
 *   <MyComponent />
 * </AnimatedSection>
 */

import { useEffect, useRef } from 'react';

export default function AnimatedSection({
  animation = 'reveal',
  delay = 0,
  threshold = 0.15,
  className = '',
  as: Tag = 'div',
  children,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Applique le délai via style inline
    if (delay) el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el); // une seule fois
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <Tag ref={ref} className={`${animation} ${className}`}>
      {children}
    </Tag>
  );
}
