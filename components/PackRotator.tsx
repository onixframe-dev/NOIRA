'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './PackRotator.module.css';

type Props = {
  image: string;
  title: string;
  accent?: string;
};

export function PackRotator({ image, title, accent = '#d8b16a' }: Props) {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const [rotation, setRotation] = useState({ x: -5, y: -18 });
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);

  function pointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, startX: rotation.x, startY: rotation.y };
  }

  function pointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    setRotation({ x: Math.max(-22, Math.min(18, drag.current.startX - dy * .16)), y: drag.current.startY + dx * .28 });
  }

  function pointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current = null;
  }

  return (
    <div className={styles.wrap} style={{ '--pack-accent': accent } as React.CSSProperties}>
      <div
        className={styles.scene}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={() => { drag.current = null; }}
        aria-label={isRu ? 'Интерактивная 3D-пачка NOIRA. Потяните мышью или пальцем, чтобы повернуть.' : 'Interactive NOIRA 3D pack. Drag to rotate.'}
      >
        <div className={styles.pack} style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}>
          <div className={`${styles.face} ${styles.front}`}><Image src={image} alt={`${title} NOIRA`} fill sizes="(max-width: 760px) 68vw, 30vw" /></div>
          <div className={`${styles.face} ${styles.back}`}>
            <div className={styles.backInner}>
              <span className={styles.backBrand}>NOIRA</span>
              <strong>{title}</strong>
              <p>{isRu ? 'Полнорационный корм для взрослых кошек' : 'Complete food for adult cats'}</p>
              <div className={styles.backRule} />
              <small>{isRu ? 'Белок · Омега 3 & 6 · Таурин · Витамины и минералы' : 'Protein · Omega 3 & 6 · Taurine · Vitamins & minerals'}</small>
              <div className={styles.fakeBarcode} />
            </div>
          </div>
          <div className={`${styles.face} ${styles.left}`}><span>NOIRA</span><small>{isRu ? 'ПИТАНИЕ С ХАРАКТЕРОМ' : 'NUTRITION WITH CHARACTER'}</small></div>
          <div className={`${styles.face} ${styles.right}`}><span>NOIRA</span><small>2.4 KG</small></div>
          <div className={`${styles.face} ${styles.top}`} />
          <div className={`${styles.face} ${styles.bottom}`} />
        </div>
      </div>
      <div className={styles.hint}>
        <span>{isRu ? 'Потяните, чтобы повернуть пачку' : 'Drag to rotate the pack'}</span>
        <button type="button" onClick={() => setRotation({ x: -5, y: -18 })} aria-label={isRu ? 'Сбросить поворот' : 'Reset rotation'}><RotateCcw size={15} /></button>
      </div>
    </div>
  );
}
