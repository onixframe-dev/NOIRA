'use client';

import { useLanguage } from '@/context/LanguageContext';
import { SectionHeading } from './SectionHeading';
import { ContactForm } from './ContactForm';
import shared from '@/styles/shared.module.css';
import styles from './ContactSection.module.css';

export function ContactSection() {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  return (
    <section className={`${shared.section} ${styles.section}`} id="contact">
      <div className={`${shared.shell} ${styles.grid}`}>
        <div>
          <SectionHeading eyebrow={isRu ? 'Напишите нам / 06' : 'Say hello / 06'} title={isRu ? <>Для магазинов, партнёров и просто <em>любопытных людей.</em></> : <>For stockists, press, or simply <em>curious humans.</em></>} copy={isRu ? 'Форма уже подключена к серверному API. Добавьте ключ Resend и адрес получателя, чтобы заявки приходили прямо на почту.' : 'The contact experience is production-ready. Connect a Resend account and messages arrive directly by email.'} />
          <div className={styles.meta}>
            <div><span>Email</span><a href="mailto:hello@noira.pet">hello@noira.pet</a></div>
            <div><span>{isRu ? 'Формат' : 'Format'}</span><strong>{isRu ? 'Digital-first premium brand' : 'Digital-first premium brand'}</strong></div>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
