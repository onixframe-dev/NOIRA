# NOIRA Premium Pet Brand

Портфолио-концепт премиального бренда корма для кошек на Next.js, React и TypeScript.

## Что внутри

- Next.js 14 App Router + React 18 + TypeScript
- GSAP + ScrollTrigger для hero scroll-scene
- Lenis для плавного скролла
- Русский интерфейс по умолчанию + переключатель RU / EN
- Google Fonts через `next/font/google`: Cormorant Garamond + Manrope
- Адаптив desktop / tablet / mobile
- Интерактивная 3D-подача пачки в блоке подбора: drag мышью или пальцем
- Контактная форма через Resend
- Favicon NOIRA
- CSS Modules: стили компонентов вынесены из `app/globals.css`

## Запуск

```bash
npm install
npm run dev
```

Открыть http://localhost:3000

## Почтовая форма

Скопируйте `.env.example` в `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=NOIRA Website <onboarding@resend.dev>
```

Для production подтвердите домен отправителя в Resend.

## Hero-анимация

Sticky-сцена управляется скроллом:

1. закрытая пачка;
2. открытие;
3. высыпание корма в пустую миску;
4. наполненная миска;
5. кот подходит;
6. кот нюхает корм;
7. кот встаёт непосредственно к миске и ест.

Золотой и бирюзовый фоновые glow-эффекты ослаблены примерно на 40% относительно первой версии.

## Архитектура стилей

`app/globals.css` содержит только CSS variables, reset/base и глобальные responsive variables. Общие UI-примитивы находятся в `styles/shared.module.css`. Каждый крупный компонент имеет собственный `*.module.css`.

## Контент

Локализованные карточки продуктов, преимущества, навигация и подбор формулы находятся в `lib/site-data.ts`. Состояние языка хранится в `context/LanguageContext.tsx` и запоминается в `localStorage`.
