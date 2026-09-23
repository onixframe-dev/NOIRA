'use client';

import Image from 'next/image';
import { useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getSiteData } from '@/lib/site-data';
import { SectionHeading } from './SectionHeading';
import shared from '@/styles/shared.module.css';
import styles from './ProductGallery.module.css';

export function ProductGallery() {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const { products } = getSiteData(language);
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<Array<HTMLElement | null>>([]);
  const [activeCard, setActiveCard] = useState(0);

  const updateActiveCard = () => {
    if (!track.current) return;
    const center = track.current.scrollLeft + track.current.clientWidth / 2;
    let closest = 0;
    let distance = Number.POSITIVE_INFINITY;
    cards.current.forEach((card, index) => {
      if (!card) return;
      const nextDistance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (nextDistance < distance) { distance = nextDistance; closest = index; }
    });
    setActiveCard(closest);
  };

  const showCard = (index: number) => {
    cards.current[index]?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    setActiveCard(index);
  };

  return (
    <section className={`${shared.section} ${styles.section}`} id="collection">
      <div className={shared.shell}>
        <div className={styles.head}>
          <SectionHeading eyebrow={isRu ? 'Коллекция / 04' : 'The collection / 04'} title={isRu ? 'Три формулы. Один характер.' : 'Three formulas. One point of view.'} copy={isRu ? 'Компактная линейка с понятными задачами, чтобы выбор рациона не превращался в каталог на сотню позиций.' : 'A compact range with distinct roles, designed to make the choice feel easy rather than endless.'} />
          <a href="#finder" className={shared.textLink}>{isRu ? 'Подобрать формулу' : 'Find your formula'} <ArrowUpRight size={16} /></a>
        </div>
        <div
          ref={track}
          className={styles.grid}
          role="region"
          tabIndex={0}
          onScroll={updateActiveCard}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); showCard(Math.max(0, activeCard - 1)); }
            if (event.key === 'ArrowRight') { event.preventDefault(); showCard(Math.min(products.length - 1, activeCard + 1)); }
          }}
          aria-label={isRu ? 'Карусель формул NOIRA' : 'NOIRA formula carousel'}
        >
          {products.map((product, index) => (
            <article ref={(node) => { cards.current[index] = node; }} className={styles.card} key={product.id} style={{ '--accent': product.accent } as CSSProperties}>
              <div className={styles.index}>0{index + 1}</div>
              <div className={styles.visual}><div className={styles.glow} /><Image src={product.image} alt={`${product.name} NOIRA`} fill sizes="(max-width: 760px) 80vw, 30vw" /></div>
              <div className={styles.copy}><span>{product.eyebrow}</span><h3>{product.name}</h3><p>{product.description}</p><ul>{product.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul></div>
            </article>
          ))}
        </div>
        <div className={styles.pagination} role="group" aria-label={isRu ? 'Выбор формулы' : 'Choose formula'}>
          {products.map((product, index) => <button key={product.id} type="button" className={activeCard === index ? styles.paginationActive : ''} aria-label={`${isRu ? 'Формула' : 'Formula'} ${index + 1}: ${product.name}`} aria-current={activeCard === index ? 'true' : undefined} onClick={() => showCard(index)}>0{index + 1}</button>)}
        </div>
      </div>
    </section>
  );
}
