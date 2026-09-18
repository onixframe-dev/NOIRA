'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
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
  return (
    <section className={`${shared.section} ${styles.section}`} id="collection">
      <div className={shared.shell}>
        <div className={styles.head}>
          <SectionHeading eyebrow={isRu ? 'Коллекция / 04' : 'The collection / 04'} title={isRu ? 'Три формулы. Один характер.' : 'Three formulas. One point of view.'} copy={isRu ? 'Компактная линейка с понятными задачами, чтобы выбор рациона не превращался в каталог на сотню позиций.' : 'A compact range with distinct roles, designed to make the choice feel easy rather than endless.'} />
          <a href="#finder" className={shared.textLink}>{isRu ? 'Подобрать формулу' : 'Find your formula'} <ArrowUpRight size={16} /></a>
        </div>
        <div className={styles.grid}>
          {products.map((product, index) => (
            <article className={styles.card} key={product.id} style={{ '--accent': product.accent } as CSSProperties}>
              <div className={styles.index}>0{index + 1}</div>
              <div className={styles.visual}><div className={styles.glow} /><Image src={product.image} alt={`${product.name} NOIRA`} fill sizes="(max-width: 760px) 80vw, 30vw" /></div>
              <div className={styles.copy}><span>{product.eyebrow}</span><h3>{product.name}</h3><p>{product.description}</p><ul>{product.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
