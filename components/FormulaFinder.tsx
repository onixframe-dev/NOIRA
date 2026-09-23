'use client';

import { useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getSiteData } from '@/lib/site-data';
import { SectionHeading } from './SectionHeading';
import { PackCarousel } from './PackCarousel';
import shared from '@/styles/shared.module.css';
import styles from './FormulaFinder.module.css';

type ProfileKey = 'indoor' | 'active' | 'sensitive';

export function FormulaFinder() {
  const [active, setActive] = useState<ProfileKey>('active');
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const { language } = useLanguage(); const isRu = language === 'ru';
  const { finderProfiles } = getSiteData(language); const profile = finderProfiles[active];
  const profileKeys = Object.keys(finderProfiles) as ProfileKey[];
  const accent = active === 'indoor' ? '#9fb49c' : active === 'sensitive' ? '#72aaa8' : '#d8b16a';
  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? profileKeys.length - 1 : event.key === 'ArrowRight' ? (index + 1) % profileKeys.length : event.key === 'ArrowLeft' ? (index + profileKeys.length - 1) % profileKeys.length : null;
    if (next === null) return; event.preventDefault(); setActive(profileKeys[next]); tabs.current[next]?.focus();
  };
  return <section className={`${shared.section} ${styles.section}`} id="finder"><div className={`${shared.shell} ${styles.grid}`}><div className={styles.copy}>
    <SectionHeading eyebrow={isRu ? 'Подбор формулы / 05' : 'Find your formula / 05'} title={isRu ? 'Как проходит день вашей кошки?' : 'What kind of day does your cat have?'} copy={isRu ? 'Выберите наиболее похожий профиль, чтобы увидеть формулу NOIRA для привычного ритма.' : 'Choose the closest profile to find the NOIRA formula that suits your cat’s everyday routine.'} />
    <div className={styles.tabs} role="tablist" aria-label={isRu ? 'Профиль кошки' : 'Cat profile'}>{profileKeys.map((key, index) => <button ref={(element) => { tabs.current[index] = element; }} id={`profile-tab-${key}`} key={key} role="tab" aria-controls="profile-panel" aria-selected={active === key} tabIndex={active === key ? 0 : -1} className={active === key ? styles.active : ''} onKeyDown={(event) => onTabKeyDown(event, index)} onClick={() => setActive(key)}>{finderProfiles[key].label}</button>)}</div>
    <div className={styles.result} id="profile-panel" role="tabpanel" aria-labelledby={`profile-tab-${active}`} tabIndex={0} aria-live="polite"><span>{isRu ? 'Рекомендуем' : 'Recommended'}</span><h3>{profile.title}</h3><p>{profile.copy}</p><a className={`${shared.button} ${shared.primary}`} href="#contact">{isRu ? 'Спросить о формуле' : 'Ask about the formula'}</a></div>
  </div><div className={styles.visual}><PackCarousel key={active} gallery={profile.gallery} title={profile.title} accent={accent} /></div></div></section>;
}
