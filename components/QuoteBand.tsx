'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from './QuoteBand.module.css';

export function QuoteBand() {
  const { language } = useLanguage();
  const phrase = language === 'ru' ? 'ПРОДУМАННОЕ ПИТАНИЕ • НАСТОЯЩАЯ ЗАБОТА • КРАСИВЫЕ РИТУАЛЫ • ' : 'REAL NUTRITION • REAL LOVE • BEAUTIFUL ROUTINES • ';
  return (
    <section className={styles.band} aria-label="NOIRA">
      <div className={styles.track}>{Array.from({ length: 4 }).map((_, index) => <span key={index}>{phrase}</span>)}</div>
    </section>
  );
}
