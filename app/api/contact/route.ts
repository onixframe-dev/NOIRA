import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const language = body.language === 'en' ? 'en' : 'ru';
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const subject = String(body.subject || (language === 'ru' ? 'Запрос с сайта' : 'Website inquiry')).trim();
    const message = String(body.message || '').trim();
    const website = String(body.website || '').trim();

    const error = (ru: string, en: string, status = 400) => NextResponse.json({ error: language === 'ru' ? ru : en }, { status });

    if (website) return NextResponse.json({ ok: true });
    if (name.length < 2 || name.length > 80) return error('Введите имя.', 'Please enter your name.');
    if (!emailPattern.test(email) || email.length > 160) return error('Введите корректный email.', 'Please enter a valid email.');
    if (message.length < 10 || message.length > 4000) return error('Сообщение должно содержать от 10 до 4000 символов.', 'Message should be between 10 and 4000 characters.');

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL || 'NOIRA Website <onboarding@resend.dev>';

    if (!apiKey || !to) return error('Отправка почты ещё не настроена. Добавьте RESEND_API_KEY и CONTACT_TO_EMAIL.', 'Email delivery is not configured yet. Add RESEND_API_KEY and CONTACT_TO_EMAIL.', 503);

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `[NOIRA] ${subject} — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nLanguage: ${language}\n\n${message}`
    });

    if (result.error) throw new Error(result.error.message);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Не удалось отправить сообщение. Попробуйте ещё раз.' }, { status: 500 });
  }
}
