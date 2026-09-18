'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/context/LanguageContext';
import shared from '@/styles/shared.module.css';
import styles from './HeroExperience.module.css';

gsap.registerPlugin(ScrollTrigger);

export function HeroExperience() {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const section = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const bagClosed = useRef<HTMLImageElement>(null);
  const bagOpen = useRef<HTMLImageElement>(null);
  const bagPour = useRef<HTMLImageElement>(null);
  const bowlEmpty = useRef<HTMLImageElement>(null);
  const bowlFull = useRef<HTMLImageElement>(null);
  const catWalk = useRef<HTMLImageElement>(null);
  const catSniff = useRef<HTMLImageElement>(null);
  const catEat = useRef<HTMLImageElement>(null);
  const orbA = useRef<HTMLDivElement>(null);
  const orbB = useRef<HTMLDivElement>(null);
  const stages = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [loadAnimationFrames, setLoadAnimationFrames] = useState(false);

  useEffect(() => {
    const load = () => setLoadAnimationFrames(true);
    const idleCallback = window.requestIdleCallback?.(load, { timeout: 1800 });
    const timeout = idleCallback === undefined ? window.setTimeout(load, 900) : undefined;
    const onScroll = () => {
      if (window.scrollY > 24) load();
    };

    window.addEventListener('scroll', onScroll, { passive: true, once: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (idleCallback !== undefined) window.cancelIdleCallback?.(idleCallback);
      if (timeout !== undefined) window.clearTimeout(timeout);
    };
  }, []);

  useGSAP(() => {
    if (!loadAnimationFrames || !section.current || !bagClosed.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const media = gsap.matchMedia();
    let sceneScale = 1;
    media.add({ mobile: '(max-width: 800px)', tablet: '(min-width: 801px) and (max-width: 1100px)', desktop: '(min-width: 1101px)' }, (context) => { sceneScale = context.conditions?.mobile ? .96 : context.conditions?.tablet ? .98 : 1; });
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.78
      }
    });

    const hidden = [bagOpen.current, bagPour.current, bowlEmpty.current, bowlFull.current, catWalk.current, catSniff.current, catEat.current, ...stages.map((ref) => ref.current)];
    gsap.set(hidden, { opacity: 0 });

    timeline
      .to(copy.current, { yPercent: -18, opacity: .42, duration: .38 }, .08)
      .to(copy.current, { autoAlpha: 0, duration: .18 }, .48)
      .to(bagClosed.current, { scale: 1.05, rotate: -1.2, yPercent: -1, duration: 1 }, .04)
      .to(bagClosed.current, { opacity: 0, duration: .14 }, .25)
      .fromTo(bagOpen.current, { opacity: 0, scale: 1.025 }, { opacity: 1, scale: 1.055, duration: .18 }, .24)
      .to(stages[0].current, { opacity: 1, y: 0, duration: .16 }, .27)
      .to(bagOpen.current, { opacity: 0, duration: .14 }, .40)
      .fromTo(bagPour.current, { opacity: 0, xPercent: -2, rotate: -2 }, { opacity: 1, xPercent: 0, rotate: 0, duration: .19 }, .39)
      .fromTo(bowlEmpty.current, { opacity: 0, yPercent: 20, scale: .95 }, { opacity: 1, yPercent: 0, scale: 1, duration: .20 }, .41)
      .to(stages[0].current, { autoAlpha: 0, y: -12, duration: .10 }, .43)
      .to(stages[1].current, { autoAlpha: 1, y: 0, duration: .12 }, .55)
      .to(bagPour.current, { opacity: 0, yPercent: -4, duration: .16 }, .59)
      .to(bowlEmpty.current, { opacity: 0, duration: .1 }, .58)
      .to(bowlFull.current, { opacity: 1, duration: .13 }, .58)
      .fromTo(catWalk.current, { opacity: 0, xPercent: -25, scale: .93 }, { opacity: 1, xPercent: 4, scale: 1, duration: .25 }, .60)
      .to(stages[1].current, { autoAlpha: 0, y: -12, duration: .10 }, .66)
      .to(stages[2].current, { autoAlpha: 1, y: 0, duration: .12 }, .77)
      .to(catWalk.current, { opacity: 0, xPercent: 1, scale: .985, duration: .18 }, .76)
      .fromTo(catSniff.current, { opacity: 0, xPercent: -5, scale: .985 }, { opacity: 1, xPercent: 2, scale: sceneScale, duration: .19 }, .76)
      .to(catSniff.current, { opacity: 0, xPercent: 1, scale: .99, duration: .18 }, .88)
      .fromTo(catEat.current, { opacity: 0, xPercent: -3, scale: .985 }, { opacity: 1, xPercent: 2, scale: sceneScale, duration: .2 }, .88)
      .to(stages[2].current, { autoAlpha: 0, y: -12, duration: .08 }, .89)
      .to(stages[3].current, { autoAlpha: 1, y: 0, duration: .10 }, .98);

    if (orbA.current) gsap.to(orbA.current, { yPercent: -22, xPercent: 8, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: true } });
    if (orbB.current) gsap.to(orbB.current, { yPercent: 18, xPercent: -7, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: true } });
    return () => media.revert();
  }, { scope: section, dependencies: [loadAnimationFrames] });

  const stageCopy = isRu
    ? ['Открываем ритуал.', 'Свежий корм. Чистая подача.', 'Любопытство делает своё.', 'Ужин одобрен.']
    : ['Open the ritual.', 'Fresh kibble. Clean pour.', 'Curiosity does the rest.', 'Dinner, approved.'];

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
            <Image ref={bagClosed} className={`${styles.asset} ${styles.bag}`} src="/assets/pack-closed.webp" alt="NOIRA" fill priority sizes="(max-width: 900px) 72vw, 42vw" />
            {loadAnimationFrames && <>
              <Image ref={bagOpen} className={`${styles.asset} ${styles.deferredAsset} ${styles.bag}`} src="/assets/pack-open.webp" alt="" aria-hidden fill sizes="(max-width: 900px) 72vw, 42vw" />
              <Image ref={bagPour} className={`${styles.asset} ${styles.deferredAsset} ${styles.bag}`} src="/assets/pack-pour.webp" alt="" aria-hidden fill sizes="(max-width: 900px) 72vw, 42vw" />
              <Image ref={bowlEmpty} className={`${styles.asset} ${styles.bowl}`} src="/assets/bowl-empty.webp" alt={isRu ? 'Пустая миска NOIRA' : 'Empty NOIRA bowl'} fill sizes="(max-width: 900px) 42vw, 22vw" />
              <Image ref={bowlFull} className={`${styles.asset} ${styles.bowl}`} src="/assets/bowl-full.webp" alt={isRu ? 'Миска NOIRA с кормом' : 'NOIRA bowl with kibble'} fill sizes="(max-width: 900px) 42vw, 22vw" />
              <Image ref={catWalk} className={`${styles.asset} ${styles.cat} ${styles.catWalk}`} src="/assets/cat-walk.webp" alt={isRu ? 'Чёрный кот подходит к миске' : 'Black cat approaching food'} fill sizes="(max-width: 900px) 58vw, 28vw" />
              <Image ref={catSniff} className={`${styles.asset} ${styles.cat} ${styles.catSniff}`} src="/assets/cat-sniff.webp" alt={isRu ? 'Кот нюхает корм' : 'Black cat sniffing food'} fill sizes="(max-width: 900px) 58vw, 28vw" />
              <Image ref={catEat} className={`${styles.asset} ${styles.cat} ${styles.catEat}`} src="/assets/cat-eat.webp" alt={isRu ? 'Кот ест корм' : 'Black cat eating'} fill sizes="(max-width: 900px) 58vw, 28vw" />
            </>}
          </div>

          {stageCopy.map((label, index) => (
            <div ref={stages[index]} className={styles.stageLabel} key={label}><span>0{index + 1}</span><strong>{label}</strong></div>
          ))}
        </div>
        <div className={styles.scrollHint}><ArrowDown size={16} /> {isRu ? 'Прокрутите, чтобы накормить' : 'Scroll to feed'}</div>
      </div>
    </section>
  );
}
