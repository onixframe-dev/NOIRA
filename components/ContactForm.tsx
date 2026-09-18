'use client';

import { FormEvent, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import shared from '@/styles/shared.module.css';
import styles from './ContactForm.module.css';

export function ContactForm() {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    setMessage('');
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || (isRu ? 'Не удалось отправить сообщение.' : 'Could not send your message.'));
      setState('success');
      setMessage(isRu ? 'Спасибо! Сообщение отправлено.' : 'Thank you. Your message is on its way.');
      form.reset();
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : (isRu ? 'Что-то пошло не так.' : 'Something went wrong.'));
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input type="hidden" name="language" value={language} />
      <div className={styles.row}>
        <label><span>{isRu ? 'Имя' : 'Name'}</span><input name="name" required autoComplete="name" placeholder={isRu ? 'Ваше имя' : 'Your name'} /></label>
        <label><span>Email</span><input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></label>
      </div>
      <label><span>{isRu ? 'Тема' : 'Subject'}</span><select name="subject" defaultValue={isRu ? 'Оптовые поставки / магазины' : 'Wholesale / retail'}><option>{isRu ? 'Оптовые поставки / магазины' : 'Wholesale / retail'}</option><option>{isRu ? 'Пресса и сотрудничество' : 'Press & collaborations'}</option><option>{isRu ? 'Вопрос о продукте' : 'Product question'}</option><option>{isRu ? 'Другое' : 'Other'}</option></select></label>
      <label><span>{isRu ? 'Сообщение' : 'Message'}</span><textarea name="message" required minLength={10} rows={5} placeholder={isRu ? 'Расскажите, что вас интересует…' : 'Tell us what you would like to know…'} /></label>
      <label className={styles.honeypot} aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className={styles.actions}>
        <button className={`${shared.button} ${shared.primary}`} disabled={state === 'sending'} type="submit">
          {state === 'sending' ? (isRu ? 'Отправляем…' : 'Sending…') : state === 'success' ? <><Check size={17} /> {isRu ? 'Отправлено' : 'Sent'}</> : <>{isRu ? 'Отправить' : 'Send message'} <ArrowUpRight size={17} /></>}
        </button>
        {message ? <p className={`${styles.status} ${state === 'success' ? styles.success : state === 'error' ? styles.error : ''}`}>{message}</p> : null}
      </div>
    </form>
  );
}
