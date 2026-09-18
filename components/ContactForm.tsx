'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import shared from '@/styles/shared.module.css';
import styles from './ContactForm.module.css';

const subjects = { ru: ['Оптовые поставки / магазины', 'Пресса и сотрудничество', 'Вопрос о продукте', 'Другое'], en: ['Wholesale / retail', 'Press & collaborations', 'Product question', 'Other'] } as const;

export function ContactForm() {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState<string>(subjects[language][0]);
  useEffect(() => { setSubject(subjects[language][0]); setMessage(''); setState('idle'); }, [language]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    setState('sending'); setMessage('');
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || (isRu ? 'Форма временно недоступна. Попробуйте позже.' : 'The form is temporarily unavailable. Please try again later.'));
      setState('success'); setMessage(isRu ? 'Спасибо! Сообщение отправлено.' : 'Thank you. Your message is on its way.'); form.reset(); setSubject(subjects[language][0]);
    } catch (error) { setState('error'); setMessage(error instanceof Error ? error.message : (isRu ? 'Форма временно недоступна. Попробуйте позже.' : 'The form is temporarily unavailable. Please try again later.')); }
  }

  return <form className={styles.form} onSubmit={onSubmit} noValidate><input type="hidden" name="language" value={language} />
    <div className={styles.row}><label><span>{isRu ? 'Имя' : 'Name'}</span><input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder={isRu ? 'Ваше имя' : 'Your name'} /></label><label><span>Email</span><input name="email" type="email" required maxLength={160} autoComplete="email" placeholder="you@example.com" /></label></div>
    <label><span>{isRu ? 'Тема' : 'Subject'}</span><select name="subject" value={subject} onChange={(event) => setSubject(event.target.value)}>{subjects[language].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
    <label><span>{isRu ? 'Сообщение' : 'Message'}</span><textarea name="message" required minLength={10} maxLength={4000} rows={5} placeholder={isRu ? 'Расскажите, что вас интересует…' : 'Tell us what you would like to know…'} /></label>
    <label className={styles.honeypot} aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
    <div className={styles.actions}><button className={`${shared.button} ${shared.primary}`} disabled={state === 'sending'} type="submit">{state === 'sending' ? (isRu ? 'Отправляем…' : 'Sending…') : state === 'success' ? <><Check size={17} /> {isRu ? 'Отправлено' : 'Sent'}</> : <>{isRu ? 'Отправить' : 'Send message'} <ArrowUpRight size={17} /></>}</button>{message ? <p className={`${styles.status} ${state === 'success' ? styles.success : state === 'error' ? styles.error : ''}`} aria-live="polite">{message}</p> : null}</div>
  </form>;
}
