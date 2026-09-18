import type { Language } from '@/context/LanguageContext';

const copy = {
  ru: {
    nav: [
      ['История', '#story'], ['Состав', '#nutrition'], ['Коллекция', '#collection'], ['Подобрать рацион', '#finder'], ['Контакты', '#contact']
    ],
    products: [
      { id: 'salmon', name: 'Salmon Formula', eyebrow: 'Энергия на каждый день', description: 'Полнорационный корм с лососем, качественным белком, омега‑3 и омега‑6 для активности, кожи и блестящей шерсти.', image: '/assets/pack-closed.webp', accent: '#d9b76f', facts: ['Лосось', 'Омега 3 & 6', 'На каждый день'] },
      { id: 'indoor', name: 'Indoor Balance', eyebrow: 'Спокойная энергия', description: 'Сбалансированная формула для домашних кошек с умеренной калорийностью, качественным белком и понятным составом.', image: '/assets/pack-noira-black.webp', accent: '#9fb49c', facts: ['Баланс энергии', 'Белок', 'Для дома'] },
      { id: 'ocean', name: 'Ocean Care', eyebrow: 'Деликатная поддержка', description: 'Лёгкая рыбная формула для кошек, которым подходит более деликатный рацион с поддержкой кожи и шерсти.', image: '/assets/pack-noira-teal.webp', accent: '#72aaa8', facts: ['Рыбный белок', 'Мягкая формула', 'Кожа и шерсть'] }
    ],
    benefits: [
      ['01', 'Белок с понятной задачей', 'Животный белок поддерживает мышечный тонус и повседневную активность без перегруженного состава.'],
      ['02', 'Поддержка кожи и шерсти', 'Омега‑3 и омега‑6 помогают поддерживать здоровую кожу и гладкую, блестящую шерсть.'],
      ['03', 'Важные микроэлементы', 'Таурин, витамины и минералы дополняют ежедневный рацион и поддерживают общее самочувствие кошки.'],
      ['04', 'Ничего лишнего', 'Понятная формула, аккуратная подача и минимум визуального шума. Этот принцип объединяет продукт и бренд.']
    ],
    finder: {
      indoor: { label: 'Домашний', title: 'Indoor Balance', copy: 'Для кошек с невысокой активностью, которым нужен полноценный рацион с контролируемой энергетической ценностью.', image: '/assets/pack-noira-black.webp' },
      active: { label: 'Активный', title: 'Salmon Formula', copy: 'Для любопытных и активных кошек, которым подходит рацион с качественным белком и омега‑жирными кислотами.', image: '/assets/pack-closed.webp' },
      sensitive: { label: 'Чувствительный', title: 'Ocean Care', copy: 'Более деликатная рыбная формула для кошек, которым лучше подходит простой и лёгкий рацион.', image: '/assets/pack-noira-teal.webp' }
    }
  },
  en: {
    nav: [['Story', '#story'], ['Nutrition', '#nutrition'], ['Collection', '#collection'], ['Find your formula', '#finder'], ['Contact', '#contact']],
    products: [
      { id: 'salmon', name: 'Salmon Formula', eyebrow: 'Everyday vitality', description: 'High-protein daily nutrition with salmon, omega 3 & 6 and essential minerals for glossy coats and bright, curious cats.', image: '/assets/pack-closed.webp', accent: '#d9b76f', facts: ['Salmon first', 'Omega 3 & 6', 'Everyday recipe'] },
      { id: 'indoor', name: 'Indoor Balance', eyebrow: 'Calm energy', description: 'A balanced formula for indoor cats with controlled energy, quality protein and a clean, focused ingredient profile.', image: '/assets/pack-noira-black.webp', accent: '#9fb49c', facts: ['Balanced energy', 'Lean protein', 'Indoor care'] },
      { id: 'ocean', name: 'Ocean Care', eyebrow: 'Sensitive support', description: 'A fish-forward recipe designed for cats that benefit from a lighter, gentle formula with skin and coat support.', image: '/assets/pack-noira-teal.webp', accent: '#72aaa8', facts: ['Fish proteins', 'Gentle recipe', 'Coat support'] }
    ],
    benefits: [
      ['01', 'Protein with a purpose', 'Animal-first protein supports lean muscle and everyday energy without turning the formula into a chemistry set.'],
      ['02', 'Skin & coat support', 'Omega 3 & 6 help support a healthy skin barrier and the kind of coat that catches the light.'],
      ['03', 'Essential micronutrients', 'Taurine, vitamins and minerals complete the daily profile for long-term feline wellbeing.'],
      ['04', 'Nothing loud, nothing random', 'A focused ingredient story, clear benefits and no visual clutter. The same principle shapes the food and the brand.']
    ],
    finder: {
      indoor: { label: 'Indoor', title: 'Indoor Balance', copy: 'For lower-activity cats who need complete nutrition with measured energy and a steady daily routine.', image: '/assets/pack-noira-black.webp' },
      active: { label: 'Active', title: 'Salmon Formula', copy: 'For curious, energetic cats who thrive on high-quality protein and omega-rich nutrition.', image: '/assets/pack-closed.webp' },
      sensitive: { label: 'Sensitive', title: 'Ocean Care', copy: 'A gentler fish-forward direction for cats that benefit from a simpler, lighter-feeling recipe.', image: '/assets/pack-noira-teal.webp' }
    }
  }
} as const;

export function getSiteData(language: Language) {
  const data = copy[language];
  return {
    navItems: data.nav.map(([label, href]) => ({ label, href })),
    products: data.products,
    benefits: data.benefits.map(([index, title, body]) => ({ index, title, copy: body })),
    finderProfiles: data.finder
  };
}
