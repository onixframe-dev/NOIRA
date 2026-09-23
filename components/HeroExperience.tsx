'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/context/LanguageContext';
import shared from '@/styles/shared.module.css';
import { bowlFrames, catFrames, heroFrames, packFrames } from './heroFrames';
import { heroCopy } from './heroCopy';
import styles from './HeroExperience.module.css';

gsap.registerPlugin(ScrollTrigger);

export function HeroExperience() {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const section = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const pack = useRef<HTMLImageElement[]>([]);
  const bowls = useRef<HTMLImageElement[]>([]);
  const cat = useRef<HTMLImageElement[]>([]);
  const labels = useRef<HTMLDivElement[]>([]);
  const orbA = useRef<HTMLDivElement>(null);
  const orbB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    heroFrames.slice(0, 3).forEach((source) => { const image = new window.Image(); image.src = source; });
  }, []);

  useGSAP(() => {
    if (!section.current || pack.current.length !== packFrames.length || bowls.current.length !== bowlFrames.length || cat.current.length !== catFrames.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 1200px)',
      tablet: '(min-width: 768px) and (max-width: 1199px)',
      mobile: '(max-width: 767px) and (min-height: 550px)',
      compact: '(max-width: 520px)',
      landscapePhone: '(max-width: 932px) and (max-height: 549px)',
    }, (context) => {
      const conditions = context.conditions as Record<string, boolean>;
      const isMobile = Boolean(conditions.mobile);
      // Phones use the same animation geometry and frame sequence as tablets.
      const isCompact = Boolean(conditions.compact) && !isMobile;
      const isLandscapePhone = Boolean(conditions.landscapePhone);
      const hidden = [...pack.current.slice(1), ...bowls.current, ...cat.current, ...labels.current];
      gsap.set(hidden, { autoAlpha: 0 });

      if (isLandscapePhone) return;

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: isMobile ? 0.12 : 0.7 },
      });
      const swap = (hide: Element | null | undefined, show: Element | null | undefined, at: number) => {
        if (hide) timeline.set(hide, { autoAlpha: 0 }, at);
        if (show) timeline.set(show, { autoAlpha: 1 }, at);
      };
      const switchCopy = (from: number, to: number, at: number) => {
        timeline.to(labels.current[from], { autoAlpha: 0, y: -10, duration: 0.04 }, at);
        timeline.set(labels.current, { autoAlpha: 0 }, at + 0.04);
        timeline.fromTo(labels.current[to], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.06 }, at + 0.05);
      };

      if (isCompact) timeline.set(pack.current[0], { yPercent: 40, scale: 0.84 }, 0);

      timeline
        .to(copy.current, { yPercent: -12, autoAlpha: 0, duration: 0.07 }, 0.04)
        .to(pack.current[0], { scale: 1.05, rotate: -1, yPercent: isCompact ? 40 : 0, duration: 0.18 }, 0.04);
      timeline.fromTo(labels.current[0], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.12);
      swap(pack.current[0], pack.current[1], 0.22);
      if (isCompact) timeline.set(pack.current[1], { xPercent: -28, yPercent: -5, scale: 0.88, transformOrigin: '100% 100%' }, 0.22);
      switchCopy(0, 1, 0.23);
      swap(pack.current[1], pack.current[2], 0.38);
      if (isCompact) timeline.set(pack.current[2], { xPercent: -18, yPercent: -5, scale: 0.88, transformOrigin: '100% 100%' }, 0.38);

      timeline.set(bowls.current[0], { autoAlpha: 1, yPercent: 12, xPercent: isCompact ? 0 : 34, scale: 1 }, 0.38);
      swap(bowls.current[0], bowls.current[1], 0.5);
      timeline.set(bowls.current[1], { xPercent: isCompact ? 0 : 34, yPercent: 0 }, 0.5);
      swap(pack.current[2], pack.current[1], 0.5);
      timeline.set(pack.current[1], { yPercent: 1 }, 0.5);

      cat.current.slice(0, 6).forEach((frame, index) => {
        const start = 0.62 + index * 0.05;
        swap(index ? cat.current[index - 1] : null, frame, start);
        timeline.set(frame, { xPercent: isCompact && index >= 4 ? 50 : index * 4, yPercent: isCompact ? -30 : 0 }, start);
      });
      timeline.set(pack.current[1], { autoAlpha: 0 }, 0.61);
      timeline.set(bowls.current[1], { xPercent: isCompact ? 0 : 34, yPercent: isCompact ? 20 : 0 }, 0.64);
      switchCopy(1, 2, 0.53);
      switchCopy(2, 3, 0.64);
      switchCopy(3, 4, 0.75);
      timeline.set(cat.current.slice(0, 6), { autoAlpha: 0 }, 0.94).set(bowls.current[1], { autoAlpha: 0 }, 0.94).set(cat.current[6], { autoAlpha: 1, xPercent: 54, yPercent: isCompact ? -30 : 0 }, 0.94);
      switchCopy(4, 5, 0.86);

      [orbA.current, orbB.current].forEach((orb, index) => orb && gsap.to(orb, {
        yPercent: index ? 18 : -22,
        xPercent: index ? -7 : 8,
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: true },
      }));
    });

    return () => media.revert();
  }, { scope: section });

  const sceneCopy = heroCopy[isRu ? 'ru' : 'en'];

  return (
    <section ref={section} className={styles.scroll} id="top">
      <div className={styles.sticky}>
        <div className={styles.gridOverlay} />
        <div ref={orbA} className={`${styles.orb} ${styles.orbA}`} />
        <div ref={orbB} className={`${styles.orb} ${styles.orbB}`} />
        <div className={`${shared.shell} ${styles.layout}`}>
          <div ref={copy} className={styles.copy}>
            <span className={shared.eyebrow}>{isRu ? 'Премиальное питание / 01' : 'Premium feline nutrition / 01'}</span>
            <h1>{isRu ? 'Для кошки, которая замечает всё.' : 'Made for the cat who notices everything.'}</h1>
            <p>{isRu ? 'Продуманный состав, качественные ингредиенты и немного театра вокруг ужина. NOIRA превращает обычное кормление в красивый ежедневный ритуал.' : 'High-quality nutrition, focused ingredients and a little theatre at dinner time. NOIRA turns everyday feeding into a ritual worth looking forward to.'}</p>
            <div className={styles.actions}>
              <a className={`${shared.button} ${shared.primary}`} href="#collection">{isRu ? 'Смотреть линейку' : 'Explore formulas'}</a>
              <a className={`${shared.button} ${shared.ghost}`} href="#story">{isRu ? 'Наша философия' : 'Our philosophy'}</a>
            </div>
          </div>
          <div className={styles.visual} role="img" aria-label={isRu ? 'Анимация кормления NOIRA' : 'Animated NOIRA feeding sequence'}>
            <div className={styles.halo} />
            {packFrames.map((source, index) => <Image key={source} ref={(node) => { if (node) pack.current[index] = node; }} className={`${styles.asset} ${styles.bag} ${index === 0 ? styles.initialBag : ''} ${index === 2 ? styles.pourBag : ''}`} src={source} alt={index === 0 ? 'NOIRA' : ''} aria-hidden={index > 0} fill priority={index === 0} loading={index ? 'lazy' : undefined} sizes="(max-width: 599px) 90vw, (max-width: 899px) 68vw, (max-width: 1199px) 54vw, 42vw" />)}
            {bowlFrames.map((source, index) => <Image key={source} ref={(node) => { if (node) bowls.current[index] = node; }} className={`${styles.asset} ${styles.bowl}`} src={source} alt={index === 0 ? (isRu ? 'Пустая миска NOIRA' : 'Empty NOIRA bowl') : (isRu ? 'Миска NOIRA с кормом' : 'NOIRA bowl with kibble')} fill loading="lazy" sizes="(max-width: 599px) 28vw, (max-width: 899px) 24vw, 22vw" />)}
            {catFrames.map((source, index) => <Image key={source} ref={(node) => { if (node) cat.current[index] = node; }} className={`${styles.asset} ${styles.cat} ${index === 6 ? styles.catEating : styles.catSequence} ${index === 5 ? styles.catSniff : ''}`} src={source} alt={index === 0 ? (isRu ? 'Чёрный кот подходит к миске' : 'Black cat approaching food') : ''} aria-hidden={index > 0} fill loading="lazy" sizes="(max-width: 599px) 62vw, (max-width: 899px) 58vw, 28vw" />)}
          </div>
          {sceneCopy.map(([number, title, description], index) => <div ref={(node) => { if (node) labels.current[index] = node; }} className={`${styles.stageLabel} ${styles[`stageLabel${index}`]}`} key={number}><span>{number}</span><strong>{title}</strong><p>{description}</p></div>)}
        </div>
        <div className={styles.scrollHint}><ArrowDown size={16} /> {isRu ? 'Прокрутите, чтобы накормить' : 'Scroll to feed'}</div>
      </div>
    </section>
  );
}
