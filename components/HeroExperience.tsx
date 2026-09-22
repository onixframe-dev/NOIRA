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
    heroFrames.forEach((source) => { const image = new window.Image(); image.src = source; });
  }, []);

  useGSAP(() => {
    if (!section.current || pack.current.length !== packFrames.length || bowls.current.length !== bowlFrames.length || cat.current.length !== catFrames.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const hidden = [...pack.current.slice(1), ...bowls.current, ...cat.current, ...labels.current];
    gsap.set(hidden, { autoAlpha: 0 });
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: 0.7 },
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

    timeline
      .to(copy.current, { yPercent: -18, autoAlpha: 0, duration: 0.24 }, 0.05)
      .to(pack.current[0], { scale: 1.05, rotate: -1, duration: 0.18 }, 0.04);
    timeline.fromTo(labels.current[0], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.12);
    swap(pack.current[0], pack.current[1], 0.22);
    switchCopy(0, 1, 0.23);
    swap(pack.current[1], pack.current[2], 0.38);

    // The bowl states deliberately switch at the same scroll position: no blended double exposure.
    // Lower only the empty bowl during the pour, so the falling kibble lands inside it.
    timeline.set(bowls.current[0], { autoAlpha: 1, yPercent: 12, xPercent: 34, scale: 1 }, 0.38);
    swap(bowls.current[0], bowls.current[1], 0.5);
    timeline.set(bowls.current[1], { xPercent: 34, yPercent: 0 }, 0.5);
    // Keep an opened pack on screen once the bowl is full, rather than leaving an empty composition.
    swap(pack.current[2], pack.current[1], 0.5);
    timeline.set(pack.current[1], { yPercent: 1 }, 0.5);

    cat.current.slice(0, 6).forEach((frame, index) => {
      const start = 0.64 + index * 0.06;
      swap(index ? cat.current[index - 1] : null, frame, start);
      timeline.set(frame, { xPercent: index * 4 }, start);
    });
    timeline.set(pack.current[1], { autoAlpha: 0 }, 0.64);
    // The bowl stays fixed; the successive cat frames move closer to it instead.
    timeline.set(bowls.current[1], { xPercent: 34 }, 0.64);
    switchCopy(1, 2, 0.6);
    switchCopy(2, 3, 0.72);
    switchCopy(3, 4, 0.84);

    // The last source frame already includes its own bowl, so hide both separate layers first.
    // The integrated eating PNG has its bowl drawn farther left inside the canvas.
    // Offset the whole frame so that bowl lands on the previous bowl position.
    timeline.set(cat.current[5], { autoAlpha: 0 }, 1.0).set(bowls.current[1], { autoAlpha: 0 }, 1.0).set(cat.current[6], { autoAlpha: 1, xPercent: 54 }, 1.0);
    switchCopy(4, 5, 0.98);

    [orbA.current, orbB.current].forEach((orb, index) => orb && gsap.to(orb, {
      yPercent: index ? 18 : -22,
      xPercent: index ? -7 : 8,
      ease: 'none',
      scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: true },
    }));
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
          <div className={styles.visual} aria-label={isRu ? 'Анимация кормления NOIRA' : 'Animated NOIRA feeding sequence'}>
            <div className={styles.halo} />
            {packFrames.map((source, index) => <Image key={source} ref={(node) => { if (node) pack.current[index] = node; }} className={`${styles.asset} ${styles.bag}`} src={source} alt={index === 0 ? 'NOIRA' : ''} aria-hidden={index > 0} fill priority={index === 0} loading={index ? 'eager' : undefined} sizes="(max-width: 900px) 72vw, 42vw" />)}
            {bowlFrames.map((source, index) => <Image key={source} ref={(node) => { if (node) bowls.current[index] = node; }} className={`${styles.asset} ${styles.bowl}`} src={source} alt={index === 0 ? (isRu ? 'Пустая миска NOIRA' : 'Empty NOIRA bowl') : (isRu ? 'Миска NOIRA с кормом' : 'NOIRA bowl with kibble')} fill loading="eager" sizes="(max-width: 900px) 42vw, 22vw" />)}
            {catFrames.map((source, index) => <Image key={source} ref={(node) => { if (node) cat.current[index] = node; }} className={`${styles.asset} ${styles.cat} ${index === 6 ? styles.catEating : styles.catSequence}`} src={source} alt={index === 0 ? (isRu ? 'Чёрный кот подходит к миске' : 'Black cat approaching food') : ''} aria-hidden={index > 0} fill loading="eager" sizes="(max-width: 900px) 58vw, 28vw" />)}
          </div>
          {sceneCopy.map(([number, title, description], index) => <div ref={(node) => { if (node) labels.current[index] = node; }} className={styles.stageLabel} key={number}><span>{number}</span><strong>{title}</strong><p>{description}</p></div>)}
        </div>
        <div className={styles.scrollHint}><ArrowDown size={16} /> {isRu ? 'Прокрутите, чтобы накормить' : 'Scroll to feed'}</div>
      </div>
    </section>
  );
}
