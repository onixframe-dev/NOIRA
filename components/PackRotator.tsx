'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './PackRotator.module.css';

type Props = { image: string; title: string; accent?: string };
type Rotation = { x: number; y: number };
const initial: Rotation = { x: -5, y: -18 };
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function PackRotator({ image, title, accent = '#d8b16a' }: Props) {
  const { language } = useLanguage(); const isRu = language === 'ru';
  const [coarsePointer, setCoarsePointer] = useState(false);
  const pack = useRef<HTMLDivElement>(null); const rotation = useRef<Rotation>({ ...initial });
  const drag = useRef<{ x: number; y: number; start: Rotation } | null>(null); const frame = useRef<number | undefined>(undefined);
  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)');
    const sync = () => setCoarsePointer(media.matches);
    sync(); media.addEventListener('change', sync);
    return () => { media.removeEventListener('change', sync); if (frame.current) cancelAnimationFrame(frame.current); };
  }, []);
  const paint = (next: Rotation) => { rotation.current = next; if (frame.current) return; frame.current = requestAnimationFrame(() => { if (pack.current) pack.current.style.transform = `rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg)`; frame.current = undefined; }); };
  const reset = () => paint({ ...initial });
  const pointerDown = (event: React.PointerEvent<HTMLDivElement>) => { if (coarsePointer) return; event.currentTarget.setPointerCapture(event.pointerId); drag.current = { x: event.clientX, y: event.clientY, start: { ...rotation.current } }; };
  const pointerMove = (event: React.PointerEvent<HTMLDivElement>) => { if (!drag.current) return; const dx = event.clientX - drag.current.x; const dy = event.clientY - drag.current.y; paint({ x: clamp(drag.current.start.x - dy * .14, -18, 14), y: clamp(drag.current.start.y + dx * .22, -40, 40) }); };
  const pointerUp = (event: React.PointerEvent<HTMLDivElement>) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); drag.current = null; };
  const keyDown = (event: React.KeyboardEvent<HTMLDivElement>) => { if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return; event.preventDefault(); paint({ ...rotation.current, y: clamp(rotation.current.y + (event.key === 'ArrowLeft' ? -8 : 8), -40, 40) }); };
  return <div className={`${styles.wrap} ${coarsePointer ? styles.touchMode : ''}`} style={{ '--pack-accent': accent } as React.CSSProperties}><div className={styles.scene} tabIndex={coarsePointer ? -1 : 0} role="group" onKeyDown={keyDown} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => { drag.current = null; }} aria-label={coarsePointer ? `${title} NOIRA` : (isRu ? 'Интерактивная 3D-пачка NOIRA. Потяните для поворота или используйте стрелки влево и вправо.' : 'Interactive NOIRA 3D pack. Drag to rotate or use the left and right arrow keys.')}><div ref={pack} className={styles.pack} style={{ transform: `rotateX(${initial.x}deg) rotateY(${initial.y}deg)` }}>
    <div className={`${styles.face} ${styles.front}`}><Image src={image} alt={`${title} NOIRA`} fill sizes="(max-width: 760px) 68vw, 30vw" /></div><div className={`${styles.face} ${styles.back}`}><div className={styles.backInner}><span className={styles.backBrand}>NOIRA</span><strong>{title}</strong><p>{isRu ? 'Полнорационный корм для кошек' : 'Complete food for cats'}</p><div className={styles.backRule} /><small>{isRu ? 'Белок · Омега 3 и 6 · Таурин · Витамины и минералы' : 'Protein · Omega 3 & 6 · Taurine · Vitamins & minerals'}</small><div className={styles.fakeBarcode} /></div></div><div className={`${styles.face} ${styles.left}`}><span>NOIRA</span><small>{isRu ? 'ПИТАНИЕ С ХАРАКТЕРОМ' : 'NUTRITION WITH CHARACTER'}</small></div><div className={`${styles.face} ${styles.right}`}><span>NOIRA</span><small>2.4 KG</small></div><div className={`${styles.face} ${styles.top}`} /><div className={`${styles.face} ${styles.bottom}`} />
  </div></div><div className={styles.hint}><span>{coarsePointer ? (isRu ? 'Проведите, чтобы посмотреть пачку' : 'Swipe to view the pack') : (isRu ? 'Потяните, чтобы повернуть пачку' : 'Drag to rotate the pack')}</span>{!coarsePointer ? <button type="button" onClick={reset} aria-label={isRu ? 'Сбросить поворот пачки' : 'Reset pack rotation'}><RotateCcw size={15} /></button> : null}</div></div>;
}
