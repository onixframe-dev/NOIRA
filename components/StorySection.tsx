'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { SectionHeading } from './SectionHeading';
import shared from '@/styles/shared.module.css';
import styles from './StorySection.module.css';

export function StorySection() {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  return (
    <section className={`${shared.section} ${styles.section}`} id="story">
      <div className={`${shared.shell} ${styles.grid}`}>
        <div>
          <SectionHeading
            eyebrow={isRu ? 'Стандарт NOIRA / 02' : 'The NOIRA standard / 02'}
            title={isRu ? <>Питание, в котором всё <em>продумано.</em></> : <>Nutrition that feels <em>considered.</em></>}
            copy={isRu ? 'NOIRA строится на простой идее: состав должен быть понятным, упаковка спокойной, а сам продукт приятно видеть дома каждый день.' : 'We designed NOIRA around a simple idea: the food should be nutritionally clear, visually calm and genuinely desirable to live with.'}
          />
          <div className={styles.metrics}>
            <div><strong>3</strong><span>{isRu ? 'формулы' : 'formulas'}</span></div>
            <div><strong>3×</strong><span>{isRu ? 'ключевых принципа питания' : 'core nutritional pillars'}</span></div>
            <div><strong>0</strong><span>{isRu ? 'лишнего визуального шума' : 'needless visual noise'}</span></div>
          </div>
        </div>
        <figure className={styles.photo}>
          <Image src="/assets/lifestyle.webp" alt="NOIRA" fill sizes="(max-width: 800px) 100vw, 46vw" />
          <figcaption>{isRu ? 'Упаковка, которую не хочется прятать в шкаф.' : 'Designed to belong in the home, not hide in a cupboard.'}</figcaption>
        </figure>
      </div>
    </section>
  );
}
