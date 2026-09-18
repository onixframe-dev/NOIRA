import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const unavailable = { ru: 'Форма временно недоступна. Попробуйте позже.', en: 'The form is temporarily unavailable. Please try again later.' };

export async function POST(request: Request) {
  let language: 'ru' | 'en' = 'ru';
  try {
    const body = await request.json();
    language = body.language === 'en' ? 'en' : 'ru';
    const name = String(body.name || '').trim(); const email = String(body.email || '').trim();
    const subject = String(body.subject || (language === 'ru' ? 'Запрос с сайта' : 'Website inquiry')).trim();
    const message = String(body.message || '').trim(); const website = String(body.website || '').trim();
    const error = (ru: string, en: string, status = 400) => NextResponse.json({ error: language === 'ru' ? ru : en }, { status });
    if (website) return NextResponse.json({ ok: true });
    if (name.length < 2 || name.length > 80) return error('Введите имя.', 'Please enter your name.');
    if (!emailPattern.test(email) || email.length > 160) return error('Введите корректный email.', 'Please enter a valid email.');
    if (message.length < 10 || message.length > 4000) return error('Сообщение должно содержать от 10 до 4000 символов.', 'Message should be between 10 and 4000 characters.');
    const apiKey = process.env.RESEND_API_KEY; const to = process.env.CONTACT_TO_EMAIL;
    if (!apiKey || !to) { console.error('Contact form is missing Resend configuration'); return error(unavailable.ru, unavailable.en, 503); }
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({ from: process.env.CONTACT_FROM_EMAIL || 'NOIRA Website <onboarding@resend.dev>', to: [to], replyTo: email, subject: `[NOIRA] ${subject} — ${name}`, text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nLanguage: ${language}\n\n${message}` });
    if (result.error) throw new Error(result.error.message);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: unavailable[language] }, { status: 500 });
  }
}
