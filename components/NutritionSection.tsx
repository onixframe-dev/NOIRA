'use client';

import { useLanguage } from '@/context/LanguageContext';
import { getSiteData } from '@/lib/site-data';
import { SectionHeading } from './SectionHeading';
import shared from '@/styles/shared.module.css';
import styles from './NutritionSection.module.css';

export function NutritionSection() {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const { benefits } = getSiteData(language);
  return (
    <section className={`${shared.section} ${styles.section}`} id="nutrition">
      <div className={shared.shell}>
        <SectionHeading eyebrow={isRu ? 'Что важно / 03' : 'What matters / 03'} title={isRu ? 'Четыре вещи, которые мы не усложняем.' : 'Four things we refuse to overcomplicate.'} copy={isRu ? 'Хорошее питание для кошек и без того интересно. Ему не нужна стена из модных терминов.' : 'Good feline nutrition is already interesting. It does not need a wall of buzzwords.'} />
        <div className={styles.grid}>
          {benefits.map((benefit) => (
            <article className={styles.card} key={benefit.index}>
              <span>{benefit.index}</span><h3>{benefit.title}</h3><p>{benefit.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
