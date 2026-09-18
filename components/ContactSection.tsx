'use client';

import { useLanguage } from '@/context/LanguageContext';
import { SectionHeading } from './SectionHeading';
import { ContactForm } from './ContactForm';
import shared from '@/styles/shared.module.css';
import styles from './ContactSection.module.css';

export function ContactSection() {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  return <section className={`${shared.section} ${styles.section}`} id="contact"><div className={`${shared.shell} ${styles.grid}`}><div>
    <SectionHeading eyebrow={isRu ? 'Напишите нам / 06' : 'Say hello / 06'} title={isRu ? <>Для магазинов, партнёров и просто <em>любопытных людей.</em></> : <>For stockists, press, or simply <em>curious humans.</em></>} copy={isRu ? 'Хотите обсудить поставки, сотрудничество или узнать больше о формулах NOIRA? Оставьте сообщение, и мы свяжемся с вами.' : 'Interested in stocking NOIRA, collaborating, or learning more about our formulas? Leave a message and we will be in touch.'} />
    <div className={styles.meta}><div><span>Email</span><a href="mailto:hello@noira.pet">hello@noira.pet</a></div><div><span>{isRu ? 'Сотрудничество' : 'Partnerships'}</span><strong>{isRu ? 'Ритейл • партнёрства • пресса' : 'Retail • partnerships • press'}</strong></div></div>
  </div><ContactForm /></div></section>;
}
