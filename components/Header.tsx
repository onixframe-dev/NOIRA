'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getSiteData } from '@/lib/site-data';
import shared from '@/styles/shared.module.css';
import styles from './Header.module.css';

export function Header() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { language, setLanguage } = useLanguage();
  const { navItems } = getSiteData(language);
  const isRu = language === 'ru';

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) { setOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className={`${styles.header} ${compact ? styles.compact : ''}`}>
      <div className={`${shared.shell} ${styles.inner}`}>
        <a className={styles.brand} href="#top" aria-label="NOIRA" onClick={() => setOpen(false)}>
          <span className={styles.brandMark}>N</span><span>NOIRA</span>
        </a>

        <nav className={styles.desktopNav} aria-label={isRu ? 'Основная навигация' : 'Primary navigation'}>
          {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>

        <div className={styles.actions}>
          <div className={styles.languageSwitch} aria-label={isRu ? 'Выбор языка' : 'Language'}>
            <button className={language === 'ru' ? styles.activeLanguage : ''} onClick={() => setLanguage('ru')} type="button">RU</button>
            <span>/</span>
            <button className={language === 'en' ? styles.activeLanguage : ''} onClick={() => setLanguage('en')} type="button">EN</button>
          </div>
          <a className={styles.cta} href="#collection">{isRu ? 'Коллекция' : 'Explore'} <ArrowUpRight size={16} /></a>
          <button ref={menuButton} className={styles.menuButton} aria-label={open ? (isRu ? 'Закрыть меню' : 'Close menu') : (isRu ? 'Открыть меню' : 'Open menu')} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && <div className={`${styles.mobileMenu} ${styles.mobileMenuOpen}`}>
        <div className={shared.shell}>
          <nav aria-label={isRu ? 'Мобильная навигация' : 'Mobile navigation'}>
            {navItems.map((item, index) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}</a>
            ))}
          </nav>
          <p>{isRu ? 'Премиальное питание для любопытных кошек.' : 'Premium nutrition for curious cats.'}</p>
        </div>
      </div>}
    </header>
  );
}
