'use client';

import { useLanguage } from '@/context/LanguageContext';
import { getSiteData } from '@/lib/site-data';
import shared from '@/styles/shared.module.css';
import styles from './Footer.module.css';

export function Footer() {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const { navItems } = getSiteData(language);
  return (
    <footer className={styles.footer}>
      <div className={`${shared.shell} ${styles.grid}`}>
        <div className={styles.brand}><span>NOIRA</span><p>{isRu ? 'Премиальное питание для любопытных кошек.' : 'Premium nutrition for curious cats.'}</p></div>
        <nav aria-label={isRu ? 'Навигация в подвале' : 'Footer navigation'}>{navItems.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</nav>
        <div className={styles.meta}><span>{isRu ? 'Концепт-проект' : 'Concept project'}</span><span>© {new Date().getFullYear()} NOIRA</span></div>
      </div>
    </footer>
  );
}
