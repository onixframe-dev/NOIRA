import type { ReactNode } from 'react';
import shared from '@/styles/shared.module.css';
import styles from './SectionHeading.module.css';

export function SectionHeading({ eyebrow, title, copy, align = 'left' }: { eyebrow: string; title: ReactNode; copy?: string; align?: 'left' | 'center' }) {
  return (
    <div className={`${styles.heading} ${align === 'center' ? styles.center : ''}`}>
      <span className={shared.eyebrow}>{eyebrow}</span>
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}
