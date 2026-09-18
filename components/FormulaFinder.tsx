'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getSiteData } from '@/lib/site-data';
import { SectionHeading } from './SectionHeading';
import { PackRotator } from './PackRotator';
import shared from '@/styles/shared.module.css';
import styles from './FormulaFinder.module.css';

type ProfileKey = 'indoor' | 'active' | 'sensitive';

export function FormulaFinder() {
  const [active, setActive] = useState<ProfileKey>('active');
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const { finderProfiles } = getSiteData(language);
  const profile = finderProfiles[active];
  const accent = active === 'indoor' ? '#9fb49c' : active === 'sensitive' ? '#72aaa8' : '#d8b16a';

  return (
    <section className={`${shared.section} ${styles.section}`} id="finder">
      <div className={`${shared.shell} ${styles.grid}`}>
        <div className={styles.copy}>
          <SectionHeading eyebrow={isRu ? 'Подбор формулы / 05' : 'Find your formula / 05'} title={isRu ? 'Как проходит день вашей кошки?' : 'What kind of day does your cat have?'} copy={isRu ? 'Выберите наиболее похожий профиль. Интерактивный подбор покажет формулу NOIRA, которая лучше соответствует привычному ритму.' : 'Choose the closest profile. This demo interaction recommends the NOIRA formula that best matches the routine.'} />
          <div className={styles.tabs} role="tablist" aria-label={isRu ? 'Профиль кошки' : 'Cat profile'}>
            {(Object.keys(finderProfiles) as ProfileKey[]).map((key) => <button key={key} role="tab" aria-selected={active === key} className={active === key ? styles.active : ''} onClick={() => setActive(key)}>{finderProfiles[key].label}</button>)}
          </div>
          <div className={styles.result} aria-live="polite">
            <span>{isRu ? 'Рекомендуем' : 'Recommended'}</span>
            <h3>{profile.title}</h3>
            <p>{profile.copy}</p>
            <a className={`${shared.button} ${shared.primary}`} href="#contact">{isRu ? 'Спросить о формуле' : 'Ask about the formula'}</a>
          </div>
        </div>
        <div className={styles.visual}><PackRotator image={profile.image} title={profile.title} accent={accent} /></div>
      </div>
    </section>
  );
}
